import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { buildApiUrl } from "@/lib/api";
import { useState } from "react";
import { Lock, ArrowLeft } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function ChangePassword() {
  const [, navigate] = useLocation();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await axios.post(buildApiUrl("/auth/change-password"), { currentPassword, newPassword }, { withCredentials: true });
      toast.success(res.data.message || "Password changed successfully!");
      
      const role = localStorage.getItem("userRole");
      switch (role) {
        case 'STUDENT':
          window.location.href = "/student/dashboard?tab=overview";
          break;
        case 'TPO_ADMIN':
          window.location.href = "/admin/dashboard?tab=overview";
          break;
        case 'TPO_HEAD':
          window.location.href = "/department/dashboard?tab=overview";
          break;
        default:
          window.location.href = "/login";
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to change password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center overflow-x-hidden bg-background p-4">
      <Card className="w-full max-w-md shadow-xl border-border">
        <CardContent className="p-6 sm:p-8">
          <div className="mb-8">
            <button onClick={() => window.history.back()} className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </button>
            <h2 className="text-2xl font-bold text-foreground mb-2">Change Password</h2>
            <p className="text-muted-foreground text-sm">
              Please enter your current password to choose a new one.
            </p>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Current Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-border rounded-xl focus:ring-primary focus:border-primary"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-border rounded-xl focus:ring-primary focus:border-primary"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-border rounded-xl focus:ring-primary focus:border-primary"
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full py-6 text-lg">
              {isLoading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
