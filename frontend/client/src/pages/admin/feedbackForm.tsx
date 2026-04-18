import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun, Send, User, Building2, Briefcase, Star, ArrowLeft } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

interface FormData {
  studentName: string;
  studentId: string;
  email: string;
  phone: string;
  branch: string;
  year: string;
  cgpa: string;
  companyName: string;
  jobRole: string;
  packageLPA: string;
  location: string;
  offerType: string;
  technicalRating: number;
  communicationRating: number;
  problemSolvingRating: number;
  strengths: string;
  improvements: string;
  tpoComments: string;
  isPlaced: boolean;
}

type FormField = keyof FormData;

export default function TPOFeedbackForm() {
  const { theme } = useTheme();
  const darkMode = theme === "dark";
  const [formData, setFormData] = useState<FormData>({
    studentName: "",
    studentId: "",
    email: "",
    phone: "",
    branch: "",
    year: "Final Year",
    cgpa: "",
    companyName: "",
    jobRole: "",
    packageLPA: "",
    location: "",
    offerType: "Full-time",
    technicalRating: 3,
    communicationRating: 3,
    problemSolvingRating: 3,
    strengths: "",
    improvements: "",
    tpoComments: "",
    isPlaced: true,
  });

  const handleChange = <K extends FormField>(field: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!formData.studentName || !formData.studentId || !formData.email || !formData.companyName) {
      alert("Please fill all required fields marked with *");
      return;
    }

    alert("Feedback submitted successfully!");
    console.log(formData);
  };

  return (
    <div className={`min-h-dvh overflow-x-hidden transition-all duration-500 ${darkMode
      ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
      : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }`}>
      {darkMode && (
        <>
          <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </>
      )}

      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 relative">
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => window.history.back()}
              className={`h-12 px-6 rounded-xl font-bold transition-all duration-300 ${darkMode
                ? 'bg-slate-800 hover:bg-slate-700 text-white border-2 border-slate-700 shadow-lg shadow-slate-900/50'
                : 'bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 shadow-md'
                }`}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <div>
              <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                TPO Feedback Form
              </h1>
              <p className={`text-sm sm:text-base mt-1 font-medium ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                Student Placement Feedback System
              </p>
            </div>
          </div>


        </div>

        <Card className={`transition-all duration-500 ${darkMode
          ? 'bg-slate-900/50 backdrop-blur-xl border-2 border-slate-800/50 shadow-2xl shadow-black/50'
          : 'bg-white border-2 border-gray-200 shadow-xl'
          }`}>
          <CardContent className="p-6 sm:p-8 lg:p-12 space-y-10">

            <div className="space-y-6">
              <div className="flex items-center gap-4 pb-4 border-b-2 border-dashed" style={{
                borderColor: darkMode ? 'rgb(51 65 85 / 0.5)' : 'rgb(229 231 235)'
              }}>
                <div className={`p-3 rounded-2xl ${darkMode
                  ? 'bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-900/50'
                  : 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30'
                  }`}>
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Student Information</h2>
                  <p className={`text-sm mt-0.5 ${darkMode ? 'text-slate-500' : 'text-gray-500'}`}>Basic details of the student</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <Label className={`text-base font-bold mb-2 block ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Student Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={formData.studentName}
                    onChange={(e) => handleChange("studentName", e.target.value)}
                    className={`h-12 text-base font-medium rounded-lg transition-all ${darkMode
                      ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                      }`}
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <Label className={`text-base font-bold mb-2 block ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Student ID <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={formData.studentId}
                    onChange={(e) => handleChange("studentId", e.target.value)}
                    className={`h-12 text-base font-medium rounded-lg transition-all ${darkMode
                      ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                      }`}
                    placeholder="e.g., CSE-2021-001"
                  />
                </div>

                <div>
                  <Label className={`text-base font-bold mb-2 block ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className={`h-12 text-base font-medium rounded-lg transition-all ${darkMode
                      ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                      }`}
                    placeholder="student@college.edu"
                  />
                </div>

                <div>
                  <Label className={`text-base font-bold mb-2 block ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Phone Number</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className={`h-12 text-base font-medium rounded-lg transition-all ${darkMode
                      ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                      }`}
                    placeholder="Enter contact number"
                  />
                </div>

                <div>
                  <Label className={`text-base font-bold mb-2 block ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Branch / Department</Label>
                  <Select value={formData.branch} onValueChange={(v) => handleChange("branch", v)}>
                    <SelectTrigger className={`h-12 text-base font-medium rounded-lg ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent className={darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}>
                      {["CSE", "ECE", "ME", "EE", "IT", "Civil"].map(b => (
                        <SelectItem key={b} value={b} className={`text-base font-medium ${darkMode ? 'text-white hover:bg-slate-700 focus:bg-slate-700' : 'text-gray-900'}`}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className={`text-base font-bold mb-2 block ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>CGPA / Percentage</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.cgpa}
                    onChange={(e) => handleChange("cgpa", e.target.value)}
                    className={`h-12 text-base font-medium rounded-lg transition-all ${darkMode
                      ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                      }`}
                    placeholder="e.g., 8.5"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 pb-4 border-b-2 border-dashed" style={{
                borderColor: darkMode ? 'rgb(51 65 85 / 0.5)' : 'rgb(229 231 235)'
              }}>
                <div className={`p-3 rounded-2xl ${darkMode
                  ? 'bg-gradient-to-br from-emerald-600 to-green-700 shadow-lg shadow-emerald-900/50'
                  : 'bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/30'
                  }`}>
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Company & Placement Details</h2>
                  <p className={`text-sm mt-0.5 ${darkMode ? 'text-slate-500' : 'text-gray-500'}`}>Job offer and company information</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <Label className={`text-base font-bold mb-2 block ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Company Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={formData.companyName}
                    onChange={(e) => handleChange("companyName", e.target.value)}
                    className={`h-12 text-base font-medium rounded-lg transition-all ${darkMode
                      ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                      }`}
                    placeholder="e.g., Google, Microsoft"
                  />
                </div>

                <div>
                  <Label className={`text-base font-bold mb-2 block ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Job Role / Position</Label>
                  <Input
                    value={formData.jobRole}
                    onChange={(e) => handleChange("jobRole", e.target.value)}
                    className={`h-12 text-base font-medium rounded-lg transition-all ${darkMode
                      ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                      }`}
                    placeholder="e.g., Software Engineer"
                  />
                </div>

                <div>
                  <Label className={`text-base font-bold mb-2 block ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Package (LPA)</Label>
                  <Input
                    type="number"
                    value={formData.packageLPA}
                    onChange={(e) => handleChange("packageLPA", e.target.value)}
                    className={`h-12 text-base font-medium rounded-lg transition-all ${darkMode
                      ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                      }`}
                    placeholder="e.g., 12.5"
                  />
                </div>

                <div>
                  <Label className={`text-base font-bold mb-2 block ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Job Location</Label>
                  <Input
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    className={`h-12 text-base font-medium rounded-lg transition-all ${darkMode
                      ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                      }`}
                    placeholder="e.g., Bangalore, Mumbai"
                  />
                </div>

                <div className="sm:col-span-2">
                  <Label className={`text-base font-bold mb-2 block ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Offer Type</Label>
                  <Select value={formData.offerType} onValueChange={(v) => handleChange("offerType", v)}>
                    <SelectTrigger className={`h-12 text-base font-medium rounded-lg ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className={darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}>
                      <SelectItem value="Full-time" className={`text-base font-medium ${darkMode ? 'text-white hover:bg-slate-700 focus:bg-slate-700' : 'text-gray-900'}`}>Full-time Position</SelectItem>
                      <SelectItem value="Internship" className={`text-base font-medium ${darkMode ? 'text-white hover:bg-slate-700 focus:bg-slate-700' : 'text-gray-900'}`}>Internship / Training</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className={`sm:col-span-2 flex items-center justify-between p-5 rounded-xl border-2 transition-all ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'
                  }`}>
                  <div>
                    <Label className={`text-lg font-bold block ${darkMode ? 'text-white' : 'text-gray-900'}`}>Student Placed Successfully?</Label>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-slate-500' : 'text-gray-500'}`}>Toggle if placement is confirmed</p>
                  </div>
                  <Switch
                    checked={formData.isPlaced}
                    onCheckedChange={(c) => handleChange("isPlaced", c)}
                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-emerald-600 data-[state=checked]:to-green-600 scale-125"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 pb-4 border-b-2 border-dashed" style={{
                borderColor: darkMode ? 'rgb(51 65 85 / 0.5)' : 'rgb(229 231 235)'
              }}>
                <div className={`p-3 rounded-2xl ${darkMode
                  ? 'bg-gradient-to-br from-purple-600 to-violet-700 shadow-lg shadow-purple-900/50'
                  : 'bg-gradient-to-br from-purple-500 to-violet-600 shadow-lg shadow-purple-500/30'
                  }`}>
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Performance Evaluation</h2>
                  <p className={`text-sm mt-0.5 ${darkMode ? 'text-slate-500' : 'text-gray-500'}`}>Rate student performance in key areas</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-6">
                {([
                  { field: "technicalRating" as const, label: "Technical Skills", color: darkMode ? 'from-blue-600 to-blue-700' : 'from-blue-500 to-blue-600' },
                  { field: "communicationRating" as const, label: "Communication", color: darkMode ? 'from-emerald-600 to-green-700' : 'from-emerald-500 to-green-600' },
                  { field: "problemSolvingRating" as const, label: "Problem Solving", color: darkMode ? 'from-purple-600 to-violet-700' : 'from-purple-500 to-violet-600' }
                ] as const).map((rating) => {
                  const ratingValue = formData[rating.field];
                  return (
                    <div key={rating.field} className={`p-6 rounded-2xl border-2 transition-all hover:scale-105 ${darkMode ? 'bg-slate-800/50 border-slate-700 hover:border-slate-600' : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                      }`}>
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${rating.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                        <Star className="w-6 h-6 text-white" fill="white" />
                      </div>
                      <Label className={`text-base font-bold block text-center mb-4 ${darkMode ? 'text-slate-200' : 'text-gray-800'}`}>{rating.label}</Label>
                      <div className="flex justify-center gap-1 mb-3">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => handleChange(rating.field, s)}
                            className="transition-transform hover:scale-125 active:scale-110"
                          >
                            <Star
                              className={`w-7 h-7 transition-all ${ratingValue >= s
                                ? 'fill-yellow-400 text-yellow-400 drop-shadow-lg'
                                : darkMode ? 'text-slate-700 hover:text-slate-600' : 'text-gray-300 hover:text-gray-400'
                                }`}
                            />
                          </button>
                        ))}
                      </div>
                      <p className={`text-2xl font-bold text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>{ratingValue}.0 / 5.0</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Label className={`text-base font-bold mb-2 block ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Student Strengths & Key Skills</Label>
                <Textarea
                  value={formData.strengths}
                  onChange={(e) => handleChange("strengths", e.target.value)}
                  className={`min-h-[120px] text-base font-medium rounded-lg resize-none transition-all ${darkMode
                    ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
                    }`}
                  placeholder="List the student's key strengths, technical skills, and achievements..."
                />
              </div>

              <div>
                <Label className={`text-base font-bold mb-2 block ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Areas for Improvement</Label>
                <Textarea
                  value={formData.improvements}
                  onChange={(e) => handleChange("improvements", e.target.value)}
                  className={`min-h-[120px] text-base font-medium rounded-lg resize-none transition-all ${darkMode
                    ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
                    }`}
                  placeholder="Suggest constructive feedback and areas where the student can improve..."
                />
              </div>

              <div>
                <Label className={`text-base font-bold mb-2 block ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>TPO Additional Comments & Recommendations</Label>
                <Textarea
                  value={formData.tpoComments}
                  onChange={(e) => handleChange("tpoComments", e.target.value)}
                  className={`min-h-[120px] text-base font-medium rounded-lg resize-none transition-all ${darkMode
                    ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
                    }`}
                  placeholder="Add your final comments, observations, and recommendations..."
                />
              </div>
            </div>

          </CardContent>

          <div className={`p-6 sm:p-8 border-t-2 ${darkMode ? 'border-slate-800 bg-slate-900/50' : 'border-gray-200 bg-gray-50'}`}>
            <Button
              type="button"
              onClick={handleSubmit}
              className={`w-full h-14 text-lg font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-xl ${darkMode
                ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-purple-900/50'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-blue-500/30'
                }`}
            >
              <Send className="w-5 h-5 mr-3" />
              Submit Feedback
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}