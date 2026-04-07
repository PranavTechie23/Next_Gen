import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { Mail, ShieldCheck, ArrowRight, ArrowLeft } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function ForgotPassword() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/reset-password", { email });
      toast.success(res.data.message || "OTP sent to your email!");
      setStep(2);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify-reset", { email, otp, newPassword });
      toast.success(res.data.message || "Password reset successfully!");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md shadow-xl border-border">
        <CardContent className="p-6 sm:p-8">
          <div className="mb-8">
            <button onClick={() => navigate("/login")} className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Login
            </button>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {step === 1 ? "Forgot Password" : "Reset Password"}
            </h2>
            <p className="text-muted-foreground text-sm">
              {step === 1 
                ? "Enter your email address and we'll send you an OTP to reset your password."
                : "Enter the OTP sent to your email and your new password."}
            </p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleRequestOtp} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-border rounded-xl focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
              </div>
              <Button type="submit" disabled={isLoading} className="w-full py-6 text-lg">
                {isLoading ? "Sending..." : "Send OTP"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold">OTP</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full pl-12 pr-4 py-3 border-2 border-border rounded-xl focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-border rounded-xl focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full py-6 text-lg">
                {isLoading ? "Resetting..." : "Reset Password"} <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
