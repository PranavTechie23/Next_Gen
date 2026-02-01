import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import {
  LogOut, Settings, Building2, TrendingUp, Users, FileText,
  DollarSign, Activity, AlertCircle, CheckCircle, Clock,
  Award, Target, Zap, ArrowUpRight, ArrowDownRight, Bell,
  Filter, Download, Search, MoreVertical, Calendar, Mail,
  Phone, MapPin, Eye, Edit, Trash2, Plus, RefreshCw,
  LayoutDashboard, ShieldCheck, Globe, HelpCircle, ChevronRight
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [, navigate] = useLocation();
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const collegeStats = [
    { label: "Active Colleges", value: "24", change: "+3", trend: "up", icon: Building2, color: "text-blue-500", bgColor: "bg-blue-500/10" },
    { label: "Total Students", value: "28,540", change: "+5%", trend: "up", icon: Users, color: "text-emerald-500", bgColor: "bg-emerald-500/10" },
    { label: "Platform Adoption", value: "89%", change: "+4%", trend: "up", icon: TrendingUp, color: "text-indigo-500", bgColor: "bg-indigo-500/10" },
    { label: "Avg Placement", value: "86%", change: "+2%", trend: "up", icon: Award, color: "text-amber-500", bgColor: "bg-amber-500/10" },
  ];

  const collegeList = [
    { id: 1, name: "IIT Delhi", students: 2400, placement: 94, status: "Active", plan: "Premium", revenue: "₹2.5L", lastActive: "2h ago", location: "New Delhi" },
    { id: 2, name: "NIT Bangalore", students: 2100, placement: 88, status: "Active", plan: "Premium", revenue: "₹2.2L", lastActive: "5h ago", location: "Bangalore" },
    { id: 3, name: "BITS Pilani", students: 1800, placement: 92, status: "Active", plan: "Premium", revenue: "₹1.9L", lastActive: "1d ago", location: "Pilani" },
    { id: 4, name: "VIT University", students: 3200, placement: 85, status: "Active", plan: "Premium", revenue: "₹3.2L", lastActive: "3h ago", location: "Vellore" },
  ];

  const usageMetrics = [
    { month: "Jan", colleges: 18, students: 22000, assessments: 15000, revenue: 18.5 },
    { month: "Feb", colleges: 20, students: 24500, assessments: 18000, revenue: 20.2 },
    { month: "Mar", colleges: 22, students: 26800, assessments: 20500, revenue: 22.8 },
    { month: "Apr", colleges: 24, students: 28540, assessments: 22000, revenue: 24.5 },
  ];

  const sidebarLinks = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "institutions", label: "Institutions", icon: Building2 },
    { id: "analytics", label: "Analytics", icon: Activity },
    { id: "security", label: "Security", icon: ShieldCheck },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const modelPerformance = [
    { metric: "Prediction Accuracy", value: 87, target: 90, status: "warning" },
    { metric: "User Adoption Rate", value: 89, target: 85, status: "success" },
    { metric: "Data Quality Score", value: 92, target: 95, status: "warning" },
    { metric: "Response Time", value: 95, target: 90, status: "success" },
  ];

  const systemHealth = [
    { component: "API Cluster", status: "Operational", uptime: "99.9%", load: "42%" },
    { component: "AI Processing", status: "Operational", uptime: "99.7%", load: "68%" },
    { component: "Database Pool", status: "Operational", uptime: "99.8%", load: "24%" },
    { component: "Storage Node", status: "Degraded", uptime: "98.5%", load: "89%" },
  ];

  const driftAnalysis = [
    { source: "NIT Bangalore", type: "Concept Drift", severity: "High", color: "text-rose-500", bgColor: "bg-rose-500/10" },
    { source: "IIT Delhi", type: "Schema Shift", severity: "Low", color: "text-sky-500", bgColor: "bg-sky-500/10" },
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0f1115] text-white' : 'bg-[#f8fafc] text-slate-900'} transition-colors duration-500 flex`}>
      {/* --- SIDEBAR --- */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 88 }}
        className={`fixed left-0 top-0 h-screen z-50 border-r border-border/40 backdrop-blur-xl ${isDark ? 'bg-black/20' : 'bg-white/40'} flex flex-col`}
      >
        <div className="p-6 flex items-center gap-4 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
            <Zap className="w-6 h-6 text-white" />
          </div>
          {isSidebarOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden whitespace-nowrap">
              <span className="font-black text-xl tracking-tight bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">NextGen</span>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Admin Nexus</p>
            </motion.div>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {sidebarLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all relative group ${activeTab === link.id
                  ? 'bg-blue-500/10 text-blue-500 shadow-sm'
                  : 'text-muted-foreground hover:bg-muted/50'
                }`}
            >
              <link.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeTab === link.id ? 'text-blue-500' : ''}`} />
              {isSidebarOpen && <span className="font-semibold text-sm">{link.label}</span>}
              {activeTab === link.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute left-0 w-1 h-6 bg-blue-500 rounded-full"
                />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border/40">
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center gap-4 p-3 rounded-2xl text-muted-foreground hover:bg-muted/50 transition-all font-semibold text-sm"
          >
            <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${isSidebarOpen ? 'rotate-180' : ''}`} />
            {isSidebarOpen && <span>Collapse</span>}
          </button>
        </div>
      </motion.aside>

      {/* --- MAIN CONTENT --- */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-[280px]' : 'ml-[88px]'} p-8`}>
        {/* Header */}
        <header className="flex items-center justify-between mb-12">
          <div className="space-y-1">
            <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
              Good Morning, <span className="text-blue-500">Admin</span>
              <span className="text-2xl animate-bounce">👋</span>
            </h2>
            <p className="text-muted-foreground font-medium">System health is <span className="text-emerald-500 font-bold">Optimal</span> based on 4 metrics.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-blue-500" />
              <input
                type="text"
                placeholder="Universal Search..."
                className={`pl-10 pr-4 py-2 rounded-2xl text-sm border focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all ${isDark ? 'bg-black/40 border-white/10' : 'bg-white border-slate-200'
                  } w-64`}
              />
            </div>

            <div className="flex items-center gap-2 p-1 rounded-2xl border border-border/40 backdrop-blur-md bg-muted/20">
              <ThemeToggle />
              <div className="w-[1px] h-4 bg-border/40 mx-1" />
              <Button variant="ghost" size="icon" className="rounded-xl relative">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-background" />
              </Button>
            </div>

            <div className="flex items-center gap-3 ml-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 border-2 border-white/10 shadow-xl overflow-hidden">
                <img src="https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff" alt="Avatar" />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Body */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-10"
        >
          {/* Key Indicators */}
          <section className="grid md:grid-cols-4 gap-6">
            {collegeStats.map((stat, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                <Card className={`group relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 border-none ${isDark ? 'bg-white/[0.03]' : 'bg-white'
                  } backdrop-blur-xl shadow-lg border border-white/10`}>
                  <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity ${stat.bgColor.replace('10', '40')}`} />
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <div className={`${stat.bgColor} p-3 rounded-2xl transition-transform group-hover:scale-110`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`text-xs font-black uppercase tracking-widest ${stat.color} bg-white/5 px-2 py-1 rounded-lg`}>
                        {stat.change}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <p className="text-3xl font-black tracking-tighter">{stat.value}</p>
                      <p className="text-sm font-bold text-muted-foreground">{stat.label}</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">Real-time Data</span>
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="w-5 h-5 rounded-full border-2 border-background bg-slate-500" />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </section>

          {/* Main Analytics Row */}
          <div className="grid lg:grid-cols-3 gap-8">
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <Card className={`h-[520px] border-none shadow-2xl relative overflow-hidden backdrop-blur-xl ${isDark ? 'bg-white/[0.03]' : 'bg-white'}`}>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-black tracking-tight uppercase">Operational Velocity</CardTitle>
                    <CardDescription className="font-semibold text-muted-foreground">Institutions vs Student Load Multiplier</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {['week', 'month', 'year'].map(p => (
                      <Button
                        key={p}
                        variant={selectedPeriod === p ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedPeriod(p)}
                        className="rounded-xl border-none shadow-sm capitalize font-bold h-9 px-4"
                      >
                        {p}
                      </Button>
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={usageMetrics} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="glowBlue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="8 8" vertical={false} stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                      <XAxis
                        dataKey="month"
                        stroke="rgba(156,163,175,0.5)"
                        fontSize={12}
                        fontWeight={700}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="rgba(156,163,175,0.5)"
                        fontSize={12}
                        fontWeight={700}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          background: isDark ? 'rgba(15,17,21,0.9)' : 'rgba(255,255,255,0.9)',
                          backdropBlur: '12px',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '16px',
                          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="students"
                        stroke="#3b82f6"
                        strokeWidth={4}
                        fill="url(#glowBlue)"
                        animationDuration={2000}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-6">
              <Card className={`border-none shadow-xl ${isDark ? 'bg-white/[0.03]' : 'bg-white'} backdrop-blur-xl overflow-hidden relative`}>
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Target className="w-32 h-32" />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg font-black uppercase flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    Security Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-2xl font-black">99.8%</p>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">Threat Isolation Rate</p>
                    </div>
                    <div className="h-12 w-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span>Firewall Integrity</span>
                      <span className="text-emerald-500">Secure</span>
                    </div>
                    <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} className="h-full bg-emerald-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={`border-none shadow-xl ${isDark ? 'bg-white/[0.03]' : 'bg-white'} backdrop-blur-xl`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center justify-between">
                    Node Distribution
                    <Globe className="w-4 h-4" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center py-6">
                  <div className="relative w-40 h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'AP-South', value: 45, color: '#3b82f6' },
                            { name: 'US-East', value: 30, color: '#8b5cf6' },
                            { name: 'EU-West', value: 25, color: '#f43f5e' },
                          ]}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          stroke="none"
                        >
                          <Cell fill="#3b82f6" />
                          <Cell fill="#8b5cf6" />
                          <Cell fill="#f43f5e" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-black">12</span>
                      <span className="text-[8px] uppercase font-black text-muted-foreground">Active Nodes</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Bento Style Middle Section */}
          <div className="grid lg:grid-cols-4 gap-6">
            {/* System Health Monitor */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <Card className={`border-none shadow-xl h-full ${isDark ? 'bg-white/[0.03]' : 'bg-white'} backdrop-blur-xl`}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-black uppercase">Infrastructure Pulse</CardTitle>
                    <CardDescription className="text-xs font-bold">Live feedback from global clusters</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" className="group">
                    <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {systemHealth.map((sys, i) => (
                    <div key={i} className={`p-4 rounded-2xl flex items-center justify-between border border-white/5 transition-all hover:bg-white/5 group ${isDark ? 'bg-black/20' : 'bg-slate-50'}`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full animate-pulse ${sys.status === 'Operational' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <div>
                          <p className="font-bold text-sm tracking-tight">{sys.component}</p>
                          <p className="text-[10px] text-muted-foreground uppercase font-black">{sys.uptime} Up-time</p>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-xs font-black text-blue-500">{sys.load} Load</p>
                        <div className="h-1 w-20 bg-muted/40 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: sys.load }} className="h-full bg-blue-500" />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* AI Model Insight */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <Card className={`border-none bg-gradient-to-br from-indigo-600 to-blue-700 text-white shadow-2xl h-full overflow-hidden relative group`}>
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
                <CardHeader>
                  <CardTitle className="text-lg font-black uppercase flex items-center gap-2">
                    <Zap className="w-5 h-5 fill-current" />
                    Intelligence Engine
                  </CardTitle>
                  <CardDescription className="text-white/70 font-bold">Model V4.2 Real-time Metrics</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  {modelPerformance.map((m, i) => (
                    <div key={i} className="p-4 rounded-3xl bg-white/10 border border-white/10 flex flex-col items-center justify-center text-center space-y-1">
                      <p className="text-[10px] font-black uppercase opacity-60 leading-tight">{m.metric}</p>
                      <p className="text-3xl font-black">{m.value}%</p>
                      <div className="h-1 w-full mt-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${m.value}%` }} className="h-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                      </div>
                    </div>
                  ))}
                </CardContent>
                <div className="p-6 bg-black/20 mt-2 flex items-center justify-between border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-[10px] font-black uppercase opacity-80">Sync Status: Optimal</span>
                  </div>
                  <Button variant="link" size="sm" className="text-white/80 font-black text-[10px] uppercase p-0 h-auto">View Detailed Logs <ChevronRight className="w-3 h-3 ml-1" /></Button>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Table Section */}
          <motion.div variants={itemVariants}>
            <Card className={`border-none shadow-xl overflow-hidden ${isDark ? 'bg-white/[0.03]' : 'bg-white'} backdrop-blur-xl`}>
              <CardHeader className="flex flex-row items-center justify-between bg-muted/10">
                <div>
                  <CardTitle className="text-xl font-black uppercase tracking-tight">Institution Management</CardTitle>
                  <CardDescription className="font-bold">Active institutional nodes on the global grid</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="rounded-xl font-bold px-5 h-10 border-none shadow-sm bg-muted/30">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="default" size="sm" className="rounded-xl font-bold px-5 h-10 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20">
                    <Plus className="w-4 h-4 mr-2" />
                    Deploy Node
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5 uppercase text-[10px] font-black tracking-widest text-muted-foreground opacity-60">
                      <th className="px-8 py-5 text-left">Organization Info</th>
                      <th className="px-8 py-5 text-left">Metrics</th>
                      <th className="px-8 py-5 text-left">Plan Layer</th>
                      <th className="px-8 py-5 text-left">Status Feed</th>
                      <th className="px-8 py-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {collegeList.map((c, i) => (
                      <motion.tr
                        whileHover={{ backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)' }}
                        key={i}
                        className="border-b border-white/5 group transition-colors"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-500 group-hover:scale-110 transition-transform">
                              <Building2 className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="font-black text-sm">{c.name}</p>
                              <p className="text-xs font-bold text-muted-foreground">{c.location}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="space-y-1">
                            <p className="text-sm font-black">{c.students.toLocaleString()}</p>
                            <p className="text-[10px] font-bold text-blue-500 uppercase">{c.placement}% Success</p>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${c.plan === 'Premium' ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20' : 'bg-slate-500/10 text-muted-foreground border border-white/5'
                            }`}>
                            {c.plan}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-bold uppercase tracking-tight text-emerald-500">{c.status}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl hover:bg-blue-500/10 hover:text-blue-500"><Eye className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl hover:bg-emerald-500/10 hover:text-emerald-500"><Edit className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl hover:bg-rose-500/10 hover:text-rose-500"><Trash2 className="w-4 h-4" /></Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
      <div className="fixed bottom-8 right-8 z-[100]">
        <Button className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-2xl shadow-blue-500/40 p-0 flex items-center justify-center group overflow-hidden">
          <HelpCircle className="w-6 h-6 text-white group-hover:scale-125 transition-transform" />
          <motion.div initial={{ width: 0 }} whileHover={{ width: 140 }} className="absolute right-full mr-2 bg-slate-900 text-white text-xs font-black uppercase px-4 py-3 rounded-2xl whitespace-nowrap overflow-hidden hidden md:block">
            Immediate Support
          </motion.div>
        </Button>
      </div>
    </div>
  );
}