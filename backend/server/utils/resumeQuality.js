const configService = require('./configService');

const scoreExtractedTextQuality = async (text = '') => {
    const weights = await configService.getConfig('resume_extraction_weights', {
        length: 0.45,
        structure: 0.35,
        content: 0.2,
    });

    const t = String(text || '');
    const lengthScore = Math.min(1, t.length / 1200);
    const lineCount = t.split('\n').filter((l) => l.trim()).length;
    const lineScore = Math.min(1, lineCount / 40);
    const headingScore = /(education|projects|experience|skills|certifications|summary)/i.test(t) ? 1 : 0;

    return (lengthScore * weights.length)
        + (lineScore * weights.structure)
        + (headingScore * weights.content);
};

const scoreParsedResumeQuality = async (parsed = {}) => {
    const weights = await configService.getConfig('resume_parsing_quality_weights', {
        skills: 0.25,
        timeline: 0.30,
        summary: 0.10,
        contact: 0.20,
        links: 0.15,
    });

    const sections = parsed?.sections || {};
    const skills = Array.isArray(parsed?.skills) ? parsed.skills.length : 0;
    const projects = Array.isArray(sections?.projects) ? sections.projects.length : 0;
    const experience = Array.isArray(sections?.experience) ? sections.experience.length : 0;
    const education = Array.isArray(sections?.education) ? sections.education.length : 0;
    const certs = Array.isArray(sections?.certifications) ? sections.certifications.length : 0;
    const hasContact = Number(!!parsed?.email) + Number(!!parsed?.phone);
    const hasLinks = Number(!!parsed?.linkedinUrl) + Number(!!parsed?.githubUrl);
    const summaryLen = String(sections?.summary || '').length;
    const timelineSignals = [projects, experience, education, certs].reduce((a, b) => a + b, 0);

    return (
        Math.min(1, skills / 20) * weights.skills
        + Math.min(1, timelineSignals / 20) * weights.timeline
        + Math.min(1, summaryLen / 400) * weights.summary
        + (hasContact / 2) * weights.contact
        + (hasLinks / 2) * weights.links
    );
};

/** Build a parsed-resume shape from stored DB JSON for quality scoring. */
const parsedFromStoredResume = ({ skills = [], sections = {}, email, phone, linkedin_url, github_url } = {}) => ({
    skills: Array.isArray(skills) ? skills : [],
    sections: sections || {},
    email: email || null,
    phone: phone || null,
    linkedinUrl: linkedin_url || null,
    githubUrl: github_url || null,
});

module.exports = {
    scoreExtractedTextQuality,
    scoreParsedResumeQuality,
    parsedFromStoredResume,
};
