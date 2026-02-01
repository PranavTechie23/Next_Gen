import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { LogOut, Settings, Building2, TrendingUp, Users, FileText, DollarSign, Activity, AlertCircle, CheckCircle, Clock, Award, Target, Zap, ArrowUpRight, ArrowDownRight, Bell, Filter, Download, Search, MoreVertical, Calendar, Mail, Phone, MapPin, Eye, Edit, Trash2, Plus, RefreshCw } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";
import { useState } from "react";

export default function AdminDashboard() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [, navigate] = useLocation();
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [activeTab, setActiveTab] = useState("overview");

  const collegeStats = [
    { label: "Active Colleges", value: "24", change: "+3", trend: "up", icon: Building2, color: "text-blue-600", bgColor: "bg-blue-50" },
    { label: "Total Students", value: "28,540", change: "+5%", trend: "up", icon: Users, color: "text-green-600", bgColor: "bg-green-50" },
    { label: "Platform Adoption", value: "89%", change: "+4%", trend: "up", icon: TrendingUp, color: "text-purple-600", bgColor: "bg-purple-50" },
    { label: "Avg Placement Rate", value: "86%", change: "+2%", trend: "up", icon: Award, color: "text-orange-600", bgColor: "bg-orange-50" },
  ];

  const additionalMetrics = [
    { label: "Active Assessments", value: "1,245", change: "+12%", trend: "up", icon: FileText },
    { label: "System Uptime", value: "99.8%", change: "0%", trend: "neutral", icon: Activity },
    { label: "Support Tickets", value: "23", change: "-18%", trend: "down", icon: AlertCircle },
    { label: "Revenue This Month", value: "₹24.5L", change: "+15%", trend: "up", icon: DollarSign },
  ];

  const usageMetrics = [
    { month: "Jan", colleges: 18, students: 22000, assessments: 15000, revenue: 18.5 },
    { month: "Feb", colleges: 20, students: 24500, assessments: 18000, revenue: 20.2 },
    { month: "Mar", colleges: 22, students: 26800, assessments: 20500, revenue: 22.8 },
    { month: "Apr", colleges: 24, students: 28540, assessments: 22000, revenue: 24.5 },
  ];

  const collegeList = [
    { id: 1, name: "IIT Delhi", students: 2400, placement: 94, status: "Active", plan: "Premium", revenue: "₹2.5L", lastActive: "2h ago", email: "admin@iitd.ac.in", location: "New Delhi" },
    { id: 2, name: "NIT Bangalore", students: 2100, placement: 88, status: "Active", plan: "Premium", revenue: "₹2.2L", lastActive: "5h ago", email: "admin@nitb.ac.in", location: "Bangalore" },
    { id: 3, name: "BITS Pilani", students: 1800, placement: 92, status: "Active", plan: "Premium", revenue: "₹1.9L", lastActive: "1d ago", email: "admin@bits.ac.in", location: "Pilani" },
    { id: 4, name: "VIT University", students: 3200, placement: 85, status: "Active", plan: "Premium", revenue: "₹3.2L", lastActive: "3h ago", email: "admin@vit.ac.in", location: "Vellore" },
    { id: 5, name: "Delhi University", students: 1500, placement: 78, status: "Active", plan: "Standard", revenue: "₹1.2L", lastActive: "6h ago", email: "admin@du.ac.in", location: "Delhi" },
    { id: 6, name: "Anna University", students: 2800, placement: 82, status: "Active", plan: "Premium", revenue: "₹2.8L", lastActive: "4h ago", email: "admin@annauniv.edu", location: "Chennai" },
    { id: 7, name: "Pune University", students: 1900, placement: 80, status: "Active", plan: "Standard", revenue: "₹1.5L", lastActive: "8h ago", email: "admin@unipune.ac.in", location: "Pune" },
    { id: 8, name: "Jadavpur University", students: 1600, placement: 86, status: "Pending", plan: "Trial", revenue: "₹0", lastActive: "2d ago", email: "admin@jadavpur.edu", location: "Kolkata" },
  ];

  const modelPerformance = [
    { metric: "Prediction Accuracy", value: 87, target: 90, status: "warning" },
    { metric: "User Adoption Rate", value: 89, target: 85, status: "success" },
    { metric: "Data Quality Score", value: 92, target: 95, status: "warning" },
    { metric: "System Uptime", value: 99.8, target: 99.5, status: "success" },
    { metric: "Response Time", value: 95, target: 90, status: "success" },
    { metric: "User Satisfaction", value: 88, target: 85, status: "success" },
  ];

  const recentActivities = [
    { id: 1, type: "new_college", title: "New College Onboarded", description: "Jadavpur University joined the platform", time: "2 hours ago", icon: Building2, color: "text-blue-600" },
    { id: 2, type: "assessment", title: "High Assessment Activity", description: "IIT Delhi completed 450 assessments", time: "5 hours ago", icon: FileText, color: "text-green-600" },
    { id: 3, type: "payment", title: "Payment Received", description: "VIT University - ₹3.2L subscription renewed", time: "1 day ago", icon: DollarSign, color: "text-purple-600" },
    { id: 4, type: "support", title: "Support Ticket Resolved", description: "Issue #234 from BITS Pilani resolved", time: "1 day ago", icon: CheckCircle, color: "text-orange-600" },
    { id: 5, type: "milestone", title: "Milestone Achieved", description: "Crossed 25,000 active students", time: "2 days ago", icon: Award, color: "text-pink-600" },
  ];

  const subscriptionBreakdown = [
    { name: "Premium", value: 18, color: "#3b82f6" },
    { name: "Standard", value: 5, color: "#10b981" },
    { name: "Trial", value: 1, color: "#f59e0b" },
  ];

  const placementTrends = [
    { range: "90-100%", count: 6, color: "#10b981" },
    { range: "80-89%", count: 10, color: "#3b82f6" },
    { range: "70-79%", count: 6, color: "#f59e0b" },
    { range: "Below 70%", count: 2, color: "#ef4444" },
  ];

  const studentEngagement = [
    { month: "Jan", activeUsers: 18500, completedAssessments: 12000, avgSessionTime: 45 },
    { month: "Feb", activeUsers: 20200, completedAssessments: 14500, avgSessionTime: 48 },
    { month: "Mar", activeUsers: 22100, completedAssessments: 16800, avgSessionTime: 52 },
    { month: "Apr", activeUsers: 24300, completedAssessments: 18900, avgSessionTime: 55 },
  ];

  const topPerformingColleges = [
    { name: "IIT Delhi", score: 94, students: 2400, growth: "+12%" },
    { name: "BITS Pilani", score: 92, students: 1800, growth: "+8%" },
    { name: "NIT Bangalore", score: 88, students: 2100, growth: "+15%" },
    { name: "Jadavpur University", score: 86, students: 1600, growth: "+10%" },
    { name: "VIT University", score: 85, students: 3200, growth: "+6%" },
  ];

  const pendingActions = [
    { id: 1, action: "Review new college application", college: "IIM Ahmedabad", priority: "high", dueDate: "Today" },
    { id: 2, action: "Approve placement data update", college: "NIT Trichy", priority: "medium", dueDate: "Tomorrow" },
    { id: 3, action: "Respond to feature request", college: "BITS Pilani", priority: "low", dueDate: "This week" },
    { id: 4, action: "Schedule demo call", college: "IIT Madras", priority: "high", dueDate: "Today" },
  ];

  const systemHealth = [
    { component: "API Server", status: "Operational", uptime: "99.9%", lastCheck: "2 min ago" },
    { component: "Database", status: "Operational", uptime: "99.8%", lastCheck: "2 min ago" },
    { component: "AI Model", status: "Operational", uptime: "99.7%", lastCheck: "5 min ago" },
    { component: "File Storage", status: "Degraded", uptime: "98.5%", lastCheck: "1 min ago" },
    { component: "Email Service", status: "Operational", uptime: "99.9%", lastCheck: "3 min ago" },
  ];

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm transition-colors duration-300">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 flex items-center justify-center">
              <img src={isDark ? "/NG/NextGen_dark.png" : "/NG/NextGen_light.png"} alt="NextGen Logo" className="w-full h-full object-contain scale-125" />
            </div>
            <div>
              <span className="font-bold text-lg bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">NextGen</span>
              <p className="text-xs text-muted-foreground">Admin Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" size="sm" className="relative hover:bg-muted">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
            <div className="h-6 w-px bg-border"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold text-primary">AD</span>
              </div>
              <span className="text-sm font-medium text-foreground">Admin User</span>
            </div>
            <Button variant="ghost" size="sm" className="hover:bg-muted" onClick={() => navigate("/admin/Setting")}>
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="hover:bg-muted" onClick={() => navigate("/")}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Enhanced Welcome Section */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-2">
                Platform Administration
              </h1>
              <p className="text-muted-foreground text-lg">
                System overview, college management, and performance analytics
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-primary to-blue-600 shadow-md shadow-primary/20">
                <Plus className="w-4 h-4 mr-2" />
                Add College
              </Button>
            </div>
          </div>

          {/* Quick Stats Bar */}
          <div className="mt-6 flex items-center gap-4 p-4 bg-primary/5 border border-primary/10 rounded-xl">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-foreground">All Systems Operational</span>
            </div>
            <div className="h-4 w-px bg-border"></div>
            <span className="text-sm text-muted-foreground">Last updated: Just now</span>
            <div className="h-4 w-px bg-border"></div>
            <span className="text-sm text-muted-foreground">Next billing cycle: 7 days</span>
          </div>
        </div>

        {/* Enhanced Key Metrics with Icons */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {collegeStats.map((stat, idx) => (
            <Card key={idx} className="border-border bg-card hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardContent className="pt-6 relative">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="flex items-center gap-1">
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="w-4 h-4 text-green-600" />
                    ) : stat.trend === "down" ? (
                      <ArrowDownRight className="w-4 h-4 text-red-600" />
                    ) : null}
                    <span className={`text-sm font-semibold ${stat.trend === "up" ? "text-green-600" : stat.trend === "down" ? "text-red-600" : "text-muted-foreground"}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Metrics Row */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {additionalMetrics.map((metric, idx) => (
            <div key={idx} className="p-4 bg-card border border-border rounded-xl hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <metric.icon className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">{metric.label}</p>
                    <p className="text-xl font-bold text-foreground">{metric.value}</p>
                  </div>
                </div>
                <span className={`text-xs font-semibold ${metric.trend === "up" ? "text-green-600" : metric.trend === "down" ? "text-red-600" : "text-muted-foreground"}`}>
                  {metric.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Enhanced Usage Metrics Chart */}
            <Card className="border-border bg-card shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Platform Growth Analytics</CardTitle>
                    <CardDescription>Comprehensive usage trends and metrics</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {["week", "month", "quarter"].map((period) => (
                      <Button
                        key={period}
                        variant={selectedPeriod === period ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedPeriod(period)}
                        className="capitalize"
                      >
                        {period}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={usageMetrics}>
                    <defs>
                      <linearGradient id="colorColleges" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px',
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                      }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="colleges" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorColleges)" name="Active Colleges" />
                    <Area type="monotone" dataKey="students" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorStudents)" name="Total Students" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Student Engagement Chart */}
            <Card className="border-border bg-card shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Student Engagement Metrics</CardTitle>
                <CardDescription>Active users and assessment completion rates</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={studentEngagement}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px'
                      }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Legend />
                    <Bar dataKey="activeUsers" fill="#8b5cf6" radius={[8, 8, 0, 0]} name="Active Users" />
                    <Bar dataKey="completedAssessments" fill="#f59e0b" radius={[8, 8, 0, 0]} name="Completed Assessments" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Enhanced Model Performance */}
            <Card className="border-border bg-card shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  AI Model Performance Dashboard
                </CardTitle>
                <CardDescription>Real-time system accuracy and adoption metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {modelPerformance.map((perf, idx) => (
                    <div key={idx} className="p-4 bg-gradient-to-br from-background to-background/50 border border-border rounded-xl hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-semibold text-foreground">{perf.metric}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-blue-600">{perf.value}%</span>
                          {perf.status === "success" ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-orange-600" />
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="text-muted-foreground/70">Target: {perf.target}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${perf.status === "success" ? "bg-gradient-to-r from-green-500 to-green-600" : "bg-gradient-to-r from-orange-500 to-orange-600"
                              }`}
                            style={{ width: `${perf.value}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Subscription Breakdown */}
            <Card className="border-border bg-card shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Subscription Distribution</CardTitle>
                <CardDescription>Active plans breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={subscriptionBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {subscriptionBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {subscriptionBreakdown.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm text-muted-foreground">{item.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-foreground">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card className="border-border bg-card shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  Recent Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0`}>
                        <activity.icon className={`w-5 h-5 ${activity.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{activity.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
                        <p className="text-xs text-muted-foreground/60 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pending Actions */}
            <Card className="border-border bg-card shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-600" />
                  Pending Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingActions.map((action) => (
                    <div key={action.id} className="p-3 border border-border rounded-lg hover:border-primary/50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-sm font-medium text-foreground">{action.action}</p>
                        <span className={`text-xs px-2 py-1 rounded font-semibold ${action.priority === "high" ? "bg-red-100 text-red-700" :
                          action.priority === "medium" ? "bg-orange-100 text-orange-700" :
                            "bg-blue-100 text-blue-700"
                          }`}>
                          {action.priority}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{action.college}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground/70">Due: {action.dueDate}</span>
                        <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Top Performing Colleges */}
        <Card className="mb-8 border-border bg-card shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  Top Performing Colleges
                </CardTitle>
                <CardDescription>Ranked by placement success and student outcomes</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformingColleges.map((college, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 bg-gradient-to-r from-muted/30 to-transparent rounded-xl border border-border hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/30">
                    <span className="text-white font-bold text-lg">#{idx + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{college.name}</p>
                    <p className="text-sm text-muted-foreground">{college.students.toLocaleString()} students</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end mb-1">
                      <Target className="w-4 h-4 text-primary" />
                      <span className="text-2xl font-bold text-foreground">{college.score}%</span>
                    </div>
                    <span className="text-xs font-semibold text-green-600">{college.growth} growth</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Active Colleges Table */}
        <Card className="mb-8 border-border bg-card shadow-lg overflow-hidden">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-xl">College Management Dashboard</CardTitle>
                <CardDescription>Comprehensive view of all onboarded institutions</CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search colleges..."
                    className="w-full sm:w-64 pl-10 pr-4 py-2 border border-border bg-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left py-4 px-4 font-semibold text-sm text-foreground">College Details</th>
                    <th className="text-left py-4 px-4 font-semibold text-sm text-foreground">Students</th>
                    <th className="text-left py-4 px-4 font-semibold text-sm text-foreground">Placement</th>
                    <th className="text-left py-4 px-4 font-semibold text-sm text-foreground">Plan</th>
                    <th className="text-left py-4 px-4 font-semibold text-sm text-foreground">Revenue</th>
                    <th className="text-left py-4 px-4 font-semibold text-sm text-foreground">Status</th>
                    <th className="text-right py-4 px-4 font-semibold text-sm text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {collegeList.map((college) => (
                    <tr key={college.id} className="border-b border-border hover:bg-muted/50 transition-colors group">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Building2 className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{college.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <MapPin className="w-3 h-3 text-muted-foreground/70" />
                              <p className="text-xs text-muted-foreground">{college.location}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium text-foreground">{college.students.toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Active: {college.lastActive}</p>
                      </td>
                      <td className="py-4 px-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden w-20">
                              <div
                                className={`h-full rounded-full ${college.placement >= 90 ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" :
                                  college.placement >= 80 ? "bg-primary" :
                                    college.placement >= 70 ? "bg-orange-500" :
                                      "bg-red-500"
                                  }`}
                                style={{ width: `${college.placement}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-bold text-foreground">{college.placement}%</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${college.plan === "Premium" ? "bg-purple-100 text-purple-700" :
                          college.plan === "Standard" ? "bg-blue-100 text-blue-700" :
                            "bg-slate-100 text-slate-700"
                          }`}>
                          {college.plan}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="font-semibold text-foreground">{college.revenue}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${college.status === "Active" ? "bg-green-100 text-green-700" :
                          college.status === "Pending" ? "bg-orange-100 text-orange-700" :
                            "bg-slate-100 text-slate-700"
                          }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${college.status === "Active" ? "bg-green-500" :
                            college.status === "Pending" ? "bg-orange-500" :
                              "bg-slate-500"
                            }`}></div>
                          {college.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border px-4">
              <p className="text-sm text-muted-foreground font-medium">Showing 1-8 of 24 colleges</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="hover:bg-muted">Previous</Button>
                <Button variant="outline" size="sm" className="bg-primary/10 text-primary border-primary/20 font-bold">1</Button>
                <Button variant="outline" size="sm" className="hover:bg-muted font-medium">2</Button>
                <Button variant="outline" size="sm" className="hover:bg-muted font-medium">3</Button>
                <Button variant="outline" size="sm" className="hover:bg-muted">Next</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Health & Revenue Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* System Health Monitor */}
          <Card className="border-border bg-card shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Activity className="w-5 h-5 text-green-600" />
                    System Health Monitor
                  </CardTitle>
                  <CardDescription>Real-time infrastructure status</CardDescription>
                </div>
                <Button variant="ghost" size="sm">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {systemHealth.map((component, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${component.status === "Operational" ? "bg-green-500 animate-pulse" :
                        component.status === "Degraded" ? "bg-orange-500 animate-pulse" :
                          "bg-red-500 animate-pulse"
                        }`}></div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">{component.component}</p>
                        <p className="text-xs text-muted-foreground">Checked {component.lastCheck}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${component.status === "Operational" ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400" :
                        component.status === "Degraded" ? "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400" :
                          "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                        }`}>
                        {component.status}
                      </span>
                      <p className="text-xs text-muted-foreground/70 mt-1.5 font-medium">{component.uptime} uptime</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Revenue & Billing */}
          <Card className="border-border bg-card shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                Revenue & Billing Overview
              </CardTitle>
              <CardDescription>Financial metrics and subscription status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl">
                  <p className="text-sm text-green-600 dark:text-green-400 mb-2 font-medium">Monthly Recurring Revenue</p>
                  <p className="text-4xl font-bold text-green-700 dark:text-green-500">₹24.5L</p>
                  <div className="flex items-center gap-2 mt-2">
                    <ArrowUpRight className="w-4 h-4 text-green-600" />
                    <p className="text-sm text-green-600 font-bold">+15% from last month</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/30 rounded-xl border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <p className="text-xs text-muted-foreground font-semibold">Active Subscriptions</p>
                    </div>
                    <p className="text-2xl font-bold text-foreground">24</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">All premium tier</p>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-xl border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <p className="text-xs text-muted-foreground font-semibold">Churn Rate</p>
                    </div>
                    <p className="text-2xl font-bold text-foreground">0%</p>
                    <p className="text-xs text-muted-foreground/70 mt-1 font-medium">This quarter</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Revenue Target</span>
                    <span className="font-bold text-foreground">₹30L</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]" style={{ width: "82%" }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground/80 font-medium">82% of monthly target achieved</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Placement Trends */}
        <Card className="border-border bg-card shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Placement Rate Distribution
            </CardTitle>
            <CardDescription>College performance across different placement brackets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              {placementTrends.map((trend, idx) => (
                <div key={idx} className="p-4 border-2 border-border bg-background rounded-xl hover:border-primary/50 transition-colors group/trend">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center group-hover/trend:scale-110 transition-transform" style={{ backgroundColor: `${trend.color}15` }}>
                      <Award className="w-5 h-5 transition-transform" style={{ color: trend.color }} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">{trend.range}</p>
                    </div>
                  </div>
                  <p className="text-4xl font-black text-foreground mb-1">{trend.count}</p>
                  <p className="text-xs text-muted-foreground/80 font-bold">colleges</p>
                  <div className="mt-4 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${(trend.count / 24) * 100}%`, backgroundColor: trend.color, boxShadow: `0 0 8px ${trend.color}60` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}