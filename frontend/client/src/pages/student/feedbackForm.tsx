import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Send, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { studentApi } from "@/services/studentApi";

export default function StudentFeedbackForm(props: any) {
  const isDashboard = props?.isDashboard || false;
  const { theme } = useTheme();
  const darkMode = theme === "dark";
  
  const [formData, setFormData] = useState({
    type: "",
    subject: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    setError(null);
    if (!formData.type || !formData.subject || !formData.description) {
      setError("Please fill all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      await studentApi.submitPlatformFeedback(formData);
      setSuccess(true);
      setFormData({ type: "", subject: "", description: "" });
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`${!isDashboard ? "min-h-dvh overflow-x-hidden" : "bg-transparent"} transition-all duration-500 ${!isDashboard ? (darkMode
      ? 'bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 shadow-inner'
      : 'bg-background'
    ) : "bg-transparent"}`}>
      {darkMode && !isDashboard && (
        <>
          <div className="fixed top-0 right-1/3 w-[320px] h-[320px] sm:w-[600px] sm:h-[600px] bg-blue-600/10 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
          <div className="fixed bottom-0 left-1/3 w-[320px] h-[320px] sm:w-[600px] sm:h-[600px] bg-purple-600/10 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '1s' }}></div>
          <div className="fixed top-1/2 left-1/2 w-[220px] h-[220px] sm:w-[400px] sm:h-[400px] bg-pink-600/5 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>
        </>
      )}

      <div className={`${!isDashboard ? "max-w-3xl mx-auto p-4 sm:p-6 lg:p-8" : "p-0"} relative`}>
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
                    Platform Feedback
                  </h1>
                  <Sparkles className={`w-6 h-6 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'} animate-pulse`} />
                </div>
                <p className={`text-sm sm:text-base mt-1 font-semibold ${darkMode ? 'text-slate-400' : 'text-gray-600'
                  }`}>
                  Help us improve CampusCareer for everyone!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Form Card */}
        <Card className={`transition-all duration-500 overflow-hidden rounded-3xl ${darkMode
          ? 'bg-gradient-to-br bg-[#0c0c14]/60 backdrop-blur-xl border border-slate-700/50 shadow-xl shadow-black/50'
          : 'bg-white/80 backdrop-blur-3xl border-slate-100 shadow-sm'
          }`}>
          <CardContent className="p-5 sm:p-8">
            {success ? (
              <div className="text-center py-12">
                <CheckCircle2 className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-green-400' : 'text-green-500'}`} />
                <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Feedback Submitted!</h2>
                <p className={`${darkMode ? 'text-slate-400' : 'text-gray-600'} mb-6`}>Thank you for helping us improve the platform.</p>
                <Button 
                  onClick={() => setSuccess(false)}
                  className={`h-11 px-8 rounded-xl font-bold ${darkMode ? 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-700' : 'bg-white border-2 border-gray-200 text-gray-900 hover:bg-gray-50'}`}
                >
                  Submit Another
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {error && (
                  <div className={`p-4 rounded-xl flex items-start gap-3 ${darkMode ? 'bg-red-950/50 border border-red-900/50' : 'bg-red-50 border border-red-100'}`}>
                    <AlertCircle className={`w-5 h-5 mt-0.5 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
                    <p className={`text-sm font-medium ${darkMode ? 'text-red-200' : 'text-red-800'}`}>{error}</p>
                  </div>
                )}

                <div>
                  <Label className={`text-sm font-semibold mb-2 block ${darkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                    Feedback Type <span className="text-pink-500">*</span>
                  </Label>
                  <Select value={formData.type} onValueChange={(v) => handleChange("type", v)}>
                    <SelectTrigger className={`h-11 text-base font-medium rounded-xl ${darkMode ? 'bg-[#0c0c14]/50 border-2 border-slate-700 text-white' : 'bg-white border-2 border-gray-300 text-gray-900'}`}>
                      <SelectValue placeholder="Select type..." />
                    </SelectTrigger>
                    <SelectContent className={darkMode ? 'bg-slate-800 border-black ' : 'bg-white border-gray-200'}>
                      {["Bug Report", "Feature Request", "General Feedback", "Placement Experience"].map(type => (
                        <SelectItem key={type} value={type} className={`text-base font-medium ${darkMode ? 'text-white hover:bg-slate-700 focus:bg-slate-700' : 'text-gray-900'}`}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className={`text-sm font-semibold mb-2 block ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                    Subject <span className="text-pink-500">*</span>
                  </Label>
                  <Input
                    value={formData.subject}
                    onChange={(e) => handleChange("subject", e.target.value)}
                    maxLength={150}
                    className={`h-11 text-base font-medium rounded-xl transition-all ${darkMode
                      ? 'bg-[#0c0c14]/50 border-2 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 focus:ring-4 focus:ring-black/20'
                      : 'bg-slate-50 border-2 border-slate-100 text-slate-900 focus:border-blue-500 focus:ring-blue-500/20 focus:ring-4 focus:ring-black/20 shadow-sm'
                      }`}
                    placeholder="Briefly summarize your feedback"
                  />
                </div>

                <div>
                  <Label className={`text-sm font-semibold mb-2 block ${darkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                    Description <span className="text-pink-500">*</span>
                  </Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    maxLength={5000}
                    className={`min-h-[150px] text-base font-medium rounded-xl resize-none transition-all ${darkMode
                      ? 'bg-[#0c0c14]/50 border-2 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20'
                      : 'bg-white border-2 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20'
                      }`}
                    placeholder="Provide details about the bug, feature idea, or your general feedback..."
                  />
                  <div className={`text-right mt-1 text-xs ${darkMode ? 'text-slate-500' : 'text-gray-400'}`}>
                    {formData.description.length}/5000
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700/30 flex justify-end">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className={`h-11 px-8 text-base font-semibold rounded-xl transition-all shadow-lg w-full sm:w-auto ${darkMode
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-blue-900/50'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-blue-500/30'
                      } ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
                  >
                    {isSubmitting ? "Submitting..." : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Feedback
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}