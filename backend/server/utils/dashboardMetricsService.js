const db = require('../config/db');
const readinessCalculator = require('./readinessCalculator');
const { scoreParsedResumeQuality, parsedFromStoredResume } = require('./resumeQuality');

const clamp = (n, min = 0, max = 100) => Math.max(min, Math.min(max, Number(n) || 0));
const sigmoid = (x) => 1 / (1 + Math.exp(-x));

const isSameCalendarDay = (a, b) => {
    const d1 = a instanceof Date ? a : new Date(a);
    const d2 = b instanceof Date ? b : new Date(b);
    if (Number.isNaN(d1.getTime()) || Number.isNaN(d2.getTime())) return false;
    return d1.getFullYear() === d2.getFullYear()
        && d1.getMonth() === d2.getMonth()
        && d1.getDate() === d2.getDate();
};

const hadLlmEvalToday = (lastLlmEvalAt) => {
    if (!lastLlmEvalAt) return false;
    return isSameCalendarDay(lastLlmEvalAt, new Date());
};

const avgPositive = (values = []) => {
    const nums = values.map(Number).filter((v) => v > 0);
    if (!nums.length) return 0;
    return nums.reduce((a, b) => a + b, 0) / nums.length;
};

const readinessStatusLabel = (score) => {
    if (score >= 75) return 'EXCELLENT';
    if (score >= 55) return 'GOOD';
    if (score >= 35) return 'BUILDING';
    return 'GETTING STARTED';
};

const readinessEncouragement = (score) => {
    if (score >= 75) {
        return 'Strong profile for campus drives — close remaining skill gaps to stand out.';
    }
    if (score >= 55) {
        return 'Solid progress — add projects and assessment scores to strengthen your fit.';
    }
    return 'Keep building your profile to unlock stronger placement signals.';
};

/**
 * Unified dashboard metrics — single source of truth for student, TPO, and dept views.
 * @param {Object} input Pre-fetched student data
 */
async function calculateDashboardMetrics(input = {}) {
    const cgpa = Number(input.cgpa || 0);
    const backlogs = Number(input.backlogs || 0);
    const verifiedSkillsCount = Number(input.verifiedSkillsCount || 0);
    const totalSkillsCount = Number(input.totalSkillsCount || 0);
    const projectsCount = Number(input.projectsCount || 0);
    const experienceCount = Number(input.experienceCount || 0);
    const certificationsCount = Number(input.certificationsCount || 0);
    const dbProjectsCount = Number(input.dbProjectsCount || 0);
    const hasResume = !!input.hasResume;
    const hasProfileLink = !!input.hasProfileLink;
    const hasPhone = !!input.hasPhone;
    const hasSummary = !!input.hasSummary;
    const parseQualityStored = input.parseQualityStored != null
        ? Number(input.parseQualityStored)
        : null;
    const performance = input.performance || {};
    const targetRole = String(input.targetRole || '').trim() || null;
    const targetRoleMatch = input.targetRoleMatch != null ? Number(input.targetRoleMatch) : null;
    const lastLlmEvalAt = input.lastLlmEvalAt || null;

    const manualExtra = Math.min(3, Math.max(0, totalSkillsCount - verifiedSkillsCount));
    const effectiveSkillsCount = verifiedSkillsCount + manualExtra;
    const totalPortfolioItems = projectsCount + experienceCount + dbProjectsCount;

    const readiness = await readinessCalculator.calculate({
        cgpa,
        backlogs,
        skills_count: effectiveSkillsCount,
        projects_count: totalPortfolioItems,
        has_resume: hasResume,
        has_profile_link: hasProfileLink,
    });

    const amcatAvg = avgPositive([
        performance.amcat_quant,
        performance.amcat_verbal,
        performance.amcat_logical,
    ]);
    const codingScore = Number(performance.coding_test_score || 0);
    const mockScore = Number(performance.mock_interview_score || 0);
    const endsemPct = Number(performance.endsem_percentage || 0);
    const assessmentComposite = avgPositive([amcatAvg, codingScore, mockScore, endsemPct]);

    const portfolioDepth = clamp(
        (projectsCount * 12)
        + (experienceCount * 10)
        + (certificationsCount * 6)
        + (dbProjectsCount * 8)
        + (hasSummary ? 8 : 0),
    );

    const coreCompetenciesScore = Math.round(clamp(
        readiness.components.skills * 0.45
        + assessmentComposite * 0.35
        + portfolioDepth * 0.20,
    ));

    let parseQuality = parseQualityStored;
    if (parseQuality == null && input.parsedResumeForQuality) {
        parseQuality = Math.round((await scoreParsedResumeQuality(input.parsedResumeForQuality)) * 100);
    }
    parseQuality = clamp(parseQuality || 0);

    const completenessSignals = [
        cgpa > 0,
        effectiveSkillsCount >= 3,
        totalPortfolioItems > 0,
        hasSummary,
        hasPhone,
        hasProfileLink,
        hasResume,
    ];
    const checklistScore = Math.round(
        (completenessSignals.filter(Boolean).length / completenessSignals.length) * 100,
    );
    const profileCompletenessScore = Math.round(clamp(parseQuality * 0.6 + checklistScore * 0.4));

    const logit = -2.2
        + (readiness.score / 100) * 3.0
        + (assessmentComposite / 100) * 1.2
        + (coreCompetenciesScore / 100) * 0.8
        - backlogs * 0.35;
    const placementFitScore = (readiness.score > 0 || assessmentComposite > 0)
        ? Math.round(clamp(sigmoid(logit) * 100))
        : 0;

    const hasTargetEval = !!(targetRole && targetRoleMatch != null);
    const targetAlignmentScore = hasTargetEval
        ? Math.round(clamp(targetRoleMatch))
        : readiness.score;

    return {
        version: '1.0',
        overallReadiness: readiness.score,
        readinessBand: readiness.band,
        readinessIssues: readiness.issues,
        readinessComponents: readiness.components,
        readinessStatusLabel: readinessStatusLabel(readiness.score),
        readinessEncouragement: readinessEncouragement(readiness.score),
        targetRoleAlignment: {
            score: targetAlignmentScore,
            role: targetRole,
            source: hasTargetEval ? (lastLlmEvalAt ? 'llm' : 'heuristic') : 'readiness',
            badge: hasTargetEval ? (lastLlmEvalAt ? 'LLM Evaluated' : 'Heuristic') : 'Readiness Score',
            label: hasTargetEval ? `Match: ${targetRole}` : 'Overall Readiness',
            description: hasTargetEval ? 'Target Role Alignment' : 'Placement Preparedness',
        },
        coreCompetencies: {
            score: coreCompetenciesScore,
            badge: 'Computed',
            label: 'Skills Mastered',
            description: 'Core Competencies',
            breakdown: {
                skills: readiness.components.skills,
                assessments: Math.round(assessmentComposite),
                portfolio: Math.round(portfolioDepth),
            },
        },
        placementFitIndex: {
            score: placementFitScore,
            badge: 'Computed',
            label: 'Placement Fit Index',
            description: 'Overall Fit',
        },
        profileCompleteness: {
            score: profileCompletenessScore,
            badge: 'Resume Analysis',
            label: 'Profile Completeness',
            description: 'Resume & Profile Coverage',
            parseQuality,
            checklistScore,
        },
        effectiveSkillsCount,
        llm_eval_available_today: !hadLlmEvalToday(lastLlmEvalAt),
    };
}

async function calculateForStudent(studentId) {
    const [rows] = await db.execute(`
        SELECT
            s.current_cgpa,
            s.active_backlogs,
            sp.resume_url,
            sp.linkedin_url,
            sp.github_url,
            sp.phone AS profile_phone,
            rp.phone AS parsed_phone,
            rp.email AS parsed_email,
            rp.linkedin_url AS parsed_linkedin_url,
            rp.github_url AS parsed_github_url,
            rp.inferred_role,
            rp.target_role,
            rp.target_role_match,
            rp.last_llm_eval_at,
            rp.parse_quality,
            rp.skills_json,
            rp.sections_json
        FROM students s
        LEFT JOIN student_profiles sp ON s.user_id = sp.student_id
        LEFT JOIN resume_parsed_data rp ON s.user_id = rp.student_id
        WHERE s.user_id = ?
        LIMIT 1
    `, [studentId]);

    if (!rows.length) return null;

    const row = rows[0];
    const sections = (() => {
        try {
            return typeof row.sections_json === 'string'
                ? JSON.parse(row.sections_json)
                : (row.sections_json || {});
        } catch (_) {
            return {};
        }
    })();
    const verifiedSkills = (() => {
        try {
            return typeof row.skills_json === 'string'
                ? JSON.parse(row.skills_json)
                : (row.skills_json || []);
        } catch (_) {
            return [];
        }
    })();

    const [[skillsCountRow]] = await db.execute(
        'SELECT COUNT(*) AS cnt FROM student_skills WHERE student_id = ?',
        [studentId],
    );
    const [[projectsCountRow]] = await db.execute(
        'SELECT COUNT(*) AS cnt FROM projects WHERE student_id = ?',
        [studentId],
    );

    const [perfRows] = await db.execute(
        `SELECT amcat_quant, amcat_verbal, amcat_logical, endsem_percentage,
                mock_interview_score, coding_test_score
         FROM student_performance_metrics WHERE student_id = ? LIMIT 1`,
        [studentId],
    );
    const performance = perfRows[0] || {};

    const summaryText = Array.isArray(sections?.summary)
        ? sections.summary.join(' ')
        : String(sections?.summary || '');

    return calculateDashboardMetrics({
        cgpa: row.current_cgpa,
        backlogs: row.active_backlogs,
        verifiedSkillsCount: Array.isArray(verifiedSkills) ? verifiedSkills.length : 0,
        totalSkillsCount: Number(skillsCountRow?.cnt || 0),
        projectsCount: Array.isArray(sections?.projects) ? sections.projects.length : 0,
        experienceCount: Array.isArray(sections?.experience) ? sections.experience.length : 0,
        certificationsCount: Array.isArray(sections?.certifications) ? sections.certifications.length : 0,
        dbProjectsCount: Number(projectsCountRow?.cnt || 0),
        hasResume: !!row.resume_url,
        hasProfileLink: !!(row.linkedin_url || row.github_url || row.parsed_linkedin_url || row.parsed_github_url),
        hasPhone: !!(row.profile_phone || row.parsed_phone),
        hasSummary: summaryText.trim().length > 20,
        parseQualityStored: row.parse_quality,
        parsedResumeForQuality: parsedFromStoredResume({
            skills: verifiedSkills,
            sections,
            email: row.parsed_email,
            phone: row.parsed_phone,
            linkedin_url: row.parsed_linkedin_url,
            github_url: row.parsed_github_url,
        }),
        performance,
        targetRole: row.target_role,
        targetRoleMatch: row.target_role_match,
        lastLlmEvalAt: row.last_llm_eval_at,
    });
}

module.exports = {
    calculateDashboardMetrics,
    calculateForStudent,
    hadLlmEvalToday,
};
