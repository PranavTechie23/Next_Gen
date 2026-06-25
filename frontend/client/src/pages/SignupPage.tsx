import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, Building2, Phone, CheckCircle, Shield, Key, MapPin, Hash, Briefcase, ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";
import { buildApiUrl } from "@/lib/api";
import axios from "axios";
import { toast } from "sonner";

export default function SignupPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    employeeCode: "",
    institutionName: "",
    institutionCode: "",
    institutionAddress: "",
    adminKey: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false
  });

  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });

    if (field === "password") {
      calculatePasswordStrength(value as string);
    }
  };

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    setPasswordStrength(strength);
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (formData.fullName && formData.email && formData.phone) {
        setStep(2);
      }
    }
  };

  const handlePrevStep = () => {
    if (step === 2) setStep(1);
  };

  const handleSignup = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(buildApiUrl("/auth/register-admin"), {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        employee_code: formData.employeeCode,
        institution_name: formData.institutionName,
        institution_code: formData.institutionCode,
        institution_address: formData.institutionAddress,
        adminKey: formData.adminKey,
      });

      toast.success(response.data.message || "Admin registered successfully!");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (error: any) {
      console.error("Signup Error:", error);
      toast.error(error.response?.data?.message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return "bg-muted";
    if (passwordStrength === 1) return "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]";
    if (passwordStrength === 2) return "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]";
    if (passwordStrength === 3) return "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]";
    return "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return "";
    if (passwordStrength === 1) return "Weak";
    if (passwordStrength === 2) return "Fair";
    if (passwordStrength === 3) return "Good";
    return "Strong";
  };

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-x-hidden bg-background px-4 py-16 transition-colors duration-300 md:py-6">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10 dark:from-primary/10 dark:via-background dark:to-accent/10" />
      {/* Theme Toggle */}
      <div className="absolute right-3 top-3 z-20 sm:right-4 sm:top-4">
        <ThemeToggle />
      </div>

      {/* Back Button */}
      <div className="absolute left-3 top-3 z-20 sm:left-4 sm:top-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => window.location.href = "/"}
          className="rounded-full bg-background/50 backdrop-blur-sm border shadow-sm hover:bg-muted transition-all"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-violet-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .slide-in {
          animation: slideIn 0.6s ease-out;
        }
        @keyframes progress {
          from { width: 0%; }
        }
        .progress-animate {
          animation: progress 0.5s ease-out;
        }
      `}</style>

      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-6 items-center relative z-10 my-auto">
        {/* Left side - Branding */}
        <div className="hidden md:block space-y-8 slide-in">
            <div className="flex items-center gap-0 mb-4 group cursor-pointer transition-all duration-300" onClick={() => window.location.href = "/"}>
              <img src="/NG/NextGen_light.png" alt="NextGen Logo" className="h-16 w-16 object-contain flex-shrink-0 transition-transform duration-500 group-hover:scale-110" />
              <div className="flex flex-col justify-center leading-tight">
                <h1 className="text-3xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-none">
                  NextGen
                </h1>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-0.5 opacity-80">
                  Data-Driven
                </p>
              </div>
            </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground leading-tight">
              TPO Admin Portal 🚀
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Register your institution and gain access to powerful placement management tools.
            </p>

            <div className="space-y-4 pt-4">
              {[
                { icon: Building2, text: "Manage Departments & Students", color: "from-violet-500 to-purple-500", bg: "bg-violet-100", textColor: "text-violet-600" },
                { icon: Shield, text: "Secure Institutional Data", color: "from-pink-500 to-rose-500", bg: "bg-pink-100", textColor: "text-pink-600" },
                { icon: CheckCircle, text: "Track Placement Drives", color: "from-purple-500 to-indigo-500", bg: "bg-purple-100", textColor: "text-purple-600" }
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 bg-card/60 backdrop-blur-md rounded-xl border border-border shadow-sm hover:shadow-md transition-all group">
                  <div className={`w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`w-6 h-6 text-primary`} />
                  </div>
                  <span className="font-semibold text-foreground">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right side - Signup Form */}
        <Card className="shadow-xl border border-border bg-white dark:bg-slate-900 rounded-2xl slide-in overflow-hidden w-full max-w-md mx-auto md:max-w-none" style={{ animationDelay: '0.2s' }}>
          <CardContent className="p-5 sm:p-6">
            {/* Mobile Logo */}
            <div className="md:hidden text-center mb-8 flex flex-col items-center">
              <div className="flex items-center gap-0 justify-center mb-4 transition-transform hover:scale-105 cursor-pointer" onClick={() => window.location.href = "/"}>
                <img src="/NG/NextGen_light.png" alt="NextGen Logo" className="h-16 w-16 object-contain flex-shrink-0" />
                <div className="flex flex-col items-start">
                  <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-none">
                    NextGen
                  </h1>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">Data-Driven</p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-foreground/80">Step {step} of 2</span>
                <span className="text-xs text-muted-foreground">{step === 1 ? "Personal Info" : "Institution Info"}</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-600 to-purple-600 progress-animate"
                  style={{ width: `${(step / 2) * 100}%` }}
                />
              </div>
            </div>

            <div className="mb-4">
              <h2 className="text-lg font-bold text-foreground mb-0.5">Admin Account</h2>
              <p className="text-xs text-muted-foreground">Register your institution details</p>
            </div>

            {step === 1 ? (
              <div className="space-y-3">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground/80">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                      type="text"
                      placeholder="Admin Name"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground/80">Email Address (Official)</label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                      type="email"
                      placeholder="admin@college.edu"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground/80">Phone Number</label>
                  <div className="relative group">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                      type="tel"
                      placeholder="+91-9876543210"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Continue Button */}
                <Button
                  onClick={handleNextStep}
                  disabled={!formData.fullName || !formData.email || !formData.phone}
                  className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 text-white py-2.5 rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <span className="flex items-center justify-center gap-2">
                    Continue to Institution Details
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </div>
            ) : (
              <div className="space-y-3 max-h-[55vh] overflow-y-auto px-1 -mx-1 pb-2">
                 {/* Institution Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground/80">Institution Name</label>
                  <div className="relative group">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input type="text" placeholder="e.g. Stanford University" value={formData.institutionName} onChange={(e) => handleInputChange("institutionName", e.target.value)} className="w-full pl-9 pr-3 py-2.5 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground/80">Institution Code</label>
                  <div className="relative group">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input type="text" placeholder="e.g. SU001" value={formData.institutionCode} onChange={(e) => handleInputChange("institutionCode", e.target.value)} className="w-full pl-9 pr-3 py-2.5 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground/80">Institution Address</label>
                  <div className="relative group">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input type="text" placeholder="City, State, Country" value={formData.institutionAddress} onChange={(e) => handleInputChange("institutionAddress", e.target.value)} className="w-full pl-9 pr-3 py-2.5 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground/80">Your Employee Code</label>
                  <div className="relative group">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input type="text" placeholder="e.g. EMP1234" value={formData.employeeCode} onChange={(e) => handleInputChange("employeeCode", e.target.value)} className="w-full pl-9 pr-3 py-2.5 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground/80">Admin Registration Key</label>
                  <div className="relative group">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input type="text" placeholder="Provided by platform" value={formData.adminKey} onChange={(e) => handleInputChange("adminKey", e.target.value)} className="w-full pl-9 pr-3 py-2.5 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground/80">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={formData.password} onChange={(e) => handleInputChange("password", e.target.value)} className="w-full pl-9 pr-10 py-2.5 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {formData.password && (
                    <div className="space-y-1">
                      <div className="flex gap-1">{[...Array(4)].map((_, i) => (<div key={i} className={`h-1 flex-1 rounded-full transition-all ${i < passwordStrength ? getPasswordStrengthColor() : "bg-gray-200"}`} />))}</div>
                      {passwordStrength > 0 && <p className="text-[10px] text-muted-foreground">Strength: <span className="font-semibold text-foreground">{getPasswordStrengthText()}</span></p>}
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground/80">Confirm Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" value={formData.confirmPassword} onChange={(e) => handleInputChange("confirmPassword", e.target.value)} className="w-full pl-9 pr-10 py-2.5 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm" />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-[10px] text-red-600">Passwords do not match</p>
                  )}
                </div>
                <label className="flex items-start gap-2 cursor-pointer group mt-1">
                  <input type="checkbox" checked={formData.agreeToTerms} onChange={(e) => handleInputChange("agreeToTerms", e.target.checked)} className="mt-0.5 w-4 h-4 text-primary border-border bg-background rounded focus:ring-primary cursor-pointer" />
                  <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors leading-tight">
                    I agree to the <a href="/terms_and_condition" className="text-primary font-bold hover:underline">Terms &amp; Conditions</a> and <a href="/PrivacyPage" className="text-primary font-bold hover:underline">Privacy Policy</a>
                  </span>
                </label>
                <div className="flex gap-2 pt-1">
                  <Button onClick={handlePrevStep} variant="outline" className="flex-1 border border-gray-300 hover:border-gray-400 py-2.5 rounded-lg font-semibold transition-all text-sm">Back</Button>
                  <Button onClick={handleSignup} disabled={isLoading || !formData.institutionName || !formData.institutionCode || !formData.adminKey || !formData.password || formData.password !== formData.confirmPassword || !formData.agreeToTerms} className="flex-[2] bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 text-white py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                    {isLoading ? <span className="flex items-center justify-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Registering...</span> : "Register Admin"}
                  </Button>
                </div>
              </div>
            )}

            <p className="text-center text-xs text-muted-foreground mt-4 font-medium">
              Already have an admin account?{" "}
              <a href="/login" className="font-bold text-primary hover:text-primary/80 transition-colors">
                Sign In
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}