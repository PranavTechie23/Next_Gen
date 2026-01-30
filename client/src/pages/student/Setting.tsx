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
  Languages
} from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

export default function StudentSettings(props: any) {
  const isDashboard = props?.isDashboard || false;
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "Rahul Kumar",
    email: "rahul.kumar@example.com",
    phone: "+91-9876543210",
    location: "Mumbai, Maharashtra",
    college: "IIT Delhi",
    branch: "Computer Science",
    year: "Final Year",
    cgpa: "8.5",
    graduationYear: "2026",
    targetRole: "Senior Software Engineer",
    linkedIn: "linkedin.com/in/rahulkumar",
    github: "github.com/rahulkumar",
    portfolio: "rahulkumar.dev",
  });

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

  const handleSave = () => {
    setSaved(true);
    setIsEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleBack = () => {
    window.history.back();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="bg-[#0c0c14]/40 backdrop-blur-3xl border border-white/5 rounded-[2rem] p-8 overflow-hidden group hover:scale-[1.02] transition-all duration-300 relative">
                    <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-[0.05] rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform flex-shrink-0`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] font-black text-white/40 uppercase tracking-[0.25em] leading-none">{stat.label}</p>
                      <p className="text-4xl font-black text-white tracking-tight py-2 leading-none">{stat.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Profile Summary */}
            <div className="bg-[#0c0c14]/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-12 overflow-hidden shadow-2xl relative group">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full -mr-40 -mt-40 blur-[130px] pointer-events-none"></div>
              <div className="flex flex-col md:flex-row items-center md:items-start gap-12 relative z-10">
                <div className="relative group/avatar">
                  <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-4xl font-black shadow-[0_20px_50px_rgba(59,130,246,0.3)] group-hover/avatar:rotate-3 transition-transform duration-500">
                    {formData.fullName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 border-4 border-[#0c0c14] rounded-2xl shadow-xl flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-5xl font-black text-white tracking-tighter leading-none">{formData.fullName}</h3>
                    <p className="text-blue-400 font-black uppercase tracking-[0.4em] text-[12px] opacity-80">{formData.branch} • {formData.year}</p>
                  </div>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    {[
                      { label: formData.college, icon: Building2, color: "text-blue-400" },
                      { label: `GPA: ${formData.cgpa}`, icon: Award, color: "text-emerald-400" },
                      { label: formData.targetRole, icon: Target, color: "text-purple-400" }
                    ].map((chip, i) => (
                      <div key={i} className="flex items-center gap-3 bg-white/5 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 group/chip hover:bg-white/10 transition-all">
                        <chip.icon className={`w-5 h-5 ${chip.color} group-hover/chip:scale-110 transition-transform`} />
                        <span className="text-xs font-black text-white uppercase tracking-widest">{chip.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Recent Activity */}
              <div className="bg-[#0c0c14]/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 overflow-hidden relative">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-sm font-black text-white/40 uppercase tracking-[0.2em]">Recent Activity</h3>
                </div>
                <div className="space-y-4">
                  {[
                    { title: "Completed Python Assessment", sub: "Scored 85% • 2 hours ago", icon: Award, color: "text-blue-400", bg: "bg-blue-400/10" },
                    { title: "Profile Updated", sub: "Added new skills • 1 day ago", icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-400/10" },
                    { title: "Applied to Google", sub: "Software Engineer role • 2 days ago", icon: Target, color: "text-purple-400", bg: "bg-purple-400/10" }
                  ].map((activity, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 hover:bg-white/5 rounded-[1.5rem] transition-colors group">
                      <div className={`w-12 h-12 ${activity.bg} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        <activity.icon className={`w-6 h-6 ${activity.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-white uppercase tracking-tight">{activity.title}</p>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-60 mt-1">{activity.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Skills */}
              <div className="bg-[#0c0c14]/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 overflow-hidden relative">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-sm font-black text-white/40 uppercase tracking-[0.2em]">Skill Architecture</h3>
                </div>
                <div className="space-y-6">
                  {skills.map((skill, idx) => (
                    <div key={idx} className="space-y-3">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-xs font-black text-white uppercase tracking-widest">{skill.name}</span>
                        <span className="text-xs font-black text-blue-400">{skill.level}%</span>
                      </div>
                      <div className="h-2.5 bg-white/5 rounded-full overflow-hidden p-0.5">
                        <div
                          className={`h-full ${skill.color} rounded-full shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-1000`}
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
            <div className="bg-[#0c0c14]/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 overflow-hidden shadow-2xl relative group">
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full -mr-20 -mt-20 blur-[100px] pointer-events-none"></div>
              <div className="flex flex-col md:flex-row items-center md:items-start gap-10 relative z-10">
                <div className="relative group/avatar">
                  <div className="w-40 h-40 rounded-[3rem] bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-5xl font-black shadow-2xl group-hover/avatar:rotate-3 transition-transform duration-500">
                    {formData.fullName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <button className="absolute -bottom-2 -right-2 w-12 h-12 bg-blue-600 border-4 border-[#0c0c14] rounded-2xl flex items-center justify-center text-white hover:bg-blue-500 transition-all shadow-xl group/cam">
                    <Camera className="w-5 h-5 group-hover/cam:scale-110 transition-transform" />
                  </button>
                </div>
                <div className="flex-1 text-center md:text-left space-y-6">
                  <div>
                    <h3 className="text-4xl font-black text-white tracking-tighter mb-2">{formData.fullName}</h3>
                    <p className="text-blue-400 font-black uppercase tracking-[0.3em] text-[11px] opacity-80">{formData.branch} • {formData.college}</p>
                  </div>
                  <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <span className="px-5 py-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      Account Active
                    </span>
                    <span className="px-5 py-2.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" />
                      Verified
                    </span>
                  </div>
                </div>
                <div className="flex gap-3">
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} className="h-14 px-8 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all shadow-xl shadow-blue-500/20">
                      <Settings className="w-4 h-4 mr-3" />
                      Configure
                    </Button>
                  ) : (
                    <div className="flex gap-3">
                      <Button onClick={handleSave} className="h-14 px-8 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all shadow-xl shadow-emerald-500/20">
                        <Save className="w-4 h-4 mr-3" />
                        Save Sync
                      </Button>
                      <Button onClick={() => setIsEditing(false)} variant="outline" className="h-14 px-8 border-white/10 hover:bg-white/5 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all">
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Input Sections */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Personal Info */}
              <div className="bg-[#0c0c14]/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-400" />
                  </div>
                  <h4 className="text-sm font-black text-white uppercase tracking-widest">Personal Matrix</h4>
                </div>

                <div className="space-y-6">
                  {[
                    { label: "Full Name", name: "fullName", icon: User },
                    { label: "Email Address", name: "email", icon: Mail },
                    { label: "Phone Connection", name: "phone", icon: Phone },
                    { label: "Geographic Location", name: "location", icon: MapPin }
                  ].map((field) => (
                    <div key={field.name} className="space-y-2">
                      <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">{field.label}</label>
                      <div className="relative">
                        <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input
                          type="text"
                          name={field.name}
                          value={(formData as any)[field.name]}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all disabled:opacity-40"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Academic Grid */}
              <div className="bg-[#0c0c14]/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-purple-400" />
                  </div>
                  <h4 className="text-sm font-black text-white uppercase tracking-widest">Academic Core</h4>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Institution</label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <input
                        type="text"
                        name="college"
                        value={formData.college}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all disabled:opacity-40"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Branch</label>
                      <select name="branch" value={formData.branch} onChange={handleChange} disabled={!isEditing}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all disabled:opacity-40 appearance-none">
                        <option className="bg-[#0c0c14]">Computer Science</option>
                        <option className="bg-[#0c0c14]">Electronics</option>
                        <option className="bg-[#0c0c14]">Information Technology</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Level</label>
                      <select name="year" value={formData.year} onChange={handleChange} disabled={!isEditing}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all disabled:opacity-40 appearance-none">
                        <option className="bg-[#0c0c14]">First Year</option>
                        <option className="bg-[#0c0c14]">Second Year</option>
                        <option className="bg-[#0c0c14]">Third Year</option>
                        <option className="bg-[#0c0c14]">Final Year</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Index (CGPA)</label>
                      <input type="text" name="cgpa" value={formData.cgpa} onChange={handleChange} disabled={!isEditing}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all disabled:opacity-40" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Cycle Year</label>
                      <input type="text" name="graduationYear" value={formData.graduationYear} onChange={handleChange} disabled={!isEditing}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all disabled:opacity-40" />
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
            <div className="bg-[#0c0c14]/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 relative overflow-hidden">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                  <Bell className="w-7 h-7 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-widest">Network Alerts</h3>
                  <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em]">Manage your synchronization preferences</p>
                </div>
              </div>

              <div className="grid gap-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <label key={key} className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/10 transition-all cursor-pointer group">
                    <div className="flex items-center gap-6">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${value ? 'bg-blue-500/20' : 'bg-white/5'}`}>
                        <Bell className={`w-5 h-5 ${value ? 'text-blue-400' : 'text-white/20'}`} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-tight group-hover:text-blue-400 transition-colors">
                          {key === 'emailNotifications' && 'Global Email Sync'}
                          {key === 'jobAlerts' && 'Career Opportunity Feeds'}
                          {key === 'assessmentReminders' && 'Milestone Alerts'}
                          {key === 'weeklyDigest' && 'Performance Analytics'}
                          {key === 'mentorMessages' && 'Expert Link Direct'}
                        </h4>
                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">
                          {key === 'emailNotifications' && 'Status updates routed to your primary terminal'}
                          {key === 'jobAlerts' && 'Real-time matching with high-priority vacancies'}
                          {key === 'assessmentReminders' && 'Critical path assessment countdowns'}
                          {key === 'weeklyDigest' && 'Full system telemetry report delivered weekly'}
                          {key === 'mentorMessages' && 'Encrypted communication from field leads'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleNotificationChange(key as NotificationKey)}
                      className={`relative w-16 h-8 rounded-full transition-all duration-500 ${value ? 'bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'bg-white/10'}`}
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
            <div className="bg-[#0c0c14]/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center">
                  <Lock className="w-7 h-7 text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-widest">Protocol Shield</h3>
                  <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em]">Security authorization & access control</p>
                </div>
              </div>

              <div className="grid gap-6">
                {[
                  { title: "Access Key Update", desc: "Reset your primary authentication string", icon: Lock, color: "text-blue-400", bg: "bg-blue-400/10" },
                  { title: "Dual Factor Sync", desc: "Biometric or multi-stage verification active", icon: ShieldCheck, color: "text-emerald-400", bg: "bg-emerald-400/10", active: true },
                  { title: "Access Telemetry", desc: "Review recent authorization attempts", icon: Activity, color: "text-purple-400", bg: "bg-purple-400/10" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-[2.5rem] group hover:bg-white/10 transition-all">
                    <div className="flex items-center gap-6">
                      <div className={`w-16 h-16 ${item.bg} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                        <item.icon className={`w-8 h-8 ${item.color}`} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-tight">{item.title}</h4>
                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">{item.desc}</p>
                        {item.active && (
                          <span className="inline-flex items-center gap-2 text-[9px] text-emerald-400 font-black uppercase tracking-widest mt-2 px-3 py-1 bg-emerald-400/5 rounded-full border border-emerald-400/10">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                            Secure
                          </span>
                        )}
                      </div>
                    </div>
                    <Button variant="outline" className="h-12 border-white/10 hover:bg-white/5 text-white rounded-xl font-black uppercase tracking-widest text-[10px] px-6">
                      Execute
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0c0c14]/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10">
              <h3 className="text-sm font-black text-white/40 uppercase tracking-[0.2em] mb-8 px-2">Active Terminals</h3>
              <div className="grid gap-4">
                {[
                  { name: "Chrome Matrix v124", loc: "Mumbai Sector 4 • ID: 103.**.**.45", icon: Globe, current: true },
                  { name: "Safari Neural Link", loc: "Delhi Sector 9 • ID: 192.**.**.12", icon: User }
                ].map((session, i) => (
                  <div key={i} className={`flex items-center justify-between p-6 rounded-[2rem] border transition-all ${session.current ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
                        <session.icon className={`w-5 h-5 ${session.current ? 'text-emerald-400' : 'text-white/40'}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h4 className="text-sm font-black text-white uppercase tracking-tight">{session.name}</h4>
                          {session.current && <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-emerald-500 text-white rounded-md">Master</span>}
                        </div>
                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">{session.loc}</p>
                      </div>
                    </div>
                    {!session.current && (
                      <Button variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-400/10 font-black uppercase tracking-widest text-[10px]">
                        Nullify
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
            <div className="bg-[#0c0c14]/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center">
                  <Database className="w-7 h-7 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-widest">Data Architecture</h3>
                  <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em]">Privacy filters & data encryption settings</p>
                </div>
              </div>

              <div className="grid gap-4">
                {[
                  { key: 'analyzeLearning', title: 'Neural Pattern Analysis', desc: 'Allow AI to optimize your learning trajectory', icon: Target },
                  { key: 'shareData', title: 'Research Contribution', desc: 'Sync anonymized metrics with educational core', icon: Database },
                  { key: 'recommendations', title: 'Predictive Matching', desc: 'Enable real-time career path projections', icon: Zap },
                  { key: 'profileVisibility', title: 'Cloaking Override', desc: 'Make your profile visible to Verified recruiters', icon: Eye }
                ].map((item) => (
                  <label key={item.key} className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/10 transition-all cursor-pointer group">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-orange-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-tight group-hover:text-orange-400 transition-colors">{item.title}</h4>
                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">{item.desc}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handlePrivacyChange(item.key as PrivacyKey)}
                      className={`relative w-16 h-8 rounded-full transition-all duration-500 ${(privacySettings as any)[item.key] ? 'bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.3)]' : 'bg-white/10'}`}
                    >
                      <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-500 ${(privacySettings as any)[item.key] ? 'translate-x-8' : 'translate-x-0'}`} />
                    </button>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-red-500/5 backdrop-blur-3xl border border-red-500/10 rounded-[3rem] p-10 overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full -mr-20 -mt-20 blur-[80px] group-hover:bg-red-500/20 transition-all"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                    <Trash2 className="w-6 h-6 text-red-500" />
                  </div>
                  <h3 className="text-sm font-black text-red-500 uppercase tracking-[0.2em]">Destruction Protocol</h3>
                </div>
                <p className="text-xs font-bold text-white/60 mb-8 max-w-xl uppercase tracking-widest leading-relaxed">Warning: Initiating account deletion will permanently purge all achievement records, verified certificates, and career analytics from the master grid. This operation is non-recoverable.</p>
                <Button variant="destructive" className="h-14 px-10 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-red-500/20">
                  Execute Deletion
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
    <div className={`${!isDashboard ? "min-h-screen bg-[#050509]" : "bg-transparent"} text-foreground font-sans selection:bg-blue-500/30 overflow-x-hidden`}>
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Header - Hide if dashboard */}
      {!isDashboard && (
        <>
          <header className="sticky top-0 z-50 bg-[#0c0c14]/80 backdrop-blur-2xl border-b border-white/5 shadow-2xl">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-20">
                <div className="flex items-center gap-6">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate("/student/dashboard")}
                    className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white hover:bg-white/10 transition-all group/back shadow-xl"
                  >
                    <ArrowLeft className="w-5 h-5 group-hover/back:-translate-x-1 transition-transform" />
                  </Button>
                  <div className="h-8 w-px bg-white/10"></div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 group hover:rotate-6 transition-transform">
                      <Settings className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-black text-white tracking-tighter leading-none">Settings</h1>
                      <p className="text-blue-400 text-xs font-black uppercase tracking-widest mt-2 opacity-90">Institution Profile & Preferences</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {saved && (
                    <div className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 px-4 py-2 rounded-2xl animate-in fade-in slide-in-from-top-4 border border-emerald-400/20 shadow-lg shadow-emerald-500/10">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="font-bold text-xs uppercase tracking-wider">Changes synchronized</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/10">
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg overflow-hidden group">
                      <span className="text-xs font-black text-white group-hover:scale-110 transition-transform">RK</span>
                    </div>
                    <div className="pr-2 hidden sm:block">
                      <p className="text-[10px] font-black text-white uppercase tracking-tight leading-none">{formData.fullName}</p>
                      <p className="text-[9px] text-muted-foreground opacity-60 mt-1 uppercase font-bold tracking-widest">Student</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="bg-[#0c0c14]/40 backdrop-blur-2xl border-b border-white/5 sticky top-20 z-40 shadow-xl">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex space-x-1 overflow-x-auto py-2 items-center no-scrollbar">
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
                    className={`py-4 px-8 rounded-2xl font-bold text-sm tracking-wide transition-all whitespace-nowrap flex items-center gap-3 group relative ${activeTab === tab.id
                      ? 'bg-white/10 text-blue-400 shadow-[0_10px_30px_rgba(59,130,246,0.1)] border border-white/10'
                      : 'text-muted-foreground opacity-60 hover:opacity-100 hover:bg-white/5'
                      }`}
                  >
                    <tab.icon className={`w-5 h-5 transition-colors ${activeTab === tab.id ? "text-blue-500" : "group-hover:text-white"}`} />
                    <span>{tab.label}</span>
                    {activeTab === tab.id && (
                      <div className="absolute -bottom-[1px] left-0 right-0 h-1 bg-blue-500 rounded-t-full shadow-[0_0_20px_rgba(59,130,246,1)]"></div>
                    )}
                  </button>
                ))}
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