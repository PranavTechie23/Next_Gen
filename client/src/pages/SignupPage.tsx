import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, Building2, GraduationCap, Phone, CheckCircle, Github, Chrome, Sparkles, Shield, Zap } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";

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
    password: "",
    confirmPassword: "",
    college: "",
    branch: "",
    year: "",
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
    await new Promise(resolve => setTimeout(resolve, 2000));
    window.location.href = "/student/dashboard";
  };

  const handleSocialSignup = (provider: string) => {
    setIsLoading(true);
    setTimeout(() => {
      window.location.href = "/student/dashboard";
    }, 1000);
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10 dark:from-primary/10 dark:via-background dark:to-accent/10" />
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
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

      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left side - Branding */}
        <div className="hidden md:block space-y-8 slide-in">
          <div className="float">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-24 h-24 flex items-center justify-center">
                <img src={isDark ? "/NG/NextGen_dark.png" : "/NG/NextGen_light.png"} alt="NextGen Logo" className="w-full h-full object-contain scale-125" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  NextGen
                </h1>
                <p className="text-muted-foreground text-sm font-medium">Start Your Journey Today</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground leading-tight">
              Join Thousands of Students! 🚀
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Create your account and unlock AI-powered career guidance tailored just for you.
            </p>

            <div className="space-y-4 pt-4">
              {[
                { icon: Sparkles, text: "AI-Powered Skill Assessment", color: "from-violet-500 to-purple-500", bg: "bg-violet-100", textColor: "text-violet-600" },
                { icon: Shield, text: "Personalized Career Roadmap", color: "from-pink-500 to-rose-500", bg: "bg-pink-100", textColor: "text-pink-600" },
                { icon: Zap, text: "Placement Probability Insights", color: "from-purple-500 to-indigo-500", bg: "bg-purple-100", textColor: "text-purple-600" }
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 bg-card/60 backdrop-blur-md rounded-xl border border-border shadow-sm hover:shadow-md transition-all group">
                  <div className={`w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`w-6 h-6 text-primary`} />
                  </div>
                  <span className="font-semibold text-foreground">{feature.text}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-primary to-blue-600 rounded-2xl shadow-xl">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="w-6 h-6 text-white" />
                <p className="text-white font-bold text-lg">Free Forever</p>
              </div>
              <p className="text-white/80 text-sm">
                No credit card required. Start tracking your career progress today!
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Signup Form */}
        <Card className="shadow-2xl border border-border bg-card/80 backdrop-blur-xl slide-in overflow-hidden" style={{ animationDelay: '0.2s' }}>
          <CardContent className="p-8 md:p-10">
            {/* Mobile Logo */}
            <div className="md:hidden text-center mb-8">
              <div className="w-24 h-24 flex items-center justify-center mx-auto mb-4">
                <img src={isDark ? "/NG/NextGen_dark.png" : "/NG/NextGen_light.png"} alt="NextGen Logo" className="w-full h-full object-contain scale-125" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                NextGen
              </h1>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-foreground/80">Step {step} of 2</span>
                <span className="text-sm text-muted-foreground">{step === 1 ? "Personal Info" : "Academic Info"}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r from-violet-600 to-purple-600 progress-animate`}
                  style={{ width: `${(step / 2) * 100}%` }}
                />
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-3xl font-bold text-foreground mb-2">Create Account</h2>
              <p className="text-muted-foreground">Fill in your details to get started</p>
            </div>

            {step === 1 ? (
              <div className="space-y-5">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground/80">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground/80">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground/80">Phone Number</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                      type="tel"
                      placeholder="+91-9876543210"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                    />
                  </div>
                </div>

                {/* Continue Button */}
                <Button
                  onClick={handleNextStep}
                  disabled={!formData.fullName || !formData.email || !formData.phone}
                  className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <span className="flex items-center justify-center gap-2">
                    Continue
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </div>
            ) : (
              <div className="space-y-5">
                {/* College */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground/80">College/University</label>
                  <div className="relative group">
                    <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                      type="text"
                      placeholder="IIT Delhi"
                      value={formData.college}
                      onChange={(e) => handleInputChange("college", e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                    />
                  </div>
                </div>

                {/* Branch */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground/80">Branch/Stream</label>
                  <div className="relative group">
                    <GraduationCap className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <select
                      value={formData.branch}
                      onChange={(e) => handleInputChange("branch", e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all cursor-pointer"
                    >
                      <option value="" className="bg-card">Select your branch</option>
                      <option className="bg-card">Computer Science</option>
                      <option className="bg-card">Information Technology</option>
                      <option className="bg-card">Electronics</option>
                      <option className="bg-card">Mechanical</option>
                      <option className="bg-card">Civil</option>
                      <option className="bg-card">Electrical</option>
                    </select>
                  </div>
                </div>

                {/* Year */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground/80">Current Year</label>
                  <select
                    value={formData.year}
                    onChange={(e) => handleInputChange("year", e.target.value)}
                    className="w-full px-4 py-3.5 border-2 border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all cursor-pointer"
                  >
                    <option value="" className="bg-card">Select your year</option>
                    <option className="bg-card">First Year</option>
                    <option className="bg-card">Second Year</option>
                    <option className="bg-card">Third Year</option>
                    <option className="bg-card">Final Year</option>
                  </select>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground/80">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="w-full pl-12 pr-12 py-3.5 border-2 border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {formData.password && (
                    <div className="space-y-1">
                      <div className="flex gap-1">
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all ${i < passwordStrength ? getPasswordStrengthColor() : "bg-gray-200"
                              }`}
                          />
                        ))}
                      </div>
                      {passwordStrength > 0 && (
                        <p className="text-xs text-muted-foreground">
                          Password strength: <span className="font-semibold text-foreground">{getPasswordStrengthText()}</span>
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground/80">Confirm Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className="w-full pl-12 pr-12 py-3.5 border-2 border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-xs text-red-600">Passwords do not match</p>
                  )}
                </div>

                {/* Terms & Conditions */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={(e) => handleInputChange("agreeToTerms", e.target.checked)}
                    className="mt-1 w-5 h-5 text-primary border-border bg-background rounded focus:ring-primary cursor-pointer"
                  />
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    I agree to the{" "}
                    <a href="/terms_and_condition" className="text-primary font-bold hover:underline">
                      Terms & Conditions
                    </a>{" "}
                    and{" "}
                    <a href="/PrivacyPage" className="text-primary font-bold hover:underline">
                      Privacy Policy
                    </a>
                  </span>
                </label>

                {/* Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={handlePrevStep}
                    variant="outline"
                    className="flex-1 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 py-3 rounded-xl font-semibold transition-all"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleSignup}
                    disabled={
                      isLoading ||
                      !formData.college ||
                      !formData.branch ||
                      !formData.year ||
                      !formData.password ||
                      formData.password !== formData.confirmPassword ||
                      !formData.agreeToTerms
                    }
                    className="flex-[2] bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 text-white py-3 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Creating...
                      </span>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Divider - Only on step 1 */}
            {step === 1 && (
              <>
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-card text-muted-foreground font-medium">Or sign up with</span>
                  </div>
                </div>

                {/* Social Signup */}
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => handleSocialSignup('google')}
                    variant="outline"
                    className="border-2 border-border hover:border-muted hover:bg-muted py-3 rounded-xl font-semibold transition-all"
                  >
                    <Chrome className="w-5 h-5 mr-2 text-red-500" />
                    Google
                  </Button>
                  <Button
                    onClick={() => handleSocialSignup('github')}
                    variant="outline"
                    className="border-2 border-border hover:border-muted hover:bg-muted py-3 rounded-xl font-semibold transition-all"
                  >
                    <Github className="w-5 h-5 mr-2" />
                    GitHub
                  </Button>
                </div>
              </>
            )}

            {/* Sign In Link */}
            <p className="text-center text-sm text-muted-foreground mt-8 font-medium">
              Already have an account?{" "}
              <a href="/login" className="font-bold text-primary hover:text-primary/80 transition-colors">
                Sign In
              </a>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-sm text-muted-foreground font-medium">
        <p>© 2026 NextGen Platform. All rights reserved.</p>
      </div>
    </div>
  );
}
