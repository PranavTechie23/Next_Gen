import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText, Download, Share2, Calendar, Filter, Search, Plus,
  TrendingUp, TrendingDown, BarChart3, PieChart, Activity, Users,
  Building, DollarSign, Award, Clock, CheckCircle, XCircle,
  AlertTriangle, Eye, Edit, Trash2, Copy, ExternalLink, Send,
  Mail, Printer, Save, RefreshCw, MoreVertical, ChevronDown,
  ChevronRight, Star, Target, Zap, Database, Globe, Smartphone,
  Laptop, Tablet, Monitor, Package, ShoppingCart, CreditCard,
  Briefcase, GraduationCap, BookOpen, MessageSquare, Phone,
  MapPin, Settings, Archive, Folder, FolderOpen, File,
  FileCheck, FilePlus, FileMinus, Upload, Hash, Percent,
  ArrowUpRight, ArrowDownRight, Maximize2, Minimize2, Grid,
  List, Layers, X, Info, AlertCircle, Sparkles, Crown,
  Flame, Droplet, Wind, Sun, Moon, CloudRain, Umbrella
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface Report {
  id: string;
  title: string;
  description: string;
  category: 'Financial' | 'Academic' | 'Operational' | 'Custom';
  type: 'PDF' | 'Excel' | 'CSV' | 'JSON';
  status: 'Ready' | 'Processing' | 'Scheduled' | 'Failed';
  createdAt: string;
  generatedBy: string;
  size: string;
  downloads: number;
  scheduled?: string;
  tags: string[];
  icon: React.ReactNode;
  color: string;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  color: string;
  popularity: number;
  estimatedTime: string;
}

interface QuickStat {
  label: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

// ============================================================================
// SAMPLE DATA
// ============================================================================

const generateReports = (): Report[] => [
  {
    id: '1',
    title: 'Q4 Financial Summary',
    description: 'Complete financial overview for Q4 2025 including revenue, expenses, and projections',
    category: 'Financial',
    type: 'PDF',
    status: 'Ready',
    createdAt: '2026-02-03 14:30',
    generatedBy: 'Admin User',
    size: '2.4 MB',
    downloads: 45,
    tags: ['Finance', 'Quarterly', 'Summary'],
    icon: <DollarSign className="w-5 h-5" />,
    color: 'from-emerald-500 to-teal-500'
  },
  {
    id: '2',
    title: 'Student Performance Report',
    description: 'Detailed analysis of student performance across all departments and years',
    category: 'Academic',
    type: 'Excel',
    status: 'Ready',
    createdAt: '2026-02-03 10:15',
    generatedBy: 'System',
    size: '5.8 MB',
    downloads: 128,
    tags: ['Students', 'Performance', 'Academic'],
    icon: <GraduationCap className="w-5 h-5" />,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: '3',
    title: 'Placement Statistics 2025',
    description: 'Comprehensive placement data with company-wise breakdown and salary analysis',
    category: 'Academic',
    type: 'PDF',
    status: 'Processing',
    createdAt: '2026-02-04 09:00',
    generatedBy: 'Placement Cell',
    size: '3.2 MB',
    downloads: 89,
    tags: ['Placement', 'Statistics', 'Companies'],
    icon: <Briefcase className="w-5 h-5" />,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: '4',
    title: 'Institution Growth Report',
    description: 'Year-over-year growth analysis of all partner institutions',
    category: 'Operational',
    type: 'PDF',
    status: 'Ready',
    createdAt: '2026-02-02 16:45',
    generatedBy: 'Analytics Team',
    size: '4.1 MB',
    downloads: 67,
    tags: ['Institutions', 'Growth', 'Analysis'],
    icon: <Building className="w-5 h-5" />,
    color: 'from-amber-500 to-orange-500'
  },
  {
    id: '5',
    title: 'System Health Report',
    description: 'Technical infrastructure performance, uptime, and system metrics',
    category: 'Operational',
    type: 'JSON',
    status: 'Ready',
    createdAt: '2026-02-04 08:00',
    generatedBy: 'DevOps',
    size: '156 KB',
    downloads: 23,
    tags: ['System', 'Health', 'Infrastructure'],
    icon: <Activity className="w-5 h-5" />,
    color: 'from-indigo-500 to-violet-500'
  },
  {
    id: '6',
    title: 'Revenue Analysis Jan 2026',
    description: 'Monthly revenue breakdown by plan type and institution',
    category: 'Financial',
    type: 'Excel',
    status: 'Scheduled',
    createdAt: '2026-02-05 00:00',
    generatedBy: 'Scheduled Task',
    size: '0 MB',
    downloads: 0,
    scheduled: '2026-02-05 00:00',
    tags: ['Revenue', 'Monthly', 'Breakdown'],
    icon: <BarChart3 className="w-5 h-5" />,
    color: 'from-cyan-500 to-blue-500'
  },
  {
    id: '7',
    title: 'Course Completion Rates',
    description: 'Semester-wise course completion and dropout analysis',
    category: 'Academic',
    type: 'PDF',
    status: 'Ready',
    createdAt: '2026-02-01 11:20',
    generatedBy: 'Academic Head',
    size: '1.8 MB',
    downloads: 156,
    tags: ['Courses', 'Completion', 'Dropout'],
    icon: <BookOpen className="w-5 h-5" />,
    color: 'from-rose-500 to-red-500'
  },
  {
    id: '8',
    title: 'Custom Dashboard Export',
    description: 'User-generated custom report with selected metrics',
    category: 'Custom',
    type: 'CSV',
    status: 'Failed',
    createdAt: '2026-02-03 18:30',
    generatedBy: 'John Doe',
    size: '0 MB',
    downloads: 0,
    tags: ['Custom', 'Export', 'Metrics'],
    icon: <FileText className="w-5 h-5" />,
    color: 'from-gray-500 to-gray-600'
  },
  {
    id: '9',
    title: 'User Engagement Report',
    description: 'Platform usage statistics and user engagement metrics',
    category: 'Operational',
    type: 'PDF',
    status: 'Ready',
    createdAt: '2026-02-03 13:15',
    generatedBy: 'Product Team',
    size: '2.9 MB',
    downloads: 94,
    tags: ['Engagement', 'Users', 'Analytics'],
    icon: <Users className="w-5 h-5" />,
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: '10',
    title: 'Department Performance',
    description: 'Comparative analysis of all academic departments',
    category: 'Academic',
    type: 'Excel',
    status: 'Ready',
    createdAt: '2026-01-31 15:45',
    generatedBy: 'Dean Office',
    size: '6.4 MB',
    downloads: 203,
    tags: ['Departments', 'Performance', 'Comparison'],
    icon: <Target className="w-5 h-5" />,
    color: 'from-violet-500 to-purple-500'
  },
];

const reportTemplates: ReportTemplate[] = [
  {
    id: 't1',
    name: 'Financial Overview',
    description: 'Revenue, expenses, and profit analysis',
    category: 'Financial',
    icon: <DollarSign className="w-6 h-6" />,
    color: 'from-emerald-500 to-teal-500',
    popularity: 95,
    estimatedTime: '2-3 min'
  },
  {
    id: 't2',
    name: 'Student Analytics',
    description: 'Enrollment, performance, and demographics',
    category: 'Academic',
    icon: <Users className="w-6 h-6" />,
    color: 'from-blue-500 to-cyan-500',
    popularity: 88,
    estimatedTime: '3-5 min'
  },
  {
    id: 't3',
    name: 'Placement Report',
    description: 'Company-wise placement and salary data',
    category: 'Academic',
    icon: <Briefcase className="w-6 h-6" />,
    color: 'from-purple-500 to-pink-500',
    popularity: 92,
    estimatedTime: '2-4 min'
  },
  {
    id: 't4',
    name: 'Institution Growth',
    description: 'Growth metrics and trends analysis',
    category: 'Operational',
    icon: <TrendingUp className="w-6 h-6" />,
    color: 'from-amber-500 to-orange-500',
    popularity: 76,
    estimatedTime: '4-6 min'
  },
  {
    id: 't5',
    name: 'System Health',
    description: 'Infrastructure and performance metrics',
    category: 'Operational',
    icon: <Activity className="w-6 h-6" />,
    color: 'from-indigo-500 to-violet-500',
    popularity: 64,
    estimatedTime: '1-2 min'
  },
  {
    id: 't6',
    name: 'Custom Report',
    description: 'Build your own report with selected data',
    category: 'Custom',
    icon: <Sparkles className="w-6 h-6" />,
    color: 'from-pink-500 to-rose-500',
    popularity: 71,
    estimatedTime: '5-10 min'
  },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ReportsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // STATE
  const [reports, setReports] = useState<Report[]>(generateReports());
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'Financial' | 'Academic' | 'Operational' | 'Custom'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'Ready' | 'Processing' | 'Scheduled' | 'Failed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'downloads'>('date');
  const [selectedReports, setSelectedReports] = useState<Set<string>>(new Set());
  const [showNewReportModal, setShowNewReportModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // COMPUTED
  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      const matchesCategory = selectedCategory === 'all' || report.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || report.status === selectedStatus;
      const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesStatus && matchesSearch;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.title.localeCompare(b.title);
        case 'downloads': return b.downloads - a.downloads;
        default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [reports, selectedCategory, selectedStatus, searchQuery, sortBy]);

  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

  const stats: QuickStat[] = [
    {
      label: 'Total Reports',
      value: reports.length,
      change: 12.5,
      icon: <FileText className="w-5 h-5" />,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      label: 'Generated Today',
      value: reports.filter(r => r.createdAt.includes('2026-02-04')).length,
      change: 8.3,
      icon: <Zap className="w-5 h-5" />,
      color: 'from-emerald-500 to-teal-500'
    },
    {
      label: 'Total Downloads',
      value: reports.reduce((sum, r) => sum + r.downloads, 0),
      change: 23.7,
      icon: <Download className="w-5 h-5" />,
      color: 'from-purple-500 to-pink-500'
    },
    {
      label: 'Scheduled',
      value: reports.filter(r => r.status === 'Scheduled').length,
      change: -5.2,
      icon: <Clock className="w-5 h-5" />,
      color: 'from-amber-500 to-orange-500'
    },
  ];

  // HANDLERS
  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedReports);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedReports(newSelection);
  };

  const getStatusIcon = (status: Report['status']) => {
    switch (status) {
      case 'Ready': return <CheckCircle className="w-4 h-4" />;
      case 'Processing': return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'Scheduled': return <Clock className="w-4 h-4" />;
      case 'Failed': return <XCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'Ready': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30';
      case 'Processing': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30';
      case 'Scheduled': return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30';
      case 'Failed': return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30';
    }
  };

  const getTypeIcon = (type: Report['type']) => {
    switch (type) {
      case 'PDF': return '📄';
      case 'Excel': return '📊';
      case 'CSV': return '📋';
      case 'JSON': return '{ }';
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-[#0a0c14]' : 'bg-[#f8fafc]'} ${isDark ? 'text-white' : 'text-slate-900'} p-4 lg:p-8`}>
      {/* Animated Background (dark mode only) */}
      <div className={`fixed inset-0 overflow-hidden pointer-events-none ${isDark ? 'block' : 'hidden'}`}>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: '12s', animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/3 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: '15s', animationDelay: '5s' }} />
      </div>

      <div className="relative max-w-[1800px] mx-auto space-y-6">
        {/* ========== HEADER ========== */}
        <div className="flex items-start justify-between">
          <div>
            <h1
              className={`text-4xl font-bold mb-2 ${isDark 
                ? 'bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent' 
                : 'text-slate-900'}`}
              style={{ fontFamily: "'Manrope', sans-serif", letterSpacing: '-0.03em' }}
            >
              Reports & Analytics
            </h1>
            <p className={`${isDark ? 'text-gray-400' : 'text-slate-500'} flex items-center gap-2`}>
              <FileText className="w-4 h-4" />
              Generate, manage, and download comprehensive reports
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowScheduleModal(true)}
              className="px-4 py-2.5 rounded-xl transition-all border flex items-center gap-2 bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 dark:bg-white/5 dark:border-white/10 dark:text-white dark:hover:bg-white/10"
            >
              <Clock className="w-4 h-4" />
              Schedule
            </button>
            <button className="px-4 py-2.5 rounded-xl transition-all border flex items-center gap-2 bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 dark:bg-white/5 dark:border-white/10 dark:text-white dark:hover:bg-white/10">
              <Upload className="w-4 h-4" />
              Import
            </button>
            <button className="px-4 py-2.5 rounded-xl transition-all border flex items-center gap-2 bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 dark:bg-white/5 dark:border-white/10 dark:text-white dark:hover:bg-white/10">
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button
              onClick={() => setShowNewReportModal(true)}
              className="px-6 py-2.5 rounded-xl transition-all shadow-lg flex items-center gap-2 font-semibold bg-blue-600 text-white hover:bg-blue-700 dark:bg-gradient-to-r dark:from-blue-500 dark:to-cyan-500 dark:hover:from-blue-600 dark:hover:to-cyan-600 dark:shadow-blue-500/20"
            >
              <Plus className="w-5 h-5" />
              New Report
            </button>
          </div>
        </div>

        {/* ========== OVERVIEW WAVE (fills empty space) ========== */}
        <div className={`overflow-hidden rounded-3xl border transition-all duration-500 ${isDark
          ? 'bg-gradient-to-br from-amber-400/15 via-blue-500/10 to-transparent border-amber-400/30 shadow-[0_18px_45px_rgba(0,0,0,0.6)]'
          : 'bg-gradient-to-br from-amber-400/10 via-blue-500/5 to-white border-amber-200 shadow-xl'
          }`}>

          <div className="px-8 pt-6 pb-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-amber-500/80 mb-2">Realtime Overview</p>
              <h2 className={`text-2xl font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Reporting activity across your campus
              </h2>
              <p className={`text-sm max-w-xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Monitor how institutions, departments, and placement cells are generating reports in the last 30 days.
              </p>
              <div className="mt-4 flex flex-wrap gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_0_4px_rgba(251,191,36,0.25)]" />
                  <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Live generation trend</span>
                </div>
                <div className={`flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                  18.4% more reports vs last week
                </div>
              </div>
            </div>

            <div className="relative w-full lg:w-[420px] h-32">
              <svg
                viewBox="0 0 400 120"
                className="absolute inset-0 w-full h-full text-amber-400/80 drop-shadow-[0_0_25px_rgba(250,204,21,0.5)]"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="reportWave" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="rgba(250,204,21,0.6)" />
                    <stop offset="100%" stopColor="rgba(250,204,21,0)" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,80 C60,20 120,40 180,70 C240,100 300,60 360,50 C380,48 390,48 400,50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M0,80 C60,20 120,40 180,70 C240,100 300,60 360,50 C380,48 390,48 400,50 L400,120 L0,120 Z"
                  fill="url(#reportWave)"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* ========== QUICK STATS ========== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`rounded-2xl p-6 border shadow-sm hover:shadow-md transition-all group ${
                isDark 
                  ? 'bg-gradient-to-br from-white/5 to-white/[0.02] border-white/10 hover:border-white/20' 
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                  {stat.icon}
                </div>
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${stat.change >= 0
                  ? isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
                  : isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-600'
                  }`}>
                  {stat.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(stat.change)}%
                </div>

              </div>
              <p className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{stat.value}</p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* ========== FILTERS & SEARCH ========== */}
        <div className={`rounded-2xl p-6 border shadow-sm ${isDark 
          ? 'bg-gradient-to-br from-white/5 to-white/[0.02] border-white/10' 
          : 'bg-white border-slate-200'}`}>
          <div className="flex flex-wrap gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-slate-400'}`} />
                <input
                  type="text"
                  placeholder="Search reports by name, description, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all focus:outline-none focus:border-blue-500/50 ${
                    isDark 
                      ? 'bg-white/5 border-white/10 text-white placeholder-gray-500' 
                      : 'bg-slate-100 border-slate-200 text-slate-900 placeholder-slate-500'
                  }`}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${
                      isDark 
                        ? 'text-gray-400 hover:text-white' 
                        : 'text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter */}
            <div className={`flex gap-2 border rounded-xl p-1 ${
              isDark 
                ? 'bg-white/5 border-white/10' 
                : 'bg-slate-100 border-slate-200'
            }`}>
              {['all', 'Financial', 'Academic', 'Operational', 'Custom'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat as any)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    selectedCategory === cat
                      ? isDark 
                        ? 'bg-blue-500/20 text-blue-400' 
                        : 'bg-slate-900 text-white'
                      : isDark
                        ? 'text-gray-400 hover:text-white'
                        : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className={`px-4 py-3 rounded-xl border cursor-pointer focus:outline-none focus:border-blue-500/50 ${
                isDark 
                  ? 'bg-white/5 border-white/10 text-white' 
                  : 'bg-slate-100 border-slate-200 text-slate-900'
              }`}
            >
              <option value="all">All Status</option>
              <option value="Ready">Ready</option>
              <option value="Processing">Processing</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Failed">Failed</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className={`px-4 py-3 rounded-xl border cursor-pointer focus:outline-none focus:border-blue-500/50 ${
                isDark 
                  ? 'bg-white/5 border-white/10 text-white' 
                  : 'bg-slate-100 border-slate-200 text-slate-900'
              }`}
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="downloads">Sort by Downloads</option>
            </select>

            {/* View Mode */}
            <div className={`flex gap-2 border rounded-xl p-1 ${
              isDark 
                ? 'bg-white/5 border-white/10' 
                : 'bg-slate-100 border-slate-200'
            }`}>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? isDark 
                      ? 'bg-blue-500/20 text-blue-400' 
                      : 'bg-slate-900 text-white'
                    : isDark
                      ? 'text-gray-400 hover:text-white'
                      : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? isDark 
                      ? 'bg-blue-500/20 text-blue-400' 
                      : 'bg-slate-900 text-white'
                    : isDark
                      ? 'text-gray-400 hover:text-white'
                      : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            <button className={`px-4 py-3 rounded-xl transition-all border flex items-center gap-2 ${
              isDark 
                ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' 
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}>
              <Filter className="w-4 h-4" />
              More
            </button>
          </div>
        </div>

        {/* ========== REPORT TEMPLATES ========== */}
        <div className={`rounded-2xl p-6 border shadow-sm ${
          isDark 
            ? 'bg-gradient-to-br from-white/5 to-white/[0.02] border-white/10' 
            : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={`text-xl font-bold mb-1 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <Sparkles className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
                Quick Generate Templates
              </h2>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Start with pre-built report templates</p>
            </div>
            <button className={`text-sm transition-colors flex items-center gap-1 ${
              isDark 
                ? 'text-blue-400 hover:text-blue-300' 
                : 'text-blue-600 hover:text-blue-700'
            }`}>
              View All
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {reportTemplates.map((template) => (
              <div
                key={template.id}
                className="relative group cursor-pointer transition-transform duration-200 hover:-translate-y-1"
              >
                <div className={`rounded-xl p-5 border transition-all ${
                  isDark 
                    ? 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20' 
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-slate-300'
                }`}>
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${template.color} flex items-center justify-center mb-4 shadow-lg`}>
                    {template.icon}
                  </div>
                  <h3 className={`text-sm font-bold mb-1 transition-colors ${
                    isDark 
                      ? 'text-white group-hover:text-blue-400' 
                      : 'text-slate-900 group-hover:text-blue-500'
                  }`}>
                    {template.name}
                  </h3>
                  <p className={`text-xs mb-3 line-clamp-2 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>{template.description}</p>

                  <div className="flex items-center justify-between text-xs">
                    <div className={`flex items-center gap-1 ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>
                      <Clock className="w-3 h-3" />
                      {template.estimatedTime}
                    </div>
                    <div className={`flex items-center gap-1 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                      <Star className={`w-3 h-3 ${isDark ? 'fill-blue-400' : 'fill-blue-600'}`} />
                      {template.popularity}%
                    </div>
                  </div>

                  <button className={`w-full mt-4 px-3 py-2 rounded-lg text-xs font-semibold transition-all border flex items-center justify-center gap-1 ${
                    isDark 
                      ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border-blue-500/30' 
                      : 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'
                  }`}>
                    <Plus className="w-3 h-3" />
                    Generate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========== RESULTS INFO ========== */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className={isDark ? 'text-gray-400' : 'text-slate-500'}>
              Showing <span className={`${isDark ? 'text-white' : 'text-slate-900'} font-semibold`}>{paginatedReports.length}</span> of{' '}
              <span className={`${isDark ? 'text-white' : 'text-slate-900'} font-semibold`}>{filteredReports.length}</span> reports
            </span>
            {selectedReports.size > 0 && (
              <>
                <span className={isDark ? 'text-gray-600' : 'text-slate-400'}>•</span>
                <span className={`${isDark ? 'text-blue-400' : 'text-blue-600'} font-semibold`}>
                  {selectedReports.size} selected
                </span>
                <button
                  onClick={() => setSelectedReports(new Set())}
                  className={`transition-colors ${
                    isDark 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Clear
                </button>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            {selectedReports.size > 0 && (
              <>
                <button className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:hover:bg-blue-500/30 dark:text-blue-400 dark:border-blue-500/30">
                  <Download className="w-3 h-3" />
                  Download Selected
                </button>
                <button className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-700 border-red-200 dark:bg-red-500/20 dark:hover:bg-red-500/30 dark:text-red-400 dark:border-red-500/30">
                  <Trash2 className="w-3 h-3" />
                  Delete Selected
                </button>
              </>
            )}
          </div>
        </div>

        {/* ========== REPORTS GRID/LIST ========== */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedReports.map((report) => (
              <div
                key={report.id}
                className={`rounded-2xl p-6 border shadow-sm hover:shadow-md transition-all group relative ${
                  isDark 
                    ? 'bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border-white/10 hover:border-white/20' 
                    : 'bg-white border-slate-200'
                }`}
              >
                {/* Selection Checkbox */}
                <div className="absolute top-4 left-4 z-10">
                  <input
                    type="checkbox"
                    checked={selectedReports.has(report.id)}
                    onChange={() => toggleSelection(report.id)}
                    onClick={(e) => e.stopPropagation()}
                    className={`w-4 h-4 rounded cursor-pointer ${
                      isDark 
                        ? 'border-white/20 bg-white/5' 
                        : 'border-slate-300 bg-white'
                    }`}
                  />
                </div>

                {/* Header */}
                <div className="flex items-start justify-between mb-4 mt-6">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${report.color} flex items-center justify-center shadow-lg`}>
                    {report.icon}
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${getStatusColor(report.status)}`}>
                      {getStatusIcon(report.status)}
                      {report.status}
                    </span>
                    <span className="text-2xl">{getTypeIcon(report.type)}</span>
                  </div>
                </div>

                {/* Content */}
                <h3 className={`text-lg font-bold mb-2 transition-colors ${
                  isDark 
                    ? 'text-white group-hover:text-blue-400' 
                    : 'text-slate-900 group-hover:text-blue-600'
                }`}>
                  {report.title}
                </h3>
                <p className={`text-sm mb-4 line-clamp-2 ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>{report.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {report.tags.slice(0, 3).map((tag, i) => (
                    <span key={i} className={`px-2 py-1 rounded-lg text-xs border ${
                      isDark 
                        ? 'bg-white/5 text-gray-400 border-white/10' 
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Meta Info */}
                <div className={`grid grid-cols-2 gap-3 mb-4 pt-4 border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                  <div>
                    <p className={`text-xs mb-1 ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>Created</p>
                    <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{report.createdAt.split(' ')[0]}</p>
                  </div>
                  <div>
                    <p className={`text-xs mb-1 ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>Size</p>
                    <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{report.size}</p>
                  </div>
                  <div>
                    <p className={`text-xs mb-1 ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>By</p>
                    <p className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{report.generatedBy}</p>
                  </div>
                  <div>
                    <p className={`text-xs mb-1 ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>Downloads</p>
                    <p className={`text-sm font-semibold flex items-center gap-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      <Download className="w-3 h-3" />
                      {report.downloads}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {report.status === 'Ready' && (
                    <button className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all border flex items-center justify-center gap-1.5 ${
                  isDark 
                    ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border-blue-500/30' 
                    : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200'
                }`}>
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </button>
                  )}
                  <button className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all border flex items-center justify-center gap-1.5 ${
                    isDark 
                      ? 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border-white/10' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border-slate-200'
                  }`}>
                    <Eye className="w-3.5 h-3.5" />
                    Preview
                  </button>
                  <button className={`px-3 py-2 rounded-lg transition-all border ${
                    isDark 
                      ? 'bg-white/5 hover:bg-white/10 border-white/10' 
                      : 'bg-slate-100 hover:bg-slate-200 border-slate-200'
                  }`}>
                    <MoreVertical className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-slate-600'}`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`rounded-2xl border shadow-sm overflow-hidden ${
            isDark 
              ? 'bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border-white/10' 
              : 'bg-white border-slate-200'
          }`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${
                    isDark 
                      ? 'border-white/10 bg-white/5' 
                      : 'border-slate-200 bg-slate-50'
                  }`}>
                    <th className="px-6 py-4 text-left">
                      <input type="checkbox" className={`w-4 h-4 rounded cursor-pointer ${
                        isDark 
                          ? 'border-white/20 bg-white/5' 
                          : 'border-slate-300 bg-white'
                      }`} />
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                      isDark ? 'text-gray-400' : 'text-slate-600'
                    }`}>
                      Report
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                      isDark ? 'text-gray-400' : 'text-slate-600'
                    }`}>
                      Category
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                      isDark ? 'text-gray-400' : 'text-slate-600'
                    }`}>
                      Type
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                      isDark ? 'text-gray-400' : 'text-slate-600'
                    }`}>
                      Status
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                      isDark ? 'text-gray-400' : 'text-slate-600'
                    }`}>
                      Created
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                      isDark ? 'text-gray-400' : 'text-slate-600'
                    }`}>
                      Size
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                      isDark ? 'text-gray-400' : 'text-slate-600'
                    }`}>
                      Downloads
                    </th>
                    <th className={`px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider ${
                      isDark ? 'text-gray-400' : 'text-slate-600'
                    }`}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedReports.map((report) => (
                    <tr
                      key={report.id}
                      className={`border-b transition-colors group ${
                        isDark 
                          ? 'border-white/10 hover:bg-white/5' 
                          : 'border-slate-100 hover:bg-slate-50'
                      }`}
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedReports.has(report.id)}
                          onChange={() => toggleSelection(report.id)}
                          className={`w-4 h-4 rounded cursor-pointer ${
                            isDark 
                              ? 'border-white/20 bg-white/5' 
                              : 'border-slate-300 bg-white'
                          }`}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${report.color} flex items-center justify-center flex-shrink-0`}>
                            {report.icon}
                          </div>
                          <div className="min-w-0">
                            <p className={`text-sm font-semibold transition-colors truncate ${
                              isDark 
                                ? 'text-white group-hover:text-blue-400' 
                                : 'text-slate-900 group-hover:text-blue-600'
                            }`}>
                              {report.title}
                            </p>
                            <p className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>{report.generatedBy}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                          isDark 
                            ? 'bg-white/5 text-gray-300 border-white/10' 
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}>
                          {report.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-2xl">{getTypeIcon(report.type)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${getStatusColor(report.status)}`}>
                          {getStatusIcon(report.status)}
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className={`text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{report.createdAt.split(' ')[0]}</p>
                        <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>{report.createdAt.split(' ')[1]}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{report.size}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center gap-1 text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          <Download className={`w-3 h-3 ${isDark ? 'text-gray-400' : 'text-slate-400'}`} />
                          {report.downloads}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {report.status === 'Ready' && (
                            <button className={`p-2 rounded-lg transition-all border ${
                              isDark 
                                ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border-blue-500/30' 
                                : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200'
                            }`}>
                              <Download className="w-4 h-4" />
                            </button>
                          )}
                          <button className={`p-2 rounded-lg transition-all border ${
                            isDark 
                              ? 'bg-white/5 hover:bg-white/10 border-white/10' 
                              : 'bg-slate-100 hover:bg-slate-200 border-slate-200'
                          }`}>
                            <Eye className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-slate-600'}`} />
                          </button>
                          <button className={`p-2 rounded-lg transition-all border ${
                            isDark 
                              ? 'bg-white/5 hover:bg-white/10 border-white/10' 
                              : 'bg-slate-100 hover:bg-slate-200 border-slate-200'
                          }`}>
                            <Share2 className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-slate-600'}`} />
                          </button>
                          <button className={`p-2 rounded-lg transition-all border ${
                            isDark 
                              ? 'bg-white/5 hover:bg-white/10 border-white/10' 
                              : 'bg-slate-100 hover:bg-slate-200 border-slate-200'
                          }`}>
                            <MoreVertical className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-slate-600'}`} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========== PAGINATION ========== */}
        {totalPages > 1 && (
          <div className={`flex items-center justify-between rounded-2xl p-6 border shadow-sm ${
            isDark 
              ? 'bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border-white/10' 
              : 'bg-white border-slate-200'
          }`}>
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
              Page <span className={`${isDark ? 'text-white' : 'text-slate-900'} font-semibold`}>{currentPage}</span> of{' '}
              <span className={`${isDark ? 'text-white' : 'text-slate-900'} font-semibold`}>{totalPages}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 border rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm ${
                  isDark 
                    ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' 
                    : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'
                }`}
              >
                First
              </button>
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`p-2 border rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDark 
                    ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' 
                    : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <ChevronDown className="w-5 h-5 rotate-90" />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all border ${
                        currentPage === pageNum
                          ? isDark 
                            ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' 
                            : 'bg-blue-600 text-white border-blue-600'
                          : isDark
                            ? 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                            : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`p-2 border rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDark 
                    ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' 
                    : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <ChevronDown className="w-5 h-5 -rotate-90" />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 border rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm ${
                  isDark 
                    ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' 
                    : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Last
              </button>
            </div>
          </div>
        )}

        {/* ========== RECENT ACTIVITY ========== */}
        <div className={`rounded-2xl p-6 border shadow-sm ${
          isDark 
            ? 'bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border-white/10' 
            : 'bg-white border-slate-200'
        }`}>
          <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Activity className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            Recent Activity
          </h2>

          <div className="space-y-3">
            {[
              { action: 'Downloaded', report: 'Q4 Financial Summary', user: 'John Doe', time: '5 mins ago', icon: <Download className="w-4 h-4" />, color: isDark ? 'text-blue-400' : 'text-blue-600' },
              { action: 'Generated', report: 'Student Performance Report', user: 'System', time: '15 mins ago', icon: <FileText className="w-4 h-4" />, color: isDark ? 'text-emerald-400' : 'text-emerald-600' },
              { action: 'Scheduled', report: 'Revenue Analysis Jan 2026', user: 'Admin User', time: '1 hour ago', icon: <Clock className="w-4 h-4" />, color: isDark ? 'text-amber-400' : 'text-amber-600' },
              { action: 'Shared', report: 'Placement Statistics 2025', user: 'Jane Smith', time: '2 hours ago', icon: <Share2 className="w-4 h-4" />, color: isDark ? 'text-purple-400' : 'text-purple-600' },
              { action: 'Deleted', report: 'Old System Logs', user: 'DevOps', time: '3 hours ago', icon: <Trash2 className="w-4 h-4" />, color: isDark ? 'text-red-400' : 'text-red-600' },
            ].map((activity, index) => (
              <div
                key={index}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all border group ${
                  isDark 
                    ? 'bg-white/5 hover:bg-white/10 border-white/10' 
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
                  isDark 
                    ? 'bg-white/5 border-white/10' 
                    : 'bg-white border-slate-200'
                } ${activity.color}`}>
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <span className="font-semibold">{activity.user}</span>
                    {' '}<span className={isDark ? 'text-gray-400' : 'text-slate-500'}>{activity.action.toLowerCase()}</span>{' '}
                    <span className={`font-semibold transition-colors ${
                      isDark 
                        ? 'group-hover:text-blue-400' 
                        : 'group-hover:text-blue-600'
                    }`}>{activity.report}</span>
                  </p>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========== NEW REPORT MODAL ========== */}
      <AnimatePresence>
        {showNewReportModal && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowNewReportModal(false)}
          >

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`${isDark ? 'bg-gradient-to-br from-[#0f111a] to-[#1a1c2e]' : 'bg-white'
                } rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto border ${isDark ? 'border-white/10' : 'border-slate-200'
                } shadow-2xl relative`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Generate New Report</h2>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Choose a template or create custom report</p>
                </div>
                <button
                  onClick={() => setShowNewReportModal(false)}
                  className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-slate-100 text-slate-500'}`}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Template Selection */}
                <div>
                  <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>Select Template</label>
                  <div className="grid grid-cols-2 gap-3">
                    {reportTemplates.slice(0, 4).map((template) => (
                      <div
                        key={template.id}
                        className={`p-4 rounded-xl border transition-all cursor-pointer group ${isDark
                          ? 'bg-white/5 border-white/10 hover:border-blue-500/50'
                          : 'bg-slate-50 border-slate-200 hover:border-blue-500/50 hover:bg-white shadow-sm'
                          }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${template.color} flex items-center justify-center`}>
                            {template.icon}
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm font-semibold transition-colors ${isDark ? 'text-white group-hover:text-blue-400' : 'text-slate-900 group-hover:text-blue-600'}`}>
                              {template.name}
                            </p>
                            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>{template.category}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Report Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>Report Name *</label>
                    <input
                      type="text"
                      placeholder="e.g., Monthly Revenue Report"
                      className={`w-full px-4 py-3 rounded-xl transition-all border focus:outline-none focus:border-blue-500/50 ${isDark
                        ? 'bg-white/5 border-white/10 text-white placeholder-gray-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                        }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>Category</label>
                    <select className={`w-full px-4 py-3 rounded-xl transition-all border focus:outline-none focus:border-blue-500/50 cursor-pointer ${isDark
                      ? 'bg-white/5 border-white/10 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}>
                      <option className={!isDark ? "text-slate-900" : "bg-[#1a1c2e]"}>Financial</option>
                      <option className={!isDark ? "text-slate-900" : "bg-[#1a1c2e]"}>Academic</option>
                      <option className={!isDark ? "text-slate-900" : "bg-[#1a1c2e]"}>Operational</option>
                      <option className={!isDark ? "text-slate-900" : "bg-[#1a1c2e]"}>Custom</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>Format</label>
                    <select className={`w-full px-4 py-3 rounded-xl transition-all border focus:outline-none focus:border-blue-500/50 cursor-pointer ${isDark
                      ? 'bg-white/5 border-white/10 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}>
                      <option className={!isDark ? "text-slate-900" : "bg-[#1a1c2e]"}>PDF</option>
                      <option className={!isDark ? "text-slate-900" : "bg-[#1a1c2e]"}>Excel (XLSX)</option>
                      <option className={!isDark ? "text-slate-900" : "bg-[#1a1c2e]"}>CSV</option>
                      <option className={!isDark ? "text-slate-900" : "bg-[#1a1c2e]"}>JSON</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>Date Range</label>
                    <select className={`w-full px-4 py-3 rounded-xl transition-all border focus:outline-none focus:border-blue-500/50 cursor-pointer ${isDark
                      ? 'bg-white/5 border-white/10 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}>
                      <option className={!isDark ? "text-slate-900" : "bg-[#1a1c2e]"}>Last 7 Days</option>
                      <option className={!isDark ? "text-slate-900" : "bg-[#1a1c2e]"}>Last 30 Days</option>
                      <option className={!isDark ? "text-slate-900" : "bg-[#1a1c2e]"}>Last 90 Days</option>
                      <option className={!isDark ? "text-slate-900" : "bg-[#1a1c2e]"}>Last Year</option>
                      <option className={!isDark ? "text-slate-900" : "bg-[#1a1c2e]"}>Custom Range</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>Description (Optional)</label>
                  <textarea
                    placeholder="Add a description for this report..."
                    rows={3}
                    className={`w-full px-4 py-3 rounded-xl transition-all border focus:outline-none focus:border-blue-500/50 resize-none ${isDark
                      ? 'bg-white/5 border-white/10 text-white placeholder-gray-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                      }`}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowNewReportModal(false)}
                    className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all border ${isDark
                      ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                      }`}
                  >
                    Cancel
                  </button>
                  <button className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 text-white">
                    <Zap className="w-5 h-5" />
                    Generate Report
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========== SCHEDULE MODAL ========== */}
      <AnimatePresence>
        {showScheduleModal && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
            onClick={() => setShowScheduleModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`${isDark ? 'bg-gradient-to-br from-[#0f111a] to-[#1a1c2e]' : 'bg-white'
                } rounded-2xl p-8 max-w-xl w-full border ${isDark ? 'border-white/10' : 'border-slate-200'
                } shadow-2xl relative`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Schedule Automated Report</h2>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Set up recurring report generation</p>
                </div>
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-slate-100 text-slate-500'}`}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>Frequency</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Daily', 'Weekly', 'Monthly'].map((freq) => (
                      <button
                        key={freq}
                        className={`py-2.5 rounded-xl border text-sm font-semibold transition-all ${isDark
                          ? 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white hover:shadow-sm'
                          }`}
                      >
                        {freq}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>Preferred Time</label>
                  <input
                    type="time"
                    className={`w-full px-4 py-3 rounded-xl transition-all border focus:outline-none focus:border-blue-500/50 ${isDark
                      ? 'bg-white/5 border-white/10 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                  />
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <Info className="w-5 h-5 text-blue-500" />
                  <p className="text-xs text-blue-500/90 font-medium leading-relaxed">
                    Reports will be automatically generated and sent to the administrators' email addresses.
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowScheduleModal(false)}
                    className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all border ${isDark
                      ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                      }`}
                  >
                    Cancel
                  </button>
                  <button className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/20">
                    Schedule
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

