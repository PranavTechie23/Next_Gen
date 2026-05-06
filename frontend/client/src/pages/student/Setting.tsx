import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Save,
  User,
  GraduationCap,
  Briefcase,
  Shield,
  Database,
  Mail,
  Phone,
  Building2,
  BookOpen,
  Calendar,
  Target,
  Lock,
  ShieldCheck,
  Eye,
  CheckCircle2,
  Bell,
  Settings,
  LogOut,
  Camera,
  MapPin,
  Globe,
  Linkedin,
  Github,
  Award,
  TrendingUp,
  Download,
  Trash2,
  RefreshCw,
  Activity,
  BarChart3,
  FileText,
  Link2,
  Code,
  Palette,
  Zap,
  Languages,
  ChevronRight
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { studentApi } from "@/services/studentApi";
import { toast } from "sonner";

export default function StudentSettings(props: any) {
  const isDashboard = props?.isDashboard || false;
  const [, navigate] = useLocation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "Mumbai, Maharashtra",
    college: "NextGen University",
    branch: "",
    year: "Final Year",
    cgpa: "0",
    graduationYear: "2026",
    targetRole: "Senior Software Engineer",
    linkedIn: "",
    github: "",
    portfolio: "",
    bio: ""
  });

  const [isLoading, setIsLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Fetch student profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const data = await studentApi.getProfile();
        setFormData({
            fullName: data?.profile?.full_name || data?.user?.email?.split('@')[0] || "Student",
            email: data?.user?.email || "",
            phone: data?.profile?.phone || "",
            location: data?.profile?.address || "Address Not Available",
            college: "NextGen University", // Assuming static or from institution table
            branch: data?.department?.name || "Engineering",
            year: "Final Year",
            cgpa: data?.student?.current_cgpa || "0",
            graduationYear: data?.student?.expected_graduation_year || "2025",
            targetRole: "Software Engineer",
            linkedIn: data?.profile?.linkedin_url || "",
            github: data?.profile?.github_url || "",
            portfolio: "",
            bio: data?.profile?.bio || ""
        });
        setAvatarUrl(data?.profile?.avatar_url || "");
      } catch (error: any) {
        console.error("Failed to fetch profile settings", error);
        if (error?.response?.status === 401) {
          toast.error("Session expired. Please login again.");
          window.location.href = "/login";
          return;
        }
        toast.error("Failed to load profile data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const [privacySettings, setPrivacySettings] = useState({
    analyzeLearning: true,
    shareData: true,
    recommendations: true,
    profileVisibility: true,
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    jobAlerts: true,
    assessmentReminders: true,
    weeklyDigest: false,
    mentorMessages: true,
  });

  const [saved, setSaved] = useState(false);

  const stats = [
    { icon: Award, label: 'Assessments Completed', value: '24', color: 'from-blue-500 to-cyan-500' },
    { icon: TrendingUp, label: 'Skill Progress', value: '87%', color: 'from-purple-500 to-pink-500' },
    { icon: Target, label: 'Career Readiness', value: '92%', color: 'from-green-500 to-emerald-500' },
    { icon: Activity, label: 'Learning Streak', value: '15 days', color: 'from-orange-500 to-red-500' },
  ];

  const skills = [
    { name: 'Python', level: 85, color: 'bg-blue-500' },
    { name: 'React', level: 78, color: 'bg-cyan-500' },
    { name: 'Machine Learning', level: 72, color: 'bg-purple-500' },
    { name: 'Data Structures', level: 90, color: 'bg-green-500' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  type PrivacyKey = keyof typeof privacySettings;
  type NotificationKey = keyof typeof notifications;

  const handlePrivacyChange = (key: PrivacyKey) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleNotificationChange = (key: NotificationKey) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.currentTarget.value = "";
    if (!file) return;
    // Preview immediately
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
    // Upload
    try {
      setUploadingAvatar(true);
      const data = await studentApi.uploadAvatar(file);
      setAvatarUrl(data.avatar_url);
      setAvatarPreview("");
      toast.success("Profile photo updated!");
    } catch (err) {
      console.error("Avatar upload failed", err);
      setAvatarPreview("");
      toast.error("Failed to upload photo. Please try again.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    try {
      // Build subjective profile payload
      const subjectiveData = {
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.location,
        bio: formData.bio,
        linkedin_url: formData.linkedIn,
        github_url: formData.github
        // Add resume/portfolio mapping logic when supported by backend
      };
      
      await studentApi.updateSubjectiveProfile(subjectiveData);
      
      setSaved(true);
      setIsEditing(false);
      toast.success("Profile updated successfully");
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Failed to update profile", error);
      toast.error("Failed to save changes.");
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className={`${isDark ? 'bg-[#0c0c14]/40 border-white/5' : 'bg-white/80 border-slate-200/50'} backdrop-blur-3xl border rounded-2xl p-6 overflow-hidden group hover:scale-[1.02] transition-all duration-300 relative shadow-lg`}>
                    <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-[0.05] rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform flex-shrink-0`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className={`text-xs font-semibold uppercase tracking-wide leading-none ${isDark ? 'text-white/50' : 'text-slate-500'}`}>{stat.label}</p>
                      <p className={`text-3xl font-bold tracking-tight py-1 leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>{stat.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Profile Widget - Compact */}
            <div className={`${isDark ? 'bg-[#0c0c14]/40 border-white/5' : 'bg-white/80 border-slate-200/50'} backdrop-blur-3xl border rounded-2xl p-6 overflow-hidden shadow-lg relative group cursor-pointer hover:scale-[1.01] transition-all`} onClick={() => setActiveTab('profile')}>
              <div className="flex items-center gap-6">
                <div className="relative group/avatar">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover/avatar:rotate-3 transition-transform duration-500">
                    {formData.fullName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-2 ${isDark ? 'border-[#0c0c14]' : 'border-white'} rounded-lg shadow-lg flex items-center justify-center`}>
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="space-y-1">
                    <h3 className={`text-xl font-bold tracking-tight leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>{formData.fullName}</h3>
                    <p className="text-blue-400 font-semibold text-sm">{formData.branch} • {formData.college}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {[
                      { label: `GPA: ${formData.cgpa}`, icon: Award, color: "text-emerald-400" },
                      { label: formData.targetRole, icon: Target, color: "text-purple-400" }
                    ].map((chip, i) => (
                      <div key={i} className={`flex items-center gap-2 ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100/80 border-slate-200/50'} px-3 py-1.5 rounded-lg border text-xs font-semibold`}>
                        <chip.icon className={`w-3.5 h-3.5 ${chip.color}`} />
                        <span className={`${isDark ? 'text-white' : 'text-slate-900'}`}>{chip.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-blue-400 group-hover:text-blue-300 transition-colors">
                  <span className="text-sm font-semibold">View Profile</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <div className={`${isDark ? 'bg-[#0c0c14]/40 border-white/5' : 'bg-white/80 border-slate-200/50'} backdrop-blur-3xl border rounded-2xl p-6 overflow-hidden relative shadow-lg`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Recent Activity</h3>
                  <Button variant="ghost" size="sm" className="text-xs font-semibold">View All</Button>
                </div>
                <div className="space-y-3">
                  {[
                    { title: "Completed Python Assessment", sub: "Scored 85% • 2 hours ago", icon: Award, color: "text-blue-400", bg: "bg-blue-400/10" },
                    { title: "Profile Updated", sub: "Added new skills • 1 day ago", icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-400/10" },
                    { title: "Applied to Google", sub: "Software Engineer role • 2 days ago", icon: Target, color: "text-purple-400", bg: "bg-purple-400/10" }
                  ].map((activity, i) => (
                    <div key={i} className={`flex items-start gap-3 p-3 ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-100/50'} rounded-xl transition-colors group cursor-pointer`}>
                      <div className={`w-10 h-10 ${activity.bg} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        <activity.icon className={`w-5 h-5 ${activity.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{activity.title}</p>
                        <p className={`text-xs mt-0.5 ${isDark ? 'text-white/60' : 'text-slate-600'}`}>{activity.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Skills */}
              <div className={`${isDark ? 'bg-[#0c0c14]/40 border-white/5' : 'bg-white/80 border-slate-200/50'} backdrop-blur-3xl border rounded-2xl p-6 overflow-hidden relative shadow-lg`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Top Skills</h3>
                  <Button variant="ghost" size="sm" className="text-xs font-semibold">View All</Button>
                </div>
                <div className="space-y-4">
                  {skills.map((skill, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{skill.name}</span>
                        <span className="text-sm font-bold text-blue-400">{skill.level}%</span>
                      </div>
                      <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/5' : 'bg-slate-200'}`}>
                        <div
                          className={`h-full ${skill.color} rounded-full transition-all duration-1000`}
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Profile Header Card */}
            <div className={`${isDark ? 'bg-[#0c0c14]/40 border-white/5' : 'bg-white/80 border-slate-200/50'} backdrop-blur-3xl border rounded-2xl p-8 overflow-hidden shadow-2xl relative group`}>
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full -mr-20 -mt-20 blur-[100px] pointer-events-none"></div>
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                <div className="relative group/avatar">
                  {/* Avatar display: photo if available, else initials gradient */}
                  <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-2xl group-hover/avatar:ring-4 group-hover/avatar:ring-blue-500/40 transition-all duration-500">
                    {(avatarPreview || avatarUrl) ? (
                      <img
                        src={avatarPreview || avatarUrl}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold">
                        {formData.fullName.split(' ').map(n => n[0]).join('') || 'S'}
                      </div>
                    )}
                    {/* Upload overlay on hover */}
                    {!uploadingAvatar && (
                      <div
                        onClick={() => avatarInputRef.current?.click()}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer rounded-2xl"
                      >
                        <div className="flex flex-col items-center gap-1">
                          <Camera className="w-7 h-7 text-white" />
                          <span className="text-white text-xs font-bold">Change</span>
                        </div>
                      </div>
                    )}
                    {uploadingAvatar && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-2xl">
                        <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                  {/* Camera trigger button */}
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className={`absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 border-4 ${isDark ? 'border-[#0c0c14]' : 'border-white'} rounded-xl flex items-center justify-center text-white hover:bg-blue-500 transition-all shadow-xl group/cam disabled:opacity-60`}
                  >
                    <Camera className="w-4 h-4 group-hover/cam:scale-110 transition-transform" />
                  </button>
                  {/* Hidden file input */}
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>
                <div className="flex-1 text-center md:text-left space-y-4">
                  <div>
                    <h3 className={`text-3xl font-bold tracking-tight mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{formData.fullName}</h3>
                    <p className="text-blue-400 font-semibold text-sm">{formData.branch} • {formData.college}</p>
                  </div>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    <span className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-semibold inline-flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      Account Active
                    </span>
                    <span className="px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl text-xs font-semibold inline-flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  </div>
                </div>
                <div className="flex gap-3">
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} className="h-12 px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-blue-500/20">
                      <Settings className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-3">
                      <Button onClick={handleSave} className="h-12 px-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-emerald-500/20">
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button onClick={() => setIsEditing(false)} variant="outline" className={`h-12 px-6 ${isDark ? 'border-white/10 hover:bg-white/5 text-white' : 'border-slate-200 hover:bg-slate-100 text-slate-900'} rounded-xl font-semibold text-sm transition-all`}>
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Input Sections */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Personal Info */}
              <div className={`${isDark ? 'bg-[#0c0c14]/40 border-white/5' : 'bg-white/80 border-slate-200/50'} backdrop-blur-3xl border rounded-2xl p-6 space-y-6 shadow-lg`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-400" />
                  </div>
                  <h4 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Personal Information</h4>
                </div>

                <div className="space-y-5">
                  {[
                    { label: "Full Name", name: "fullName", icon: User },
                    { label: "Email Address", name: "email", icon: Mail, readOnly: true },
                    { label: "Phone Number", name: "phone", icon: Phone },
                    { label: "Location", name: "location", icon: MapPin },
                    { label: "Bio / Summary", name: "bio", icon: FileText },
                    { label: "LinkedIn URL", name: "linkedIn", icon: Linkedin },
                    { label: "GitHub URL", name: "github", icon: Github }
                  ].map((field) => (
                    <div key={field.name} className="space-y-2">
                      <label className={`text-xs font-semibold ${isDark ? 'text-white/70' : 'text-slate-700'}`}>{field.label}</label>
                      <div className="relative">
                        <field.icon className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-white/30' : 'text-slate-400'}`} />
                        <input
                          type="text"
                          name={field.name}
                          value={(formData as any)[field.name]}
                          onChange={handleChange}
                          disabled={!isEditing || field.readOnly}
                          className={`w-full ${isDark ? 'bg-white/5 border-white/10 text-white placeholder:text-white/30' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'} border rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Academic Grid */}
              <div className={`${isDark ? 'bg-[#0c0c14]/40 border-white/5' : 'bg-white/80 border-slate-200/50'} backdrop-blur-3xl border rounded-2xl p-6 space-y-6 shadow-lg`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-purple-400" />
                  </div>
                  <h4 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Academic Information</h4>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className={`text-xs font-semibold ${isDark ? 'text-white/70' : 'text-slate-700'}`}>Institution</label>
                    <div className="relative">
                      <Building2 className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-white/30' : 'text-slate-400'}`} />
                      <input
                        type="text"
                        name="college"
                        value={formData.college}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full ${isDark ? 'bg-white/5 border-white/10 text-white placeholder:text-white/30' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'} border rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className={`text-xs font-semibold ${isDark ? 'text-white/70' : 'text-slate-700'}`}>Branch</label>
                      <Select 
                        value={formData.branch} 
                        onValueChange={(value) => setFormData({ ...formData, branch: value })}
                        disabled={!isEditing}
                      >
                        <SelectTrigger className={`w-full h-12 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-xl px-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}>
                          <SelectValue placeholder="Select Branch" />
                        </SelectTrigger>
                        <SelectContent className={isDark ? "bg-[#0c0c14] border-white/10 text-white" : "bg-white text-slate-900"}>
                          <SelectItem value="Computer Science">Computer Science</SelectItem>
                          <SelectItem value="Electronics">Electronics</SelectItem>
                          <SelectItem value="Information Technology">Information Technology</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className={`text-xs font-semibold ${isDark ? 'text-white/70' : 'text-slate-700'}`}>Level</label>
                      <Select 
                        value={formData.year} 
                        onValueChange={(value) => setFormData({ ...formData, year: value })}
                        disabled={!isEditing}
                      >
                        <SelectTrigger className={`w-full h-12 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-xl px-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}>
                          <SelectValue placeholder="Select Level" />
                        </SelectTrigger>
                        <SelectContent className={isDark ? "bg-[#0c0c14] border-white/10 text-white" : "bg-white text-slate-900"}>
                          <SelectItem value="First Year">First Year</SelectItem>
                          <SelectItem value="Second Year">Second Year</SelectItem>
                          <SelectItem value="Third Year">Third Year</SelectItem>
                          <SelectItem value="Final Year">Final Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className={`text-xs font-semibold ${isDark ? 'text-white/70' : 'text-slate-700'}`}>CGPA</label>
                      <input type="text" name="cgpa" value={formData.cgpa} onChange={handleChange} disabled={!isEditing}
                        className={`w-full ${isDark ? 'bg-white/5 border-white/10 text-white placeholder:text-white/30' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'} border rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed`} />
                    </div>
                    <div className="space-y-2">
                      <label className={`text-xs font-semibold ${isDark ? 'text-white/70' : 'text-slate-700'}`}>Graduation Year</label>
                      <input type="text" name="graduationYear" value={formData.graduationYear} onChange={handleChange} disabled={!isEditing}
                        className={`w-full ${isDark ? 'bg-white/5 border-white/10 text-white placeholder:text-white/30' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'} border rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed`} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className={`${isDark ? 'bg-[#0c0c14]/40 border-white/5' : 'bg-white/80 border-slate-200/50'} backdrop-blur-3xl border rounded-[3rem] p-10 relative overflow-hidden shadow-lg`}>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <Bell className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Notification Preferences</h3>
                  <p className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-600'}`}>Manage how and when you receive notifications</p>
                </div>
              </div>

              <div className="grid gap-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <label key={key} className={`flex items-center justify-between p-6 ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-slate-50/80 border-slate-200/50 hover:bg-slate-100/80'} border rounded-[2rem] transition-all cursor-pointer group`}>
                    <div className="flex items-center gap-6">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${value ? 'bg-blue-500/20' : isDark ? 'bg-white/5' : 'bg-slate-200/50'}`}>
                        <Bell className={`w-5 h-5 ${value ? 'text-blue-400' : isDark ? 'text-white/20' : 'text-slate-400'}`} />
                      </div>
                      <div>
                        <h4 className={`text-sm font-semibold group-hover:text-blue-400 transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {key === 'emailNotifications' && 'Email Notifications'}
                          {key === 'jobAlerts' && 'Job Alerts'}
                          {key === 'assessmentReminders' && 'Assessment Reminders'}
                          {key === 'weeklyDigest' && 'Weekly Digest'}
                          {key === 'mentorMessages' && 'Mentor Messages'}
                        </h4>
                        <p className={`text-xs mt-0.5 ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
                          {key === 'emailNotifications' && 'Receive email updates about your account'}
                          {key === 'jobAlerts' && 'Get notified about new job opportunities'}
                          {key === 'assessmentReminders' && 'Reminders for upcoming assessments'}
                          {key === 'weeklyDigest' && 'Weekly summary of your progress'}
                          {key === 'mentorMessages' && 'Notifications from your mentors'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleNotificationChange(key as NotificationKey)}
                      className={`relative w-16 h-8 rounded-full transition-all duration-500 ${value ? 'bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]' : isDark ? 'bg-white/10' : 'bg-slate-300'}`}
                    >
                      <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-500 ${value ? 'translate-x-8' : 'translate-x-0'}`} />
                    </button>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className={`${isDark ? 'bg-[#0c0c14]/40 border-white/5' : 'bg-white/80 border-slate-200/50'} backdrop-blur-3xl border rounded-[3rem] p-10 shadow-lg`}>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
                  <Lock className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Security Settings</h3>
                  <p className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-600'}`}>Manage your account security and access</p>
                </div>
              </div>

              <div className="grid gap-6">
                {[
                  { title: "Access Key Update", desc: "Reset your primary authentication string", icon: Lock, color: "text-blue-400", bg: "bg-blue-400/10" },
                  { title: "Dual Factor Sync", desc: "Biometric or multi-stage verification active", icon: ShieldCheck, color: "text-emerald-400", bg: "bg-emerald-400/10", active: true },
                  { title: "Access Telemetry", desc: "Review recent authorization attempts", icon: Activity, color: "text-purple-400", bg: "bg-purple-400/10" }
                ].map((item, i) => (
                  <div key={i} className={`flex items-center justify-between p-6 ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-slate-50/80 border-slate-200/50 hover:bg-slate-100/80'} border rounded-[2.5rem] group transition-all`}>
                    <div className="flex items-center gap-6">
                      <div className={`w-16 h-16 ${item.bg} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                        <item.icon className={`w-8 h-8 ${item.color}`} />
                      </div>
                      <div>
                        <h4 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.title}</h4>
                        <p className={`text-xs mt-0.5 ${isDark ? 'text-white/60' : 'text-slate-600'}`}>{item.desc}</p>
                        {item.active && (
                          <span className="inline-flex items-center gap-2 text-[9px] text-emerald-400 font-black uppercase tracking-widest mt-2 px-3 py-1 bg-emerald-400/5 rounded-full border border-emerald-400/10">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                            Secure
                          </span>
                        )}
                      </div>
                    </div>
                    <Button variant="outline" className={`h-10 ${isDark ? 'border-white/10 hover:bg-white/5 text-white' : 'border-slate-200 hover:bg-slate-100 text-slate-900'} rounded-lg font-semibold text-xs px-4`}>
                      Manage
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className={`${isDark ? 'bg-[#0c0c14]/40 border-white/5' : 'bg-white/80 border-slate-200/50'} backdrop-blur-3xl border rounded-2xl p-6 shadow-lg`}>
              <h3 className={`text-base font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>Active Sessions</h3>
              <div className="grid gap-4">
                {[
                  { name: "Chrome Matrix v124", loc: "Mumbai Sector 4 • ID: 103.**.**.45", icon: Globe, current: true },
                  { name: "Safari Neural Link", loc: "Delhi Sector 9 • ID: 192.**.**.12", icon: User }
                ].map((session, i) => (
                  <div key={i} className={`flex items-center justify-between p-6 rounded-[2rem] border transition-all ${session.current ? 'bg-emerald-500/5 border-emerald-500/20' : isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-slate-50/80 border-slate-200/50 hover:bg-slate-100/80'}`}>
                    <div className="flex items-center gap-6">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? 'bg-white/5' : 'bg-slate-200/50'}`}>
                        <session.icon className={`w-5 h-5 ${session.current ? 'text-emerald-400' : isDark ? 'text-white/40' : 'text-slate-600'}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{session.name}</h4>
                          {session.current && <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-500 text-white rounded">Current</span>}
                        </div>
                        <p className={`text-xs mt-0.5 ${isDark ? 'text-white/60' : 'text-slate-600'}`}>{session.loc}</p>
                      </div>
                    </div>
                    {!session.current && (
                      <Button variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-400/10 font-semibold text-xs">
                        Revoke
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className={`${isDark ? 'bg-[#0c0c14]/40 border-white/5' : 'bg-white/80 border-slate-200/50'} backdrop-blur-3xl border rounded-[3rem] p-10 shadow-lg`}>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
                  <Database className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Privacy Settings</h3>
                  <p className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-600'}`}>Control your data and privacy preferences</p>
                </div>
              </div>

              <div className="grid gap-4">
                {[
                  { key: 'analyzeLearning', title: 'Neural Pattern Analysis', desc: 'Allow AI to optimize your learning trajectory', icon: Target },
                  { key: 'shareData', title: 'Research Contribution', desc: 'Sync anonymized metrics with educational core', icon: Database },
                  { key: 'recommendations', title: 'Predictive Matching', desc: 'Enable real-time career path projections', icon: Zap },
                  { key: 'profileVisibility', title: 'Cloaking Override', desc: 'Make your profile visible to Verified recruiters', icon: Eye }
                ].map((item) => (
                  <label key={item.key} className={`flex items-center justify-between p-6 ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-slate-50/80 border-slate-200/50 hover:bg-slate-100/80'} border rounded-[2rem] transition-all cursor-pointer group`}>
                    <div className="flex items-center gap-6">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? 'bg-white/5' : 'bg-slate-200/50'}`}>
                        <item.icon className="w-5 h-5 text-orange-400" />
                      </div>
                      <div>
                        <h4 className={`text-sm font-semibold group-hover:text-orange-400 transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.title}</h4>
                        <p className={`text-xs mt-0.5 ${isDark ? 'text-white/60' : 'text-slate-600'}`}>{item.desc}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handlePrivacyChange(item.key as PrivacyKey)}
                      className={`relative w-16 h-8 rounded-full transition-all duration-500 ${(privacySettings as any)[item.key] ? 'bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.3)]' : isDark ? 'bg-white/10' : 'bg-slate-300'}`}
                    >
                      <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-500 ${(privacySettings as any)[item.key] ? 'translate-x-8' : 'translate-x-0'}`} />
                    </button>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-red-500/5 backdrop-blur-3xl border border-red-500/10 rounded-[3rem] p-10 overflow-hidden relative group shadow-lg">
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full -mr-20 -mt-20 blur-[80px] group-hover:bg-red-500/20 transition-all"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                    <Trash2 className="w-6 h-6 text-red-500" />
                  </div>
                  <h3 className="text-base font-bold text-red-500">Danger Zone</h3>
                </div>
                <p className={`text-sm mb-6 max-w-xl leading-relaxed ${isDark ? 'text-white/70' : 'text-slate-700'}`}>Warning: Deleting your account will permanently remove all your data, achievements, and progress. This action cannot be undone.</p>
                <Button variant="destructive" className="h-11 px-6 bg-red-600 hover:bg-red-500 text-white rounded-xl font-semibold text-sm shadow-lg shadow-red-500/20">
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`${!isDashboard ? `min-h-dvh ${isDark ? 'bg-[#050509]' : 'bg-slate-50'}` : "bg-transparent"} font-sans text-foreground selection:bg-blue-500/30 overflow-x-hidden transition-colors duration-300`}>
      {/* Dynamic Background Elements */}
      {isDark && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]"></div>
        </div>
      )}

      {/* Header - Hide if dashboard */}
      {!isDashboard && (
        <>
          <header className={`sticky top-0 z-50 ${isDark ? 'bg-[#0c0c14]/80 border-white/5' : 'bg-white/80 border-slate-200/50'} backdrop-blur-2xl border-b shadow-2xl transition-all duration-500`}>
            <div className="max-w-[1700px] mx-auto px-6 sm:px-10">
              <div className="flex items-center justify-between h-20">
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => navigate("/student/dashboard")}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white rounded-xl font-black text-sm tracking-tight hover:shadow-[0_10px_30_rgba(37,99,235,0.4)] transition-all flex items-center gap-2 hover:scale-105 active:scale-95 group"
                  >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back
                  </button>
                  <div className={`h-10 w-px ${isDark ? 'bg-white/10' : 'bg-slate-300'} hidden sm:block`}></div>
                  <div className="flex items-center gap-0">
                    <img src="/NG/NextGen_light.png" alt="NextGen Logo" className="h-14 w-14 object-contain flex-shrink-0 transition-transform duration-500 group-hover:scale-110" />
                    <div className="flex flex-col -gap-1">
                      <span className="font-black text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tighter">NextGen</span>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Student Settings</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {saved && (
                    <div className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 px-4 py-2 rounded-2xl animate-in fade-in slide-in-from-top-4 border border-emerald-400/20 shadow-lg shadow-emerald-500/10 hidden md:flex">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="font-bold text-[10px] uppercase tracking-wider">Changes synchronized</span>
                    </div>
                  )}
                  <ThemeToggle className={`!h-12 !w-12 backdrop-blur-md ${isDark ? 'bg-white/5 border-white/10 hover:border-blue-500/30 text-white' : 'bg-slate-100 border-slate-200 hover:border-blue-500/30 text-slate-900'} border !rounded-xl transition-all flex items-center justify-center shadow-lg hover:scale-110`} />
                </div>
              </div>
            </div>
          </header>

          <div className={`${isDark ? 'bg-[#0c0c14]/40 border-white/5' : 'bg-white/80 border-slate-200/50'} backdrop-blur-2xl border-b sticky top-20 z-40 shadow-xl`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-center items-center py-4">
                <div className="flex space-x-2 items-center bg-white/5 dark:bg-white/5 rounded-2xl p-1.5 border border-white/10 dark:border-white/10 shadow-inner">
                  {[
                    { id: 'overview', label: 'Overview', icon: BarChart3 },
                    { id: 'profile', label: 'Profile', icon: User },
                    { id: 'notifications', label: 'Notifications', icon: Bell },
                    { id: 'security', label: 'Security', icon: Lock },
                    { id: 'privacy', label: 'Privacy', icon: Database }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`relative py-3 px-6 rounded-xl font-semibold text-base transition-all duration-200 whitespace-nowrap flex items-center gap-2.5 group ${activeTab === tab.id
                        ? isDark 
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105' 
                          : 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 scale-105'
                        : isDark 
                          ? 'text-white/70 hover:text-white hover:bg-white/10' 
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                        }`}
                    >
                      <tab.icon className={`w-5 h-5 transition-all ${activeTab === tab.id ? "scale-110" : "group-hover:scale-110"}`} />
                      <span className="font-medium">{tab.label}</span>
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 rounded-xl bg-blue-600/20 -z-10"
                          transition={{ type: "spring" as const, bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <main className={`${!isDashboard ? "container mx-auto px-4 sm:px-6 lg:px-8 py-8" : "py-0"}`}>
        <div className="max-w-5xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}