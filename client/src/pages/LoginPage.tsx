import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Sparkles, Shield, CheckCircle, Github, Chrome, GithubIcon, TwitterIcon, InstagramIcon } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";
import axios from "axios";
import { toast } from "sonner";

const REMEMBERED_EMAIL_KEY = "rememberedEmail";

export default function LoginPage() {
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
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
        rememberMe,
      }, { withCredentials: true });

      const { user, message } = response.data;
      if (user) {
        toast.success(message || "Login successful!");
        localStorage.setItem("userRole", user.role);
        if (rememberMe) {
          localStorage.setItem(REMEMBERED_EMAIL_KEY, email);
        } else {
          localStorage.removeItem(REMEMBERED_EMAIL_KEY);
        }
        
        // INTERCEPT: If they must change password (first login), redirect them immediately
        if (user.must_change_password) {
          toast("Please change your default password to continue", { icon: "🔒" });
          window.location.href = "/change-password";
          return;
        }

        // Ensure consistent role mapping between backend roles and frontend redirects
        switch (user.role) {
          case 'STUDENT':
            window.location.href = "/student/dashboard";
            break;
          case 'TPO_ADMIN':
            window.location.href = "/admin/dashboard";
            break;
          case 'TPO_HEAD':
            window.location.href = "/department/dashboard";
            break;
          default:
            window.location.href = "/student/dashboard";
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
    <div className="min-h-screen h-screen bg-background flex flex-col items-center justify-center p-4 py-12 md:py-4 relative overflow-x-hidden transition-colors duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10 dark:from-primary/10 dark:via-background dark:to-accent/10" />
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>
      
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-20">
        <Button 
          variant="ghost" 
          onClick={() => window.location.href = "/"} 
          className="text-muted-foreground hover:text-foreground bg-background/50 backdrop-blur-sm"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
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

      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center relative z-10 my-auto">
        {/* Left side - Branding and Features */}
        <div className="hidden md:block space-y-8 slide-in">
          <div className="float">
            <div className="flex items-center gap-0 mb-6 group cursor-pointer transition-all duration-300" onClick={() => window.location.href = "/"}>
              <img src="/NG/NextGen_light.png" alt="NextGen Logo" className="h-24 w-24 object-contain flex-shrink-0 transition-transform duration-500 group-hover:scale-110" />
              <div className="flex flex-col justify-center leading-tight">
                <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-none">
                  NextGen
                </h1>
                <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest mt-0.5 opacity-80">
                  AI-Driven
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground leading-tight">
              Welcome to the NextGen Portal 👋
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Sign in to your account. Whether you are a student exploring placements, a department head managing batches, or a TPO admin directing the campus drive, everything you need is right here.
            </p>

            <div className="space-y-4 pt-4">
              {[
                { icon: Sparkles, text: "Centralized Placement Drives", color: "blue" },
                { icon: Shield, text: "Role-Based Secure Access", color: "green" },
                { icon: CheckCircle, text: "Comprehensive Analytics & Tracking", color: "purple" }
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

        {/* Right side - Login Form */}
        <Card className="shadow-xl border border-border bg-white dark:bg-slate-900 rounded-2xl slide-in overflow-hidden w-full max-w-md mx-auto md:max-w-none" style={{ animationDelay: '0.2s' }}>
          <CardContent className="p-6 sm:p-8 md:p-10">
            {/* Mobile Logo */}
            <div className="md:hidden text-center mb-8 flex flex-col items-center">
              <div className="flex items-center gap-0 justify-center mb-4 transition-transform hover:scale-105 cursor-pointer" onClick={() => window.location.href = "/"}>
                <img src="/NG/NextGen_light.png" alt="NextGen Logo" className="h-16 w-16 object-contain flex-shrink-0" />
                <div className="flex flex-col items-start">
                  <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-none">
                    NextGen
                  </h1>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">AI-Driven</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Portal Login</h2>
              <p className="text-sm sm:text-base text-muted-foreground">Use your registered email and password to securely log in.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground/80">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm sm:text-base"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground/80">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3.5 border-2 border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm sm:text-base"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
                className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 text-white py-4 rounded-xl font-semibold text-base sm:text-lg shadow-lg shadow-primary/20 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
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

            <p className="text-center text-sm text-muted-foreground mt-8 font-medium">
              Is your institution not registered yet?{" "}
              <a href="/signup" className="font-bold text-primary hover:text-primary/80 transition-colors">
                Register as TPO Admin
              </a>
            </p>

          </CardContent>
        </Card>
      </div>
      {/* Bottom Info */}
      <div className="mt-8 text-center text-sm text-muted-foreground font-medium relative z-10">
        <p>© {new Date().getFullYear()} NextGen Platform. All rights reserved.</p>
      </div>
    </div>
  );
}
