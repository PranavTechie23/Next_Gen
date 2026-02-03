import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp, TrendingDown, Users, Building, DollarSign, Award,
  Calendar, Download, Upload, Filter, RefreshCw, Share2, Printer,
  BarChart3, PieChart, Activity, Target, Zap, Clock, MapPin,
  ArrowUpRight, ArrowDownRight, ChevronDown, ChevronUp, Eye,
  ThumbsUp, ThumbsDown, Star, Globe, Smartphone, Laptop,
  Mail, Phone, MessageSquare, ShoppingCart, CreditCard,
  FileText, Briefcase, GraduationCap, BookOpen, CheckCircle,
  XCircle, AlertTriangle, Info, Settings, Search, Plus,
  Minus, X, MoreVertical, MoreHorizontal, Maximize2, Minimize2,
  ChevronLeft, ChevronRight, Database, Server, Shield, Lock,
  Unlock, Bell, BellOff, Send, Inbox, Archive, Trash2,
  Edit, Copy, ExternalLink, Link, Hash, Percent, Grid,
  List, Layers, Package, ShoppingBag, Sparkles,
  Flame, Droplet, Wind, Sun, Moon, CloudRain, Compass, Gift,
  Trophy, AlertCircle, PlayCircle, PauseCircle, SkipForward,
  SkipBack, Volume2, VolumeX, Mic, MicOff, Video, VideoOff,
  Image, Film, Music, Headphones, Radio, Tv, Monitor, Tablet,
  Watch, Battery, BatteryCharging, Wifi, WifiOff, Bluetooth,
  Cast, Airplay, Repeat, Shuffle, Heart, Bookmark,
  Flag, Tag, Folder, File, FileCheck, FilePlus, FileMinus,
  Save, CloudUpload, CloudDownload, HardDrive, Cpu, MemoryStick,
  Power, PowerOff, Sliders, Wrench, Hammer, Scissors,
  PenTool, Paintbrush, Droplets, Feather, Anchor, Award as AwardIcon,
  BadgeCheck, Bandage, Beaker, Binary, BookCopy, Box, Boxes,
  Briefcase as BriefcaseIcon, Bug, Calculator, CameraOff,
  CheckCheck, ChevronDownCircle, CircleDashed, Clipboard,
  UserPlus
} from 'lucide-react';

// ===================================================================
// TYPE DEFINITIONS
// ===================================================================

interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'flat';
  icon: React.ReactNode;
  color: string;
}

interface TimeSeriesPoint {
  date: string;
  value: number;
  label?: string;
}

interface ComparisonData {
  current: number;
  previous: number;
  change: number;
  changePercent: number;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color: string;
  }[];
}

// ===================================================================
// UTILITY FUNCTIONS
// ===================================================================

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

const formatCurrency = (num: number): string => {
  return `₹${num.toFixed(1)}L`;
};

const formatPercent = (num: number): string => {
  return `${num >= 0 ? '+' : ''}${num.toFixed(1)}%`;
};

const generateMockData = (points: number, min: number, max: number): number[] => {
  return Array.from({ length: points }, () => 
    Math.floor(Math.random() * (max - min + 1)) + min
  );
};

const generateTimeSeriesData = (days: number): TimeSeriesPoint[] => {
  const data: TimeSeriesPoint[] = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.floor(Math.random() * 5000) + 20000,
    });
  }
  
  return data;
};

// ===================================================================
// SAMPLE DATA
// ===================================================================

const generateSampleData = () => {
  return {
    overview: {
      totalRevenue: { current: 24.5, previous: 21.9, change: 2.6, changePercent: 11.9 },
      totalStudents: { current: 28540, previous: 27120, change: 1420, changePercent: 5.2 },
      avgPlacement: { current: 86, previous: 83, change: 3, changePercent: 3.6 },
      activeInstitutions: { current: 24, previous: 21, change: 3, changePercent: 14.3 },
      platformAdoption: { current: 89, previous: 85, change: 4, changePercent: 4.7 },
      activeUsers: { current: 1274, previous: 1198, change: 76, changePercent: 6.3 },
    },
    revenueByMonth: generateTimeSeriesData(12),
    studentGrowth: generateTimeSeriesData(12),
    placementTrends: generateTimeSeriesData(12),
    topInstitutions: [
      { name: 'IIT Bombay', students: 4200, revenue: 4.5, placement: 98, growth: 18.5, rating: 5.0 },
      { name: 'BITS Pilani', students: 1800, revenue: 1.9, placement: 92, growth: 12.3, rating: 4.8 },
      { name: 'DTU Delhi', students: 2200, revenue: 2.3, placement: 90, growth: 10.7, rating: 4.6 },
      { name: 'VIT Vellore', students: 3500, revenue: 3.4, placement: 85, growth: 7.8, rating: 4.4 },
      { name: 'Anna University', students: 2800, revenue: 2.7, placement: 83, growth: 8.5, rating: 4.5 },
    ],
    studentsByDepartment: {
      'Computer Science': 8540,
      'Electronics': 6230,
      'Mechanical': 5120,
      'Civil': 3890,
      'Business': 4760,
    },
    studentsByGender: {
      male: 17124,
      female: 10988,
      other: 428,
    },
    studentsByYear: {
      year1: 7850,
      year2: 7120,
      year3: 6890,
      year4: 6680,
    },
    revenueByPlan: {
      free: 0,
      standard: 8.2,
      premium: 12.8,
      enterprise: 3.5,
    },
    placementByCompany: {
      'Google': 245,
      'Microsoft': 312,
      'Amazon': 289,
      'Infosys': 1245,
      'TCS': 2134,
      'Wipro': 987,
    },
    placementBySector: {
      'IT Services': 12450,
      'Product': 4230,
      'Consulting': 3120,
      'Finance': 2890,
      'Other': 1872,
    },
    systemMetrics: {
      uptime: 99.9,
      apiCalls: 15868,
      activeUsers: 1274,
      storage: 2.4,
      bandwidth: 185.6,
      errorRate: 0.02,
      responseTime: 145,
      requestsPerSecond: 1250,
    },
    engagementMetrics: {
      dailyActiveTime: 4.2,
      courseCompletion: 87.3,
      assignmentSubmit: 92.1,
      avgRating: 4.6,
      feedbackCount: 3254,
      supportTickets: 142,
      resolutionTime: 2.5,
    },
    geographicData: {
      'Tamil Nadu': 5,
      'Delhi': 4,
      'Maharashtra': 3,
      'Karnataka': 3,
      'Others': 9,
    },
    institutionTypes: {
      'University': 12,
      'College': 6,
      'Institute': 5,
      'School': 1,
    },
  };
};

// ===================================================================
// MAIN COMPONENT
// ===================================================================

export default function AnalyticsPage() {
  // STATE
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y' | 'all'>('30d');
  const [selectedCategory, setSelectedCategory] = useState<'overview' | 'students' | 'revenue' | 'placement' | 'institutions' | 'system' | 'engagement'>('overview');
  const [showFilters, setShowFilters] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // DATA
  const data = useMemo(() => generateSampleData(), []);

  // EFFECTS
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setLastRefresh(new Date());
      }, refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  // RENDER HELPERS
  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    change: number;
    changePercent: number;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, change, changePercent, icon, color }) => {
    const isPositive = change >= 0;
    
    return (
      <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all group">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
            {icon}
          </div>
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
            isPositive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {formatPercent(changePercent)}
          </div>
        </div>
        <h3 className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-2">{title}</h3>
        <div className="flex items-baseline gap-2 mb-1">
          <p className="text-3xl font-bold text-white">{value}</p>
          <span className={`text-sm font-semibold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
            {change >= 0 ? '+' : ''}{change}
          </span>
        </div>
        <p className="text-sm text-gray-500">vs previous period</p>
      </div>
    );
  };

  const ProgressBar: React.FC<{
    label: string;
    value: number;
    max: number;
    color: string;
    showPercentage?: boolean;
  }> = ({ label, value, max, color, showPercentage = true }) => {
    const percentage = (value / max) * 100;
    
    return (
      <div className="group">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400 font-medium">{label}</span>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-white">{formatNumber(value)}</span>
            {showPercentage && (
              <span className="text-xs text-gray-500 min-w-[45px] text-right">{percentage.toFixed(1)}%</span>
            )}
          </div>
        </div>
        <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-1000`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  const StatCard: React.FC<{
    icon: React.ReactNode;
    value: string | number;
    label: string;
    change?: string;
    color: string;
  }> = ({ icon, value, label, change, color }) => (
    <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all group">
      <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-4`}>
        {icon}
      </div>
      <p className="text-3xl font-bold text-white mb-2">{value}</p>
      <p className="text-sm text-gray-400 mb-2">{label}</p>
      {change && (
        <div className="flex items-center justify-center gap-1 text-emerald-400 text-sm">
          <TrendingUp className="w-4 h-4" />
          <span>{change}</span>
        </div>
      )}
    </div>
  );

  const TimeSeriesChart: React.FC<{
    title: string;
    subtitle: string;
    data: TimeSeriesPoint[];
    color: string;
    icon: React.ReactNode;
  }> = ({ title, subtitle, data, color, icon }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    
    return (
      <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              {icon}
              {title}
            </h3>
            <p className="text-sm text-gray-400">{subtitle}</p>
          </div>
          <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
        
        <div className="space-y-3">
          {data.slice(-6).map((point, index) => {
            const width = (point.value / maxValue) * 100;
            const month = new Date(point.date).toLocaleDateString('en-US', { month: 'short' });
            
            return (
              <div key={index}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-gray-400 font-medium">{month}</span>
                  <span className="text-sm font-semibold text-white">{formatNumber(point.value)}</span>
                </div>
                <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-1000`}
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const TopList: React.FC<{
    title: string;
    subtitle: string;
    items: any[];
    icon: React.ReactNode;
    valueKey: string;
    labelKey: string;
    color: string;
  }> = ({ title, subtitle, items, icon, valueKey, labelKey, color }) => (
    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
            {icon}
            {title}
          </h3>
          <p className="text-sm text-gray-400">{subtitle}</p>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-3 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all group cursor-pointer">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-sm font-bold shadow-lg`}>
              #{index + 1}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                {item[labelKey]}
              </p>
              <p className="text-xs text-gray-400">{formatNumber(item[valueKey])} • {item.rating && `${item.rating} ★`}</p>
            </div>
            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100">
              <Eye className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  // ===================================================================
  // RENDER
  // ===================================================================

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-8">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent mb-2"
                style={{ fontFamily: "'Sora', sans-serif", letterSpacing: '-0.03em' }}>
              Analytics Dashboard
            </h1>
            <p className="text-gray-400 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Comprehensive insights and performance metrics
            </p>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs text-gray-500">Last updated: {lastRefresh.toLocaleTimeString()}</span>
              {autoRefresh && (
                <span className="flex items-center gap-1 text-xs text-emerald-400">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Auto-refresh enabled
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10 flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <button 
              onClick={() => setCompareMode(!compareMode)}
              className={`px-4 py-2.5 rounded-xl transition-all border flex items-center gap-2 ${
                compareMode 
                  ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' 
                  : 'bg-white/5 hover:bg-white/10 border-white/10'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Compare
            </button>
            <button className="px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10 flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button 
              onClick={() => setLastRefresh(new Date())}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* ========== PERIOD SELECTOR ========== */}
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-semibold text-gray-400">Time Period:</span>
              <div className="flex gap-2 bg-white/5 border border-white/10 rounded-xl p-1">
                {[
                  { value: '7d', label: 'Last 7 Days' },
                  { value: '30d', label: 'Last 30 Days' },
                  { value: '90d', label: 'Last 90 Days' },
                  { value: '1y', label: 'Last Year' },
                  { value: 'all', label: 'All Time' },
                ].map((period) => (
                  <button
                    key={period.value}
                    onClick={() => setSelectedPeriod(period.value as any)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      selectedPeriod === period.value
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-white/5"
                />
                <span className="text-sm text-gray-400">Auto-refresh</span>
              </label>
              {autoRefresh && (
                <select
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(Number(e.target.value))}
                  className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white cursor-pointer"
                >
                  <option value={10}>10s</option>
                  <option value={30}>30s</option>
                  <option value={60}>1m</option>
                  <option value={300}>5m</option>
                </select>
              )}
            </div>
          </div>
        </div>

        {/* ========== CATEGORY TABS ========== */}
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl p-2 border border-white/10">
          <div className="flex gap-2 overflow-x-auto">
            {[
              { value: 'overview', label: 'Overview', icon: <Grid className="w-4 h-4" /> },
              { value: 'students', label: 'Students', icon: <Users className="w-4 h-4" /> },
              { value: 'revenue', label: 'Revenue', icon: <DollarSign className="w-4 h-4" /> },
              { value: 'placement', label: 'Placement', icon: <Award className="w-4 h-4" /> },
              { value: 'institutions', label: 'Institutions', icon: <Building className="w-4 h-4" /> },
              { value: 'system', label: 'System', icon: <Activity className="w-4 h-4" /> },
              { value: 'engagement', label: 'Engagement', icon: <Target className="w-4 h-4" /> },
            ].map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value as any)}
                className={`flex-1 min-w-[130px] px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                  selectedCategory === category.value
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {category.icon}
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* ========== OVERVIEW TAB ========== */}
        {selectedCategory === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <MetricCard
                title="Total Revenue"
                value={formatCurrency(data.overview.totalRevenue.current)}
                change={data.overview.totalRevenue.change}
                changePercent={data.overview.totalRevenue.changePercent}
                icon={<DollarSign className="w-6 h-6" />}
                color="from-emerald-500 to-teal-500"
              />
              <MetricCard
                title="Total Students"
                value={formatNumber(data.overview.totalStudents.current)}
                change={data.overview.totalStudents.change}
                changePercent={data.overview.totalStudents.changePercent}
                icon={<Users className="w-6 h-6" />}
                color="from-blue-500 to-cyan-500"
              />
              <MetricCard
                title="Average Placement"
                value={`${data.overview.avgPlacement.current}%`}
                change={data.overview.avgPlacement.change}
                changePercent={data.overview.avgPlacement.changePercent}
                icon={<Award className="w-6 h-6" />}
                color="from-purple-500 to-pink-500"
              />
              <MetricCard
                title="Active Institutions"
                value={data.overview.activeInstitutions.current}
                change={data.overview.activeInstitutions.change}
                changePercent={data.overview.activeInstitutions.changePercent}
                icon={<Building className="w-6 h-6" />}
                color="from-amber-500 to-orange-500"
              />
              <MetricCard
                title="Platform Adoption"
                value={`${data.overview.platformAdoption.current}%`}
                change={data.overview.platformAdoption.change}
                changePercent={data.overview.platformAdoption.changePercent}
                icon={<TrendingUp className="w-6 h-6" />}
                color="from-violet-500 to-indigo-500"
              />
              <MetricCard
                title="Active Users"
                value={formatNumber(data.overview.activeUsers.current)}
                change={data.overview.activeUsers.change}
                changePercent={data.overview.activeUsers.changePercent}
                icon={<Activity className="w-6 h-6" />}
                color="from-cyan-500 to-blue-500"
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TimeSeriesChart
                title="Revenue Trend"
                subtitle="Monthly revenue over time"
                data={data.revenueByMonth}
                color="from-emerald-500 to-teal-500"
                icon={<TrendingUp className="w-5 h-5 text-emerald-400" />}
              />

              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                      <PieChart className="w-5 h-5 text-blue-400" />
                      Student Distribution
                    </h3>
                    <p className="text-sm text-gray-400">By department</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {Object.entries(data.studentsByDepartment).map(([dept, count], index) => {
                    const colors = [
                      'from-blue-500 to-cyan-500',
                      'from-purple-500 to-pink-500',
                      'from-emerald-500 to-teal-500',
                      'from-orange-500 to-red-500',
                      'from-indigo-500 to-violet-500',
                    ];
                    
                    return (
                      <ProgressBar
                        key={dept}
                        label={dept}
                        value={count}
                        max={data.overview.totalStudents.current}
                        color={colors[index % colors.length]}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Top Performing Institutions */}
            <TopList
              title="Top Performing Institutions"
              subtitle="Based on overall performance metrics"
              items={data.topInstitutions}
              icon={<Star className="w-5 h-5 text-amber-400" />}
              valueKey="students"
              labelKey="name"
              color="from-blue-500 to-cyan-500"
            />

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard
                icon={<CheckCircle className="w-6 h-6" />}
                value="95.2%"
                label="Student Satisfaction"
                change="+12.5%"
                color="from-blue-500 to-cyan-500"
              />
              <StatCard
                icon={<Target className="w-6 h-6" />}
                value="92.8%"
                label="Goal Completion"
                change="+8.3%"
                color="from-emerald-500 to-teal-500"
              />
              <StatCard
                icon={<Zap className="w-6 h-6" />}
                value="847"
                label="Active Courses"
                change="+15.7%"
                color="from-purple-500 to-pink-500"
              />
              <StatCard
                icon={<Clock className="w-6 h-6" />}
                value="45m"
                label="Avg Session Time"
                change="+4.2%"
                color="from-amber-500 to-orange-500"
              />
            </div>

            {/* Real-time Activity Feed */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-400" />
                    Real-time Activity
                  </h3>
                  <p className="text-sm text-gray-400">Live system events and updates</p>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { type: 'success', message: 'New student enrolled at IIT Bombay', time: '2m ago', icon: <UserPlus className="w-4 h-4" /> },
                  { type: 'info', message: 'Weekly report generated successfully', time: '5m ago', icon: <FileText className="w-4 h-4" /> },
                  { type: 'warning', message: 'Storage usage at 85%', time: '12m ago', icon: <AlertTriangle className="w-4 h-4" /> },
                  { type: 'success', message: 'Payment received from VIT Vellore', time: '18m ago', icon: <DollarSign className="w-4 h-4" /> },
                  { type: 'info', message: 'System backup completed', time: '25m ago', icon: <Database className="w-4 h-4" /> },
                ].map((activity, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all group cursor-pointer"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      activity.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' :
                      activity.type === 'warning' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white group-hover:text-blue-400 transition-colors">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-xl rounded-2xl p-6 border border-emerald-500/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="text-xs text-emerald-400 font-semibold">Excellent</span>
                </div>
                <p className="text-2xl font-bold text-white mb-1">+18.5%</p>
                <p className="text-sm text-gray-400">Revenue Growth YoY</p>
              </div>

              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-xs text-blue-400 font-semibold">Growing</span>
                </div>
                <p className="text-2xl font-bold text-white mb-1">+5.2%</p>
                <p className="text-sm text-gray-400">Student Growth</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Award className="w-5 h-5 text-purple-400" />
                  </div>
                  <span className="text-xs text-purple-400 font-semibold">Improving</span>
                </div>
                <p className="text-2xl font-bold text-white mb-1">+3.6%</p>
                <p className="text-sm text-gray-400">Placement Rate</p>
              </div>
            </div>
          </div>
        )}

        {/* ========== STUDENTS TAB ========== */}
        {selectedCategory === 'students' && (
          <div className="space-y-6">
            {/* Student Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <StatCard
                icon={<Users className="w-6 h-6" />}
                value={formatNumber(data.overview.totalStudents.current)}
                label="Total Students"
                change="+5.2%"
                color="from-blue-500 to-cyan-500"
              />
              <StatCard
                icon={<CheckCircle className="w-6 h-6" />}
                value={formatNumber(27320)}
                label="Active Students"
                change="+4.8%"
                color="from-emerald-500 to-teal-500"
              />
              <StatCard
                icon={<BookOpen className="w-6 h-6" />}
                value={formatNumber(7850)}
                label="Enrolled This Year"
                change="+12.3%"
                color="from-purple-500 to-pink-500"
              />
              <StatCard
                icon={<GraduationCap className="w-6 h-6" />}
                value={formatNumber(19200)}
                label="Graduated"
                change="+6.5%"
                color="from-amber-500 to-orange-500"
              />
              <StatCard
                icon={<XCircle className="w-6 h-6" />}
                value={formatNumber(1490)}
                label="Dropped Out"
                change="-2.3%"
                color="from-red-500 to-rose-500"
              />
            </div>

            {/* Demographics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gender Distribution */}
              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  Gender Distribution
                </h3>

                <div className="space-y-6">
                  {[
                    { label: 'Male', count: data.studentsByGender.male, color: 'from-blue-500 to-cyan-500' },
                    { label: 'Female', count: data.studentsByGender.female, color: 'from-pink-500 to-rose-500' },
                    { label: 'Other', count: data.studentsByGender.other, color: 'from-purple-500 to-violet-500' },
                  ].map((item) => (
                    <ProgressBar
                      key={item.label}
                      label={item.label}
                      value={item.count}
                      max={data.overview.totalStudents.current}
                      color={item.color}
                    />
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-xs text-gray-400 mb-1">Male %</p>
                    <p className="text-lg font-bold text-blue-400">
                      {((data.studentsByGender.male / data.overview.totalStudents.current) * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="text-center border-x border-white/10">
                    <p className="text-xs text-gray-400 mb-1">Female %</p>
                    <p className="text-lg font-bold text-pink-400">
                      {((data.studentsByGender.female / data.overview.totalStudents.current) * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400 mb-1">Other %</p>
                    <p className="text-lg font-bold text-purple-400">
                      {((data.studentsByGender.other / data.overview.totalStudents.current) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Year-wise Distribution */}
              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-400" />
                  Year-wise Distribution
                </h3>

                <div className="space-y-6">
                  {[
                    { label: 'First Year', count: data.studentsByYear.year1, color: 'from-emerald-500 to-teal-500' },
                    { label: 'Second Year', count: data.studentsByYear.year2, color: 'from-blue-500 to-cyan-500' },
                    { label: 'Third Year', count: data.studentsByYear.year3, color: 'from-purple-500 to-pink-500' },
                    { label: 'Fourth Year', count: data.studentsByYear.year4, color: 'from-amber-500 to-orange-500' },
                  ].map((item) => (
                    <ProgressBar
                      key={item.label}
                      label={item.label}
                      value={item.count}
                      max={data.overview.totalStudents.current}
                      color={item.color}
                    />
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Average per Year</p>
                      <p className="text-lg font-bold text-white">
                        {formatNumber(Math.floor(data.overview.totalStudents.current / 4))}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400 mb-1">Retention Rate</p>
                      <p className="text-lg font-bold text-emerald-400">94.8%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Student Engagement Metrics */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-400" />
                Student Engagement Metrics
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  icon={<Clock className="w-6 h-6" />}
                  value={`${data.engagementMetrics.dailyActiveTime}hrs`}
                  label="Daily Active Time"
                  change="+12.5%"
                  color="from-blue-500 to-cyan-500"
                />
                <StatCard
                  icon={<BookOpen className="w-6 h-6" />}
                  value={`${data.engagementMetrics.courseCompletion}%`}
                  label="Course Completion"
                  change="+5.2%"
                  color="from-emerald-500 to-teal-500"
                />
                <StatCard
                  icon={<Target className="w-6 h-6" />}
                  value={`${data.engagementMetrics.assignmentSubmit}%`}
                  label="Assignment Submit"
                  change="+3.8%"
                  color="from-purple-500 to-pink-500"
                />
                <StatCard
                  icon={<Star className="w-6 h-6" />}
                  value={`${data.engagementMetrics.avgRating}/5`}
                  label="Avg Rating"
                  change="+0.3"
                  color="from-amber-500 to-orange-500"
                />
              </div>
            </div>

            {/* Student Growth Trend */}
            <TimeSeriesChart
              title="Student Growth Trend"
              subtitle="Monthly student enrollment over time"
              data={data.studentGrowth}
              color="from-blue-500 to-cyan-500"
              icon={<TrendingUp className="w-5 h-5 text-blue-400" />}
            />

            {/* Department Performance */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-400" />
                Department-wise Student Distribution
              </h3>

              <div className="space-y-4">
                {Object.entries(data.studentsByDepartment).map(([dept, count], index) => {
                  const colors = [
                    'from-blue-500 to-cyan-500',
                    'from-emerald-500 to-teal-500',
                    'from-purple-500 to-pink-500',
                    'from-amber-500 to-orange-500',
                    'from-rose-500 to-red-500',
                  ];
                  
                  return (
                    <ProgressBar
                      key={dept}
                      label={dept}
                      value={count}
                      max={data.overview.totalStudents.current}
                      color={colors[index % colors.length]}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========== REVENUE TAB ========== */}
        {selectedCategory === 'revenue' && (
          <div className="space-y-6">
            {/* Revenue Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={<DollarSign className="w-6 h-6" />}
                value={formatCurrency(data.overview.totalRevenue.current)}
                label="Total Revenue"
                change="+11.9%"
                color="from-emerald-500 to-teal-500"
              />
              <StatCard
                icon={<RefreshCw className="w-6 h-6" />}
                value={formatCurrency(20.1)}
                label="Recurring Revenue"
                change="+15.2%"
                color="from-blue-500 to-cyan-500"
              />
              <StatCard
                icon={<Zap className="w-6 h-6" />}
                value={formatCurrency(4.4)}
                label="One-Time Revenue"
                change="-3.5%"
                color="from-purple-500 to-pink-500"
              />
              <StatCard
                icon={<TrendingUp className="w-6 h-6" />}
                value={formatCurrency(28.2)}
                label="Projected (Next)"
                change="+15.1%"
                color="from-amber-500 to-orange-500"
              />
            </div>

            {/* Revenue by Plan */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-400" />
                Revenue by Plan
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { plan: 'Standard', amount: data.revenueByPlan.standard, color: 'from-cyan-500 to-blue-500', icon: <Package className="w-6 h-6" /> },
                  { plan: 'Premium', amount: data.revenueByPlan.premium, color: 'from-blue-500 to-indigo-500', icon: <Star className="w-6 h-6" /> },
                  { plan: 'Enterprise', amount: data.revenueByPlan.enterprise, color: 'from-purple-500 to-pink-500', icon: <Building className="w-6 h-6" /> },
                  { plan: 'Free', amount: data.revenueByPlan.free, color: 'from-gray-500 to-gray-600', icon: <Gift className="w-6 h-6" /> },
                ].map((item) => {
                  const percentage = (item.amount / data.overview.totalRevenue.current) * 100;
                  return (
                    <div key={item.plan} className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center mb-4`}>
                        {item.icon}
                      </div>
                      <p className="text-2xl font-bold text-white mb-1">{formatCurrency(item.amount)}</p>
                      <p className="text-sm text-gray-400 mb-3">{item.plan} Plan</p>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">{percentage.toFixed(1)}% of total</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Monthly Revenue Breakdown */}
            <TimeSeriesChart
              title="Monthly Revenue Breakdown"
              subtitle="Last 12 months performance"
              data={data.revenueByMonth}
              color="from-emerald-500 to-teal-500"
              icon={<BarChart3 className="w-5 h-5 text-emerald-400" />}
            />

            {/* Revenue Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-xl rounded-2xl p-6 border border-emerald-500/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="text-xs text-emerald-400 font-semibold">Best Month</span>
                </div>
                <p className="text-2xl font-bold text-white mb-1">
                  {formatCurrency(Math.max(...data.revenueByMonth.map(d => d.value / 10000)))}
                </p>
                <p className="text-sm text-gray-400">Peak revenue achieved</p>
              </div>

              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-xs text-blue-400 font-semibold">Average</span>
                </div>
                <p className="text-2xl font-bold text-white mb-1">
                  {formatCurrency(data.revenueByMonth.reduce((sum, d) => sum + d.value, 0) / data.revenueByMonth.length / 10000)}
                </p>
                <p className="text-sm text-gray-400">Monthly average</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Target className="w-5 h-5 text-purple-400" />
                  </div>
                  <span className="text-xs text-purple-400 font-semibold">Growth</span>
                </div>
                <p className="text-2xl font-bold text-white mb-1">+18.5%</p>
                <p className="text-sm text-gray-400">Year over year</p>
              </div>
            </div>

            {/* Revenue Forecast */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                Revenue Forecast & Predictions
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Next Month</p>
                  <p className="text-3xl font-bold text-white mb-1">{formatCurrency(28.2)}</p>
                  <p className="text-sm text-emerald-400">+15.1% projected growth</p>
                </div>
                <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Next Quarter</p>
                  <p className="text-3xl font-bold text-white mb-1">{formatCurrency(82.5)}</p>
                  <p className="text-sm text-emerald-400">+12.8% projected growth</p>
                </div>
                <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Next Year</p>
                  <p className="text-3xl font-bold text-white mb-1">{formatCurrency(328.6)}</p>
                  <p className="text-sm text-emerald-400">+18.5% projected growth</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========== PLACEMENT TAB ========== */}
        {selectedCategory === 'placement' && (
          <div className="space-y-6">
            {/* Placement Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={<Award className="w-6 h-6" />}
                value={formatNumber(24562)}
                label="Students Placed"
                change="+8.2%"
                color="from-emerald-500 to-teal-500"
              />
              <StatCard
                icon={<DollarSign className="w-6 h-6" />}
                value={formatCurrency(8.5)}
                label="Average Package"
                change="+12.3%"
                color="from-blue-500 to-cyan-500"
              />
              <StatCard
                icon={<TrendingUp className="w-6 h-6" />}
                value={formatCurrency(45.0)}
                label="Highest Package"
                change="Record"
                color="from-amber-500 to-orange-500"
              />
              <StatCard
                icon={<Briefcase className="w-6 h-6" />}
                value="86%"
                label="Placement Rate"
                change="+3.6%"
                color="from-purple-500 to-pink-500"
              />
            </div>

            {/* Top Recruiters */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-400" />
                Top Recruiting Companies
              </h3>

              <div className="space-y-4">
                {Object.entries(data.placementByCompany)
                  .sort(([, a], [, b]) => b - a)
                  .map(([company, count], index) => {
                    const colors = [
                      'from-blue-500 to-cyan-500',
                      'from-emerald-500 to-teal-500',
                      'from-purple-500 to-pink-500',
                      'from-amber-500 to-orange-500',
                      'from-indigo-500 to-violet-500',
                      'from-rose-500 to-pink-500',
                    ];
                    
                    return (
                      <ProgressBar
                        key={company}
                        label={`#${index + 1} ${company}`}
                        value={count}
                        max={Math.max(...Object.values(data.placementByCompany))}
                        color={colors[index % colors.length]}
                        showPercentage={false}
                      />
                    );
                  })}
              </div>
            </div>

            {/* Sector-wise Placement */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-emerald-400" />
                Sector-wise Placement Distribution
              </h3>

              <div className="space-y-4">
                {Object.entries(data.placementBySector).map(([sector, count], index) => {
                  const colors = [
                    'from-blue-500 to-cyan-500',
                    'from-emerald-500 to-teal-500',
                    'from-purple-500 to-pink-500',
                    'from-amber-500 to-orange-500',
                    'from-rose-500 to-red-500',
                  ];
                  
                  return (
                    <ProgressBar
                      key={sector}
                      label={sector}
                      value={count}
                      max={24562}
                      color={colors[index % colors.length]}
                    />
                  );
                })}
              </div>
            </div>

            {/* Placement Trends */}
            <TimeSeriesChart
              title="Monthly Placement Trends"
              subtitle="Placements over the last 12 months"
              data={data.placementTrends}
              color="from-emerald-500 to-teal-500"
              icon={<BarChart3 className="w-5 h-5 text-emerald-400" />}
            />

            {/* Placement Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Dream Offers</p>
                <p className="text-3xl font-bold text-white mb-2">1,245</p>
                <p className="text-sm text-emerald-400">Packages &gt; ₹15L</p>
              </div>
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">International</p>
                <p className="text-3xl font-bold text-white mb-2">342</p>
                <p className="text-sm text-blue-400">Global placements</p>
              </div>
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Startups</p>
                <p className="text-3xl font-bold text-white mb-2">876</p>
                <p className="text-sm text-purple-400">Startup offers</p>
              </div>
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Pre-placement</p>
                <p className="text-3xl font-bold text-white mb-2">1,523</p>
                <p className="text-sm text-amber-400">PPO conversions</p>
              </div>
            </div>
          </div>
        )}

        {/* ========== INSTITUTIONS TAB ========== */}
        {selectedCategory === 'institutions' && (
          <div className="space-y-6">
            {/* Institution Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={<Building className="w-6 h-6" />}
                value="24"
                label="Active Institutions"
                change="+14.3%"
                color="from-blue-500 to-cyan-500"
              />
              <StatCard
                icon={<Users className="w-6 h-6" />}
                value="1,189"
                label="Avg Students/Institution"
                change="+5.8%"
                color="from-emerald-500 to-teal-500"
              />
              <StatCard
                icon={<Award className="w-6 h-6" />}
                value="4.5"
                label="Avg Rating"
                change="+0.2"
                color="from-purple-500 to-pink-500"
              />
              <StatCard
                icon={<DollarSign className="w-6 h-6" />}
                value={formatCurrency(1.02)}
                label="Avg Revenue/Institution"
                change="+9.2%"
                color="from-amber-500 to-orange-500"
              />
            </div>

            {/* Top Performers */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                Performance Leaderboard
              </h3>

              <div className="space-y-4">
                {data.topInstitutions.map((inst, index) => {
                  const colors = [
                    'from-blue-500 to-cyan-500',
                    'from-emerald-500 to-teal-500',
                    'from-purple-500 to-pink-500',
                    'from-amber-500 to-orange-500',
                    'from-rose-500 to-red-500',
                  ];
                  
                  return (
                    <div 
                      key={inst.name}
                      className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-white/20 transition-all group cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colors[index % colors.length]} flex items-center justify-center text-lg font-bold shadow-lg flex-shrink-0`}>
                          #{index + 1}
                        </div>

                        <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                          <div>
                            <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors mb-1">
                              {inst.name}
                            </p>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              <span className="text-xs text-gray-400">{inst.rating}</span>
                            </div>
                          </div>

                          <div>
                            <p className="text-xs text-gray-400 mb-1">Students</p>
                            <p className="text-sm font-bold text-white">{formatNumber(inst.students)}</p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-400 mb-1">Placement</p>
                            <p className="text-sm font-bold text-emerald-400">{inst.placement}%</p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-400 mb-1">Revenue</p>
                            <p className="text-sm font-bold text-white">{formatCurrency(inst.revenue)}</p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-400 mb-1">Growth</p>
                            <p className="text-sm font-bold text-blue-400">+{inst.growth}%</p>
                          </div>
                        </div>

                        <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Institution Type Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-400" />
                  Institution Types
                </h3>

                <div className="space-y-4">
                  {Object.entries(data.institutionTypes).map(([type, count], index) => {
                    const colors = [
                      'from-blue-500 to-cyan-500',
                      'from-emerald-500 to-teal-500',
                      'from-purple-500 to-pink-500',
                      'from-amber-500 to-orange-500',
                    ];
                    
                    return (
                      <ProgressBar
                        key={type}
                        label={type}
                        value={count}
                        max={24}
                        color={colors[index % colors.length]}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                  Geographic Distribution
                </h3>

                <div className="space-y-4">
                  {Object.entries(data.geographicData).map(([state, count], index) => {
                    const colors = [
                      'from-blue-500 to-cyan-500',
                      'from-emerald-500 to-teal-500',
                      'from-purple-500 to-pink-500',
                      'from-amber-500 to-orange-500',
                      'from-gray-500 to-gray-600',
                    ];
                    
                    return (
                      <ProgressBar
                        key={state}
                        label={state}
                        value={count}
                        max={24}
                        color={colors[index % colors.length]}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========== SYSTEM TAB ========== */}
        {selectedCategory === 'system' && (
          <div className="space-y-6">
            {/* System Health */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                    <Server className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
                    Excellent
                  </span>
                </div>
                <p className="text-3xl font-bold text-white mb-1">{data.systemMetrics.uptime}%</p>
                <p className="text-sm text-gray-400">System Uptime</p>
              </div>

              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                    <Zap className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold">
                    Active
                  </span>
                </div>
                <p className="text-3xl font-bold text-white mb-1">{formatNumber(data.systemMetrics.apiCalls)}</p>
                <p className="text-sm text-gray-400">API Calls/Hour</p>
              </div>

              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                    <Activity className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-semibold">
                    Online
                  </span>
                </div>
                <p className="text-3xl font-bold text-white mb-1">{formatNumber(data.systemMetrics.activeUsers)}</p>
                <p className="text-sm text-gray-400">Active Users</p>
              </div>
            </div>

            {/* Storage & Performance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-400" />
                  Storage & Bandwidth
                </h3>

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Storage Used</span>
                      <span className="text-sm font-bold text-white">{data.systemMetrics.storage}TB / 5TB</span>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                        style={{ width: `${(data.systemMetrics.storage / 5) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Bandwidth (GB/day)</span>
                      <span className="text-sm font-bold text-white">{data.systemMetrics.bandwidth}GB</span>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                        style={{ width: '74%' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-400" />
                  Performance Metrics
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Response Time</p>
                        <p className="text-lg font-bold text-white">{data.systemMetrics.responseTime}ms</p>
                      </div>
                    </div>
                    <span className="text-xs text-emerald-400">Excellent</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Requests/Second</p>
                        <p className="text-lg font-bold text-white">{formatNumber(data.systemMetrics.requestsPerSecond)}</p>
                      </div>
                    </div>
                    <span className="text-xs text-blue-400">High</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Error Rate</p>
                        <p className="text-lg font-bold text-white">{data.systemMetrics.errorRate}%</p>
                      </div>
                    </div>
                    <span className="text-xs text-emerald-400">Low</span>
                  </div>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                System Status
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-3 p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                  <div>
                    <p className="text-xs text-gray-400">Database</p>
                    <p className="text-sm font-bold text-emerald-400">Operational</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                  <div>
                    <p className="text-xs text-gray-400">API Services</p>
                    <p className="text-sm font-bold text-emerald-400">Operational</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                  <div>
                    <p className="text-xs text-gray-400">Authentication</p>
                    <p className="text-sm font-bold text-emerald-400">Operational</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                  <div>
                    <p className="text-xs text-gray-400">File Storage</p>
                    <p className="text-sm font-bold text-emerald-400">Operational</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-xl rounded-2xl p-6 border border-emerald-500/20">
                <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6 text-emerald-400" />
                </div>
                <p className="text-2xl font-bold text-white mb-1">256-bit</p>
                <p className="text-sm text-gray-400">SSL Encryption</p>
              </div>

              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20">
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-blue-400" />
                </div>
                <p className="text-2xl font-bold text-white mb-1">0</p>
                <p className="text-sm text-gray-400">Security Breaches</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20">
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-purple-400" />
                </div>
                <p className="text-2xl font-bold text-white mb-1">Daily</p>
                <p className="text-sm text-gray-400">Automated Backups</p>
              </div>
            </div>
          </div>
        )}

        {/* ========== ENGAGEMENT TAB ========== */}
        {selectedCategory === 'engagement' && (
          <div className="space-y-6">
            {/* Engagement Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={<Clock className="w-6 h-6" />}
                value={`${data.engagementMetrics.dailyActiveTime}hrs`}
                label="Daily Active Time"
                change="+12.5%"
                color="from-blue-500 to-cyan-500"
              />
              <StatCard
                icon={<BookOpen className="w-6 h-6" />}
                value={`${data.engagementMetrics.courseCompletion}%`}
                label="Course Completion"
                change="+5.2%"
                color="from-emerald-500 to-teal-500"
              />
              <StatCard
                icon={<Target className="w-6 h-6" />}
                value={`${data.engagementMetrics.assignmentSubmit}%`}
                label="Assignment Submit"
                change="+3.8%"
                color="from-purple-500 to-pink-500"
              />
              <StatCard
                icon={<Star className="w-6 h-6" />}
                value={`${data.engagementMetrics.avgRating}/5`}
                label="Avg Rating"
                change="+0.3"
                color="from-amber-500 to-orange-500"
              />
            </div>

            {/* User Feedback */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-400" />
                User Feedback & Satisfaction
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-400 mb-4">Overall Satisfaction</p>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-1">
                      <div className="h-4 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: '95%' }} />
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-white">95%</span>
                  </div>
                  <p className="text-xs text-gray-500">{formatNumber(data.engagementMetrics.feedbackCount)} total responses</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    <ThumbsUp className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white mb-1">92%</p>
                    <p className="text-xs text-gray-400">Positive</p>
                  </div>
                  <div className="text-center p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                    <ThumbsDown className="w-8 h-8 text-red-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white mb-1">8%</p>
                    <p className="text-xs text-gray-400">Negative</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <Users className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Total Support Tickets</p>
                    <p className="text-2xl font-bold text-white">{formatNumber(data.engagementMetrics.supportTickets)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-blue-400" /> </div>
                  <div>
                    <p className="text-sm text-gray-400">Average Response Time</p>
                    <p className="text-2xl font-bold text-white">{data.engagementMetrics.resolutionTime}min</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}