const configService = require('./configService');

/**
 * Unified Readiness Calculator for the entire platform.
 * Uses dynamic weights from platform_config.
 */
class ReadinessCalculator {
    constructor() {
        this.clamp = (n, min = 0, max = 100) => Math.max(min, Math.min(max, n));
    }

    /**
     * Calculate readiness score based on student data.
     * @param {Object} data { cgpa, backlogs, skills_count, projects_count, has_resume, has_profile_link }
     * @param {Object} [providedWeights] Optional pre-fetched weights to avoid DB call
     */
    async calculate(data, providedWeights = null) {
        const weights = providedWeights || await configService.getConfig('readiness_weights', {
            academics: 0.5,
            skills: 0.3,
            portfolio: 0.2
        });

        const cgpa = Number(data.cgpa || 0);
        const backlogs = Number(data.backlogs || 0);
        const skills = Number(data.skills_count || 0);
        const projects = Number(data.projects_count || 0);
        const hasResume = !!data.has_resume;
        const hasProfileLink = !!data.has_profile_link;

        // 1. Academics Score (0-100)
        // Formula: (CGPA/10 * 100) - penalty for backlogs
        let academics = (cgpa / 10) * 100;
        if (backlogs > 0) {
            academics -= backlogs * 15;
        }
        academics = this.clamp(academics);

        // 2. Skills Score (0-100)
        // Uses an exponential decay curve: 100 * (1 - e^(-skills/8))
        // This rewarding early skills more than late ones.
        const skillsScore = this.clamp(100 * (1 - Math.exp(-skills / 8)));

        // 3. Portfolio/Experience Score (0-100)
        // Base points for Resume and Profile links + Projects
        let portfolio = 0;
        if (hasResume) portfolio += 40;
        if (hasProfileLink) portfolio += 20;
        portfolio += projects * 15;
        portfolio = this.clamp(portfolio);

        // 4. Weighted Total
        const total = (academics * weights.academics) + 
                      (skillsScore * weights.skills) + 
                      (portfolio * weights.portfolio);

        const readiness = Math.round(this.clamp(total));

        // 5. Issue Detection
        const issues = [];
        if (!cgpa) issues.push('CGPA missing');
        else if (cgpa < 7.0) issues.push('Below 7.0 CGPA');
        
        if (backlogs > 0) issues.push(`${backlogs} active backlog${backlogs > 1 ? 's' : ''}`);
        if (!hasResume) issues.push('Resume missing');
        if (!hasProfileLink) issues.push('Profile links missing');
        if (skills < 3) issues.push('Skills need update');

        // 6. Determine Band
        let band = 'Needs attention';
        if (readiness >= 80 && issues.length === 0) band = 'Drive ready';
        else if (readiness >= 70) band = 'Almost ready';
        else if (issues.length >= 3 || readiness < 55) band = 'Critical';

        return {
            score: readiness,
            band: band,
            issues: issues,
            components: {
                academics: Math.round(academics),
                skills: Math.round(skillsScore),
                portfolio: Math.round(portfolio)
            }
        };
    }
}

module.exports = new ReadinessCalculator();
