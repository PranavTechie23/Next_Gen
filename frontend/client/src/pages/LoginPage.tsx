import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Sparkles, Shield, CheckCircle, Github, Chrome, GithubIcon, TwitterIcon, InstagramIcon } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";
import { buildApiUrl } from "@/lib/api";
import axios from "axios";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { useUser } from "@/contexts/UserContext";

const REMEMBERED_EMAIL_KEY = "rememberedEmail";

export default function LoginPage() {
  const [, navigate] = useLocation();
  const { refreshUser } = useUser();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const rememberedEmail = localStorage.getItem(REMEMBERED_EMAIL_KEY);
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);



  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(buildApiUrl("/auth/login"), {
        email,
        password,
        rememberMe,
      }, { withCredentials: true });

      const { user, message, token } = response.data;
      if (user) {
        localStorage.setItem("userRole", user.role);
        if (token) {
          localStorage.setItem("token", token);
        }
        if (rememberMe) {
          localStorage.setItem(REMEMBERED_EMAIL_KEY, email);
        } else {
          localStorage.removeItem(REMEMBERED_EMAIL_KEY);
        }
        
        // INTERCEPT: If they must change password (first login), navigate them immediately
        if (user.must_change_password) {
          toast("Please change your default password to continue", { icon: "🔒" });
          navigate("/change-password");
          return;
        }

        if (user.role === 'STUDENT') {
          await refreshUser();
        }

        toast.success(message || "Login successful!");

        // Ensure consistent role mapping between backend roles and frontend redirects
        switch (user.role) {
          case 'STUDENT':
            navigate("/student/dashboard?tab=overview");
            break;
          case 'TPO_ADMIN':
            navigate("/admin/dashboard?tab=overview");
            break;
          case 'TPO_HEAD':
            navigate("/department/dashboard?tab=overview");
            break;
          default:
            navigate("/student/dashboard?tab=overview");
        }
      }
    } catch (error: any) {
      console.error("Login Error:", error);
      toast.error(error.response?.data?.message || "An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-x-hidden bg-background px-4 py-16 transition-colors duration-300 md:py-6">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10 dark:from-primary/10 dark:via-background dark:to-accent/10" />
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>
      
      {/* Back Button */}
      <div className="absolute left-2 top-3 z-20 max-w-[calc(100%-5rem)] sm:left-4 sm:top-4">
        <Button 
          variant="ghost" 
          onClick={() => window.location.href = "/"} 
          className="h-10 max-w-full truncate bg-background/50 px-2 text-muted-foreground backdrop-blur-sm hover:text-foreground sm:h-11 sm:px-4"
        >
          <ArrowLeft className="mr-1 h-4 w-4 shrink-0 sm:mr-2 sm:h-5 sm:w-5" />
          <span className="inline sm:hidden">Home</span>
          <span className="hidden sm:inline">Back to Home</span>
        </Button>
      </div>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
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
      `}</style>

      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-6 items-center relative z-10 my-auto">
        {/* Left side - Branding and Features */}
        <div className="hidden md:block space-y-5 slide-in">
          <div className="flex items-center gap-0 mb-4 group cursor-pointer transition-all duration-300" onClick={() => window.location.href = "/"}>
              <img src="/NG/NextGen_light.png" alt="NextGen Logo" className="h-16 w-16 object-contain flex-shrink-0 transition-transform duration-500 group-hover:scale-110" />
              <div className="flex flex-col justify-center leading-tight">
                <h1 className="text-3xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-none">
                  NextGen
                </h1>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-0.5 opacity-80">
                  AI-Driven
                </p>
              </div>
            </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-foreground leading-tight">
              Welcome to the NextGen Portal 👋
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Sign in to your account. Whether you are a student, department head, or TPO admin{" — "}everything you need is right here.
            </p>

            <div className="space-y-2 pt-2">
              {[
                { icon: Sparkles, text: "Centralized Placement Drives" },
                { icon: Shield, text: "Role-Based Secure Access" },
                { icon: CheckCircle, text: "Comprehensive Analytics & Tracking" }
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-card/60 backdrop-blur-md rounded-lg border border-border shadow-sm hover:shadow-md transition-all group">
                  <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                    <feature.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <Card className="shadow-xl border border-border bg-white dark:bg-slate-900 rounded-2xl slide-in overflow-hidden w-full max-w-sm mx-auto md:max-w-none" style={{ animationDelay: '0.2s' }}>
          <CardContent className="p-6 sm:p-8">
            {/* Mobile Logo */}
            <div className="md:hidden text-center mb-6 flex flex-col items-center">
              <div className="flex items-center gap-0 justify-center mb-4 transition-transform hover:scale-105 cursor-pointer" onClick={() => window.location.href = "/"}>
                <img src="/NG/NextGen_light.png" alt="NextGen Logo" className="h-12 w-12 object-contain flex-shrink-0" />
                <div className="flex flex-col items-start">
                  <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-none">
                    NextGen
                  </h1>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">Data-Driven</p>
                </div>
              </div>
            </div>

            <div className="mb-5">
              <h2 className="text-xl font-bold text-foreground mb-1">Portal Login</h2>
              <p className="text-xs text-muted-foreground">Use your registered email and password to securely log in.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground/80">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground/80">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-primary border-border bg-background rounded focus:ring-primary cursor-pointer"
                  />
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Remember me</span>
                </label>
                <a href="/forgot-password" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
                  Forgot password?
                </a>
              </div>

              {/* Sign In Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 text-white py-2.5 rounded-lg font-semibold text-sm shadow-md shadow-primary/20 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Sign In
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </form>

            <p className="text-center text-xs text-muted-foreground mt-5 font-medium">
              Is your institution not registered yet?{" "}
              <a href="/signup" className="font-bold text-primary hover:text-primary/80 transition-colors">
                Register as TPO Admin
              </a>
            </p>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
