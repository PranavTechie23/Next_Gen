type EducationEntry = {
  id?: string;
  level?: "graduation" | "hsc" | "ssc" | "other";
  institute?: string;
  degreeOrBoard?: string;
  years?: string;
  marks?: string;
  details?: string[];
};

const LEVEL_LABELS: Record<string, string> = {
  graduation: "Graduation",
  hsc: "HSC / 12th",
  ssc: "SSC / 10th",
  other: "Education",
};

const levelBadgeClass = (level?: string) => {
  if (level === "ssc") return "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/20";
  if (level === "hsc") return "bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20";
  return "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20";
};

export function EducationProfileList({
  entries,
  emptyMessage = "No education details added yet.",
}: {
  entries?: EducationEntry[];
  emptyMessage?: string;
}) {
  const list = Array.isArray(entries) ? entries : [];
  if (!list.length) {
    return (
      <p className="text-xs text-muted-foreground bg-muted/20 p-3 rounded-lg border border-border border-dashed">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="space-y-2.5">
      {list.map((entry, idx) => {
        const marks = entry.marks
          ? entry.marks.includes("%")
            ? entry.marks
            : `${entry.marks}%`
          : null;
        return (
          <div key={entry.id || `edu-${idx}`} className="rounded-xl border border-border/30 bg-muted/15 p-3.5">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${levelBadgeClass(entry.level)}`}>
                {LEVEL_LABELS[String(entry.level || "other")] || LEVEL_LABELS.other}
              </span>
              {marks && <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{marks}</span>}
            </div>
            <p className="font-bold text-sm text-foreground leading-snug">{entry.institute || "Institute not specified"}</p>
            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
              {entry.degreeOrBoard && <span className="font-medium">{entry.degreeOrBoard}</span>}
              {entry.years && <span>{entry.years}</span>}
            </div>
            {Array.isArray(entry.details) && entry.details.length > 0 && (
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                {entry.details.slice(0, 5).map((line, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-muted-foreground/50 shrink-0" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
