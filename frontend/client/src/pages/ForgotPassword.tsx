import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { buildApiUrl } from "@/lib/api";
import { useState, useEffect, useRef } from "react";
import { Mail, ShieldCheck, ArrowRight, ArrowLeft, KeyRound, RefreshCw, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useLocation } from "wouter";

const RESEND_COOLDOWN = 60; // seconds — must match backend

export default function ForgotPassword() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Countdown for Resend OTP
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCountdown = (seconds: number = RESEND_COOLDOWN) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCountdown(seconds);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Clean up timer on unmount
  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(buildApiUrl("/auth/reset-password"), { email });
      if (res.data.message?.toLowerCase().includes("failed") || res.data.message?.toLowerCase().includes("fallback")) {
        toast.error(res.data.message);
      } else {
        toast.success(res.data.message || "OTP sent to your email!");
        startCountdown();
      }
      setStep(2);
    } catch (error: any) {
      const retryAfter = error.response?.data?.retryAfter;
      if (error.response?.status === 429 && retryAfter) {
        // If we're already on step 2 (resend was clicked), just restart the timer
        if (step === 2) startCountdown(retryAfter);
      }
      toast.error(error.response?.data?.message || "Failed to send OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    try {
      const res = await axios.post(buildApiUrl("/auth/reset-password"), { email });
      if (res.data.message?.toLowerCase().includes("failed") || res.data.message?.toLowerCase().includes("fallback")) {
        toast.error(res.data.message);
      } else {
        toast.success(res.data.message || "OTP resent successfully!");
        startCountdown();
      }
    } catch (error: any) {
      const retryAfter = error.response?.data?.retryAfter;
      if (error.response?.status === 429 && retryAfter) {
        startCountdown(retryAfter); // sync timer with server
      }
      toast.error(error.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setIsResending(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post(buildApiUrl("/auth/verify-otp"), { email, otp });
      toast.success("OTP verified! Please enter your new password.");
      setStep(3);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(buildApiUrl("/auth/verify-reset"), { email, otp, newPassword });
      toast.success(res.data.message || "Password reset successfully!");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center overflow-x-hidden bg-background p-4">
      <Card className="w-full max-w-md shadow-xl border-border">
        <CardContent className="p-6 sm:p-8">
          <div className="mb-8">
            <button onClick={() => navigate("/login")} className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Login
            </button>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {step === 1 && "Forgot Password"}
              {step === 2 && "Verify OTP"}
              {step === 3 && "Set New Password"}
            </h2>
            <p className="text-muted-foreground text-sm">
              {step === 1 && "Enter your email address and we'll send you an OTP to reset your password."}
              {step === 2 && "Enter the 6-digit OTP sent to your email."}
              {step === 3 && "Enter your new password."}
            </p>
          </div>

          {step === 1 && (
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
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </span>
                ) : (
                  "Send OTP"
                )}
              </Button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold">OTP</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    maxLength={6}
                    autoComplete="one-time-code"
                    className="w-full pl-12 pr-4 py-3 border-2 border-border rounded-xl focus:ring-primary focus:border-primary tracking-widest font-mono text-lg"
                    required
                  />
                </div>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full py-6 text-lg">
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifying...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Verify OTP <ArrowRight className="w-5 h-5 ml-2" />
                  </span>
                )}
              </Button>

              {/* Resend OTP */}
              <div className="flex items-center justify-center gap-2 pt-1">
                <span className="text-sm text-muted-foreground">Didn't receive the OTP?</span>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={countdown > 0 || isResending}
                  className={`flex items-center gap-1 text-sm font-semibold transition-colors ${
                    countdown > 0 || isResending
                      ? "text-muted-foreground cursor-not-allowed"
                      : "text-primary hover:text-primary/80 cursor-pointer"
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isResending ? "animate-spin" : ""}`} />
                  {isResending
                    ? "Sending..."
                    : countdown > 0
                    ? `Resend in ${countdown}s`
                    : "Resend OTP"}
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold">New Password</label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    className="w-full pl-12 pr-4 py-3 border-2 border-border rounded-xl focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
              </div>
              <Button type="submit" disabled={isLoading} className="w-full py-6 text-lg">
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Resetting...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
