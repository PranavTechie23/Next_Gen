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
      case 'Ready': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Processing': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Scheduled': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Failed': return 'bg-red-500/20 text-red-400 border-red-500/30';
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
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900 dark:bg-[#050712] dark:text-white p-8">
      {/* Animated Background (dark mode only) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none hidden dark:block">
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
              className="text-4xl font-bold mb-2 text-slate-900 dark:bg-gradient-to-r dark:from-white dark:via-blue-100 dark:to-cyan-200 dark:bg-clip-text dark:text-transparent"
              style={{ fontFamily: "'Manrope', sans-serif", letterSpacing: '-0.03em' }}
            >
              Reports & Analytics
            </h1>
            <p className="text-slate-500 dark:text-gray-400 flex items-center gap-2">
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
        <div className="overflow-hidden rounded-3xl border bg-gradient-to-br from-amber-400/10 via-blue-500/5 to-transparent border-amber-400/20 dark:from-amber-400/15 dark:via-blue-500/10 dark:to-transparent dark:border-amber-400/30 shadow-[0_18px_45px_rgba(15,23,42,0.45)]">
          <div className="px-8 pt-6 pb-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-amber-500/80 mb-2">Realtime Overview</p>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-1">
                Reporting activity across your campus
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl">
                Monitor how institutions, departments, and placement cells are generating reports in the last 30 days.
              </p>
              <div className="mt-4 flex flex-wrap gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_0_4px_rgba(251,191,36,0.25)]" />
                  <span className="text-slate-600 dark:text-slate-300">Live generation trend</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
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
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all group dark:bg-gradient-to-br dark:from-white/5 dark:to-white/[0.02] dark:border-white/10 dark:hover:border-white/20"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                  {stat.icon}
                </div>
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${stat.change >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                  {stat.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(stat.change)}%
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</p>
              <p className="text-sm text-slate-500 dark:text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* ========== FILTERS & SEARCH ========== */}
        <div className="rounded-2xl p-6 border bg-white border-slate-200 shadow-sm dark:bg-gradient-to-br dark:from-white/5 dark:to-white/[0.02] dark:border-white/10">
          <div className="flex flex-wrap gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reports by name, description, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border transition-all bg-slate-100 border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder-gray-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 bg-slate-100 border border-slate-200 rounded-xl p-1 dark:bg-white/5 dark:border-white/10">
              {['all', 'Financial', 'Academic', 'Operational', 'Custom'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat as any)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${selectedCategory === cat
                      ? 'bg-slate-900 text-white dark:bg-blue-500/20 dark:text-blue-400'
                      : 'text-slate-600 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white'
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
              className="px-4 py-3 rounded-xl border cursor-pointer bg-slate-100 border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500/50 dark:bg-white/5 dark:border-white/10 dark:text-white"
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
              className="px-4 py-3 rounded-xl border cursor-pointer bg-slate-100 border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500/50 dark:bg-white/5 dark:border-white/10 dark:text-white"
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="downloads">Sort by Downloads</option>
            </select>

            {/* View Mode */}
            <div className="flex gap-2 bg-slate-100 border border-slate-200 rounded-xl p-1 dark:bg-white/5 dark:border-white/10">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid'
                    ? 'bg-slate-900 text-white dark:bg-blue-500/20 dark:text-blue-400'
                    : 'text-slate-600 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white'
                  }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list'
                    ? 'bg-slate-900 text-white dark:bg-blue-500/20 dark:text-blue-400'
                    : 'text-slate-600 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white'
                  }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            <button className="px-4 py-3 rounded-xl transition-all border flex items-center gap-2 bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 dark:bg-white/5 dark:border-white/10 dark:text-white dark:hover:bg-white/10">
              <Filter className="w-4 h-4" />
              More
            </button>
          </div>
        </div>

        {/* ========== REPORT TEMPLATES ========== */}
        <div className="rounded-2xl p-6 border bg-white border-slate-200 shadow-sm dark:bg-gradient-to-br dark:from-white/5 dark:to-white/[0.02] dark:border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                Quick Generate Templates
              </h2>
              <p className="text-sm text-slate-500 dark:text-gray-400">Start with pre-built report templates</p>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors flex items-center gap-1">
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
                <div className="rounded-xl p-5 border bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-slate-300 transition-all dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10 dark:hover:border-white/20">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${template.color} flex items-center justify-center mb-4 shadow-lg`}>
                    {template.icon}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-gray-400 mb-3 line-clamp-2">{template.description}</p>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-slate-500 dark:text-gray-500">
                      <Clock className="w-3 h-3" />
                      {template.estimatedTime}
                    </div>
                    <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                      <Star className="w-3 h-3 fill-blue-600 dark:fill-blue-400" />
                      {template.popularity}%
                    </div>
                  </div>

                  <button className="w-full mt-4 px-3 py-2 rounded-lg text-xs font-semibold transition-all border flex items-center justify-center gap-1 bg-slate-900 text-white border-slate-900 hover:bg-slate-800 dark:bg-blue-500/20 dark:hover:bg-blue-500/30 dark:text-blue-400 dark:border-blue-500/30">
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
            <span className="text-gray-400">
              Showing <span className="text-white font-semibold">{paginatedReports.length}</span> of{' '}
              <span className="text-white font-semibold">{filteredReports.length}</span> reports
            </span>
            {selectedReports.size > 0 && (
              <>
                <span className="text-gray-600">•</span>
                <span className="text-blue-400 font-semibold">
                  {selectedReports.size} selected
                </span>
                <button
                  onClick={() => setSelectedReports(new Set())}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Clear
                </button>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            {selectedReports.size > 0 && (
              <>
                <button className="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-400 text-xs font-semibold transition-all border border-blue-500/30 flex items-center gap-1">
                  <Download className="w-3 h-3" />
                  Download Selected
                </button>
                <button className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 text-xs font-semibold transition-all border border-red-500/30 flex items-center gap-1">
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
            {paginatedReports.map((report, index) => (
              <div
                key={report.id}
                className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all group relative"
                style={{
                  animation: 'fadeInUp 0.5s ease-out forwards',
                  animationDelay: `${index * 100}ms`,
                  opacity: 0
                }}
              >
                {/* Selection Checkbox */}
                <div className="absolute top-4 left-4 z-10">
                  <input
                    type="checkbox"
                    checked={selectedReports.has(report.id)}
                    onChange={() => toggleSelection(report.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 cursor-pointer"
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
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {report.title}
                </h3>
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">{report.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {report.tags.slice(0, 3).map((tag, i) => (
                    <span key={i} className="px-2 py-1 bg-white/5 rounded-lg text-xs text-gray-400 border border-white/10">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Meta Info */}
                <div className="grid grid-cols-2 gap-3 mb-4 pt-4 border-t border-white/10">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Created</p>
                    <p className="text-sm font-semibold text-white">{report.createdAt.split(' ')[0]}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Size</p>
                    <p className="text-sm font-semibold text-white">{report.size}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">By</p>
                    <p className="text-sm font-semibold text-white truncate">{report.generatedBy}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Downloads</p>
                    <p className="text-sm font-semibold text-white flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      {report.downloads}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {report.status === 'Ready' && (
                    <button className="flex-1 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-400 text-xs font-semibold transition-all border border-blue-500/30 flex items-center justify-center gap-1.5">
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </button>
                  )}
                  <button className="flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white text-xs font-semibold transition-all border border-white/10 flex items-center justify-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    Preview
                  </button>
                  <button className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all border border-white/10">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="px-6 py-4 text-left">
                      <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-white/5 cursor-pointer" />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Report
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Downloads
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedReports.map((report, index) => (
                    <tr
                      key={report.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                      style={{
                        animation: 'fadeIn 0.3s ease-out forwards',
                        animationDelay: `${index * 50}ms`,
                        opacity: 0
                      }}
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedReports.has(report.id)}
                          onChange={() => toggleSelection(report.id)}
                          className="w-4 h-4 rounded border-white/20 bg-white/5 cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${report.color} flex items-center justify-center flex-shrink-0`}>
                            {report.icon}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors truncate">
                              {report.title}
                            </p>
                            <p className="text-xs text-gray-400 truncate">{report.generatedBy}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-white/5 rounded-lg text-xs font-semibold text-gray-300 border border-white/10">
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
                        <p className="text-sm text-white">{report.createdAt.split(' ')[0]}</p>
                        <p className="text-xs text-gray-500">{report.createdAt.split(' ')[1]}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-white">{report.size}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm font-semibold text-white">
                          <Download className="w-3 h-3 text-gray-400" />
                          {report.downloads}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {report.status === 'Ready' && (
                            <button className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 transition-all border border-blue-500/30">
                              <Download className="w-4 h-4" />
                            </button>
                          )}
                          <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all border border-white/10">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all border border-white/10">
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all border border-white/10">
                            <MoreVertical className="w-4 h-4" />
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
          <div className="flex items-center justify-between bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <div className="text-sm text-gray-400">
              Page <span className="text-white font-semibold">{currentPage}</span> of{' '}
              <span className="text-white font-semibold">{totalPages}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                First
              </button>
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${currentPage === pageNum
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
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
                className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronDown className="w-5 h-5 -rotate-90" />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Last
              </button>
            </div>
          </div>
        )}

        {/* ========== RECENT ACTIVITY ========== */}
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            Recent Activity
          </h2>

          <div className="space-y-3">
            {[
              { action: 'Downloaded', report: 'Q4 Financial Summary', user: 'John Doe', time: '5 mins ago', icon: <Download className="w-4 h-4" />, color: 'text-blue-400' },
              { action: 'Generated', report: 'Student Performance Report', user: 'System', time: '15 mins ago', icon: <FileText className="w-4 h-4" />, color: 'text-emerald-400' },
              { action: 'Scheduled', report: 'Revenue Analysis Jan 2026', user: 'Admin User', time: '1 hour ago', icon: <Clock className="w-4 h-4" />, color: 'text-amber-400' },
              { action: 'Shared', report: 'Placement Statistics 2025', user: 'Jane Smith', time: '2 hours ago', icon: <Share2 className="w-4 h-4" />, color: 'text-purple-400' },
              { action: 'Deleted', report: 'Old System Logs', user: 'DevOps', time: '3 hours ago', icon: <Trash2 className="w-4 h-4" />, color: 'text-red-400' },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all border border-white/10 group"
              >
                <div className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center ${activity.color}`}>
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white">
                    <span className="font-semibold">{activity.user}</span>
                    {' '}<span className="text-gray-400">{activity.action.toLowerCase()}</span>{' '}
                    <span className="font-semibold group-hover:text-blue-400 transition-colors">{activity.report}</span>
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========== NEW REPORT MODAL ========== */}
      {showNewReportModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowNewReportModal(false)}
        >
          <div
            className="bg-gradient-to-br from-[#0f0f1a] to-[#1a1a2e] rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Generate New Report</h2>
                <p className="text-sm text-gray-400">Choose a template or create custom report</p>
              </div>
              <button
                onClick={() => setShowNewReportModal(false)}
                className="p-2 rounded-lg hover:bg-white/10 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Template Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-3">Select Template</label>
                <div className="grid grid-cols-2 gap-3">
                  {reportTemplates.slice(0, 4).map((template) => (
                    <div
                      key={template.id}
                      className="p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-blue-500/50 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${template.color} flex items-center justify-center`}>
                          {template.icon}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                            {template.name}
                          </p>
                          <p className="text-xs text-gray-500">{template.category}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Report Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Report Name *</label>
                  <input
                    type="text"
                    placeholder="e.g., Monthly Revenue Report"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                  <select className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50 transition-all cursor-pointer">
                    <option>Financial</option>
                    <option>Academic</option>
                    <option>Operational</option>
                    <option>Custom</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Format</label>
                  <select className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50 transition-all cursor-pointer">
                    <option>PDF</option>
                    <option>Excel (XLSX)</option>
                    <option>CSV</option>
                    <option>JSON</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Date Range</label>
                  <select className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50 transition-all cursor-pointer">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                    <option>Last 90 Days</option>
                    <option>Last Year</option>
                    <option>Custom Range</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Description (Optional)</label>
                <textarea
                  placeholder="Add a description for this report..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowNewReportModal(false)}
                  className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-semibold transition-all border border-white/10"
                >
                  Cancel
                </button>
                <button className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2">
                  <Zap className="w-5 h-5" />
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}