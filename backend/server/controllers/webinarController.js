const db = require('../config/db');
const {
    getTenantScope,
    resolveInstitutionId,
    webinarInstitutionClause,
    assertWebinarInScope,
} = require('../middleware/institutionScope');

const VALID_SCOPE = new Set(['all', 'upcoming', 'past']);
const VALID_STATUS = new Set(['DRAFT', 'PUBLISHED', 'COMPLETED', 'CANCELLED']);
const VALID_SESSION_MODE = new Set(['OFFLINE', 'ONLINE', 'HYBRID']);

const normalizeScope = (scope) => (VALID_SCOPE.has(scope) ? scope : 'all');
const normalizeStatus = (status) => (VALID_STATUS.has(status) ? status : 'DRAFT');
const normalizeMode = (mode) => (VALID_SESSION_MODE.has(mode) ? mode : 'OFFLINE');

const getScopeClause = (scope) => {
  if (scope === 'upcoming') return 'w.starts_at >= NOW()';
  if (scope === 'past') return 'w.starts_at < NOW()';
  return '1=1';
};

const sanitizeWebinarPayload = (body = {}, { requireCoreFields = false } = {}) => {
  const payload = {
    title: typeof body.title === 'string' ? body.title.trim() : '',
    summary: typeof body.summary === 'string' ? body.summary.trim() : '',
    speaker_name: typeof body.speaker_name === 'string' ? body.speaker_name.trim() : '',
    speaker_role: typeof body.speaker_role === 'string' ? body.speaker_role.trim() : null,
    speaker_background: typeof body.speaker_background === 'string' ? body.speaker_background.trim() : null,
    speaker_photo_url: typeof body.speaker_photo_url === 'string' ? body.speaker_photo_url.trim() : null,
    session_mode: normalizeMode(body.session_mode),
    venue: typeof body.venue === 'string' ? body.venue.trim() : null,
    meeting_link: typeof body.meeting_link === 'string' ? body.meeting_link.trim() : null,
    recording_url: typeof body.recording_url === 'string' ? body.recording_url.trim() : null,
    starts_at: body.starts_at ? new Date(body.starts_at) : null,
    ends_at: body.ends_at ? new Date(body.ends_at) : null,
    registration_required: Boolean(body.registration_required),
    capacity: body.capacity === null || body.capacity === undefined || body.capacity === '' ? null : Number(body.capacity),
    status: normalizeStatus(body.status),
    mom_text: typeof body.mom_text === 'string' ? body.mom_text.trim() : null,
    mom_url: typeof body.mom_url === 'string' ? body.mom_url.trim() : null,
    key_takeaways: typeof body.key_takeaways === 'string' ? body.key_takeaways.trim() : null,
  };

  if (requireCoreFields) {
    if (!payload.title) return { error: 'title is required.' };
    if (!payload.summary) return { error: 'summary is required.' };
    if (!payload.speaker_name) return { error: 'speaker_name is required.' };
    if (!payload.starts_at || Number.isNaN(payload.starts_at.getTime())) return { error: 'Valid starts_at is required.' };
  }

  if (payload.starts_at && Number.isNaN(payload.starts_at.getTime())) return { error: 'Invalid starts_at.' };
  if (payload.ends_at && Number.isNaN(payload.ends_at.getTime())) return { error: 'Invalid ends_at.' };
  if (payload.starts_at && payload.ends_at && payload.ends_at < payload.starts_at) {
    return { error: 'ends_at cannot be before starts_at.' };
  }
  if (payload.capacity !== null && (!Number.isInteger(payload.capacity) || payload.capacity <= 0)) {
    return { error: 'capacity must be a positive integer when provided.' };
  }

  return { payload };
};

const mapWebinar = (w) => ({
  id: w.id,
  title: w.title,
  summary: w.summary,
  speaker_name: w.speaker_name,
  speaker_role: w.speaker_role,
  speaker_background: w.speaker_background,
  speaker_photo_url: w.speaker_photo_url,
  session_mode: w.session_mode,
  venue: w.venue,
  meeting_link: w.meeting_link,
  recording_url: w.recording_url,
  starts_at: w.starts_at,
  ends_at: w.ends_at,
  registration_required: Boolean(w.registration_required),
  capacity: w.capacity,
  status: w.status,
  mom_text: w.mom_text,
  mom_url: w.mom_url,
  key_takeaways: w.key_takeaways,
  registration_count: Number(w.registration_count || 0),
  has_mom: Boolean(w.mom_text || w.mom_url),
  has_recording: Boolean(w.recording_url),
  created_at: w.created_at,
  updated_at: w.updated_at,
});

const hasTable = async (tableName) => {
  try {
    const [rows] = await db.execute(
      `
      SELECT COUNT(*) AS c
      FROM information_schema.tables
      WHERE table_schema = DATABASE()
        AND table_name = ?
      `,
      [tableName]
    );
    return Number(rows?.[0]?.c || 0) > 0;
  } catch {
    return false;
  }
};

const hasColumn = async (tableName, columnName) => {
  try {
    const [rows] = await db.execute(
      `
      SELECT COUNT(*) AS c
      FROM information_schema.columns
      WHERE table_schema = DATABASE()
        AND table_name = ?
        AND column_name = ?
      `,
      [tableName, columnName]
    );
    return Number(rows?.[0]?.c || 0) > 0;
  } catch {
    return false;
  }
};

exports.listWebinarsForManagement = async (req, res) => {
  try {
    const tenantScope = getTenantScope(req);
    if (!tenantScope) {
      return res.status(403).json({ message: 'Institution context is required for this operation.' });
    }

    const scope = normalizeScope(req.query.scope);
    const search = String(req.query.search || '').trim();
    const status = req.query.status && VALID_STATUS.has(req.query.status) ? req.query.status : null;

    const { clause: institutionClause, params: institutionParams } = webinarInstitutionClause(tenantScope);
    const clauses = [getScopeClause(scope), institutionClause];
    const params = [...institutionParams];

    if (status) {
      clauses.push('w.status = ?');
      params.push(status);
    }

    if (search) {
      clauses.push('(w.title LIKE ? OR w.speaker_name LIKE ? OR w.summary LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const [rows] = await db.execute(
      `
      SELECT
        w.*,
        COUNT(DISTINCT wr.student_id) AS registration_count
      FROM webinars w
      LEFT JOIN webinar_registrations wr
        ON wr.webinar_id = w.id
       AND wr.status = 'REGISTERED'
      WHERE ${clauses.join(' AND ')}
      GROUP BY w.id
      ORDER BY w.starts_at ASC
      `,
      params
    );

    const deptClauses = ['u.institution_id = ?'];
    const deptParams = [tenantScope.institutionId];
    if (scope === 'upcoming') deptClauses.push('d.date >= NOW()');
    if (scope === 'past') deptClauses.push('d.date < NOW()');
    if (search) {
        deptClauses.push('(d.title LIKE ? OR d.type LIKE ?)');
        deptParams.push(`%${search}%`, `%${search}%`);
    }

    const [deptRows] = await db.execute(`
        SELECT d.*, u.email as user_email
        FROM dept_events d
        JOIN users u ON d.created_by = u.id
        WHERE ${deptClauses.join(' AND ')}
        ORDER BY d.date ASC
    `, deptParams);

    const combined = [
        ...rows.map(mapWebinar),
        ...deptRows.map(d => ({
            id: 'dept_' + d.id,
            title: d.title,
            summary: d.type,
            speaker_name: d.user_email || 'Dept Head',
            speaker_role: 'Dept Head',
            speaker_background: null,
            speaker_photo_url: null,
            session_mode: d.meeting_link ? 'ONLINE' : 'OFFLINE',
            venue: null,
            meeting_link: d.meeting_link,
            recording_url: null,
            starts_at: d.date,
            ends_at: d.expires_at,
            registration_required: false,
            capacity: null,
            status: 'PUBLISHED',
            mom_text: null,
            mom_url: null,
            key_takeaways: null,
            registration_count: 0,
            has_mom: false,
            has_recording: false,
            created_at: d.created_at,
            updated_at: d.created_at
        }))
    ].sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime());

    return res.status(200).json({
      count: combined.length,
      webinars: combined,
    });
  } catch (error) {
    console.error('listWebinarsForManagement error', error);
    return res.status(500).json({ message: 'Failed to fetch webinars.' });
  }
};

exports.createWebinar = async (req, res) => {
  try {
    const institutionId = resolveInstitutionId(req);
    if (!institutionId) {
      return res.status(403).json({ message: 'Institution context is required for this operation.' });
    }

    const { payload, error } = sanitizeWebinarPayload(req.body, { requireCoreFields: true });
    if (error) return res.status(400).json({ message: error });

    const [result] = await db.execute(
      `
      INSERT INTO webinars (
        institution_id, title, summary, speaker_name, speaker_role, speaker_background, speaker_photo_url,
        session_mode, venue, meeting_link, recording_url,
        starts_at, ends_at, registration_required, capacity, status,
        mom_text, mom_url, key_takeaways, created_by, updated_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        institutionId,
        payload.title,
        payload.summary,
        payload.speaker_name,
        payload.speaker_role,
        payload.speaker_background,
        payload.speaker_photo_url,
        payload.session_mode,
        payload.venue,
        payload.meeting_link,
        payload.recording_url,
        payload.starts_at,
        payload.ends_at,
        payload.registration_required,
        payload.capacity,
        payload.status,
        payload.mom_text,
        payload.mom_url,
        payload.key_takeaways,
        req.user.id,
        req.user.id,
      ]
    );

    return res.status(201).json({ message: 'Webinar created successfully.', webinar_id: result.insertId });
  } catch (error) {
    console.error('createWebinar error', error);
    return res.status(500).json({ message: 'Failed to create webinar.' });
  }
};

exports.updateWebinar = async (req, res) => {
  try {
    const webinarId = Number(req.params.id);
    if (!Number.isInteger(webinarId) || webinarId <= 0) {
      return res.status(400).json({ message: 'Invalid webinar id.' });
    }

    const { payload, error } = sanitizeWebinarPayload(req.body);
    if (error) return res.status(400).json({ message: error });

    const scopeCheck = await assertWebinarInScope(req, webinarId);
    if (!scopeCheck.ok) {
      return res.status(scopeCheck.status).json({ message: scopeCheck.message });
    }

    const fieldMap = {
      title: payload.title || null,
      summary: payload.summary || null,
      speaker_name: payload.speaker_name || null,
      speaker_role: payload.speaker_role,
      speaker_background: payload.speaker_background,
      speaker_photo_url: payload.speaker_photo_url,
      session_mode: payload.session_mode || null,
      venue: payload.venue,
      meeting_link: payload.meeting_link,
      recording_url: payload.recording_url,
      starts_at: payload.starts_at,
      ends_at: payload.ends_at,
      registration_required: payload.registration_required,
      capacity: payload.capacity,
      status: payload.status || null,
      mom_text: payload.mom_text,
      mom_url: payload.mom_url,
      key_takeaways: payload.key_takeaways,
    };

    const fields = [];
    const values = [];
    Object.keys(fieldMap).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        fields.push(`${key} = ?`);
        values.push(fieldMap[key]);
      }
    });

    if (!fields.length) {
      return res.status(400).json({ message: 'No fields provided to update.' });
    }

    fields.push('updated_by = ?');
    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(req.user.id);
    values.push(webinarId);

    await db.execute(`UPDATE webinars SET ${fields.join(', ')} WHERE id = ?`, values);

    return res.status(200).json({ message: 'Webinar updated successfully.' });
  } catch (error) {
    console.error('updateWebinar error', error);
    return res.status(500).json({ message: 'Failed to update webinar.' });
  }
};

exports.deleteWebinar = async (req, res) => {
  try {
    const webinarId = Number(req.params.id);
    if (!Number.isInteger(webinarId) || webinarId <= 0) {
      return res.status(400).json({ message: 'Invalid webinar id.' });
    }

    const scopeCheck = await assertWebinarInScope(req, webinarId);
    if (!scopeCheck.ok) {
      return res.status(scopeCheck.status).json({ message: scopeCheck.message });
    }

    await db.execute('DELETE FROM webinars WHERE id = ?', [webinarId]);

    return res.status(200).json({ message: 'Webinar deleted successfully.' });
  } catch (error) {
    console.error('deleteWebinar error', error);
    return res.status(500).json({ message: 'Failed to delete webinar.' });
  }
};

exports.getStudentWebinars = async (req, res) => {
  try {
    const institutionId = req.user?.institution_id;
    if (!institutionId) {
      return res.status(403).json({ message: 'Institution context is required.' });
    }

    const scope = normalizeScope(req.query.scope || 'all');
    const search = String(req.query.search || '').trim();
    const userId = req.user.id;
    const registrationsTableExists = await hasTable('webinar_registrations');
    const hasStartsAt = await hasColumn('webinars', 'starts_at');
    const hasStatus = await hasColumn('webinars', 'status');

    const hasInstitutionId = await hasColumn('webinars', 'institution_id');

    // Fallback for legacy webinar schema (date_time/link only).
    if (!hasStartsAt || !hasStatus) {
      const legacyScopeClause =
        scope === 'upcoming' ? 'w.date_time >= NOW()' : scope === 'past' ? 'w.date_time < NOW()' : '1=1';
      const legacyClauses = [legacyScopeClause];
      const legacyParams = [];
      if (hasInstitutionId) {
        legacyClauses.push('w.institution_id = ?');
        legacyParams.push(institutionId);
      }

      if (search) {
        legacyClauses.push('(w.title LIKE ? OR w.speaker_name LIKE ?)');
        legacyParams.push(`%${search}%`, `%${search}%`);
      }

      const [legacyRows] = await db.execute(
        `
        SELECT
          w.id,
          w.title,
          '' AS summary,
          w.speaker_name,
          NULL AS speaker_role,
          NULL AS speaker_background,
          NULL AS speaker_photo_url,
          'ONLINE' AS session_mode,
          NULL AS venue,
          w.link AS meeting_link,
          NULL AS recording_url,
          w.date_time AS starts_at,
          NULL AS ends_at,
          FALSE AS registration_required,
          NULL AS capacity,
          'PUBLISHED' AS status,
          NULL AS mom_text,
          NULL AS mom_url,
          NULL AS key_takeaways,
          0 AS registration_count,
          0 AS is_registered,
          NULL AS created_at,
          NULL AS updated_at
        FROM webinars w
        WHERE ${legacyClauses.join(' AND ')}
        ORDER BY w.date_time ASC
        `,
        legacyParams
      );

      return res.status(200).json({
        count: legacyRows.length,
        webinars: legacyRows.map((w) => ({
          ...mapWebinar(w),
          is_registered: false,
        })),
      });
    }

    const clauses = ['w.status IN (\'PUBLISHED\', \'COMPLETED\')', getScopeClause(scope)];
    const params = [userId];
    if (hasInstitutionId) {
      clauses.push('w.institution_id = ?');
      params.push(institutionId);
    }

    if (search) {
      clauses.push('(w.title LIKE ? OR w.speaker_name LIKE ? OR w.summary LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const [rows] = registrationsTableExists
      ? await db.execute(
          `
          SELECT
            w.*,
            COUNT(DISTINCT wr2.student_id) AS registration_count,
            CASE WHEN wr.student_id IS NULL THEN 0 ELSE 1 END AS is_registered
          FROM webinars w
          LEFT JOIN webinar_registrations wr
            ON wr.webinar_id = w.id
           AND wr.student_id = ?
           AND wr.status = 'REGISTERED'
          LEFT JOIN webinar_registrations wr2
            ON wr2.webinar_id = w.id
           AND wr2.status = 'REGISTERED'
          WHERE ${clauses.join(' AND ')}
          GROUP BY w.id, wr.student_id
          ORDER BY
            CASE WHEN w.starts_at >= NOW() THEN 0 ELSE 1 END ASC,
            w.starts_at ASC
          `,
          params
        )
      : await db.execute(
          `
          SELECT
            w.*,
            0 AS registration_count,
            0 AS is_registered
          FROM webinars w
          WHERE ${clauses.join(' AND ')}
          ORDER BY
            CASE WHEN w.starts_at >= NOW() THEN 0 ELSE 1 END ASC,
            w.starts_at ASC
          `,
          params.slice(1)
        );

    return res.status(200).json({
      count: rows.length,
      webinars: rows.map((w) => ({
        ...mapWebinar(w),
        is_registered: Boolean(w.is_registered),
      })),
    });
  } catch (error) {
    console.error('getStudentWebinars error', error);
    return res.status(500).json({ message: 'Failed to fetch webinars.' });
  }
};

exports.registerForWebinar = async (req, res) => {
  try {
    const registrationsTableExists = await hasTable('webinar_registrations');
    if (!registrationsTableExists) {
      return res.status(503).json({
        message: 'Webinar registration is not available until the latest database migration is applied.',
      });
    }

    const webinarId = Number(req.params.id);
    const studentId = req.user.id;
    if (!Number.isInteger(webinarId) || webinarId <= 0) {
      return res.status(400).json({ message: 'Invalid webinar id.' });
    }

    const institutionId = req.user?.institution_id;
    if (!institutionId) {
      return res.status(403).json({ message: 'Institution context is required.' });
    }

    const [[webinar]] = await db.execute(
      `
      SELECT id, status, starts_at, registration_required, capacity
      FROM webinars
      WHERE id = ? AND institution_id = ?
      `,
      [webinarId, institutionId]
    );

    if (!webinar) return res.status(404).json({ message: 'Webinar not found.' });
    if (!['PUBLISHED', 'COMPLETED'].includes(webinar.status)) {
      return res.status(400).json({ message: 'This webinar is not open for student registration.' });
    }
    if (new Date(webinar.starts_at) < new Date()) {
      return res.status(400).json({ message: 'Registration is closed for this webinar.' });
    }
    if (!webinar.registration_required) {
      return res.status(400).json({ message: 'Registration is not required for this webinar.' });
    }

    if (webinar.capacity) {
      const [[countRow]] = await db.execute(
        `SELECT COUNT(*) AS total FROM webinar_registrations WHERE webinar_id = ? AND status = 'REGISTERED'`,
        [webinarId]
      );
      if (Number(countRow.total || 0) >= Number(webinar.capacity)) {
        return res.status(400).json({ message: 'This webinar is already full.' });
      }
    }

    await db.execute(
      `
      INSERT INTO webinar_registrations (webinar_id, student_id, status)
      VALUES (?, ?, 'REGISTERED')
      ON DUPLICATE KEY UPDATE status = 'REGISTERED', updated_at = CURRENT_TIMESTAMP
      `,
      [webinarId, studentId]
    );

    return res.status(200).json({ message: 'Registered successfully.' });
  } catch (error) {
    console.error('registerForWebinar error', error);
    return res.status(500).json({ message: 'Failed to register for webinar.' });
  }
};

