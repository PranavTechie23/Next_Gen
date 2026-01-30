import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, MapPin, Building, Calendar, Edit, Save, X, Shield, Bell, Lock, Users, GraduationCap, Briefcase, TrendingUp, Activity, BarChart3, Settings, Eye, Clock, CheckCircle, AlertCircle, Camera, Award, Target, Zap, Database, Download, Globe, Smartphone, Laptop, Key, UserCheck, RefreshCw, LogOut, ArrowLeft, ChevronRight, Trash2, Plus, ArrowRight, Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLocation } from 'wouter';

export default function AdminSettings() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [, navigate] = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [adminData, setAdminData] = useState({
    name: 'Admin User',
    email: 'admin@campuscareer.edu',
    phone: '+91 98765 43210',
    role: 'System Administrator',
    department: 'Platform Management',
    institution: 'Campus Career HQ',
    location: 'Mumbai, Maharashtra',
    joinDate: 'Jan 2022',
    avatar: ''
  });

  const [notifications, setNotifications] = useState({
    newCollege: true,
    systemAlerts: true,
    emailDigest: true,
    paymentAlerts: true,
    supportTickets: true,
    weeklyReports: false
  });



  const recentActivities = [
    { id: 1, type: 'login', action: 'Logged in from Mumbai', device: 'Chrome on Windows', time: '2 hours ago', status: 'success' },
    { id: 2, type: 'college', action: 'Added new college', detail: 'IIT Madras', time: '5 hours ago', status: 'info' },
    { id: 3, type: 'settings', action: 'Updated notification settings', detail: 'Email preferences', time: '1 day ago', status: 'info' },
    { id: 4, type: 'security', action: 'Password changed', detail: 'Security update', time: '2 days ago', status: 'warning' },
    { id: 5, type: 'system', action: 'System maintenance completed', detail: 'Database optimization', time: '3 days ago', status: 'success' }
  ];

  const activeSessions = [
    { id: 1, device: 'Chrome on Windows', location: 'Mumbai, India', ip: '192.168.1.1', lastActive: 'Active now', current: true },
    { id: 2, device: 'Safari on iPhone', location: 'Delhi, India', ip: '192.168.1.2', lastActive: '2 hours ago', current: false },
    { id: 3, device: 'Edge on Windows', location: 'Bangalore, India', ip: '192.168.1.3', lastActive: '1 day ago', current: false }
  ];

  const securityLogs = [
    { id: 1, event: 'Successful login', location: 'Mumbai, India', time: '2 hours ago', status: 'success' },
    { id: 2, event: 'Password changed', location: 'Mumbai, India', time: '2 days ago', status: 'info' },
    { id: 3, event: 'Failed login attempt', location: 'Unknown', time: '5 days ago', status: 'warning' },
    { id: 4, event: '2FA enabled', location: 'Mumbai, India', time: '1 week ago', status: 'success' }
  ];

  const apiKeys = [
    { id: 1, name: 'Production API Key', key: 'pk_live_**********************', created: 'Jan 15, 2026', lastUsed: '2 hours ago', status: 'active' },
    { id: 2, name: 'Development API Key', key: 'pk_test_**********************', created: 'Dec 20, 2025', lastUsed: '1 day ago', status: 'active' },
    { id: 3, name: 'Legacy API Key', key: 'pk_old_***********************', created: 'Nov 10, 2025', lastUsed: 'Never', status: 'inactive' }
  ];

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            </div>

            {/* Quick Actions */}
            <Card className="border-border bg-card shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-600" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Frequently accessed settings and tools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button className="p-4 bg-primary/5 border border-primary/10 rounded-xl hover:shadow-lg transition-all text-left group">
                    <Shield className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="font-semibold text-foreground mb-1">Security Settings</h3>
                    <p className="text-xs text-muted-foreground">Manage passwords & 2FA</p>
                  </button>
                  <button className="p-4 bg-purple-500/5 border border-purple-500/10 rounded-xl hover:shadow-lg transition-all text-left group">
                    <Bell className="w-8 h-8 text-purple-600 mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="font-semibold text-foreground mb-1">Notifications</h3>
                    <p className="text-xs text-muted-foreground">Configure alerts</p>
                  </button>
                  <button className="p-4 bg-green-500/5 border border-green-500/10 rounded-xl hover:shadow-lg transition-all text-left group">
                    <Database className="w-8 h-8 text-green-600 mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="font-semibold text-foreground mb-1">Backup & Export</h3>
                    <p className="text-xs text-muted-foreground">Data management</p>
                  </button>
                  <button className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-xl hover:shadow-lg transition-all text-left group">
                    <Key className="w-8 h-8 text-orange-600 mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="font-semibold text-foreground mb-1">API Keys</h3>
                    <p className="text-xs text-muted-foreground">Manage integrations</p>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities & Active Sessions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activities */}
              <Card className="border-border bg-card shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-600" />
                        Recent Activities
                      </CardTitle>
                      <CardDescription>Your latest actions on the platform</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm">View All</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors border border-transparent hover:border-border">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${activity.status === 'success' ? 'bg-green-500' :
                          activity.status === 'warning' ? 'bg-orange-500' :
                            'bg-primary'
                          }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">{activity.detail}</p>
                          <p className="text-xs text-muted-foreground/60 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Active Sessions */}
              <Card className="border-slate-200 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Laptop className="w-5 h-5 text-purple-600" />
                        Active Sessions
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">Devices currently signed in</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="hover:bg-muted">
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activeSessions.map((session) => (
                      <div key={session.id} className="flex items-start justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors border border-border">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Smartphone className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{session.device}</p>
                            <p className="text-xs text-muted-foreground">{session.location}</p>
                            <p className="text-xs text-muted-foreground/60 mt-1">
                              {session.current ? (
                                <span className="inline-flex items-center gap-1 text-green-500 font-medium">
                                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                  {session.lastActive}
                                </span>
                              ) : session.lastActive}
                            </p>
                          </div>
                        </div>
                        {!session.current && (
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6">
            <Card className="border-slate-200 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Profile Information</CardTitle>
                    <CardDescription>Manage your personal details and preferences</CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} className="bg-gradient-to-r from-primary to-blue-600 shadow-md shadow-primary/20">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={handleSave} className="bg-gradient-to-r from-green-600 to-green-700">
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button onClick={handleCancel} variant="outline">
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {/* Avatar Section */}
                <div className="flex items-center gap-6 mb-8 p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-border">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg shadow-primary/30">
                      {adminData.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    {isEditing && (
                      <button className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors shadow-lg">
                        <Camera className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">{adminData.name}</h3>
                    <p className="text-muted-foreground mb-2">{adminData.role}</p>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-sm font-semibold inline-flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        Active
                      </span>
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold inline-flex items-center gap-1.5">
                        <Shield className="w-3 h-3" />
                        Verified
                      </span>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-muted-foreground mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground/60 w-5 h-5" />
                      <input
                        type="text"
                        value={adminData.name}
                        onChange={(e) => setAdminData({ ...adminData, name: e.target.value })}
                        disabled={!isEditing}
                        className="w-full pl-11 pr-4 py-3 border border-border bg-background text-foreground rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-muted/50 disabled:text-muted-foreground transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-muted-foreground mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground/60 w-5 h-5" />
                      <input
                        type="email"
                        value={adminData.email}
                        onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
                        disabled={!isEditing}
                        className="w-full pl-11 pr-4 py-3 border border-border bg-background text-foreground rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-muted/50 disabled:text-muted-foreground transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-muted-foreground mb-2">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground/60 w-5 h-5" />
                      <input
                        type="tel"
                        value={adminData.phone}
                        onChange={(e) => setAdminData({ ...adminData, phone: e.target.value })}
                        disabled={!isEditing}
                        className="w-full pl-11 pr-4 py-3 border border-border bg-background text-foreground rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-muted/50 disabled:text-muted-foreground transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-muted-foreground mb-2">Role</label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground/60 w-5 h-5" />
                      <input
                        type="text"
                        value={adminData.role}
                        disabled
                        className="w-full pl-11 pr-4 py-3 border border-border bg-muted/30 text-muted-foreground rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-muted-foreground mb-2">Department</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground/60 w-5 h-5" />
                      <input
                        type="text"
                        value={adminData.department}
                        onChange={(e) => setAdminData({ ...adminData, department: e.target.value })}
                        disabled={!isEditing}
                        className="w-full pl-11 pr-4 py-3 border border-border bg-background text-foreground rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-muted/50 disabled:text-muted-foreground transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-muted-foreground mb-2">Institution</label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground/60 w-5 h-5" />
                      <input
                        type="text"
                        value={adminData.institution}
                        onChange={(e) => setAdminData({ ...adminData, institution: e.target.value })}
                        disabled={!isEditing}
                        className="w-full pl-11 pr-4 py-3 border border-border bg-background text-foreground rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-muted/50 disabled:text-muted-foreground transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-muted-foreground mb-2">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground/60 w-5 h-5" />
                      <input
                        type="text"
                        value={adminData.location}
                        onChange={(e) => setAdminData({ ...adminData, location: e.target.value })}
                        disabled={!isEditing}
                        className="w-full pl-11 pr-4 py-3 border border-border bg-background text-foreground rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-muted/50 disabled:text-muted-foreground transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-muted-foreground mb-2">Member Since</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground/60 w-5 h-5" />
                      <input
                        type="text"
                        value={adminData.joinDate}
                        disabled
                        className="w-full pl-11 pr-4 py-3 border border-border bg-muted/30 text-muted-foreground rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <Card className="border-slate-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Bell className="w-6 h-6 text-blue-600" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Manage how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 hover:bg-muted/50 rounded-lg border border-border transition-colors">
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {key === 'newCollege' && 'Get notified when new colleges join the platform'}
                          {key === 'systemAlerts' && 'Receive alerts about system status and updates'}
                          {key === 'emailDigest' && 'Daily summary of platform activities'}
                          {key === 'paymentAlerts' && 'Notifications for payment and billing'}
                          {key === 'supportTickets' && 'New support ticket notifications'}
                          {key === 'weeklyReports' && 'Weekly performance and analytics reports'}
                        </p>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, [key]: !value })}
                        className={`relative w-14 h-7 rounded-full transition-colors ${value ? 'bg-primary' : 'bg-muted'
                          }`}
                      >
                        <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${value ? 'transform translate-x-7' : ''
                          }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            {/* Security Settings */}
            <Card className="border-border bg-card shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Lock className="w-6 h-6 text-red-600" />
                  Security Settings
                </CardTitle>
                <CardDescription>Manage your account security and authentication</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <button className="w-full text-left p-4 hover:bg-muted/50 rounded-lg flex items-center justify-between border border-border transition-all hover:border-primary/50 group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Key className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Change Password</h3>
                        <p className="text-sm text-muted-foreground">Update your account password</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground/50" />
                  </button>

                  <button className="w-full text-left p-4 hover:bg-muted/50 rounded-lg flex items-center justify-between border border-border transition-all hover:border-primary/50 group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Shield className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Two-Factor Authentication</h3>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-bold">Enabled</span>
                  </button>

                  <button className="w-full text-left p-4 hover:bg-muted/50 rounded-lg flex items-center justify-between border border-border transition-all hover:border-primary/50 group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Laptop className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Active Sessions</h3>
                        <p className="text-sm text-muted-foreground">Manage your logged in devices</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground/50" />
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Security Logs */}
            <Card className="border-border bg-card shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Eye className="w-5 h-5 text-blue-600" />
                  Security Activity Log
                </CardTitle>
                <CardDescription>Recent security events and login history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {securityLogs.map((log) => (
                    <div key={log.id} className="flex items-start justify-between p-3 hover:bg-muted/50 rounded-lg border border-border transition-colors">
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${log.status === 'success' ? 'bg-green-500' :
                          log.status === 'warning' ? 'bg-orange-500' : 'bg-primary'
                          }`} />
                        <div>
                          <p className="text-sm font-semibold text-foreground">{log.event}</p>
                          <p className="text-xs text-muted-foreground">{log.location}</p>
                          <p className="text-xs text-muted-foreground/60 mt-1">{log.time}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-md font-bold ${log.status === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' :
                        log.status === 'warning' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400' :
                          'bg-primary/10 text-primary'
                        }`}>
                        {log.status}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* API Keys */}
            <Card className="border-border bg-card shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Key className="w-5 h-5 text-orange-600" />
                      API Keys
                    </CardTitle>
                    <CardDescription>Manage your API keys for integrations</CardDescription>
                  </div>
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    New Key
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {apiKeys.map((key) => (
                    <div key={key.id} className="flex items-center justify-between p-4 hover:bg-muted/50 rounded-lg border border-border transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-foreground">{key.name}</h3>
                          <span className={`text-xs px-2.5 py-1 rounded-md font-bold ${key.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-muted text-muted-foreground'
                            }`}>
                            {key.status}
                          </span>
                        </div>
                        <p className="text-sm text-primary font-mono mb-1 bg-primary/5 p-2 rounded border border-primary/10 inline-block">{key.key}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2 font-medium">
                          <span>Created: {key.created}</span>
                          <span>Last used: {key.lastUsed}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="hover:bg-muted">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'data':
        return (
          <div className="space-y-6">
            {/* Data Management */}
            <Card className="border-border bg-card shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Database className="w-6 h-6 text-green-600" />
                  Data Management
                </CardTitle>
                <CardDescription>Export, backup, and manage your platform data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <button className="w-full text-left p-4 hover:bg-muted/50 rounded-lg flex items-center justify-between border border-border transition-all hover:border-primary/50 group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Download className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Export All Data</h3>
                        <p className="text-sm text-muted-foreground">Download a complete copy of your platform data</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground/50" />
                  </button>

                  <button className="w-full text-left p-4 hover:bg-muted/50 rounded-lg flex items-center justify-between border border-border transition-all hover:border-primary/50 group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Database className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Backup Database</h3>
                        <p className="text-sm text-muted-foreground">Create a backup of your database</p>
                        <p className="text-xs text-green-600 mt-1 font-medium">Last backup: 2 hours ago</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground/50" />
                  </button>

                  <button className="w-full text-left p-4 hover:bg-muted/50 rounded-lg flex items-center justify-between border border-border transition-all hover:border-primary/50 group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <BarChart3 className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Analytics Export</h3>
                        <p className="text-sm text-muted-foreground">Export analytics and reports</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground/50" />
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Storage Usage */}
            <Card className="border-border bg-card shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-600" />
                  Storage Usage
                </CardTitle>
                <CardDescription>Monitor your storage consumption</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-muted-foreground">Total Storage</span>
                      <span className="text-sm font-black text-foreground">45.2 GB / 100 GB</span>
                    </div>
                    <div className="h-4 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.4)]" style={{ width: '45%' }}></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
                      <p className="text-sm text-primary mb-1 font-semibold uppercase tracking-wider">Database</p>
                      <p className="text-3xl font-black text-foreground">18.5 GB</p>
                      <p className="text-xs text-primary mt-1 font-bold">41% of total</p>
                    </div>
                    <div className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl">
                      <p className="text-sm text-purple-600 mb-1 font-semibold uppercase tracking-wider">Files</p>
                      <p className="text-3xl font-black text-foreground">22.8 GB</p>
                      <p className="text-xs text-purple-600 mt-1 font-bold">50% of total</p>
                    </div>
                    <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-xl">
                      <p className="text-sm text-green-600 mb-1 font-semibold uppercase tracking-wider">Backups</p>
                      <p className="text-3xl font-black text-foreground">3.9 GB</p>
                      <p className="text-xs text-green-600 mt-1 font-bold">9% of total</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-500/50 bg-red-500/5 shadow-xl shadow-red-500/10">
              <CardHeader>
                <CardTitle className="text-2xl text-red-600 flex items-center gap-2 font-black">
                  <AlertCircle className="w-6 h-6" />
                  Danger Zone
                </CardTitle>
                <CardDescription className="text-red-500 font-semibold italic">Irreversible actions - proceed with extreme caution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-background border border-red-500/20 rounded-xl">
                    <h3 className="font-bold text-foreground mb-2">Clear All Cache</h3>
                    <p className="text-sm text-muted-foreground mb-4">Remove all cached data to free up space</p>
                    <Button variant="outline" className="border-red-500/50 text-red-600 hover:bg-red-500 hover:text-white transition-all font-bold">
                      Clear Cache
                    </Button>
                  </div>
                  <div className="p-4 bg-background border border-red-500/20 rounded-xl">
                    <h3 className="font-bold text-foreground mb-2">Reset All Settings</h3>
                    <p className="text-sm text-muted-foreground mb-4">Restore all settings to default values</p>
                    <Button variant="outline" className="border-red-500/50 text-red-600 hover:bg-red-500 hover:text-white transition-all font-bold">
                      Reset Settings
                    </Button>
                  </div>
                  <div className="p-4 bg-background border border-red-500/40 rounded-xl ring-2 ring-red-500/10">
                    <h3 className="font-bold text-red-600 mb-2">Delete Account</h3>
                    <p className="text-sm text-red-500 mb-4 font-medium">Permanently delete your account and all associated data. This action cannot be undone.</p>
                    <Button className="bg-red-600 hover:bg-red-700 text-white font-black shadow-lg shadow-red-600/30">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => window.history.back()} className="hover:bg-muted">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="h-6 w-px bg-border"></div>
            <div className="w-14 h-14 flex items-center justify-center">
              <img src={isDark ? "/images/NextGen_dark.png" : "/images/NextGen_light.jpg"} alt="NextGen Logo" className="w-full h-full object-contain scale-125" />
            </div>
            <div>
              <span className="font-bold text-lg bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Settings</span>
              <p className="text-xs text-muted-foreground">Admin Configuration</p>
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
            <Button variant="ghost" size="sm" className="hover:bg-muted" onClick={() => navigate("/")}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-card border-b border-border sticky top-16 z-40 shadow-sm transition-colors duration-300">
        <div className="container">
          <div className="flex space-x-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-6 border-b-2 font-bold transition-all whitespace-nowrap ${activeTab === 'overview'
                ? 'border-primary text-primary bg-primary/5'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                <span>Overview</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-6 border-b-2 font-bold transition-all whitespace-nowrap ${activeTab === 'profile'
                ? 'border-primary text-primary bg-primary/5'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Profile</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`py-4 px-6 border-b-2 font-bold transition-all whitespace-nowrap ${activeTab === 'notifications'
                ? 'border-primary text-primary bg-primary/5'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
            >
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                <span>Notifications</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`py-4 px-6 border-b-2 font-bold transition-all whitespace-nowrap ${activeTab === 'security'
                ? 'border-primary text-primary bg-primary/5'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
            >
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span>Security</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('data')}
              className={`py-4 px-6 border-b-2 font-bold transition-all whitespace-nowrap ${activeTab === 'data'
                ? 'border-primary text-primary bg-primary/5'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
            >
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                <span>Data & Privacy</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container py-8">
        {renderContent()}
      </main>
    </div>
  );
}