import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Code, GraduationCap, Upload } from "lucide-react";

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
  onUploadResume: () => void;
  uploading?: boolean;
}) {
  const { isDark, resumeSections, onUploadResume, uploading } = props;

  const projects = Array.isArray(resumeSections?.projects) ? resumeSections.projects : [];
  const experience = Array.isArray(resumeSections?.experience) ? resumeSections.experience : [];
  const extracurricular = Array.isArray(resumeSections?.extracurricular) ? resumeSections.extracurricular : [];
  const education = Array.isArray(resumeSections?.education) ? resumeSections.education : [];
  const certifications = Array.isArray(resumeSections?.certifications) ? resumeSections.certifications : [];

  return (
    <div className="space-y-8">
      <Card className={`${isDark ? "bg-[#0c0c14]/40" : "bg-white/80"} backdrop-blur-3xl ${isDark ? "border-white/5" : "border-gray-200"} rounded-[2.5rem] overflow-hidden`}>
        <CardContent className="p-6 sm:p-10">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-2">
              <p className={`text-xs font-black uppercase tracking-[0.2em] ${isDark ? "text-slate-500" : "text-slate-500"}`}>Internships</p>
              <h2 className={`text-2xl sm:text-3xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>Projects & Internships</h2>
              <p className={`${isDark ? "text-slate-400" : "text-slate-600"} text-sm max-w-2xl`}>
                These details are extracted from your resume. If anything is missing, upload an updated resume or add items manually in Skills.
              </p>
            </div>
            <Button onClick={onUploadResume} disabled={!!uploading} className="h-12 rounded-2xl font-black">
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? "Uploading..." : "Upload Resume"}
            </Button>
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
                {projects.slice(0, 8).map((p, idx) => (
                  <div key={idx} className={`${isDark ? "bg-black/20" : "bg-slate-50"} rounded-xl p-4 border ${isDark ? "border-white/5" : "border-slate-200"}`}>
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
                {[...experience, ...extracurricular].slice(0, 18).map((e, idx) => (
                  <div key={idx} className={`flex items-start gap-2 text-sm ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-emerald-500/70 flex-shrink-0" />
                    <span>{e}</span>
                  </div>
                ))}
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
                {education.slice(0, 12).map((e, idx) => (
                  <div key={idx} className={`text-sm ${isDark ? "text-slate-200" : "text-slate-800"}`}>{e}</div>
                ))}
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
                {certifications.slice(0, 12).map((c, idx) => (
                  <div key={idx} className={`text-sm ${isDark ? "text-slate-200" : "text-slate-800"}`}>{c}</div>
                ))}
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

