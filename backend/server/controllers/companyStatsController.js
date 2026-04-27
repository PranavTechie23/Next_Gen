const db = require('../config/db');
const xlsx = require('xlsx');

const ensureCompanyStatsTable = async () => {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS company_hiring_stats (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      company_name VARCHAR(255) NOT NULL,
      year INT NOT NULL,
      role VARCHAR(255) NULL,
      ctc_lpa DECIMAL(10,2) NULL,
      selected_count INT NOT NULL DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX (company_name),
      INDEX (year)
    )
  `);
};

const toNumberOrNull = (v) => {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const normalizeCompany = (name) => String(name || '').trim();

const ctcBucket = (ctc) => {
  if (ctc === null || ctc === undefined) return 'Unknown';
  const n = Number(ctc);
  if (!Number.isFinite(n)) return 'Unknown';
  if (n < 4) return '<4';
  if (n < 6) return '4-6';
  if (n < 10) return '6-10';
  if (n < 15) return '10-15';
  if (n < 25) return '15-25';
  return '25+';
};

// POST /api/dept/company-stats/upload (TPO_HEAD)
exports.uploadCompanyStats = async (req, res) => {
  try {
    await ensureCompanyStatsTable();

    if (!req.file?.buffer) {
      return res.status(400).json({ message: 'No file uploaded. Please upload an Excel file.' });
    }

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames?.[0];
    if (!sheetName) {
      return res.status(400).json({ message: 'Excel has no sheets.' });
    }

    const rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    if (!rows || rows.length === 0) {
      return res.status(400).json({ message: 'The uploaded Excel file is empty.' });
    }

    // Expected columns (case-insensitive):
    // company_name, year, role, ctc_lpa, selected_count
    const inserts = [];
    for (const r of rows) {
      const company_name =
        r.company_name || r.Company || r.company || r['Company Name'] || r['company name'] || r['COMPANY'];
      const year = r.year || r.Year || r['Academic Year'] || r['YEAR'];
      const role = r.role || r.Role || r['Job Role'] || r['ROLE'];
      const ctc = r.ctc_lpa || r.ctc || r.CTC || r['CTC (LPA)'] || r['ctc (lpa)'] || r['Package LPA'];
      const selected = r.selected_count || r.selected || r.Selected || r['Selected Count'] || r['selected count'];

      const company = normalizeCompany(company_name);
      const y = toNumberOrNull(year);
      if (!company || !y) continue;

      inserts.push([
        company,
        Math.trunc(y),
        role ? String(role).trim() : null,
        toNumberOrNull(ctc),
        Math.max(1, Math.trunc(toNumberOrNull(selected) ?? 1)),
      ]);
    }

    if (inserts.length === 0) {
      return res.status(400).json({
        message: 'No valid rows found. Required: company_name and year. Optional: role, ctc_lpa, selected_count.',
      });
    }

    // Bulk insert
    await db.query(
      `INSERT INTO company_hiring_stats (company_name, year, role, ctc_lpa, selected_count)
       VALUES ?`,
      [inserts]
    );

    return res.json({ message: 'Company stats uploaded successfully.', rowsInserted: inserts.length });
  } catch (err) {
    console.error('uploadCompanyStats error', err);
    return res.status(500).json({ message: 'Failed to upload company stats' });
  }
};

// GET /api/student/company-stats?company=Google
exports.getCompanyStats = async (req, res) => {
  try {
    await ensureCompanyStatsTable();

    const company = normalizeCompany(req.query.company);
    if (!company) {
      return res.status(400).json({ message: 'Missing company query param' });
    }

    const [yearRows] = await db.execute(
      `SELECT year, SUM(selected_count) AS selected
       FROM company_hiring_stats
       WHERE company_name = ?
       GROUP BY year
       ORDER BY year DESC`,
      [company]
    );

    const [roleRows] = await db.execute(
      `SELECT COALESCE(role, 'Unknown') AS role, SUM(selected_count) AS count
       FROM company_hiring_stats
       WHERE company_name = ?
       GROUP BY COALESCE(role, 'Unknown')
       ORDER BY count DESC`,
      [company]
    );

    const [ctcRows] = await db.execute(
      `SELECT ctc_lpa, selected_count
       FROM company_hiring_stats
       WHERE company_name = ?`,
      [company]
    );

    const buckets = { '<4': 0, '4-6': 0, '6-10': 0, '10-15': 0, '15-25': 0, '25+': 0, Unknown: 0 };
    for (const r of ctcRows) {
      const b = ctcBucket(r.ctc_lpa);
      buckets[b] = (buckets[b] || 0) + Number(r.selected_count || 0);
    }

    return res.json({
      company,
      yearly: yearRows || [],
      roles: roleRows || [],
      ctcBuckets: buckets,
    });
  } catch (err) {
    console.error('getCompanyStats error', err);
    return res.status(500).json({ message: 'Failed to fetch company stats' });
  }
};

