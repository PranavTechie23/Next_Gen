import React, { useState, useEffect } from 'react';
import { Search, Plus, Download, Edit2, BarChart2, MoreVertical, Users, MapPin, Calendar, TrendingUp, TrendingDown, Building2, GraduationCap, BookOpen, Award, Mail, Phone, Globe, Star, CheckCircle, AlertCircle, Clock, DollarSign, Target } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

// Types
interface Institution {
  id: string;
  name: string;
  type: 'university' | 'college' | 'school' | 'academy';
  location: string;
  country: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  totalStudents: number;
  totalFaculty: number;
  departments: number;
  courses: number;
  rating: number;
  founded: string;
  logo: string;
  color: string;
  revenue: string;
  completionRate: number;
  enrollmentGrowth: number;
  contact: {
    email: string;
    phone: string;
    website: string;
  };
  accreditation: string[];
  performanceMetrics: {
    studentSatisfaction: number;
    graduationRate: number;
    employmentRate: number;
    researchOutput: number;
  };
}

interface StatCard {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
  color: string;
}

// Main Component
const InstitutionsPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'inactive' | 'pending'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTags, setActiveTags] = useState<string[]>(['Top Rated']);
  const [showAnalytics, setShowAnalytics] = useState(true);

  // Sample Data
  const institutions: Institution[] = [
    {
      id: '1',
      name: 'Massachusetts Institute of Technology',
      type: 'university',
      location: 'Cambridge, MA',
      country: 'USA',
      status: 'active',
      totalStudents: 11520,
      totalFaculty: 1074,
      departments: 32,
      courses: 487,
      rating: 4.9,
      founded: '1861',
      logo: '🎓',
      color: '#991B1B',
      revenue: '$3.8B',
      completionRate: 94.5,
      enrollmentGrowth: 5.2,
      contact: {
        email: 'info@mit.edu',
        phone: '+1 (617) 253-1000',
        website: 'www.mit.edu',
      },
      accreditation: ['ABET', 'NEASC', 'AACSB'],
      performanceMetrics: {
        studentSatisfaction: 95,
        graduationRate: 94,
        employmentRate: 98,
        researchOutput: 92,
      },
    },
    {
      id: '2',
      name: 'Stanford University',
      type: 'university',
      location: 'Stanford, CA',
      country: 'USA',
      status: 'active',
      totalStudents: 17249,
      totalFaculty: 2288,
      departments: 40,
      courses: 612,
      rating: 4.8,
      founded: '1885',
      logo: '🌲',
      color: '#8C1515',
      revenue: '$6.9B',
      completionRate: 92.8,
      enrollmentGrowth: 3.8,
      contact: {
        email: 'info@stanford.edu',
        phone: '+1 (650) 723-2300',
        website: 'www.stanford.edu',
      },
      accreditation: ['WASC', 'AACSB', 'ABET'],
      performanceMetrics: {
        studentSatisfaction: 93,
        graduationRate: 94,
        employmentRate: 96,
        researchOutput: 95,
      },
    },
    {
      id: '3',
      name: 'Harvard University',
      type: 'university',
      location: 'Cambridge, MA',
      country: 'USA',
      status: 'active',
      totalStudents: 23731,
      totalFaculty: 2400,
      departments: 38,
      courses: 578,
      rating: 4.9,
      founded: '1636',
      logo: '⚜️',
      color: '#A51C30',
      revenue: '$5.2B',
      completionRate: 96.2,
      enrollmentGrowth: 2.1,
      contact: {
        email: 'info@harvard.edu',
        phone: '+1 (617) 495-1000',
        website: 'www.harvard.edu',
      },
      accreditation: ['NEASC', 'AACSB', 'ABA'],
      performanceMetrics: {
        studentSatisfaction: 94,
        graduationRate: 98,
        employmentRate: 97,
        researchOutput: 96,
      },
    },
    {
      id: '4',
      name: 'Oxford University',
      type: 'university',
      location: 'Oxford',
      country: 'UK',
      status: 'active',
      totalStudents: 24515,
      totalFaculty: 1500,
      departments: 45,
      courses: 534,
      rating: 4.8,
      founded: '1096',
      logo: '📚',
      color: '#002147',
      revenue: '£2.3B',
      completionRate: 95.1,
      enrollmentGrowth: 4.5,
      contact: {
        email: 'info@ox.ac.uk',
        phone: '+44 1865 270000',
        website: 'www.ox.ac.uk',
      },
      accreditation: ['QAA', 'AACSB', 'EQUIS'],
      performanceMetrics: {
        studentSatisfaction: 92,
        graduationRate: 95,
        employmentRate: 94,
        researchOutput: 97,
      },
    },
    {
      id: '5',
      name: 'Cambridge University',
      type: 'university',
      location: 'Cambridge',
      country: 'UK',
      status: 'active',
      totalStudents: 23247,
      totalFaculty: 1450,
      departments: 42,
      courses: 498,
      rating: 4.9,
      founded: '1209',
      logo: '🏛️',
      color: '#00B5E2',
      revenue: '£2.2B',
      completionRate: 94.8,
      enrollmentGrowth: 3.2,
      contact: {
        email: 'info@cam.ac.uk',
        phone: '+44 1223 337733',
        website: 'www.cam.ac.uk',
      },
      accreditation: ['QAA', 'AMBA', 'EQUIS'],
      performanceMetrics: {
        studentSatisfaction: 93,
        graduationRate: 96,
        employmentRate: 95,
        researchOutput: 98,
      },
    },
    {
      id: '6',
      name: 'Tokyo Institute of Technology',
      type: 'university',
      location: 'Tokyo',
      country: 'Japan',
      status: 'pending',
      totalStudents: 10331,
      totalFaculty: 876,
      departments: 28,
      courses: 356,
      rating: 4.6,
      founded: '1881',
      logo: '🗾',
      color: '#003DA5',
      revenue: '¥75B',
      completionRate: 91.2,
      enrollmentGrowth: 6.8,
      contact: {
        email: 'info@titech.ac.jp',
        phone: '+81 3-5734-2975',
        website: 'www.titech.ac.jp',
      },
      accreditation: ['JABEE', 'AACSB'],
      performanceMetrics: {
        studentSatisfaction: 89,
        graduationRate: 91,
        employmentRate: 93,
        researchOutput: 88,
      },
    },
  ];

  const stats: StatCard[] = [
    {
      title: 'Total Institutions',
      value: 24,
      change: '+3 this month',
      trend: 'up',
      icon: <Building2 className="w-6 h-6" />,
      color: '#6366f1',
    },
    {
      title: 'Active Students',
      value: '1,274',
      change: '+142 vs last month',
      trend: 'up',
      icon: <GraduationCap className="w-6 h-6" />,
      color: '#10b981',
    },
    {
      title: 'Total Revenue',
      value: '$24.5M',
      change: '+12.5% growth',
      trend: 'up',
      icon: <DollarSign className="w-6 h-6" />,
      color: '#f59e0b',
    },
    {
      title: 'Avg Rating',
      value: 4.7,
      change: '+0.2 improvement',
      trend: 'up',
      icon: <Star className="w-6 h-6" />,
      color: '#8b5cf6',
    },
  ];

  // Filtered institutions
  const filteredInstitutions = institutions.filter((institution) => {
    const matchesTab = activeTab === 'all' || institution.status === activeTab;
    const matchesSearch = institution.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         institution.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || institution.type === selectedType;
    const matchesCountry = selectedCountry === 'all' || institution.country === selectedCountry;
    const matchesRating = selectedRating === 'all' || 
                         (selectedRating === '4.5+' && institution.rating >= 4.5) ||
                         (selectedRating === '4.0+' && institution.rating >= 4.0);
    
    return matchesTab && matchesSearch && matchesType && matchesCountry && matchesRating;
  });

  // Toggle tag
  const toggleTag = (tag: string) => {
    if (activeTags.includes(tag)) {
      setActiveTags(activeTags.filter(t => t !== tag));
    } else {
      setActiveTags([...activeTags, tag]);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('search-input')?.focus();
      }
      if (e.key === 'Escape') {
        setIsModalOpen(false);
        setIsDetailModalOpen(false);
        setIsAdvancedFilterOpen(false);
        setIsExportModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-[#0a0b0e]' : 'bg-slate-50'}`}>
      {/* Main Content */}
      <div className="min-h-screen">
        {/* Header */}
        <Header 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setIsModalOpen={setIsModalOpen}
          setIsExportModalOpen={setIsExportModalOpen}
          viewMode={viewMode}
          setViewMode={setViewMode}
          isDark={isDark}
        />

        {/* Content */}
        <main className={`p-8 ${isDark ? 'bg-[#0a0b0e]' : 'bg-slate-50'}`}>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <StatCard key={index} stat={stat} index={index} isDark={isDark} />
            ))}
          </div>

          {/* Analytics Dashboard */}
          {showAnalytics && <AnalyticsSection isDark={isDark} />}

          {/* Quick Actions */}
          <QuickActions setIsModalOpen={setIsModalOpen} isDark={isDark} />

          {/* Tabs */}
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} isDark={isDark} />

          {/* Filter Bar */}
          <FilterBar
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
            selectedRating={selectedRating}
            setSelectedRating={setSelectedRating}
            activeTags={activeTags}
            toggleTag={toggleTag}
            setIsAdvancedFilterOpen={setIsAdvancedFilterOpen}
            isDark={isDark}
          />

          {/* Institutions Display */}
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredInstitutions.map((institution, index) => (
              viewMode === 'grid' ? (
                <InstitutionCard
                  key={institution.id}
                  institution={institution}
                  index={index}
                  onClick={() => {
                    setSelectedInstitution(institution);
                    setIsDetailModalOpen(true);
                  }}
                  isDark={isDark}
                />
              ) : (
                <InstitutionListItem
                  key={institution.id}
                  institution={institution}
                  onClick={() => {
                    setSelectedInstitution(institution);
                    setIsDetailModalOpen(true);
                  }}
                  isDark={isDark}
                />
              )
            ))}
          </div>

          {filteredInstitutions.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🏫</div>
              <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>No institutions found</h3>
              <p className={isDark ? 'text-gray-500' : 'text-gray-500'}>Try adjusting your filters or search terms</p>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      {isModalOpen && <CreateInstitutionModal setIsModalOpen={setIsModalOpen} isDark={isDark} />}
      {isDetailModalOpen && (
        <InstitutionDetailModal
          institution={selectedInstitution}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          isDark={isDark}
        />
      )}
      {isAdvancedFilterOpen && (
        <AdvancedFilterModal
          isOpen={isAdvancedFilterOpen}
          onClose={() => setIsAdvancedFilterOpen(false)}
          isDark={isDark}
        />
      )}
      {isExportModalOpen && (
        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          isDark={isDark}
        />
      )}

      {/* Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        * {
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          margin: 0;
          padding: 0;
        }

        .fade-in {
          animation: fadeIn 0.5s ease forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .delay-1 { animation-delay: 0.1s; opacity: 0; }
        .delay-2 { animation-delay: 0.2s; opacity: 0; }
        .delay-3 { animation-delay: 0.3s; opacity: 0; }
        .delay-4 { animation-delay: 0.4s; opacity: 0; }

        @keyframes slideUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .modal-content {
          animation: slideUp 0.3s ease;
        }

        .progress-fill {
          transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        .shimmer {
          animation: shimmer 2s infinite linear;
          background: linear-gradient(to right, #f0f0f0 4%, #f8f8f8 25%, #f0f0f0 36%);
          background-size: 1000px 100%;
        }
      `}</style>
    </div>
  );
};

// Sidebar Component - Removed as it's handled by AdminDashboard

// Header Component
interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setIsModalOpen: (isOpen: boolean) => void;
  setIsExportModalOpen: (isOpen: boolean) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  isDark: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  searchTerm, 
  setSearchTerm, 
  setIsModalOpen, 
  setIsExportModalOpen,
  viewMode,
  setViewMode,
  isDark
}) => {
  return (
    <header className={`sticky top-0 z-40 backdrop-blur-xl border-b ${isDark ? 'bg-black/60 border-white/5' : 'bg-white/95 border-slate-200'} px-8 py-5 shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Institutions</h1>
          <div className={`flex items-center gap-2 text-sm mt-1 font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <span>Dashboard</span>
            <span className={isDark ? 'text-gray-600' : 'text-gray-400'}>›</span>
            <span className={isDark ? 'text-blue-400' : 'text-blue-600'}>Institutions</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${isDark ? 'text-gray-500 group-focus-within:text-blue-400' : 'text-gray-400 group-focus-within:text-blue-500'}`} />
            <input
              id="search-input"
              type="text"
              placeholder="Search institutions... (⌘K)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 pr-4 py-2.5 w-80 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium ${
                isDark 
                  ? 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:bg-white/10' 
                  : 'bg-slate-50 border-slate-200 text-gray-900 focus:bg-white'
              }`}
            />
          </div>

          {/* View Mode Toggle */}
          <div className={`flex border-2 rounded-xl overflow-hidden ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2.5 transition-all font-semibold ${
                viewMode === 'grid' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : isDark 
                    ? 'text-gray-400 hover:text-gray-300 hover:bg-white/10' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-slate-50'
              }`}
            >
              ⊞
            </button>
            <div className={`w-px ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2.5 transition-all font-semibold ${
                viewMode === 'list' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : isDark 
                    ? 'text-gray-400 hover:text-gray-300 hover:bg-white/10' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-slate-50'
              }`}
            >
              ☰
            </button>
          </div>

          {/* Export Button */}
          <button 
            onClick={() => setIsExportModalOpen(true)}
            className={`flex items-center gap-2 px-5 py-2.5 border-2 rounded-xl font-bold transition-all ${
              isDark 
                ? 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:border-white/20' 
                : 'border-slate-200 bg-white text-gray-700 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <Download className="w-4 h-4" />
            Export
          </button>

          {/* Add Institution Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-xl hover:-translate-y-0.5 transition-all shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Add Institution
          </button>
        </div>
      </div>
    </header>
  );
};

// Stat Card Component
interface StatCardProps {
  stat: StatCard;
  index: number;
  isDark: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ stat, index, isDark }) => {
  return (
    <div 
      className={`p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border-t-4 border-transparent hover:border-t-4 fade-in delay-${index + 1} ${
        isDark ? 'bg-white/[0.02] hover:bg-white/[0.05] backdrop-blur-xl' : 'bg-white hover:shadow-blue-500/10'
      }`}
      style={{ borderTopColor: stat.color }}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
          style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
        >
          {stat.icon}
        </div>
      </div>
      <div className={`text-4xl font-black tracking-tighter mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{stat.value}</div>
      <div className={`text-sm font-bold mb-3 uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{stat.title}</div>
      <div className={`flex items-center gap-2 text-sm pt-3 border-t ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
        {stat.trend === 'up' ? (
          <TrendingUp className="w-4 h-4 text-emerald-500" />
        ) : (
          <TrendingDown className="w-4 h-4 text-rose-500" />
        )}
        <span className={stat.trend === 'up' ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
          {stat.change}
        </span>
      </div>
    </div>
  );
};

// Analytics Section Component
interface AnalyticsSectionProps {
  isDark: boolean;
}

const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ isDark }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 fade-in">
      {/* Geographic Distribution */}
      <div className={`lg:col-span-2 p-6 rounded-2xl shadow-xl ${isDark ? 'bg-white/[0.02] backdrop-blur-xl' : 'bg-white'}`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-lg font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Geographic Distribution</h3>
          <select className={`px-4 py-2 border-2 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
            isDark 
              ? 'bg-white/5 border-white/10 text-white' 
              : 'bg-white border-slate-200 text-gray-900'
          }`}>
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>Last Year</option>
          </select>
        </div>
        <div className="space-y-4">
          {[
            { country: 'United States', count: 8, percent: 33, color: '#3b82f6' },
            { country: 'United Kingdom', count: 6, percent: 25, color: '#10b981' },
            { country: 'Japan', count: 4, percent: 17, color: '#f59e0b' },
            { country: 'Germany', count: 3, percent: 12, color: '#8b5cf6' },
            { country: 'Others', count: 3, percent: 13, color: '#6b7280' },
          ].map((item) => (
            <div key={item.country}>
              <div className="flex justify-between text-sm mb-2">
                <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{item.country}</span>
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{item.count} institutions ({item.percent}%)</span>
              </div>
              <div className={`h-2.5 rounded-full overflow-hidden ${isDark ? 'bg-white/5' : 'bg-gray-200'}`}>
                <div
                  className="h-full transition-all duration-1000"
                  style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Performers */}
      <div className={`p-6 rounded-2xl shadow-xl ${isDark ? 'bg-white/[0.02] backdrop-blur-xl' : 'bg-white'}`}>
        <h3 className={`text-lg font-black uppercase tracking-tight mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Top Performers</h3>
        <div className="space-y-4">
          {[
            { name: 'MIT', rating: 4.9, logo: '🎓', color: '#991B1B' },
            { name: 'Harvard', rating: 4.9, logo: '⚜️', color: '#A51C30' },
            { name: 'Cambridge', rating: 4.9, logo: '🏛️', color: '#00B5E2' },
            { name: 'Stanford', rating: 4.8, logo: '🌲', color: '#8C1515' },
            { name: 'Oxford', rating: 4.8, logo: '📚', color: '#002147' },
          ].map((inst, i) => (
            <div key={i} className={`flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer ${
              isDark 
                ? 'bg-white/5 hover:bg-white/10' 
                : 'bg-gray-50 hover:bg-gray-100'
            }`}>
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                style={{ backgroundColor: `${inst.color}15` }}
              >
                {inst.logo}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{inst.name}</div>
                <div className={`flex items-center gap-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span>{inst.rating}</span>
                </div>
              </div>
              <div className="text-right">
                <div className={isDark ? 'text-xs text-gray-400' : 'text-xs text-gray-500'}>Rank</div>
                <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>#{i + 1}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Quick Actions Component
interface QuickActionsProps {
  setIsModalOpen: (isOpen: boolean) => void;
  isDark: boolean;
}

const QuickActions: React.FC<QuickActionsProps> = ({ setIsModalOpen, isDark }) => {
  const actions = [
    { icon: '🏢', title: 'Add New Institution', onClick: () => setIsModalOpen(true) },
    { icon: '📊', title: 'View Analytics', onClick: () => {} },
    { icon: '📥', title: 'Import Data', onClick: () => {} },
    { icon: '⚙️', title: 'Manage Settings', onClick: () => {} },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 fade-in">
      {actions.map((action, index) => (
        <div
          key={index}
          onClick={action.onClick}
          className={`p-5 rounded-xl border-2 border-dashed text-center cursor-pointer hover:border-blue-500 transition-all ${
            isDark 
              ? 'bg-white/[0.02] border-white/10 hover:bg-blue-500/10' 
              : 'bg-white border-gray-300 hover:bg-blue-50/50'
          }`}
        >
          <div className={`w-14 h-14 mx-auto mb-3 rounded-xl flex items-center justify-center text-3xl ${
            isDark ? 'bg-blue-500/10' : 'bg-blue-50'
          }`}>
            {action.icon}
          </div>
          <div className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{action.title}</div>
        </div>
      ))}
    </div>
  );
};

// Tabs Component
interface TabsProps {
  activeTab: string;
  setActiveTab: (tab: 'all' | 'active' | 'inactive' | 'pending') => void;
  isDark: boolean;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab, isDark }) => {
  const tabs = [
    { id: 'all', label: 'All Institutions' },
    { id: 'active', label: 'Active' },
    { id: 'inactive', label: 'Inactive' },
    { id: 'pending', label: 'Pending' },
  ];

  return (
    <div className={`flex gap-1 p-1 rounded-xl mb-6 fade-in ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id as any)}
          className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
            activeTab === tab.id
              ? isDark
                ? 'bg-blue-500/20 text-blue-400 shadow-sm'
                : 'bg-white text-gray-900 shadow-sm'
              : isDark
                ? 'text-gray-400 hover:text-gray-300'
                : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

// Filter Bar Component
interface FilterBarProps {
  selectedType: string;
  setSelectedType: (value: string) => void;
  selectedCountry: string;
  setSelectedCountry: (value: string) => void;
  selectedRating: string;
  setSelectedRating: (value: string) => void;
  activeTags: string[];
  toggleTag: (tag: string) => void;
  setIsAdvancedFilterOpen: (isOpen: boolean) => void;
  isDark: boolean;
}

const FilterBar: React.FC<FilterBarProps> = ({
  selectedType,
  setSelectedType,
  selectedCountry,
  setSelectedCountry,
  selectedRating,
  setSelectedRating,
  activeTags,
  toggleTag,
  setIsAdvancedFilterOpen,
  isDark,
}) => {
  return (
    <div className={`p-5 rounded-xl shadow-sm mb-6 flex flex-wrap items-center gap-4 fade-in ${
      isDark ? 'bg-white/[0.02]' : 'bg-white'
    }`}>
      <span className={`text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Filter by:</span>
      
      <select
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}
        className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
          isDark 
            ? 'bg-white/5 border-white/10 text-white' 
            : 'bg-white border-gray-300 text-gray-900'
        }`}
      >
        <option value="all">All Types</option>
        <option value="university">University</option>
        <option value="college">College</option>
        <option value="school">School</option>
        <option value="academy">Academy</option>
      </select>

      <select
        value={selectedCountry}
        onChange={(e) => setSelectedCountry(e.target.value)}
        className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
          isDark 
            ? 'bg-white/5 border-white/10 text-white' 
            : 'bg-white border-gray-300 text-gray-900'
        }`}
      >
        <option value="all">All Countries</option>
        <option value="USA">USA</option>
        <option value="UK">UK</option>
        <option value="Japan">Japan</option>
        <option value="Germany">Germany</option>
      </select>

      <select
        value={selectedRating}
        onChange={(e) => setSelectedRating(e.target.value)}
        className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
          isDark 
            ? 'bg-white/5 border-white/10 text-white' 
            : 'bg-white border-gray-300 text-gray-900'
        }`}
      >
        <option value="all">All Ratings</option>
        <option value="4.5+">4.5+ Stars</option>
        <option value="4.0+">4.0+ Stars</option>
      </select>

      <div className="flex gap-2 ml-auto">
        {['Top Rated', 'New', 'Growing'].map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTags.includes(tag)
                ? 'bg-blue-600 text-white'
                : isDark
                  ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
            }`}
          >
            {tag}
          </button>
        ))}
        <button
          onClick={() => setIsAdvancedFilterOpen(true)}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
            isDark
              ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-500/10'
              : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
          }`}
        >
          🔍 Advanced
        </button>
      </div>
    </div>
  );
};

// Institution Card Component
interface InstitutionCardProps {
  institution: Institution;
  index: number;
  onClick: () => void;
  isDark: boolean;
}

const InstitutionCard: React.FC<InstitutionCardProps> = ({ institution, index, onClick, isDark }) => {
  const statusStyles = {
    active: isDark ? 'bg-green-500/10 text-green-400' : 'bg-green-50 text-green-600',
    inactive: isDark ? 'bg-gray-500/10 text-gray-400' : 'bg-gray-50 text-gray-600',
    pending: isDark ? 'bg-orange-500/10 text-orange-400' : 'bg-orange-50 text-orange-600',
    suspended: isDark ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-600',
  };

  return (
    <div
      onClick={onClick}
      className={`rounded-xl p-6 shadow-sm hover:shadow-xl hover:border-blue-500 border transition-all cursor-pointer hover:-translate-y-1 fade-in delay-${Math.min(index % 3 + 1, 4)} ${
        isDark 
          ? 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05]' 
          : 'bg-white border-transparent'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{ backgroundColor: `${institution.color}15` }}
          >
            {institution.logo}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`text-lg font-bold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{institution.name}</h3>
            <div className={`flex items-center gap-2 text-sm mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <MapPin className="w-3.5 h-3.5" />
              <span className="truncate">{institution.location}</span>
            </div>
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${statusStyles[institution.status]}`}>
          {institution.status}
        </span>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(institution.rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : isDark ? 'text-gray-600' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{institution.rating}</span>
        <span className={isDark ? 'text-xs text-gray-500' : 'text-xs text-gray-500'}>• Est. {institution.founded}</span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className={`p-3 rounded-lg ${isDark ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
          <div className={`text-2xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{institution.totalStudents.toLocaleString()}</div>
          <div className={`text-xs uppercase tracking-wider mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Students</div>
        </div>
        <div className={`p-3 rounded-lg ${isDark ? 'bg-green-500/10' : 'bg-green-50'}`}>
          <div className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>{institution.totalFaculty}</div>
          <div className={`text-xs uppercase tracking-wider mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Faculty</div>
        </div>
        <div className={`p-3 rounded-lg ${isDark ? 'bg-purple-500/10' : 'bg-purple-50'}`}>
          <div className={`text-2xl font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>{institution.departments}</div>
          <div className={`text-xs uppercase tracking-wider mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Departments</div>
        </div>
        <div className={`p-3 rounded-lg ${isDark ? 'bg-orange-500/10' : 'bg-orange-50'}`}>
          <div className={`text-2xl font-bold ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>{institution.courses}</div>
          <div className={`text-xs uppercase tracking-wider mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Courses</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1.5">
          <span className={`font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Completion Rate</span>
          <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{institution.completionRate}%</span>
        </div>
        <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/5' : 'bg-gray-200'}`}>
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all"
            style={{ width: `${institution.completionRate}%` }}
          ></div>
        </div>
      </div>

      {/* Footer */}
      <div className={`flex items-center justify-between pt-4 border-t ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
        <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          <TrendingUp className="w-4 h-4 text-green-500" />
          <span className="text-green-600 font-semibold">+{institution.enrollmentGrowth}%</span>
          <span className={isDark ? 'text-gray-500' : 'text-gray-500'}>growth</span>
        </div>
        <button className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
          isDark 
            ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20' 
            : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
        }`}>
          View Details
        </button>
      </div>
    </div>
  );
};

// Institution List Item Component
interface InstitutionListItemProps {
  institution: Institution;
  onClick: () => void;
  isDark: boolean;
}

const InstitutionListItem: React.FC<InstitutionListItemProps> = ({ institution, onClick, isDark }) => {
  const statusStyles = {
    active: isDark ? 'bg-green-500/10 text-green-400' : 'bg-green-50 text-green-600',
    inactive: isDark ? 'bg-gray-500/10 text-gray-400' : 'bg-gray-50 text-gray-600',
    pending: isDark ? 'bg-orange-500/10 text-orange-400' : 'bg-orange-50 text-orange-600',
    suspended: isDark ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-600',
  };

  return (
    <div
      onClick={onClick}
      className={`rounded-xl p-5 shadow-sm hover:shadow-lg hover:border-blue-500 border transition-all cursor-pointer ${
        isDark 
          ? 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05]' 
          : 'bg-white border-transparent'
      }`}
    >
      <div className="flex items-center gap-6">
        {/* Logo */}
        <div
          className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
          style={{ backgroundColor: `${institution.color}15` }}
        >
          {institution.logo}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{institution.name}</h3>
            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${statusStyles[institution.status]}`}>
              {institution.status}
            </span>
          </div>
          <div className={`flex items-center gap-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {institution.location}, {institution.country}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {institution.totalStudents.toLocaleString()} students
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              {institution.courses} courses
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-8">
          <div className="text-center">
            <div className="flex items-center gap-1 text-yellow-500 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(institution.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : isDark ? 'text-gray-600' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{institution.rating}/5.0</div>
          </div>

          <div className="text-right">
            <div className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Completion</div>
            <div className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{institution.completionRate}%</div>
          </div>

          <div className="text-right">
            <div className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Revenue</div>
            <div className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{institution.revenue}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button className={`w-9 h-9 flex items-center justify-center border rounded-lg transition-all ${
            isDark 
              ? 'border-white/10 hover:bg-white/10' 
              : 'border-gray-300 hover:bg-gray-50'
          }`}>
            <Edit2 className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
          </button>
          <button className={`w-9 h-9 flex items-center justify-center border rounded-lg transition-all ${
            isDark 
              ? 'border-white/10 hover:bg-white/10' 
              : 'border-gray-300 hover:bg-gray-50'
          }`}>
            <BarChart2 className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
          </button>
          <button className={`w-9 h-9 flex items-center justify-center border rounded-lg transition-all ${
            isDark 
              ? 'border-white/10 hover:bg-white/10' 
              : 'border-gray-300 hover:bg-gray-50'
          }`}>
            <MoreVertical className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Create Institution Modal Component
interface CreateInstitutionModalProps {
  setIsModalOpen: (isOpen: boolean) => void;
  isDark: boolean;
}

const CreateInstitutionModal: React.FC<CreateInstitutionModalProps> = ({ setIsModalOpen, isDark }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'university',
    location: '',
    country: 'USA',
    email: '',
    phone: '',
    website: '',
    founded: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating institution:', formData);
    setIsModalOpen(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsModalOpen(false);
      }}
    >
      <div className={`modal-content rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto ${
        isDark ? 'bg-slate-900' : 'bg-white'
      }`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Add New Institution</h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${
              isDark 
                ? 'bg-white/10 hover:bg-white/20 text-gray-300' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Institution Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter institution name"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark 
                    ? 'bg-white/5 border-white/10 text-white placeholder-gray-500' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark 
                      ? 'bg-white/5 border-white/10 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="university">University</option>
                  <option value="college">College</option>
                  <option value="school">School</option>
                  <option value="academy">Academy</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Founded Year
                </label>
                <input
                  type="text"
                  value={formData.founded}
                  onChange={(e) => setFormData({ ...formData, founded: e.target.value })}
                  placeholder="1861"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark 
                      ? 'bg-white/5 border-white/10 text-white placeholder-gray-500' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="City, State"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark 
                      ? 'bg-white/5 border-white/10 text-white placeholder-gray-500' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Country</label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark 
                      ? 'bg-white/5 border-white/10 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="USA">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="Japan">Japan</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                </select>
              </div>
            </div>

            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="info@institution.edu"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark 
                    ? 'bg-white/5 border-white/10 text-white placeholder-gray-500' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark 
                      ? 'bg-white/5 border-white/10 text-white placeholder-gray-500' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="www.institution.edu"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark 
                      ? 'bg-white/5 border-white/10 text-white placeholder-gray-500' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className={`flex-1 px-6 py-3 border rounded-lg font-semibold transition-all ${
                isDark 
                  ? 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10' 
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Add Institution
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Institution Detail Modal Component
interface InstitutionDetailModalProps {
  institution: Institution | null;
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

const InstitutionDetailModal: React.FC<InstitutionDetailModalProps> = ({ institution, isOpen, onClose, isDark }) => {
  if (!isOpen || !institution) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`modal-content rounded-2xl p-8 max-w-5xl w-full max-h-[90vh] overflow-y-auto ${
        isDark ? 'bg-slate-900' : 'bg-white'
      }`}>
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div
              className="w-20 h-20 rounded-xl flex items-center justify-center text-4xl"
              style={{ backgroundColor: `${institution.color}15` }}
            >
              {institution.logo}
            </div>
            <div>
              <h2 className={`text-3xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>{institution.name}</h2>
              <div className={`flex items-center gap-3 text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {institution.location}, {institution.country}
                </span>
                <span>•</span>
                <span>Est. {institution.founded}</span>
                <span>•</span>
                <span className="capitalize">{institution.type}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${
              isDark 
                ? 'bg-white/10 hover:bg-white/20 text-gray-300' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            ✕
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className={`p-5 rounded-xl text-center ${isDark ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
            <div className={`text-3xl font-black ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{institution.totalStudents.toLocaleString()}</div>
            <div className={`text-xs uppercase tracking-wider mt-1 font-bold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Students</div>
          </div>
          <div className={`p-5 rounded-xl text-center ${isDark ? 'bg-green-500/10' : 'bg-green-50'}`}>
            <div className={`text-3xl font-black ${isDark ? 'text-green-400' : 'text-green-600'}`}>{institution.totalFaculty}</div>
            <div className={`text-xs uppercase tracking-wider mt-1 font-bold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Faculty</div>
          </div>
          <div className={`p-5 rounded-xl text-center ${isDark ? 'bg-purple-500/10' : 'bg-purple-50'}`}>
            <div className={`text-3xl font-black ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>{institution.departments}</div>
            <div className={`text-xs uppercase tracking-wider mt-1 font-bold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Departments</div>
          </div>
          <div className={`p-5 rounded-xl text-center ${isDark ? 'bg-orange-500/10' : 'bg-orange-50'}`}>
            <div className={`text-3xl font-black ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>{institution.courses}</div>
            <div className={`text-xs uppercase tracking-wider mt-1 font-bold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Courses</div>
          </div>
        </div>

        {/* Tabs */}
        <div className={`border-b mb-6 ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
          <div className="flex gap-8">
            {['Overview', 'Performance', 'Contact', 'Accreditation'].map((tab) => (
              <button
                key={tab}
                className={`pb-3 text-sm font-bold transition-all ${
                  isDark 
                    ? 'text-gray-400 hover:text-blue-400 border-b-2 border-transparent hover:border-blue-400' 
                    : 'text-gray-600 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <h3 className={`text-lg font-black mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Institution Details</h3>
              <div className="space-y-3 text-sm">
                <div className={`flex justify-between py-2 border-b ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Revenue:</span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{institution.revenue}</span>
                </div>
                <div className={`flex justify-between py-2 border-b ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Completion Rate:</span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{institution.completionRate}%</span>
                </div>
                <div className={`flex justify-between py-2 border-b ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Enrollment Growth:</span>
                  <span className={`font-bold ${isDark ? 'text-emerald-400' : 'text-green-600'}`}>+{institution.enrollmentGrowth}%</span>
                </div>
                <div className={`flex justify-between py-2 border-b ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Rating:</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{institution.rating}/5.0</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className={`text-lg font-black mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Contact Information</h3>
              <div className="space-y-3">
                <div className={`flex items-center gap-3 p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                  <Mail className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                  <div>
                    <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Email</div>
                    <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{institution.contact.email}</div>
                  </div>
                </div>
                <div className={`flex items-center gap-3 p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                  <Phone className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                  <div>
                    <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Phone</div>
                    <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{institution.contact.phone}</div>
                  </div>
                </div>
                <div className={`flex items-center gap-3 p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                  <Globe className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                  <div>
                    <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Website</div>
                    <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{institution.contact.website}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div>
              <h3 className={`text-lg font-black mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Performance Metrics</h3>
              <div className="space-y-3">
                {[
                  { label: 'Student Satisfaction', value: institution.performanceMetrics.studentSatisfaction, color: 'bg-blue-500' },
                  { label: 'Graduation Rate', value: institution.performanceMetrics.graduationRate, color: 'bg-green-500' },
                  { label: 'Employment Rate', value: institution.performanceMetrics.employmentRate, color: 'bg-purple-500' },
                  { label: 'Research Output', value: institution.performanceMetrics.researchOutput, color: 'bg-orange-500' },
                ].map((metric) => (
                  <div key={metric.label}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className={`font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{metric.label}</span>
                      <span className={`font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>{metric.value}%</span>
                    </div>
                    <div className={`h-2.5 rounded-full overflow-hidden ${isDark ? 'bg-white/5' : 'bg-gray-200'}`}>
                      <div
                        className={`h-full ${metric.color} transition-all duration-1000`}
                        style={{ width: `${metric.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className={`text-lg font-black mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Accreditation</h3>
              <div className="flex flex-wrap gap-2">
                {institution.accreditation.map((acc) => (
                  <span
                    key={acc}
                    className={`px-3 py-1.5 rounded-xl text-sm font-bold ${
                      isDark 
                        ? 'bg-blue-500/10 text-blue-400' 
                        : 'bg-blue-50 text-blue-700'
                    }`}
                  >
                    {acc}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button className={`flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-xl transition-all`}>
            View Full Analytics
          </button>
          <button className={`px-6 py-3 border rounded-xl font-bold transition-all ${
            isDark 
              ? 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10' 
              : 'border-gray-300 bg-white hover:bg-gray-50'
          }`}>
            Edit Institution
          </button>
        </div>
      </div>
    </div>
  );
};

// Advanced Filter Modal Component
interface AdvancedFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

const AdvancedFilterModal: React.FC<AdvancedFilterModalProps> = ({ isOpen, onClose, isDark }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`modal-content rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto ${
        isDark ? 'bg-slate-900' : 'bg-white'
      }`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>Advanced Filters</h2>
          <button
            onClick={onClose}
            className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${
              isDark 
                ? 'bg-white/10 hover:bg-white/20 text-gray-300' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Student Count Range */}
          <div>
            <label className={`block text-sm font-bold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Student Count Range</label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Min students"
                className={`w-full px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                  isDark 
                    ? 'bg-white/5 border-white/10 text-white placeholder-gray-500' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
              <input
                type="number"
                placeholder="Max students"
                className={`w-full px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                  isDark 
                    ? 'bg-white/5 border-white/10 text-white placeholder-gray-500' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
          </div>

          {/* Completion Rate */}
          <div>
            <label className={`block text-sm font-bold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Minimum Completion Rate
            </label>
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="80"
              className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${
                isDark ? 'bg-white/5' : 'bg-gray-200'
              }`}
            />
            <div className={`flex justify-between text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Founded Year Range */}
          <div>
            <label className={`block text-sm font-bold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Founded Year Range</label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="From year"
                className={`w-full px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                  isDark 
                    ? 'bg-white/5 border-white/10 text-white placeholder-gray-500' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
              <input
                type="number"
                placeholder="To year"
                className={`w-full px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                  isDark 
                    ? 'bg-white/5 border-white/10 text-white placeholder-gray-500' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
          </div>

          {/* Accreditation */}
          <div>
            <label className={`block text-sm font-bold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Accreditation</label>
            <div className="grid grid-cols-3 gap-2">
              {['ABET', 'AACSB', 'NEASC', 'WASC', 'QAA', 'EQUIS'].map((acc) => (
                <label key={acc} className={`flex items-center gap-2 p-3 rounded-xl cursor-pointer transition-all ${
                  isDark 
                    ? 'bg-white/5 hover:bg-white/10' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}>
                  <input type="checkbox" className="w-4 h-4 text-blue-600" />
                  <span className={`text-sm font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{acc}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className={`flex-1 px-6 py-3 border-2 rounded-xl font-bold transition-all ${
              isDark 
                ? 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10' 
                : 'border-gray-300 bg-white hover:bg-gray-50'
            }`}
          >
            Reset Filters
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-xl transition-all"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

// Export Modal Component
interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, isDark }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`modal-content rounded-2xl p-8 max-w-lg w-full ${
        isDark ? 'bg-slate-900' : 'bg-white'
      }`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>Export Institutions</h2>
          <button
            onClick={onClose}
            className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${
              isDark 
                ? 'bg-white/10 hover:bg-white/20 text-gray-300' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Export Format</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { format: 'CSV', icon: '📊' },
                { format: 'Excel', icon: '📗' },
                { format: 'PDF', icon: '📄' },
                { format: 'JSON', icon: '{ }' },
              ].map((option) => (
                <button
                  key={option.format}
                  className={`p-4 border-2 rounded-xl transition-all text-center ${
                    isDark 
                      ? 'border-white/10 hover:border-blue-500 hover:bg-blue-500/10' 
                      : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                  }`}
                >
                  <div className="text-2xl mb-1">{option.icon}</div>
                  <div className={`text-sm font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{option.format}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Include</label>
            <div className="space-y-2">
              {['Basic Details', 'Contact Information', 'Performance Metrics', 'Accreditation'].map((option) => (
                <label key={option} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                  isDark 
                    ? 'bg-white/5 hover:bg-white/10' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}>
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
                  <span className={`text-sm font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{option}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className={`flex-1 px-6 py-3 border-2 rounded-xl font-bold transition-all ${
              isDark 
                ? 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10' 
                : 'border-gray-300 bg-white hover:bg-gray-50'
            }`}
          >
            Cancel
          </button>
          <button className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-xl transition-all">
            Export
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstitutionsPage;