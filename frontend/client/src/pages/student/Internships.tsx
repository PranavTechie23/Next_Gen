import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Code, GraduationCap, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { studentApi } from "@/services/studentApi";
import { toast } from "sonner";

type ResumeProject = {
  title?: string;
  bullets?: string[];
};

type ResumeSections = {
  projects?: ResumeProject[];
  experience?: string[];
  extracurricular?: string[];
  education?: string[];
  certifications?: string[];
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

  useEffect(() => {
    setDraft({
      projects: Array.isArray(resumeSections?.projects) ? resumeSections.projects.map((p) => ({ title: p?.title || "", bullets: Array.isArray(p?.bullets) ? [...p.bullets] : [] })) : [],
      experience: Array.isArray(resumeSections?.experience) ? [...resumeSections.experience] : [],
      extracurricular: Array.isArray(resumeSections?.extracurricular) ? [...resumeSections.extracurricular] : [],
      education: Array.isArray(resumeSections?.education) ? [...resumeSections.education] : [],
      certifications: Array.isArray(resumeSections?.certifications) ? [...resumeSections.certifications] : [],
    });
  }, [resumeSections]);

  const projects = Array.isArray(draft?.projects) ? draft.projects : [];
  const experience = Array.isArray(draft?.experience) ? draft.experience : [];
  const extracurricular = Array.isArray(draft?.extracurricular) ? draft.extracurricular : [];
  const education = Array.isArray(draft?.education) ? draft.education : [];
  const certifications = Array.isArray(draft?.certifications) ? draft.certifications : [];

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

  const cancelEdit = () => {
    setIsEditing(false);
    setDraft({
      projects: Array.isArray(resumeSections?.projects) ? resumeSections.projects.map((p) => ({ title: p?.title || "", bullets: Array.isArray(p?.bullets) ? [...p.bullets] : [] })) : [],
      experience: Array.isArray(resumeSections?.experience) ? [...resumeSections.experience] : [],
      extracurricular: Array.isArray(resumeSections?.extracurricular) ? [...resumeSections.extracurricular] : [],
      education: Array.isArray(resumeSections?.education) ? [...resumeSections.education] : [],
      certifications: Array.isArray(resumeSections?.certifications) ? [...resumeSections.certifications] : [],
    });
  };

  const saveChanges = async () => {
    try {
      setSaving(true);
      await studentApi.updateResumeSections({
        projects: (projects || [])
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
      <Card className={`${isDark ? "bg-[#0c0c14]/40" : "bg-white/80"} backdrop-blur-3xl ${isDark ? "border-white/5" : "border-gray-200"} rounded-[2.5rem] overflow-hidden`}>
        <CardContent className="p-6 sm:p-10">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-2">
              <p className={`text-xs font-black uppercase tracking-[0.2em] ${isDark ? "text-slate-500" : "text-slate-500"}`}>Internships</p>
              <h2 className={`text-2xl sm:text-3xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>Projects & Internships</h2>
              <p className={`${isDark ? "text-slate-400" : "text-slate-600"} text-sm max-w-2xl`}>
                These details are extracted from your resume. Upload an updated PDF if anything is missing.
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

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className={`rounded-2xl border p-5 ${isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}>
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
                  <div key={idx} className={`${isDark ? "bg-black/20" : "bg-slate-50"} rounded-xl p-4 border ${isDark ? "border-white/5" : "border-slate-200"}`}>
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

            <div className={`rounded-2xl border p-5 ${isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}>
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
          </div>

          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className={`rounded-2xl border p-5 ${isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? "bg-purple-500/10" : "bg-purple-50"}`}>
                  <GraduationCap className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? "text-slate-500" : "text-slate-500"}`}>Education</p>
                  <p className={`${isDark ? "text-white" : "text-slate-900"} font-black text-sm`}>{education.length} lines</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {!isEditing && education.slice(0, 12).map((e, idx) => (
                  <div key={idx} className={`text-sm ${isDark ? "text-slate-200" : "text-slate-800"}`}>{e}</div>
                ))}
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
                {education.length === 0 && (
                  <p className={`${isDark ? "text-slate-500" : "text-slate-500"} text-sm`}>No education extracted yet.</p>
                )}
              </div>
            </div>

            <div className={`rounded-2xl border p-5 ${isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}>
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
