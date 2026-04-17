import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Moon, Sun, Send, User, Briefcase, Award, TrendingUp, Star, ArrowLeft, Sparkles, Zap, Target, Trophy, CheckCircle2 } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

interface FormData {
  studentName: string;
  studentId: string;
  email: string;
  phone: string;
  branch: string;
  semester: string;
  cgpa: string;
  companyName: string;
  jobRole: string;
  packageLPA: string;
  location: string;
  offerType: string;
  interviewExperience: string;
  technicalQuestions: string;
  hrQuestions: string;
  interviewRounds: string;
  preparationTips: string;
  resourcesUsed: string;
  difficultyRating: number;
  interviewRating: number;
  overallExperience: string;
  adviceForJuniors: string;
}

type FormField = keyof FormData;

export default function StudentFeedbackForm(props: any) {
  const isDashboard = props?.isDashboard || false;
  const { theme } = useTheme();
  const darkMode = theme === "dark";
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    studentName: "",
    studentId: "",
    email: "",
    phone: "",
    branch: "",
    semester: "8",
    cgpa: "",
    companyName: "",
    jobRole: "",
    packageLPA: "",
    location: "",
    offerType: "Full-time",
    interviewExperience: "",
    technicalQuestions: "",
    hrQuestions: "",
    interviewRounds: "3",
    preparationTips: "",
    resourcesUsed: "",
    difficultyRating: 3,
    interviewRating: 3,
    overallExperience: "",
    adviceForJuniors: "",
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

    alert("🎉 Feedback submitted successfully! Thank you for sharing your experience!");
    console.log(formData);
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const steps = [
    { num: 1, title: "Personal Info", icon: User },
    { num: 2, title: "Placement Details", icon: Briefcase },
    { num: 3, title: "Experience", icon: Award }
  ];

  return (
    <div className={`${!isDashboard ? "min-h-screen" : "bg-transparent"} transition-all duration-500 ${!isDashboard ? (darkMode
      ? 'bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 shadow-inner'
      : 'bg-background'
    ) : "bg-transparent"}`}>
      {darkMode && (
        <>
          <div className="fixed top-0 right-1/3 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="fixed bottom-0 left-1/3 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="fixed top-1/2 left-1/2 w-[400px] h-[400px] bg-pink-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </>
      )}

      <div className={`${!isDashboard ? "max-w-5xl mx-auto p-4 sm:p-6 lg:p-8" : "p-0"} relative`}>
        {/* Header - Only show if not in dashboard */}
        {!isDashboard && (
          <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => window.history.back()}
                className={`h-12 px-6 rounded-2xl font-bold transition-all duration-300 ${darkMode
                  ? 'bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white border-2 border-slate-700/50 shadow-xl shadow-slate-900/50'
                  : 'bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 shadow-lg'
                  }`}
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className={`text-3xl sm:text-4xl font-black tracking-tight ${darkMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400' : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600'
                    }`}>
                    Student Feedback
                  </h1>
                  <Sparkles className={`w-6 h-6 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'} animate-pulse`} />
                </div>
                <p className={`text-sm sm:text-base mt-1 font-semibold ${darkMode ? 'text-slate-400' : 'text-gray-600'
                  }`}>
                  Share your placement journey & inspire others! 🚀
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Progress Steps */}
        <div className={`mb-8 p-6 rounded-[2rem] transition-all duration-300 ${darkMode
          ? 'bg-gradient-to-r from-black/50 to-black/50 backdrop-blur-xl border-2 border-slate-700/50'
          : 'bg-white/80 backdrop-blur-3xl border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)]'
          }`}>
          <div className="flex justify-between items-center">
            {steps.map((step, idx) => (
              <div key={step.num} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${currentStep >= step.num
                    ? darkMode
                      ? 'bg-gradient-to-br from-black to-black shadow-lg shadow-blue-500/50'
                      : 'bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg'
                    : darkMode
                      ? 'bg-slate-800 border-2 border-slate-700'
                      : 'bg-gray-100 border-2 border-gray-300'
                    }`}>
                    {currentStep > step.num ? (
                      <CheckCircle2 className="w-7 h-7 text-white" />
                    ) : (
                      <step.icon className={`w-7 h-7 ${currentStep >= step.num ? 'text-white' : darkMode ? 'text-slate-500' : 'text-gray-400'}`} />
                    )}
                  </div>
                  <span className={`mt-2 text-xs font-bold ${currentStep >= step.num
                    ? darkMode ? 'text-blue-400' : 'text-blue-600'
                    : darkMode ? 'text-slate-600' : 'text-gray-400'
                    }`}>
                    {step.title}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`h-1 flex-1 mx-2 rounded-full transition-all duration-300 ${currentStep > step.num
                    ? darkMode
                      ? 'bg-gradient-to-r from-black to-black'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500'
                    : darkMode
                      ? 'bg-slate-800'
                      : 'bg-gray-200'
                    }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Form Card */}
        <Card className={`transition-all duration-500 overflow-hidden rounded-[2.5rem] ${darkMode
          ? 'bg-gradient-to-br from-black/80 to-black/80 backdrop-blur-xl border-2 border-slate-700/50 shadow-2xl shadow-black/50'
          : 'bg-white/80 backdrop-blur-3xl border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)]'
          }`}>
          <CardContent className="p-6 sm:p-10 lg:p-12">

            {/* Step 1: Personal Info */}
            {currentStep === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center gap-4 pb-6 border-b-2 border-dashed" style={{
                  borderColor: darkMode ? 'rgb(51 65 85 / 0.5)' : 'rgb(229 231 235)'
                }}>
                  <div className={`p-4 rounded-2xl ${darkMode
                    ? 'bg-gradient-to-br from-black to-black shadow-xl shadow-blue-900/50'
                    : 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg'
                    }`}>
                    <User className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-slate-900'} tracking-tight`}>Tell us about yourself</h2>
                    <p className={`text-base mt-1 font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Let's start with your basic details
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <Label className={`text-lg font-bold mb-3 block ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                      Full Name <span className="text-pink-500">*</span>
                    </Label>
                    <Input
                      value={formData.studentName}
                      onChange={(e) => handleChange("studentName", e.target.value)}
                      className={`h-14 text-lg font-black rounded-2xl transition-all ${darkMode
                        ? 'bg-slate-800/50 border-2 border-slate-700 text-white placeholder:text-slate-500 focus:border-black focus:ring-4 focus:ring-black/20'
                        : 'bg-slate-50 border-2 border-slate-100 text-slate-900 focus:border-black focus:ring-4 focus:ring-black/20 shadow-sm'
                        }`}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <Label className={`text-lg font-bold mb-3 block ${darkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                      Student ID <span className="text-pink-500">*</span>
                    </Label>
                    <Input
                      value={formData.studentId}
                      onChange={(e) => handleChange("studentId", e.target.value)}
                      className={`h-14 text-lg font-semibold rounded-xl transition-all ${darkMode
                        ? 'bg-slate-800/50 border-2 border-slate-700 text-white placeholder:text-slate-500 focus:border-black focus:ring-4 focus:ring-black/20'
                        : 'bg-white border-2 border-gray-300 text-gray-900 focus:border-black focus:ring-4 focus:ring-black/20'
                        }`}
                      placeholder="e.g., CSE-2021-001"
                    />
                  </div>

                  <div>
                    <Label className={`text-lg font-bold mb-3 block ${darkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                      Email Address <span className="text-pink-500">*</span>
                    </Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className={`h-14 text-lg font-semibold rounded-xl transition-all ${darkMode
                        ? 'bg-slate-800/50 border-2 border-slate-700 text-white placeholder:text-slate-500 focus:border-black focus:ring-4 focus:ring-black/20'
                        : 'bg-white border-2 border-gray-300 text-gray-900 focus:border-black focus:ring-4 focus:ring-black/20'
                        }`}
                      placeholder="your.email@college.edu"
                    />
                  </div>

                  <div>
                    <Label className={`text-lg font-bold mb-3 block ${darkMode ? 'text-slate-200' : 'text-gray-800'}`}>Phone Number</Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className={`h-14 text-lg font-semibold rounded-xl transition-all ${darkMode
                        ? 'bg-slate-800/50 border-2 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20'
                        : 'bg-white border-2 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20'
                        }`}
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>

                  <div>
                    <Label className={`text-lg font-bold mb-3 block ${darkMode ? 'text-slate-200' : 'text-gray-800'}`}>Branch</Label>
                    <Select value={formData.branch} onValueChange={(v) => handleChange("branch", v)}>
                      <SelectTrigger className={`h-14 text-lg font-semibold rounded-xl ${darkMode ? 'bg-slate-800/50 border-2 border-slate-700 text-white' : 'bg-white border-2 border-gray-300 text-gray-900'
                        }`}>
                        <SelectValue placeholder="Select your branch" />
                      </SelectTrigger>
                      <SelectContent className={darkMode ? 'bg-slate-800 border-black ' : 'bg-white border-gray-200'}>
                        {["Computer Science", "Electronics", "Mechanical", "Electrical", "IT", "Civil"].map(b => (
                          <SelectItem key={b} value={b} className={`text-lg font-semibold ${darkMode ? 'text-white hover:bg-slate-700 focus:bg-slate-700' : 'text-gray-900'}`}>{b}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className={`text-lg font-bold mb-3 block ${darkMode ? 'text-slate-200' : 'text-gray-800'}`}>CGPA</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.cgpa}
                      onChange={(e) => handleChange("cgpa", e.target.value)}
                      className={`h-14 text-lg font-semibold rounded-xl transition-all ${darkMode
                        ? 'bg-slate-800/50 border-2 border-black text-white placeholder:text-slate-500 focus:border-black focus:ring-4 focus:ring-black/20'
                        : 'bg-white border-2 border-gray-300 text-gray-900 focus:border-black focus:ring-4 focus:ring-black/20'
                        }`}
                      placeholder="e.g., 8.5"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Placement Details */}
            {currentStep === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center gap-4 pb-6 border-b-2 border-dashed" style={{
                  borderColor: darkMode ? 'rgb(51 65 85 / 0.5)' : 'rgb(229 231 235)'
                }}>
                  <div className={`p-4 rounded-2xl ${darkMode
                    ? 'bg-gradient-to-br from-emerald-600 to-green-700 shadow-xl shadow-emerald-900/50'
                    : 'bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg'
                    }`}>
                    <Briefcase className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>Your Placement Success</h2>
                    <p className={`text-base mt-1 font-medium ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                      Share your achievement details
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <Label className={`text-lg font-bold mb-3 block ${darkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                      Company Name <span className="text-pink-500">*</span>
                    </Label>
                    <Input
                      value={formData.companyName}
                      onChange={(e) => handleChange("companyName", e.target.value)}
                      className={`h-14 text-lg font-semibold rounded-xl transition-all ${darkMode
                        ? 'bg-slate-800/50 border-2 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20'
                        : 'bg-white border-2 border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20'
                        }`}
                      placeholder="e.g., Google, Microsoft, Amazon"
                    />
                  </div>

                  <div>
                    <Label className={`text-lg font-bold mb-3 block ${darkMode ? 'text-slate-200' : 'text-gray-800'}`}>Job Role</Label>
                    <Input
                      value={formData.jobRole}
                      onChange={(e) => handleChange("jobRole", e.target.value)}
                      className={`h-14 text-lg font-semibold rounded-xl transition-all ${darkMode
                        ? 'bg-slate-800/50 border-2 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20'
                        : 'bg-white border-2 border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20'
                        }`}
                      placeholder="e.g., Software Developer"
                    />
                  </div>

                  <div>
                    <Label className={`text-lg font-bold mb-3 block ${darkMode ? 'text-slate-200' : 'text-gray-800'}`}>Package (LPA)</Label>
                    <Input
                      type="number"
                      value={formData.packageLPA}
                      onChange={(e) => handleChange("packageLPA", e.target.value)}
                      className={`h-14 text-lg font-semibold rounded-xl transition-all ${darkMode
                        ? 'bg-slate-800/50 border-2 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20'
                        : 'bg-white border-2 border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20'
                        }`}
                      placeholder="e.g., 12.5"
                    />
                  </div>

                  <div>
                    <Label className={`text-lg font-bold mb-3 block ${darkMode ? 'text-slate-200' : 'text-gray-800'}`}>Location</Label>
                    <Input
                      value={formData.location}
                      onChange={(e) => handleChange("location", e.target.value)}
                      className={`h-14 text-lg font-semibold rounded-xl transition-all ${darkMode
                        ? 'bg-slate-800/50 border-2 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20'
                        : 'bg-white border-2 border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20'
                        }`}
                      placeholder="e.g., Bangalore, Mumbai"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <Label className={`text-lg font-bold mb-3 block ${darkMode ? 'text-slate-200' : 'text-gray-800'}`}>Offer Type</Label>
                    <Select value={formData.offerType} onValueChange={(v) => handleChange("offerType", v)}>
                      <SelectTrigger className={`h-14 text-lg font-semibold rounded-xl ${darkMode ? 'bg-slate-800/50 border-2 border-slate-700 text-white' : 'bg-white border-2 border-gray-300 text-gray-900'
                        }`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className={darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}>
                        <SelectItem value="Full-time" className={`text-lg font-semibold ${darkMode ? 'text-white hover:bg-slate-700 focus:bg-slate-700' : 'text-gray-900'}`}>Full-time Position</SelectItem>
                        <SelectItem value="Internship" className={`text-lg font-semibold ${darkMode ? 'text-white hover:bg-slate-700 focus:bg-slate-700' : 'text-gray-900'}`}>Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="sm:col-span-2">
                    <Label className={`text-lg font-bold mb-3 block ${darkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                      Number of Interview Rounds
                    </Label>
                    <Input
                      type="number"
                      value={formData.interviewRounds}
                      onChange={(e) => handleChange("interviewRounds", e.target.value)}
                      className={`h-14 text-lg font-semibold rounded-xl transition-all ${darkMode
                        ? 'bg-slate-800/50 border-2 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20'
                        : 'bg-white border-2 border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20'
                        }`}
                      placeholder="e.g., 3"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Experience */}
            {currentStep === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center gap-4 pb-6 border-b-2 border-dashed" style={{
                  borderColor: darkMode ? 'rgb(51 65 85 / 0.5)' : 'rgb(229 231 235)'
                }}>
                  <div className={`p-4 rounded-2xl ${darkMode
                    ? 'bg-gradient-to-br from-purple-600 to-violet-700 shadow-xl shadow-purple-900/50'
                    : 'bg-gradient-to-br from-purple-500 to-violet-600 shadow-lg'
                    }`}>
                    <Award className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>Share Your Experience</h2>
                    <p className={`text-base mt-1 font-medium ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                      Help your juniors with valuable insights
                    </p>
                  </div>
                </div>

                {/* Rating Cards */}
                <div className="grid sm:grid-cols-2 gap-6 mb-8">
                  {([
                    { field: "difficultyRating" as const, label: "Interview Difficulty", icon: Target, color: darkMode ? 'from-orange-600 to-red-700' : 'from-orange-500 to-red-600' },
                    { field: "interviewRating" as const, label: "Overall Experience", icon: Trophy, color: darkMode ? 'from-blue-600 to-purple-700' : 'from-blue-500 to-purple-600' }
                  ] as const).map((rating) => {
                    const ratingValue = formData[rating.field];
                    const IconComponent = rating.icon;
                    return (
                      <div key={rating.field} className={`p-8 rounded-2xl border-2 transition-all ${darkMode ? 'bg-slate-800/30 border-slate-700 hover:border-slate-600' : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}>
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${rating.color} flex items-center justify-center mx-auto mb-5 shadow-lg`}>
                          <IconComponent className="w-7 h-7 text-white" />
                        </div>
                        <Label className={`text-lg font-bold block text-center mb-5 ${darkMode ? 'text-slate-200' : 'text-gray-800'}`}>{rating.label}</Label>
                        <div className="flex justify-center gap-2 mb-4">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => handleChange(rating.field, s)}
                              className="transition-transform hover:scale-125 active:scale-110"
                            >
                              <Star
                                className={`w-9 h-9 transition-all ${ratingValue >= s
                                  ? 'fill-yellow-400 text-yellow-400 drop-shadow-lg'
                                  : darkMode ? 'text-slate-700 hover:text-slate-600' : 'text-gray-300 hover:text-gray-400'
                                  }`}
                              />
                            </button>
                          ))}
                        </div>
                        <p className={`text-2xl font-bold text-center mt-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{ratingValue}.0 / 5.0</p>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-6">
                  <div>
                    <Label className={`text-lg font-bold mb-3 block ${darkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                      <Zap className="w-5 h-5 inline mr-2 text-yellow-400" />
                      Interview Experience
                    </Label>
                    <Textarea
                      value={formData.interviewExperience}
                      onChange={(e) => handleChange("interviewExperience", e.target.value)}
                      className={`min-h-[140px] text-lg font-medium rounded-xl resize-none transition-all ${darkMode
                        ? 'bg-slate-800/50 border-2 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20'
                        : 'bg-white border-2 border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20'
                        }`}
                      placeholder="Describe your overall interview experience, the environment, and how you felt..."
                    />
                  </div>

                  <div>
                    <Label className={`text-lg font-bold mb-3 block ${darkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                      <TrendingUp className="w-5 h-5 inline mr-2 text-blue-400" />
                      Technical Questions Asked
                    </Label>
                    <Textarea
                      value={formData.technicalQuestions}
                      onChange={(e) => handleChange("technicalQuestions", e.target.value)}
                      className={`min-h-[140px] text-lg font-medium rounded-xl resize-none transition-all ${darkMode
                        ? 'bg-slate-800/50 border-2 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20'
                        : 'bg-white border-2 border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20'
                        }`}
                      placeholder="List the technical questions, coding problems, or technical concepts discussed..."
                    />
                  </div>

                  <div>
                    <Label className={`text-lg font-bold mb-3 block ${darkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                      <Target className="w-5 h-5 inline mr-2 text-green-400" />
                      HR Questions & Behavioral Round
                    </Label>
                    <Textarea
                      value={formData.hrQuestions}
                      onChange={(e) => handleChange("hrQuestions", e.target.value)}
                      className={`min-h-[140px] text-lg font-medium rounded-xl resize-none transition-all ${darkMode
                        ? 'bg-slate-800/50 border-2 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20'
                        : 'bg-white border-2 border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20'
                        }`}
                      placeholder="Share HR questions, behavioral questions, or situational questions asked..."
                    />
                  </div>

                  <div>
                    <Label className={`text-lg font-bold mb-3 block ${darkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                      <Trophy className="w-5 h-5 inline mr-2 text-purple-400" />
                      Preparation Tips & Resources
                    </Label>
                    <Textarea
                      value={formData.preparationTips}
                      onChange={(e) => handleChange("preparationTips", e.target.value)}
                      className={`min-h-[140px] text-lg font-medium rounded-xl resize-none transition-all ${darkMode
                        ? 'bg-slate-800/50 border-2 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20'
                        : 'bg-white border-2 border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20'
                        }`}
                      placeholder="Share how you prepared, which resources helped, and any tips for success..."
                    />
                  </div>

                  <div>
                    <Label className={`text-lg font-bold mb-3 block ${darkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                      <Sparkles className="w-5 h-5 inline mr-2 text-pink-400" />
                      Advice for Juniors
                    </Label>
                    <Textarea
                      value={formData.adviceForJuniors}
                      onChange={(e) => handleChange("adviceForJuniors", e.target.value)}
                      className={`min-h-[140px] text-lg font-medium rounded-xl resize-none transition-all ${darkMode
                        ? 'bg-slate-800/50 border-2 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20'
                        : 'bg-white border-2 border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20'
                        }`}
                      placeholder="What advice would you give to your juniors preparing for placements?..."
                    />
                  </div>
                </div>
              </div>
            )}

          </CardContent>

          {/* Navigation Buttons */}
          <div className={`p-6 sm:p-8 border-t-2 flex justify-between items-center ${darkMode ? 'border-black bg-black/50' : 'border-gray-200 bg-gray-50'
            }`}>
            <Button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`h-14 px-8 text-lg font-bold rounded-xl transition-all ${currentStep === 1
                ? 'opacity-50 cursor-not-allowed'
                : darkMode
                  ? 'bg-slate-800 hover:bg-slate-700 text-white border-2 border-slate-700 hover:bg-white hover:text-black'
                  : 'bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300 hover:bg-pink-500 hover:text-white'
                }`}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Previous
            </Button>

            {currentStep < 3 ? (
              <Button
                type="button"
                onClick={nextStep}
                className={`h-14 px-8 text-lg font-bold rounded-xl transition-all shadow-xl ${darkMode
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-blue-900/50'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-blue-500/30'
                  }`}
              >
                Next Step
                <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                className={`h-14 px-10 text-lg font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl ${darkMode
                  ? 'bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white shadow-green-900/50'
                  : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-green-500/30'
                  }`}
              >
                <Send className="w-5 h-5 mr-3" />
                Submit Feedback
                <Sparkles className="w-5 h-5 ml-2" />
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}