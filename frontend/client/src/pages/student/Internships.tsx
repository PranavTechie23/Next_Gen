import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Code, GraduationCap, Pencil, Plus, Save, Trash2, X, ChevronDown } from "lucide-react";
import { studentApi } from "@/services/studentApi";
import { toast } from "sonner";

type ResumeProject = {
  title?: string;
  bullets?: string[];
};

type CustomSection = {
  id?: string;
  title?: string;
  lines?: string[];
};

type ResumeSections = {
  projects?: ResumeProject[];
  experience?: string[];
  extracurricular?: string[];
  education?: string[];
  certifications?: string[];
  custom_sections?: CustomSection[];
};

type EducationEntry = {
  id: string;
  institute: string;
  headline?: string;
  years?: string;
  detailLines: string[];
};

const parseEducationEntries = (lines: string[]): EducationEntry[] => {
  const raw = Array.isArray(lines) ? lines.map((l) => String(l || "").trim()).filter(Boolean) : [];
  if (!raw.length) return [];

  const isInstituteLine = (l: string) =>
    /(institute|university|college|school|vidyalaya|polytechnic)/i.test(l) ||
    /\b(?:IIT|NIT|IIIT|BITS)\b/i.test(l);

  const extractYears = (l: string) => {
    const m =
      l.match(/\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)\s+\d{4}\s*[-–—]\s*(?:present|ongoing|\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)\s+\d{4})\b/i) ||
      l.match(/\b(20\d{2})\s*[-–—]\s*(present|ongoing|20\d{2})\b/i);
    return m ? m[0].replace(/\s+/g, " ").trim() : undefined;
  };

  const entries: EducationEntry[] = [];
  let current: EducationEntry | null = null;
  let seq = 0;

  const pushCurrent = () => {
    if (current && current.institute) entries.push(current);
    current = null;
  };

  for (const line of raw) {
    if (!current) {
      current = { id: `edu-${seq++}`, institute: line, detailLines: [] };
      continue;
    }

    // Start new entry when a new institute-like line appears and current already has some content.
    if (isInstituteLine(line) && (current.detailLines.length > 0 || current.headline)) {
      pushCurrent();
      current = { id: `edu-${seq++}`, institute: line, detailLines: [] };
      continue;
    }

    const years = extractYears(line);
    if (years && !current.years) {
      current.years = years;
      // Keep the original line as detail too (it often contains degree + years).
      current.detailLines.push(line);
      continue;
    }

    // First non-institute line usually becomes the "headline" (degree/board).
    if (!current.headline) {
      current.headline = line;
    } else {
      current.detailLines.push(line);
    }
  }
  pushCurrent();

  // If heuristics didn't split well, fall back to single entry.
  if (entries.length === 0 && raw.length) {
    return [{ id: "edu-0", institute: raw[0], headline: raw[1], years: extractYears(raw[1] || ""), detailLines: raw.slice(1) }];
  }
  return entries;
};

const normalizeProjectEntries = (inputProjects?: ResumeProject[]): ResumeProject[] => {
  const source = Array.isArray(inputProjects) ? inputProjects : [];
  const merged: ResumeProject[] = [];
  const cleanProjectTitle = (rawTitle: string) => {
    let title = String(rawTitle || "").trim();
    // Remove source/platform noise often extracted from resume headings.
    title = title
      .replace(/\((github|gitlab|bitbucket|vercel|netlify|render|portfolio|live|demo|source)\)/gi, "")
      .replace(
        /\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)\s+\d{4}\s*[-–—]\s*(?:present|ongoing|\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)\s+\d{4})\b/gi,
        ""
      )
      .replace(/\b\d{4}\s*[-–—]\s*(?:present|ongoing|\d{4})\b/gi, "")
      .replace(/\s{2,}/g, " ")
      .replace(/\s+-\s+$/, "")
      .trim();
    return title;
  };

  for (const raw of source) {
    const title = cleanProjectTitle(String(raw?.title || ""));
    const bullets = (Array.isArray(raw?.bullets) ? raw.bullets : [])
      .map((b) => String(b || "").trim())
      .filter(Boolean);
    const isTechStackOnly = /^tech\s*stack\b/i.test(title);

    if (isTechStackOnly && merged.length > 0) {
      const prev = merged[merged.length - 1];
      prev.bullets = [...(Array.isArray(prev.bullets) ? prev.bullets : []), title, ...bullets];
      continue;
    }

    if (!title && bullets.length > 0 && merged.length > 0) {
      const prev = merged[merged.length - 1];
      prev.bullets = [...(Array.isArray(prev.bullets) ? prev.bullets : []), ...bullets];
      continue;
    }

    if (!title && bullets.length === 0) continue;
    merged.push({ title, bullets });
  }

  return merged;
};

export default function Internships(props: {
  isDark: boolean;
  resumeSections: ResumeSections;
  onAfterSectionsSave?: () => void | Promise<void>;
}) {
  const { isDark, resumeSections, onAfterSectionsSave } = props;

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<ResumeSections>({});
  const [expandedEdu, setExpandedEdu] = useState<Record<string, boolean>>({});
  const [lastAddedCustomId, setLastAddedCustomId] = useState<string | null>(null);
  const glassCard = isDark
    ? "border border-white/10 bg-gradient-to-br from-white/10 via-white/[0.07] to-white/[0.04] backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
    : "border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-slate-100/80 backdrop-blur-xl shadow-[0_10px_30px_rgba(15,23,42,0.08)]";

  useEffect(() => {
    const normalizedProjects = normalizeProjectEntries(resumeSections?.projects);
    setDraft({
      projects: normalizedProjects.map((p) => ({
        title: p?.title || "",
        bullets: Array.isArray(p?.bullets) ? [...p.bullets] : [],
      })),
      experience: Array.isArray(resumeSections?.experience) ? [...resumeSections.experience] : [],
      extracurricular: Array.isArray(resumeSections?.extracurricular) ? [...resumeSections.extracurricular] : [],
      education: Array.isArray(resumeSections?.education) ? [...resumeSections.education] : [],
      certifications: Array.isArray(resumeSections?.certifications) ? [...resumeSections.certifications] : [],
      custom_sections: Array.isArray(resumeSections?.custom_sections)
        ? resumeSections.custom_sections.map((s) => ({
            id: String((s as any)?.id || ""),
            title: String(s?.title || ""),
            lines: Array.isArray(s?.lines) ? [...s.lines] : [],
          }))
        : [],
    });
  }, [resumeSections]);

  const projects = Array.isArray(draft?.projects) ? draft.projects : [];
  const experience = Array.isArray(draft?.experience) ? draft.experience : [];
  const extracurricular = Array.isArray(draft?.extracurricular) ? draft.extracurricular : [];
  const education = Array.isArray(draft?.education) ? draft.education : [];
  const certifications = Array.isArray(draft?.certifications) ? draft.certifications : [];
  const customSections = Array.isArray(draft?.custom_sections) ? draft.custom_sections : [];
  const educationEntries = parseEducationEntries(education);

  const updateList = (key: "experience" | "extracurricular" | "education" | "certifications", index: number, value: string) => {
    setDraft((prev) => {
      const arr = Array.isArray(prev?.[key]) ? [...(prev[key] as string[])] : [];
      arr[index] = value;
      return { ...(prev || {}), [key]: arr };
    });
  };

  const addListItem = (key: "experience" | "extracurricular" | "education" | "certifications") => {
    setDraft((prev) => {
      const arr = Array.isArray(prev?.[key]) ? [...(prev[key] as string[])] : [];
      arr.push("");
      return { ...(prev || {}), [key]: arr };
    });
  };

  const deleteListItem = (key: "experience" | "extracurricular" | "education" | "certifications", index: number) => {
    setDraft((prev) => {
      const arr = Array.isArray(prev?.[key]) ? [...(prev[key] as string[])] : [];
      arr.splice(index, 1);
      return { ...(prev || {}), [key]: arr };
    });
  };

  const addProject = () => {
    setDraft((prev) => ({
      ...(prev || {}),
      projects: [...(Array.isArray(prev?.projects) ? prev.projects : []), { title: "", bullets: [] }],
    }));
  };

  const updateProject = (index: number, patch: Partial<ResumeProject>) => {
    setDraft((prev) => {
      const arr = Array.isArray(prev?.projects) ? [...prev.projects] : [];
      arr[index] = { ...(arr[index] || {}), ...patch };
      return { ...(prev || {}), projects: arr };
    });
  };

  const deleteProject = (index: number) => {
    setDraft((prev) => {
      const arr = Array.isArray(prev?.projects) ? [...prev.projects] : [];
      arr.splice(index, 1);
      return { ...(prev || {}), projects: arr };
    });
  };

  const addCustomSection = () => {
    const id = `cs-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setDraft((prev) => ({
      ...(prev || {}),
      custom_sections: [
        { id, title: "New Section", lines: [""] },
        ...(Array.isArray(prev?.custom_sections) ? prev.custom_sections : []),
      ],
    }));
    setLastAddedCustomId(id);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  };

  const updateCustomSection = (index: number, patch: Partial<CustomSection>) => {
    setDraft((prev) => {
      const arr = Array.isArray(prev?.custom_sections) ? [...prev.custom_sections] : [];
      arr[index] = { ...(arr[index] || {}), ...patch };
      return { ...(prev || {}), custom_sections: arr };
    });
  };

  const deleteCustomSection = (index: number) => {
    setDraft((prev) => {
      const arr = Array.isArray(prev?.custom_sections) ? [...prev.custom_sections] : [];
      arr.splice(index, 1);
      return { ...(prev || {}), custom_sections: arr };
    });
  };

  const updateCustomSectionLine = (sectionIndex: number, lineIndex: number, value: string) => {
    const section = customSections[sectionIndex] || { title: "", lines: [] };
    const lines = Array.isArray(section.lines) ? [...section.lines] : [];
    lines[lineIndex] = value;
    updateCustomSection(sectionIndex, { lines });
  };

  const addCustomSectionLine = (sectionIndex: number) => {
    const section = customSections[sectionIndex] || { title: "", lines: [] };
    const lines = Array.isArray(section.lines) ? [...section.lines] : [];
    lines.push("");
    updateCustomSection(sectionIndex, { lines });
  };

  const deleteCustomSectionLine = (sectionIndex: number, lineIndex: number) => {
    const section = customSections[sectionIndex] || { title: "", lines: [] };
    const lines = Array.isArray(section.lines) ? [...section.lines] : [];
    lines.splice(lineIndex, 1);
    updateCustomSection(sectionIndex, { lines });
  };

  const cancelEdit = () => {
    setIsEditing(false);
    const normalizedProjects = normalizeProjectEntries(resumeSections?.projects);
    setDraft({
      projects: normalizedProjects.map((p) => ({
        title: p?.title || "",
        bullets: Array.isArray(p?.bullets) ? [...p.bullets] : [],
      })),
      experience: Array.isArray(resumeSections?.experience) ? [...resumeSections.experience] : [],
      extracurricular: Array.isArray(resumeSections?.extracurricular) ? [...resumeSections.extracurricular] : [],
      education: Array.isArray(resumeSections?.education) ? [...resumeSections.education] : [],
      certifications: Array.isArray(resumeSections?.certifications) ? [...resumeSections.certifications] : [],
      custom_sections: Array.isArray(resumeSections?.custom_sections)
        ? resumeSections.custom_sections.map((s) => ({
            id: String((s as any)?.id || ""),
            title: String(s?.title || ""),
            lines: Array.isArray(s?.lines) ? [...s.lines] : [],
          }))
        : [],
    });
  };

  const saveChanges = async () => {
    try {
      setSaving(true);
      await studentApi.updateResumeSections({
        projects: normalizeProjectEntries(projects || [])
          .map((p) => ({
            title: String(p?.title || "").trim(),
            bullets: (Array.isArray(p?.bullets) ? p.bullets : [])
              .map((b) => String(b || "").trim())
              .filter(Boolean),
          }))
          .filter((p) => p.title || p.bullets.length > 0),
        experience: (experience || []).map((x) => String(x || "").trim()).filter(Boolean),
        extracurricular: (extracurricular || []).map((x) => String(x || "").trim()).filter(Boolean),
        education: (education || []).map((x) => String(x || "").trim()).filter(Boolean),
        certifications: (certifications || []).map((x) => String(x || "").trim()).filter(Boolean),
        custom_sections: (customSections || [])
          .map((s) => ({
            title: String(s?.title || "").trim(),
            lines: (Array.isArray(s?.lines) ? s.lines : []).map((x) => String(x || "").trim()).filter(Boolean),
          }))
          .filter((s) => s.title),
      });
      toast.success("Internship and project details updated.");
      setIsEditing(false);
      await onAfterSectionsSave?.();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Could not save changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card className={`${isDark ? "bg-[#0c0c14]/50" : "bg-white/80"} backdrop-blur-3xl ${isDark ? "border-white/10" : "border-gray-200"} rounded-[2rem] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.25)]`}>
        <CardContent className="p-6 sm:p-10">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-2">
              <p className={`text-xs font-black uppercase tracking-[0.2em] ${isDark ? "text-slate-500" : "text-slate-500"}`}>Internships</p>
              <h2 className={`text-2xl sm:text-3xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>Projects & Internships</h2>
              <p className={`${isDark ? "text-slate-400" : "text-slate-600"} text-sm max-w-2xl`}>
                Details are auto-extracted from your resume. If anything is missed or incorrect, edit or add it manually.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto shrink-0">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} className="h-12 rounded-2xl font-black" variant="secondary">
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit Details
                </Button>
              ) : (
                <>
                  <Button onClick={addCustomSection} disabled={saving} className="h-12 rounded-2xl font-black" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Section
                  </Button>
                  <Button onClick={saveChanges} disabled={saving} className="h-12 rounded-2xl font-black">
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button onClick={cancelEdit} disabled={saving} className="h-12 rounded-2xl font-black" variant="secondary">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
            <div className="space-y-5">
            <div className={`self-start h-fit rounded-2xl p-5 ${glassCard}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? "bg-blue-500/10" : "bg-blue-50"}`}>
                  <Code className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? "text-slate-500" : "text-slate-500"}`}>Projects</p>
                  <p className={`${isDark ? "text-white" : "text-slate-900"} font-black text-sm`}>{projects.length} detected</p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {isEditing && (
                  <Button onClick={addProject} variant="outline" className={`h-9 rounded-xl ${isDark ? "border-white/20 text-white hover:bg-white/10" : ""}`}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Project
                  </Button>
                )}
                {projects.slice(0, 8).map((p, idx) => (
                  <div key={idx} className={`${isDark ? "bg-black/20 border-white/10" : "bg-slate-50 border-slate-200"} rounded-xl p-4 border`}>
                    {isEditing ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <input
                            value={p?.title || ""}
                            onChange={(e) => updateProject(idx, { title: e.target.value })}
                            placeholder="Project title"
                            className={`w-full h-10 px-3 rounded-xl text-sm border outline-none ${
                              isDark ? "bg-[#0c0c14]/60 border-white/10 text-white" : "bg-white border-slate-200 text-slate-900"
                            }`}
                          />
                          <Button variant="ghost" size="icon" onClick={() => deleteProject(idx)} className="h-9 w-9">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                        <textarea
                          value={Array.isArray(p?.bullets) ? p.bullets.join("\n") : ""}
                          onChange={(e) =>
                            updateProject(idx, {
                              bullets: e.target.value
                                .split("\n")
                                .map((x) => x.trim())
                                .filter(Boolean),
                            })
                          }
                          placeholder="One bullet per line"
                          rows={4}
                          className={`w-full px-3 py-2 rounded-xl text-sm border outline-none ${
                            isDark ? "bg-[#0c0c14]/60 border-white/10 text-white" : "bg-white border-slate-200 text-slate-900"
                          }`}
                        />
                      </div>
                    ) : (
                      <>
                        <p className={`font-black text-sm ${isDark ? "text-white" : "text-slate-900"}`}>{p?.title || "Project"}</p>
                        {Array.isArray(p?.bullets) && p.bullets.length > 0 && (
                          <ul className={`mt-2 space-y-1 text-xs ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                            {p.bullets.slice(0, 5).map((b, i) => (
                              <li key={i} className="flex gap-2">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500/70 flex-shrink-0" />
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    )}
                  </div>
                ))}
                {projects.length === 0 && (
                  <p className={`${isDark ? "text-slate-500" : "text-slate-500"} text-sm`}>No projects extracted yet.</p>
                )}
              </div>
            </div>
            <div className={`self-start h-fit rounded-2xl p-5 ${glassCard}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? "bg-purple-500/10" : "bg-purple-50"}`}>
                  <GraduationCap className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? "text-slate-500" : "text-slate-500"}`}>Education</p>
                  <p className={`${isDark ? "text-white" : "text-slate-900"} font-black text-sm`}>{educationEntries.length} entries</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {!isEditing && (
                  <div className="space-y-2">
                    {educationEntries.length > 0 ? (
                      educationEntries.slice(0, 6).map((entry) => {
                        const isOpen = Boolean(expandedEdu[entry.id]);
                        return (
                          <div
                            key={entry.id}
                            className={`${isDark ? "bg-black/20 border-white/10" : "bg-white/70 border-slate-200"} rounded-xl border p-3`}
                          >
                            <button
                              type="button"
                              onClick={() => setExpandedEdu((prev) => ({ ...(prev || {}), [entry.id]: !isOpen }))}
                              className="w-full text-left flex items-start justify-between gap-3"
                            >
                              <div className="min-w-0">
                                <p className={`${isDark ? "text-slate-50" : "text-slate-900"} font-black text-sm leading-snug truncate`}>
                                  {entry.institute}
                                </p>
                                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
                                  {entry.headline && (
                                    <span className={`${isDark ? "text-slate-200" : "text-slate-700"} text-xs font-semibold`}>
                                      {entry.headline}
                                    </span>
                                  )}
                                  {entry.years && (
                                    <span className={`${isDark ? "text-slate-300" : "text-slate-600"} text-xs`}>
                                      {entry.years}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <ChevronDown
                                className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isDark ? "text-slate-200" : "text-slate-700"} transition-transform ${
                                  isOpen ? "rotate-180" : ""
                                }`}
                              />
                            </button>

                            {isOpen && (
                              <div className="mt-3 space-y-1">
                                {(entry.detailLines || []).slice(0, 10).map((line, i) => (
                                  <div key={i} className={`text-xs leading-relaxed ${isDark ? "text-slate-200/95" : "text-slate-700"}`}>
                                    {line}
                                  </div>
                                ))}
                                {(entry.detailLines || []).length === 0 && (
                                  <div className={`${isDark ? "text-slate-400" : "text-slate-500"} text-xs`}>No extra details.</div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <p className={`${isDark ? "text-slate-500" : "text-slate-500"} text-sm`}>No education extracted yet.</p>
                    )}
                  </div>
                )}
                {isEditing && (
                  <div className="space-y-2">
                    <Button variant="outline" className={`h-8 rounded-lg text-xs ${isDark ? "border-white/20 text-white hover:bg-white/10" : ""}`} onClick={() => addListItem("education")}>
                      <Plus className="w-3 h-3 mr-1" /> Add Education Line
                    </Button>
                    {education.map((line, idx) => (
                      <div key={`edu-${idx}`} className="flex items-center gap-2">
                        <input
                          value={line}
                          onChange={(e) => updateList("education", idx, e.target.value)}
                          className={`w-full h-10 px-3 rounded-xl text-sm border outline-none ${
                            isDark ? "bg-[#0c0c14]/60 border-white/10 text-white" : "bg-white border-slate-200 text-slate-900"
                          }`}
                        />
                        <Button variant="ghost" size="icon" onClick={() => deleteListItem("education", idx)} className="h-8 w-8">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            </div>

            <div className="space-y-5">
            <div className={`self-start h-fit rounded-2xl p-5 ${glassCard}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? "bg-emerald-500/10" : "bg-emerald-50"}`}>
                  <Briefcase className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? "text-slate-500" : "text-slate-500"}`}>Internships / Experience</p>
                  <p className={`${isDark ? "text-white" : "text-slate-900"} font-black text-sm`}>
                    {(experience.length + extracurricular.length) || 0} detected
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {!isEditing && [...experience, ...extracurricular].slice(0, 18).map((e, idx) => (
                  <div key={idx} className={`flex items-start gap-2 text-sm ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-emerald-500/70 flex-shrink-0" />
                    <span>{e}</span>
                  </div>
                ))}
                {isEditing && (
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className={`text-xs font-black uppercase tracking-widest ${isDark ? "text-slate-400" : "text-slate-500"}`}>Experience</p>
                        <Button variant="outline" className={`h-8 rounded-lg text-xs ${isDark ? "border-white/20 text-white hover:bg-white/10" : ""}`} onClick={() => addListItem("experience")}>
                          <Plus className="w-3 h-3 mr-1" /> Add
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {experience.map((line, idx) => (
                          <div key={`exp-${idx}`} className="flex items-center gap-2">
                            <input
                              value={line}
                              onChange={(e) => updateList("experience", idx, e.target.value)}
                              className={`w-full h-10 px-3 rounded-xl text-sm border outline-none ${
                                isDark ? "bg-[#0c0c14]/60 border-white/10 text-white" : "bg-white border-slate-200 text-slate-900"
                              }`}
                            />
                            <Button variant="ghost" size="icon" onClick={() => deleteListItem("experience", idx)} className="h-8 w-8">
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className={`text-xs font-black uppercase tracking-widest ${isDark ? "text-slate-400" : "text-slate-500"}`}>Extracurricular</p>
                        <Button variant="outline" className={`h-8 rounded-lg text-xs ${isDark ? "border-white/20 text-white hover:bg-white/10" : ""}`} onClick={() => addListItem("extracurricular")}>
                          <Plus className="w-3 h-3 mr-1" /> Add
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {extracurricular.map((line, idx) => (
                          <div key={`extra-${idx}`} className="flex items-center gap-2">
                            <input
                              value={line}
                              onChange={(e) => updateList("extracurricular", idx, e.target.value)}
                              className={`w-full h-10 px-3 rounded-xl text-sm border outline-none ${
                                isDark ? "bg-[#0c0c14]/60 border-white/10 text-white" : "bg-white border-slate-200 text-slate-900"
                              }`}
                            />
                            <Button variant="ghost" size="icon" onClick={() => deleteListItem("extracurricular", idx)} className="h-8 w-8">
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {(experience.length + extracurricular.length) === 0 && (
                  <p className={`${isDark ? "text-slate-500" : "text-slate-500"} text-sm`}>No internship/experience extracted yet.</p>
                )}
              </div>
            </div>
            <div className={`self-start h-fit rounded-2xl p-5 ${glassCard}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? "bg-amber-500/10" : "bg-amber-50"}`}>
                  <Briefcase className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? "text-slate-500" : "text-slate-500"}`}>Certifications</p>
                  <p className={`${isDark ? "text-white" : "text-slate-900"} font-black text-sm`}>{certifications.length} lines</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {!isEditing && certifications.slice(0, 12).map((c, idx) => (
                  <div key={idx} className={`text-sm ${isDark ? "text-slate-200" : "text-slate-800"}`}>{c}</div>
                ))}
                {isEditing && (
                  <div className="space-y-2">
                    <Button variant="outline" className={`h-8 rounded-lg text-xs ${isDark ? "border-white/20 text-white hover:bg-white/10" : ""}`} onClick={() => addListItem("certifications")}>
                      <Plus className="w-3 h-3 mr-1" /> Add Certification Line
                    </Button>
                    {certifications.map((line, idx) => (
                      <div key={`cert-${idx}`} className="flex items-center gap-2">
                        <input
                          value={line}
                          onChange={(e) => updateList("certifications", idx, e.target.value)}
                          className={`w-full h-10 px-3 rounded-xl text-sm border outline-none ${
                            isDark ? "bg-[#0c0c14]/60 border-white/10 text-white" : "bg-white border-slate-200 text-slate-900"
                          }`}
                        />
                        <Button variant="ghost" size="icon" onClick={() => deleteListItem("certifications", idx)} className="h-8 w-8">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                {certifications.length === 0 && (
                  <p className={`${isDark ? "text-slate-500" : "text-slate-500"} text-sm`}>No certifications extracted yet.</p>
                )}
              </div>
            </div>
            {customSections.map((section, sectionIndex) => {
              const stableId = String(section?.id || `cs-${sectionIndex}`);
              const isJustAdded = lastAddedCustomId && stableId === lastAddedCustomId;
              return (
              <div
                id={stableId}
                key={stableId}
                className={`self-start h-fit rounded-2xl p-5 ${glassCard} ${isJustAdded ? "ring-2 ring-violet-500/60" : ""}`}
              >
                <div className="flex items-center gap-3 justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? "bg-cyan-500/10" : "bg-cyan-50"}`}>
                      <Briefcase className="w-5 h-5 text-cyan-500" />
                    </div>
                    <div className="min-w-0">
                      {isEditing ? (
                        <input
                          value={section?.title || ""}
                          onChange={(e) => updateCustomSection(sectionIndex, { title: e.target.value })}
                          className={`w-full h-9 px-2 rounded-lg text-sm border outline-none ${
                            isDark ? "bg-[#0c0c14]/60 border-white/10 text-white" : "bg-white border-slate-200 text-slate-900"
                          }`}
                        />
                      ) : (
                        <p className={`${isDark ? "text-white" : "text-slate-900"} font-black text-sm truncate`}>
                          {section?.title || "Custom Section"}
                        </p>
                      )}
                    </div>
                  </div>
                  {isEditing && (
                    <Button variant="ghost" size="icon" onClick={() => deleteCustomSection(sectionIndex)} className="h-8 w-8">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  )}
                </div>
                <div className="mt-4 space-y-2">
                  {!isEditing &&
                    (Array.isArray(section?.lines) ? section.lines : []).map((line, idx) => (
                      <div key={idx} className={`text-sm ${isDark ? "text-slate-200" : "text-slate-800"}`}>{line}</div>
                    ))}
                  {!isEditing && (!Array.isArray(section?.lines) || section.lines.length === 0) && (
                    <p className={`${isDark ? "text-slate-500" : "text-slate-500"} text-sm`}>No details added yet.</p>
                  )}
                  {isEditing && (
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className={`h-8 rounded-lg text-xs ${isDark ? "border-white/20 text-white hover:bg-white/10" : ""}`}
                        onClick={() => addCustomSectionLine(sectionIndex)}
                      >
                        <Plus className="w-3 h-3 mr-1" /> Add Line
                      </Button>
                      {(Array.isArray(section?.lines) ? section.lines : []).map((line, idx) => (
                        <div key={`custom-${sectionIndex}-line-${idx}`} className="flex items-center gap-2">
                          <input
                            value={line}
                            onChange={(e) => updateCustomSectionLine(sectionIndex, idx, e.target.value)}
                            className={`w-full h-10 px-3 rounded-xl text-sm border outline-none ${
                              isDark ? "bg-[#0c0c14]/60 border-white/10 text-white" : "bg-white border-slate-200 text-slate-900"
                            }`}
                          />
                          <Button variant="ghost" size="icon" onClick={() => deleteCustomSectionLine(sectionIndex, idx)} className="h-8 w-8">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
            })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
