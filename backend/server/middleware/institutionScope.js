const db = require('../config/db');

/* ─────────────────────────────────────────────────────────────────────────────
 * SCHEMA PROBE — memoized, race-safe
 *
 * A single pending Promise is stored so concurrent callers awaiting before the
 * first resolves share one DB round-trip instead of racing to write the same
 * module-level variable.
 * ───────────────────────────────────────────────────────────────────────────── */

let _recruiterHasInstitutionId = null; // true | false | null (not yet resolved)
let _recruiterProbePromise = null;

async function _probeRecruiterColumn() {
    if (_recruiterHasInstitutionId !== null) return _recruiterHasInstitutionId;
    if (_recruiterProbePromise) return _recruiterProbePromise;

    _recruiterProbePromise = (async () => {
        const [rows] = await db.execute(
            `SELECT COUNT(*) AS c FROM information_schema.columns
             WHERE table_schema = DATABASE()
               AND table_name   = 'recruiters'
               AND column_name  = 'institution_id'`,
        );
        _recruiterHasInstitutionId = Number(rows[0]?.c ?? 0) > 0;
        _recruiterProbePromise = null;
        return _recruiterHasInstitutionId;
    })();

    return _recruiterProbePromise;
}

/* Call once at startup so all subsequent callers hit the memoized value. */
exports.ensureRecruiterInstitutionColumn = _probeRecruiterColumn;

/* ─────────────────────────────────────────────────────────────────────────────
 * TENANT SCOPE MIDDLEWARE
 * ───────────────────────────────────────────────────────────────────────────── */

/**
 * Attach tenant scope from JWT user context.
 * TPO_ADMIN: institution-wide; TPO_HEAD: institution + department.
 */
exports.attachTenantScope = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized.' });
        }

        const institutionId = req.user.institution_id;
        if (!institutionId) {
            return res.status(403).json({ message: 'Institution context is required for this operation.' });
        }

        const role = String(req.user.role || '').trim().toUpperCase();
        let departmentId = null;

        if (role === 'TPO_HEAD') {
            const [rows] = await db.execute(
                'SELECT department_id FROM tpo_heads WHERE user_id = ? LIMIT 1',
                [req.user.id]
            );
            if (!rows.length) {
                return res.status(403).json({ message: 'Department head profile not found.' });
            }
            departmentId = rows[0].department_id;
        }

        req.tenantScope = { institutionId, departmentId, role };
        next();
    } catch (error) {
        console.error('attachTenantScope error:', error.message);
        return res.status(500).json({ message: 'Failed to resolve institution scope.' });
    }
};

exports.getTenantScope = (req) => req.tenantScope ?? null;
exports.resolveInstitutionId = (req) => req.tenantScope?.institutionId ?? req.user?.institution_id ?? null;
exports.scopeFromInstitutionId = (institutionId) => institutionId ? { institutionId, departmentId: null } : null;

/* ─────────────────────────────────────────────────────────────────────────────
 * CACHE KEY BUILDER
 * ───────────────────────────────────────────────────────────────────────────── */

exports.dashboardCacheScope = (scope, filters = {}) => {
    let base = `TPO_dashboard:inst:${scope.institutionId}`;
    if (scope.departmentId != null) base += `:dept:${scope.departmentId}`;
    if (filters.year) base += `:y:${filters.year}`;
    if (filters.branches?.length) {
        base += `:br:${filters.branches.map((b) => encodeURIComponent(b)).join(',')}`;
    }
    return base;
};

/* ─────────────────────────────────────────────────────────────────────────────
 * SQL CLAUSE BUILDERS
 * ───────────────────────────────────────────────────────────────────────────── */

const _requireScope = (scope) => {
    if (!scope?.institutionId) {
        const err = new Error('Institution scope is required.');
        err.statusCode = 403;
        throw err;
    }
};

/**
 * WHERE fragment for students joined to users.
 * Default aliases: s = students, u = users.
 */
exports.studentInstitutionClause = (scope, aliases = { s: 's', u: 'u' }) => {
    _requireScope(scope);
    const parts = [`${aliases.u}.institution_id = ?`];
    const params = [scope.institutionId];
    if (scope.departmentId != null) {
        parts.push(`${aliases.s}.department_id = ?`);
        params.push(scope.departmentId);
    }
    return { clause: parts.join(' AND '), params };
};

/** Standard JOIN block for application-centric queries. */
exports.applicationScopeJoins = (aliases = { a: 'a', s: 's', u: 'u' }) =>
    `JOIN students ${aliases.s} ON ${aliases.a}.student_id = ${aliases.s}.user_id
     JOIN users    ${aliases.u} ON ${aliases.s}.user_id    = ${aliases.u}.id`;

exports.webinarInstitutionClause = (scope, alias = 'w') => ({
    clause: `${alias}.institution_id = ?`,
    params: [scope.institutionId],
});

/**
 * Drives visible to a tenant: applications from scoped students, or audit by institution actor.
 */
exports.driveTenantClause = (scope, alias = 'd') => {
    _requireScope(scope);
    const deptSql = scope.departmentId != null ? ' AND s_d.department_id = ?' : '';
    const deptParams = scope.departmentId != null ? [scope.departmentId] : [];

    const appExists = `EXISTS (
        SELECT 1 FROM job_postings jp_d
        INNER JOIN applications a_d ON a_d.job_id    = jp_d.id
        INNER JOIN students    s_d  ON s_d.user_id   = a_d.student_id
        INNER JOIN users       u_d  ON u_d.id        = s_d.user_id
        WHERE jp_d.drive_id = ${alias}.id
          AND u_d.institution_id = ?${deptSql}
    )`;

    const auditExists = `EXISTS (
        SELECT 1 FROM audit_logs al_d
        INNER JOIN users actor_d ON actor_d.id = al_d.actor_user_id
        WHERE al_d.target_table = 'recruitment_drives'
          AND al_d.target_id   = ${alias}.id
          AND actor_d.institution_id = ?
    )`;

    return {
        clause: `(${appExists} OR ${auditExists})`,
        params: [scope.institutionId, ...deptParams, scope.institutionId],
    };
};

const _recruiterAuditExistsSql = (scope, alias) => `EXISTS (
    SELECT 1 FROM audit_logs al_r
    INNER JOIN users actor_r ON actor_r.id = al_r.actor_user_id
    WHERE al_r.target_table = 'recruiters'
      AND al_r.target_id   = ${alias}.id
      AND actor_r.institution_id = ?
)`;

const _recruiterViaDrivesClause = (scope, alias = 'r') => {
    const { clause: driveClause, params: driveParams } = exports.driveTenantClause(scope, 'rd_t');
    return {
        clause: `(EXISTS (
            SELECT 1 FROM recruitment_drives rd_t
            WHERE rd_t.recruiter_id = ${alias}.id AND ${driveClause}
        ) OR ${_recruiterAuditExistsSql(scope, alias)})`,
        params: [...driveParams, scope.institutionId],
    };
};

/**
 * Recruiter filter: direct institution_id column when present, else drive-join fallback.
 *
 * Always awaits the probe so callers don't need to pre-warm the cache themselves.
 */
exports.recruiterInstitutionClause = async (scope, alias = 'r') => {
    _requireScope(scope);
    const hasCol = await _probeRecruiterColumn();
    if (hasCol) {
        return { clause: `${alias}.institution_id = ?`, params: [scope.institutionId] };
    }
    return _recruiterViaDrivesClause(scope, alias);
};

exports.getDriveScopeFilter = async (scope, alias = 'd') => {
    _requireScope(scope);
    const hasCol = await _probeRecruiterColumn();
    if (hasCol) {
        return {
            clause: `EXISTS (
                SELECT 1 FROM recruiters r_ds
                WHERE r_ds.id = ${alias}.recruiter_id AND r_ds.institution_id = ?
            )`,
            params: [scope.institutionId],
        };
    }
    return exports.driveTenantClause(scope, alias);
};

/* ─────────────────────────────────────────────────────────────────────────────
 * RECRUITER DATA ACCESS
 * ───────────────────────────────────────────────────────────────────────────── */

exports.insertRecruiterForScope = async (executor, scope, { companyName, contactEmail = null }) => {
    const hasCol = await _probeRecruiterColumn();

    if (hasCol) {
        const [result] = await executor.query(
            'INSERT INTO recruiters (company_name, contact_email, institution_id) VALUES (?, ?, ?)',
            [companyName, contactEmail, scope.institutionId]
        );
        return result.insertId;
    }

    /* FIX (Issue 3): The original branched into three separate INSERT statements
     * based on contactEmail != null when the column is absent. A single query
     * with a conditional value handles both cases without duplication. */
    const [result] = await executor.query(
        'INSERT INTO recruiters (company_name, contact_email) VALUES (?, ?)',
        [companyName, contactEmail]
    );
    return result.insertId;
};

exports.findRecruiterIdByNameForScope = async (executor, scope, companyName) => {
    const hasCol = await _probeRecruiterColumn();
    if (hasCol) {
        const [rows] = await executor.query(
            'SELECT id FROM recruiters WHERE company_name = ? AND institution_id = ? LIMIT 1',
            [companyName, scope.institutionId]
        );
        return rows[0]?.id ?? null;
    }
    const [rows] = await executor.query(
        'SELECT id FROM recruiters WHERE company_name = ? LIMIT 1',
        [companyName]
    );
    return rows[0]?.id ?? null;
};

/* ─────────────────────────────────────────────────────────────────────────────
 * SCOPE ASSERTION HELPERS
 *
 * Shared _assertInScope eliminates the repeated get-scope → build-clause →
 * execute → check-rows pattern across all assert* functions.
 * ───────────────────────────────────────────────────────────────────────────── */

const _assertInScope = async (scope, sql, params, notFoundMessage) => {
    const [rows] = await db.execute(sql, params);
    if (!rows.length) {
        return { ok: false, status: 404, message: notFoundMessage };
    }
    return { ok: true };
};

exports.assertApplicationInScope = async (req, applicationId) => {
    const scope = exports.getTenantScope(req);
    if (!scope) return { ok: false, status: 403, message: 'Institution context is required.' };

    const { clause, params } = exports.studentInstitutionClause(scope);
    return _assertInScope(
        scope,
        `SELECT a.id
         FROM applications a
         ${exports.applicationScopeJoins()}
         WHERE a.id = ? AND ${clause} LIMIT 1`,
        [applicationId, ...params],
        'Application not found.'
    );
};

exports.assertRecruiterInScope = async (req, recruiterId) => {
    const scope = exports.getTenantScope(req)
        ?? exports.scopeFromInstitutionId(exports.resolveInstitutionId(req));
    if (!scope?.institutionId) return { ok: false, status: 403, message: 'Institution context is required.' };

    const { clause, params } = await exports.recruiterInstitutionClause(scope, 'r');
    return _assertInScope(
        scope,
        `SELECT r.id FROM recruiters r WHERE r.id = ? AND ${clause} LIMIT 1`,
        [recruiterId, ...params],
        'Company not found.'
    );
};

exports.assertDriveInScope = async (req, driveId) => {
    const scope = exports.getTenantScope(req)
        ?? exports.scopeFromInstitutionId(exports.resolveInstitutionId(req));
    if (!scope?.institutionId) return { ok: false, status: 403, message: 'Institution context is required.' };

    const { clause, params } = await exports.getDriveScopeFilter(scope, 'rd');
    return _assertInScope(
        scope,
        `SELECT rd.id FROM recruitment_drives rd WHERE rd.id = ? AND ${clause} LIMIT 1`,
        [driveId, ...params],
        'Recruitment drive not found.'
    );
};

exports.assertWebinarInScope = async (req, webinarId) => {
    const institutionId = exports.resolveInstitutionId(req);
    if (!institutionId) return { ok: false, status: 403, message: 'Institution context is required.' };

    return _assertInScope(
        { institutionId },
        'SELECT id FROM webinars WHERE id = ? AND institution_id = ? LIMIT 1',
        [webinarId, institutionId],
        'Webinar not found.'
    );
};

exports.assertStudentUserInScope = async (req, studentUserId) => {
    const scope = exports.getTenantScope(req);
    if (!scope) return { ok: false, status: 403, message: 'Institution context is required.' };

    const { clause, params } = exports.studentInstitutionClause(scope);
    return _assertInScope(
        scope,
        `SELECT s.user_id
         FROM students s
         JOIN users u ON s.user_id = u.id
         WHERE s.user_id = ? AND ${clause} LIMIT 1`,
        [studentUserId, ...params],
        'Student not found.'
    );
};