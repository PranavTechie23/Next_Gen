import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, Shield, CheckCircle, Github, Chrome, GithubIcon, TwitterIcon, InstagramIcon } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";

export default function LoginPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Auto-detect user type from email or redirect to appropriate dashboard
    if (email.includes("student") || email.includes("demo")) {
      window.location.href = "/student/dashboard";
    } else if (email.includes("tpo") || email.includes("dept") || email.includes("college")) {
      window.location.href = "/college/dashboard";
    } else if (email.includes("admin")) {
      window.location.href = "/admin/dashboard";
    } else {
      window.location.href = "/student/dashboard"; // Default
    }
  };

  const handleDemoLogin = () => {
    setEmail("demo@student.com");
    setPassword("demo123");
  };

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    setTimeout(() => {
      window.location.href = "/student/dashboard";
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10 dark:from-primary/10 dark:via-background dark:to-accent/10" />
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
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

      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-6 md:gap-8 items-center relative z-10">
        {/* Left side - Branding and Features */}
        <div className="hidden md:block space-y-6 md:space-y-8 slide-in">
          <div className="float">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center">
                <img src={isDark ? "/NG/NextGen_dark.png" : "/NG/NextGen_light.png"} alt="NextGen Logo" className="w-full h-full object-contain scale-125" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  NextGen
                </h1>
                <p className="text-muted-foreground text-xs md:text-sm font-medium">Your Path to Success</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 md:space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
              Welcome Back! 👋
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Sign in to access your personalized career dashboard and continue your journey to success.
            </p>

            <div className="space-y-4 pt-4">
              {[
                { icon: Sparkles, text: "AI-Powered Career Insights", color: "blue" },
                { icon: Shield, text: "Secure & Private", color: "green" },
                { icon: CheckCircle, text: "Track Your Progress", color: "purple" }
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
        <Card className="shadow-2xl border border-border bg-card/80 backdrop-blur-xl slide-in overflow-hidden" style={{ animationDelay: '0.2s' }}>
          <CardContent className="p-8 md:p-10">
            {/* Mobile Logo */}
            <div className="md:hidden text-center mb-8">
              <div className="w-24 h-24 flex items-center justify-center mx-auto mb-4">
                <img src={isDark ? "/NG/NextGen_dark.png" : "/NG/NextGen_light.png"} alt="NextGen Logo" className="w-full h-full object-contain scale-125" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                NextGen
              </h1>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">Sign In</h2>
              <p className="text-muted-foreground">Enter your credentials to access your account</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
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
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
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
                    className="w-full pl-12 pr-12 py-3.5 border-2 border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
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
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-primary border-border bg-background rounded focus:ring-primary cursor-pointer"
                  />
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Remember me</span>
                </label>
                <a href="#forgot" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
                  Forgot password?
                </a>
              </div>

              {/* Sign In Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 text-white py-4 rounded-xl font-semibold text-lg shadow-lg shadow-primary/20 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
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

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-card text-muted-foreground font-medium">Or continue with</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                onClick={() => handleSocialLogin('google')}
                variant="outline"
                className="border-2 border-border hover:border-muted hover:bg-muted py-3 rounded-xl font-semibold text-foreground transition-all"
              >
                <Chrome className="w-5 h-5 mr-2 text-red-500" />
                Google
              </Button>
              <Button
                type="button"
                onClick={() => handleSocialLogin('github')}
                variant="outline"
                className="border-2 border-border hover:border-muted hover:bg-muted py-3 rounded-xl font-semibold text-foreground transition-all"
              >
                <GithubIcon className="w-5 h-5 mr-2" />
                GitHub
              </Button>
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-muted-foreground mt-8 font-medium">
              Don't have an account?{" "}
              <a href="/signup" className="font-bold text-primary hover:text-primary/80 transition-colors">
                Create an account
              </a>
            </p>

          </CardContent>
        </Card>
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-sm text-muted-foreground font-medium">
        <p>© {new Date().getFullYear()} NextGen Platform. All rights reserved.</p>
      </div>
    </div>
  );
}
