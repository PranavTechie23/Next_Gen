const db = require('../config/db');
const { parsePositiveInt } = require('../utils/validateParams');
const { getTenantScope } = require('../middleware/institutionScope');

const KIT_FIELDS    = 'k.id, k.name, k.description, k.tier, k.gradient, k.avg_package AS avgPackage, k.logo_url AS logo, k.interview_rounds AS interviewRounds, k.interview_tips AS interviewTips, k.resources, k.created_at';
const PROBLEM_FIELDS = 'p.id, p.title, p.difficulty, p.topic, p.url';

const getAllKits = async (req, res) => {
    try {
        const scope = getTenantScope(req);
        if (!scope) {
            return res.status(403).json({ message: 'Institution context is required.' });
        }

        const [kits] = await db.query(
            `SELECT ${KIT_FIELDS}
             FROM company_assessment_kits k
             WHERE k.institution_id IS NULL OR k.institution_id = ?
             ORDER BY k.name ASC`,
            [scope.institution_id]
        );

        if (kits.length === 0) {
            return res.json([]);
        }

        const kitIds = kits.map((k) => k.id);

        const [mappings] = await db.query(
            `SELECT m.company_id, ${PROBLEM_FIELDS}
             FROM coding_problems p
             JOIN company_problem_mapping m ON p.id = m.problem_id
             WHERE m.company_id IN (?)`,
            [kitIds]
        );

        const problemsByKit = mappings.reduce((acc, { company_id, ...problem }) => {
            if (!acc[company_id]) acc[company_id] = [];
            acc[company_id].push(problem);
            return acc;
        }, {});

        return res.json(
            kits.map((kit) => ({ ...kit, problems: problemsByKit[kit.id] ?? [] }))
        );
    } catch (error) {
        console.error('getAllKits error:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

const getKitById = async (req, res) => {
    const idParsed = parsePositiveInt(req.params.id, 'kit id');
    if (!idParsed.ok) {
        return res.status(400).json({ message: idParsed.message });
    }
    const id = idParsed.value;

    try {
        const scope = getTenantScope(req);
        if (!scope) {
            return res.status(403).json({ message: 'Institution context is required.' });
        }

        const [kits] = await db.query(
            `SELECT ${KIT_FIELDS}
             FROM company_assessment_kits k
             WHERE k.id = ? AND (k.institution_id IS NULL OR k.institution_id = ?)`,
            [id, scope.institution_id]
        );

        if (kits.length === 0) {
            return res.status(404).json({ message: 'Kit not found.' });
        }

        const [problems] = await db.query(
            `SELECT ${PROBLEM_FIELDS}
             FROM coding_problems p
             JOIN company_problem_mapping m ON p.id = m.problem_id
             WHERE m.company_id = ?`,
            [id]
        );

        return res.json({ ...kits[0], problems });
    } catch (error) {
        console.error('getKitById error:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = {
    getAllKits,
    getKitById,
};