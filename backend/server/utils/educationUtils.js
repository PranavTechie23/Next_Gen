const EDUCATION_LEVELS = new Set(['graduation', 'diploma', 'hsc', 'ssc', 'other']);

const uniq = (arr = []) => Array.from(new Set(arr.filter(Boolean)));

const normalizeLineArray = (arr, max = 40) => {
    if (!Array.isArray(arr)) return [];
    return arr
        .map((x) => String(x || '').replace(/\s+/g, ' ').trim())
        .filter(Boolean)
        .slice(0, max);
};

const inferEducationLevel = (text = '') => {
    const t = String(text || '').toLowerCase();
    if (/\b(ssc|10th|matric|matriculation|secondary school|class x|std\.?\s*x)\b/.test(t)) return 'ssc';
    if (/\b(hsc|12th|higher secondary|intermediate|junior college|class xii|std\.?\s*xii)\b/.test(t)) return 'hsc';
    if (/\b(diploma|polytechnic)\b/.test(t)) return 'diploma';
    if (/(institute|university|college|b\.?\s*tech|b\.?\s*e|engineering|degree)/i.test(t)) return 'graduation';
    return 'other';
};

const parseMarksPercent = (raw) => {
    const m = String(raw || '').match(/(\d{1,3}(?:\.\d{1,2})?)/);
    if (!m) return null;
    const n = Number(m[1]);
    return Number.isFinite(n) && n >= 0 && n <= 100 ? n : null;
};

const educationEntryToLines = (entry = {}) => {
    const lines = [];
    if (entry.institute) lines.push(String(entry.institute).trim());
    if (entry.degreeOrBoard) lines.push(String(entry.degreeOrBoard).trim());
    if (entry.years) lines.push(String(entry.years).trim());
    if (entry.marks) {
        const marks = String(entry.marks).trim();
        lines.push(marks.includes('%') ? marks : `${marks}%`);
    }
    for (const d of Array.isArray(entry.details) ? entry.details : []) {
        const line = String(d || '').trim();
        if (line) lines.push(line);
    }
    return lines;
};

const inferStructuredEducationFromFlatLines = (lines = []) => {
    const raw = Array.isArray(lines) ? lines.map((l) => String(l || '').trim()).filter(Boolean) : [];
    if (!raw.length) return [];

    const isInstituteLine = (l) =>
        /(institute|university|college|school|vidyalaya|polytechnic|junior college)/i.test(l) ||
        /\b(?:IIT|NIT|IIIT|BITS)\b/i.test(l);

    const extractYears = (l) => {
        const m =
            l.match(/\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)\s+\d{4}\s*[-–—]\s*(?:present|ongoing|\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)\s+\d{4})\b/i) ||
            l.match(/\b(20\d{2})\s*[-–—]\s*(present|ongoing|20\d{2})\b/i);
        return m ? m[0].replace(/\s+/g, ' ').trim() : undefined;
    };

    const extractMarks = (l) => {
        const pct = String(l || '').match(/(\d{1,2}(?:\.\d{1,2})?)\s*%/);
        if (pct) return pct[1];
        const marks = String(l || '').match(/marks?\s*[:\-]?\s*(\d{1,2}(?:\.\d{1,2})?)/i);
        if (marks) return marks[1];
        return undefined;
    };

    const entries = [];
    let current = null;
    let seq = 0;

    const pushCurrent = () => {
        if (!current) return;
        const combined = [current.institute, current.degreeOrBoard, ...(current.details || [])].join(' ');
        current.level = inferEducationLevel(combined);
        if (!current.marks) current.marks = extractMarks(combined);
        if (current.institute || current.degreeOrBoard) entries.push(current);
        current = null;
    };

    for (const line of raw) {
        if (!current) {
            current = {
                id: `edu-${seq++}`,
                level: 'other',
                institute: line,
                degreeOrBoard: undefined,
                years: undefined,
                marks: extractMarks(line),
                details: [],
            };
            continue;
        }

        if (isInstituteLine(line) && (current.details.length > 0 || current.degreeOrBoard)) {
            pushCurrent();
            current = {
                id: `edu-${seq++}`,
                level: 'other',
                institute: line,
                degreeOrBoard: undefined,
                years: undefined,
                marks: extractMarks(line),
                details: [],
            };
            continue;
        }

        const years = extractYears(line);
        if (years && !current.years) {
            current.years = years;
            current.details.push(line);
            continue;
        }

        const marks = extractMarks(line);
        if (marks && !current.marks) current.marks = marks;

        if (!current.degreeOrBoard) {
            current.degreeOrBoard = line;
        } else {
            current.details.push(line);
        }
    }
    pushCurrent();

    if (entries.length === 0 && raw.length) {
        return [{
            id: 'edu-0',
            level: inferEducationLevel(raw.join(' ')),
            institute: raw[0],
            degreeOrBoard: raw[1] || undefined,
            years: extractYears(raw[1] || ''),
            marks: extractMarks(raw.join(' ')),
            details: raw.slice(2),
        }];
    }
    return entries;
};

const normalizeEducationEntries = (entries = [], legacyLines = []) => {
    let structured = [];
    if (Array.isArray(entries) && entries.length > 0) {
        structured = entries
            .map((e, i) => {
                const institute = String(e?.institute || '').trim();
                const degreeOrBoard = String(e?.degreeOrBoard || e?.headline || '').trim();
                const combined = `${institute} ${degreeOrBoard}`;
                const level = EDUCATION_LEVELS.has(e?.level) ? e.level : inferEducationLevel(combined);
                return {
                    id: String(e?.id || `edu-${i}`),
                    level,
                    institute,
                    degreeOrBoard: degreeOrBoard || undefined,
                    years: String(e?.years || '').trim() || undefined,
                    marks: String(e?.marks || '').trim() || undefined,
                    details: normalizeLineArray(e?.details || e?.detailLines, 10),
                };
            })
            .filter((e) => e.institute || e.degreeOrBoard)
            .slice(0, 12);
    } else if (Array.isArray(legacyLines) && legacyLines.length > 0) {
        structured = inferStructuredEducationFromFlatLines(legacyLines);
    }

    const flatLines = uniq(structured.flatMap(educationEntryToLines)).slice(0, 40);
    return { education_entries: structured, education: flatLines };
};

const educationLevelLabel = (level = '') => {
    const map = {
        graduation: 'Graduation',
        diploma: 'Diploma',
        hsc: 'HSC / 12th',
        ssc: 'SSC / 10th',
        other: 'Education',
    };
    return map[level] || map.other;
};

module.exports = {
    EDUCATION_LEVELS,
    inferEducationLevel,
    parseMarksPercent,
    educationEntryToLines,
    inferStructuredEducationFromFlatLines,
    normalizeEducationEntries,
    educationLevelLabel,
};
