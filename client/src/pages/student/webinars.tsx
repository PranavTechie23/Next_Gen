import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  Video,
  BookOpen,
  Star,
  TrendingUp,
  Award,
  Play,
  Search,
  Filter,
  Download,
  Share2,
  Bookmark,
  Bell,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Globe,
  MapPin,
  Heart,
  MessageSquare,
  Eye,
  ThumbsUp,
  Zap,
  Target,
  Briefcase,
  GraduationCap,
  Code,
  Brain,
  Lightbulb,
  Rocket,
  CheckCircle,
  XCircle,
  AlertCircle,
  Settings,
  Moon,
  Sun,
  Mail,
  Linkedin,
  Twitter,
  Facebook,
  Link2,
  MoreVertical,
  Plus,
  Minus,
  BarChart3,
  PieChart,
  LineChart,
  TrendingDown,
  Activity,
  Radio,
  PlayCircle,
  PauseCircle,
  Volume2,
  Maximize2,
  Send,
  Smile,
  Paperclip,
  Image as ImageIcon,
  Gift,
  Shield,
  Lock,
  Sparkles
} from "lucide-react";
import { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";

export default function StudentWebinar(props: any) {
  const isDashboard = props?.isDashboard || false;
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedWebinars, setBookmarkedWebinars] = useState<number[]>([]);
  const [registeredWebinars, setRegisteredWebinars] = useState<number[]>([1, 3]);
  const [showFilters, setShowFilters] = useState(false);

  // Theme-aware styles
  const cardBgClass = 'bg-card border-border';
  const textPrimaryClass = 'text-foreground';
  const textSecondaryClass = 'text-muted-foreground';
  const textMutedClass = 'text-muted-foreground/70';
  const inputBgClass = 'bg-background border-border text-foreground';
  const hoverBgClass = 'hover:bg-muted';
  const { theme } = useTheme();
  const darkMode = theme === "dark";

  const handleBack = () => {
    window.history.back();
  };

  const toggleBookmark = (id: number) => {
    if (bookmarkedWebinars.includes(id)) {
      setBookmarkedWebinars(bookmarkedWebinars.filter(wId => wId !== id));
    } else {
      setBookmarkedWebinars([...bookmarkedWebinars, id]);
    }
  };

  const toggleRegistration = (id: number) => {
    if (registeredWebinars.includes(id)) {
      setRegisteredWebinars(registeredWebinars.filter(wId => wId !== id));
    } else {
      setRegisteredWebinars([...registeredWebinars, id]);
    }
  };

  const categories = [
    { id: 'all', name: 'All Webinars', icon: Globe, count: 24 },
    { id: 'technical', name: 'Technical Skills', icon: Code, count: 8 },
    { id: 'career', name: 'Career Development', icon: Briefcase, count: 6 },
    { id: 'interview', name: 'Interview Prep', icon: Target, count: 5 },
    { id: 'industry', name: 'Industry Insights', icon: TrendingUp, count: 5 },
  ];

  const stats = [
    {
      icon: Video,
      label: 'Webinars Attended',
      value: '12',
      change: '+3 this month',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      icon: Award,
      label: 'Certificates Earned',
      value: '8',
      change: '+2 new',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      icon: Clock,
      label: 'Learning Hours',
      value: '24h',
      change: '+5h this week',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10'
    },
    {
      icon: Star,
      label: 'Avg Rating Given',
      value: '4.8',
      change: 'Excellent',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-500/10'
    },
  ];

  const upcomingWebinars = [
    {
      id: 1,
      title: "Advanced Python for Data Science",
      description: "Master advanced Python concepts including decorators, generators, and async programming for data science applications.",
      speaker: {
        name: "Dr. Amit Sharma",
        role: "Senior Data Scientist, Google",
        image: "AS",
        rating: 4.9,
        students: "15K+"
      },
      date: "Jan 28, 2026",
      time: "6:00 PM - 8:00 PM IST",
      duration: "2 hours",
      category: "Technical Skills",
      level: "Advanced",
      seats: "245 / 500",
      price: "Free",
      tags: ["Python", "Data Science", "ML"],
      thumbnail: "gradient-1",
      liveNow: false,
      registered: 1245,
      rating: 4.8,
      languages: ["English", "Hindi"],
      certificateOffered: true,
      recordingAvailable: true,
    },
    {
      id: 2,
      title: "Cracking FAANG Interviews",
      description: "Learn proven strategies and techniques to ace technical interviews at top tech companies like Google, Amazon, and Microsoft.",
      speaker: {
        name: "Priya Gupta",
        role: "Engineering Manager, Amazon",
        image: "PG",
        rating: 4.9,
        students: "20K+"
      },
      date: "Jan 30, 2026",
      time: "7:00 PM - 9:00 PM IST",
      duration: "2 hours",
      category: "Interview Prep",
      level: "Intermediate",
      seats: "180 / 400",
      price: "₹299",
      tags: ["Interviews", "DSA", "System Design"],
      thumbnail: "gradient-2",
      liveNow: false,
      registered: 985,
      rating: 4.9,
      languages: ["English"],
      certificateOffered: true,
      recordingAvailable: true,
    },
    {
      id: 3,
      title: "React & Next.js Masterclass",
      description: "Build modern, scalable web applications with React 19 and Next.js 15. Covers server components, streaming, and more.",
      speaker: {
        name: "Rahul Verma",
        role: "Lead Frontend Engineer, Microsoft",
        image: "RV",
        rating: 4.8,
        students: "12K+"
      },
      date: "Feb 1, 2026",
      time: "5:00 PM - 7:30 PM IST",
      duration: "2.5 hours",
      category: "Technical Skills",
      level: "Intermediate",
      seats: "320 / 600",
      price: "Free",
      tags: ["React", "Next.js", "Frontend"],
      thumbnail: "gradient-3",
      liveNow: true,
      registered: 1567,
      rating: 4.7,
      languages: ["English", "Hindi"],
      certificateOffered: true,
      recordingAvailable: true,
    },
    {
      id: 4,
      title: "AI & Machine Learning Career Path",
      description: "Explore career opportunities in AI/ML, required skills, and how to transition into this exciting field in 2026.",
      speaker: {
        name: "Dr. Sneha Patel",
        role: "AI Research Lead, Meta",
        image: "SP",
        rating: 5.0,
        students: "25K+"
      },
      date: "Feb 3, 2026",
      time: "6:30 PM - 8:30 PM IST",
      duration: "2 hours",
      category: "Career Development",
      level: "Beginner",
      seats: "150 / 450",
      price: "Free",
      tags: ["AI", "ML", "Career"],
      thumbnail: "gradient-4",
      liveNow: false,
      registered: 2134,
      rating: 4.9,
      languages: ["English"],
      certificateOffered: true,
      recordingAvailable: true,
    },
    {
      id: 5,
      title: "Building Scalable Backend Systems",
      description: "Design and implement highly scalable backend architectures using microservices, Docker, and Kubernetes.",
      speaker: {
        name: "Vikram Singh",
        role: "Principal Engineer, Netflix",
        image: "VS",
        rating: 4.9,
        students: "18K+"
      },
      date: "Feb 5, 2026",
      time: "7:00 PM - 9:30 PM IST",
      duration: "2.5 hours",
      category: "Technical Skills",
      level: "Advanced",
      seats: "95 / 300",
      price: "₹499",
      tags: ["Backend", "Microservices", "DevOps"],
      thumbnail: "gradient-5",
      liveNow: false,
      registered: 756,
      rating: 4.8,
      languages: ["English"],
      certificateOffered: true,
      recordingAvailable: true,
    },
    {
      id: 6,
      title: "Personal Branding for Engineers",
      description: "Learn how to build your personal brand on LinkedIn, create impactful content, and attract recruiters.",
      speaker: {
        name: "Ananya Krishnan",
        role: "Tech Influencer & Career Coach",
        image: "AK",
        rating: 4.7,
        students: "30K+"
      },
      date: "Feb 7, 2026",
      time: "6:00 PM - 7:30 PM IST",
      duration: "1.5 hours",
      category: "Career Development",
      level: "Beginner",
      seats: "420 / 800",
      price: "Free",
      tags: ["LinkedIn", "Branding", "Career"],
      thumbnail: "gradient-6",
      liveNow: false,
      registered: 1890,
      rating: 4.6,
      languages: ["English", "Hindi"],
      certificateOffered: false,
      recordingAvailable: true,
    },
  ];

  const pastWebinars = [
    {
      id: 7,
      title: "Introduction to Cloud Computing",
      description: "Comprehensive overview of AWS, Azure, and GCP cloud platforms and their core services.",
      speaker: {
        name: "Rajesh Kumar",
        role: "Cloud Architect, Amazon",
        image: "RK",
        rating: 4.8,
      },
      date: "Jan 20, 2026",
      duration: "2 hours",
      category: "Technical Skills",
      views: "3.2K",
      rating: 4.7,
      recordingAvailable: true,
    },
    {
      id: 8,
      title: "Resume Writing Workshop",
      description: "Create ATS-friendly resumes that get you interviews at top companies.",
      speaker: {
        name: "Meera Shah",
        role: "HR Director, Microsoft",
        image: "MS",
        rating: 4.9,
      },
      date: "Jan 18, 2026",
      duration: "1.5 hours",
      category: "Career Development",
      views: "5.1K",
      rating: 4.8,
      recordingAvailable: true,
    },
    {
      id: 9,
      title: "Blockchain & Web3 Fundamentals",
      description: "Understand blockchain technology, cryptocurrencies, and decentralized applications.",
      speaker: {
        name: "Arjun Malhotra",
        role: "Blockchain Developer, Polygon",
        image: "AM",
        rating: 4.6,
      },
      date: "Jan 15, 2026",
      duration: "2.5 hours",
      category: "Technical Skills",
      views: "2.8K",
      rating: 4.5,
      recordingAvailable: true,
    },
  ];

  const featuredSpeakers = [
    {
      id: 1,
      name: "Dr. Amit Sharma",
      role: "Senior Data Scientist",
      company: "Google",
      image: "AS",
      rating: 4.9,
      webinars: 15,
      students: "15K+",
      specialization: "Data Science & ML"
    },
    {
      id: 2,
      name: "Priya Gupta",
      role: "Engineering Manager",
      company: "Amazon",
      image: "PG",
      rating: 4.9,
      webinars: 12,
      students: "20K+",
      specialization: "Interview Preparation"
    },
    {
      id: 3,
      name: "Rahul Verma",
      role: "Lead Frontend Engineer",
      company: "Microsoft",
      image: "RV",
      rating: 4.8,
      webinars: 18,
      students: "12K+",
      specialization: "Frontend Development"
    },
    {
      id: 4,
      name: "Dr. Sneha Patel",
      role: "AI Research Lead",
      company: "Meta",
      image: "SP",
      rating: 5.0,
      webinars: 20,
      students: "25K+",
      specialization: "AI & ML"
    },
  ];

  const trendingTopics = [
    { name: "Artificial Intelligence", count: 145, trending: true },
    { name: "System Design", count: 98, trending: true },
    { name: "React & Next.js", count: 87, trending: false },
    { name: "Cloud Computing", count: 76, trending: true },
    { name: "Interview Preparation", count: 134, trending: true },
    { name: "Data Structures", count: 112, trending: false },
  ];

  return (
    <div className={`${!isDashboard ? "min-h-screen bg-background" : "bg-transparent"} transition-colors duration-300`}>
      {!isDashboard && (
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm transition-colors duration-300">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={handleBack} className="hover:bg-muted">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div className="h-6 w-px bg-border"></div>
                <div className="w-14 h-14 flex items-center justify-center">
                  <img src={darkMode ? "/images/NextGen_dark.png" : "/images/NextGen_light.jpg"} alt="NextGen Logo" className="w-full h-full object-contain scale-125" />
                </div>
                <div>
                  <span className="font-bold text-lg bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Webinars</span>
                  <p className="text-xs text-muted-foreground">Live Learning Sessions</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <Button variant="ghost" size="sm" className="relative hover:bg-muted">
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
                </Button>
                <div className="h-6 w-px bg-border"></div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-primary">RK</span>
                  </div>
                  <span className="text-sm font-medium hidden sm:block">Rahul Kumar</span>
                </div>
              </div>
            </div>
          </div>
        </header>
      )}

      <main className={`${!isDashboard ? "container mx-auto px-4 sm:px-6 lg:px-8 py-10" : "py-0"}`}>
        {/* Welcome Section - Hide if dashboard */}
        {!isDashboard && (
          <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
                Live & Interactive Learning <Sparkles className="h-6 w-6 text-yellow-500" />
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                Connect with industry experts, learn trending technologies, and accelerate your career with our curated live sessions.
              </p>
            </div>
            <div className="flex bg-card p-1.5 rounded-2xl gap-2 border border-border shadow-sm">
              <Button
                variant={activeTab === 'all' ? 'default' : 'ghost'}
                className={`rounded-xl px-6 font-bold text-xs uppercase tracking-widest h-11 ${activeTab === 'all' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground'}`}
                onClick={() => setActiveTab('all')}
              >
                All Sessions
              </Button>
              <Button
                variant={activeTab === 'live' ? 'default' : 'ghost'}
                className={`rounded-xl px-6 font-bold text-xs uppercase tracking-widest h-11 ${activeTab === 'live' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground'}`}
                onClick={() => setActiveTab('live')}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  Live Now
                </div>
              </Button>
            </div>
          </div>
        )}
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className={`text-4xl font-bold ${textPrimaryClass} mb-2`}>
                Live Webinars & Workshops
              </h1>
              <p className={`text-lg ${textSecondaryClass}`}>
                Learn from industry experts and boost your career
              </p>
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
              <Calendar className="w-4 h-4 mr-2" />
              My Schedule
            </Button>
          </div>

          {/* Live Indicator */}
          <div className={`flex items-center gap-2 p-4 ${darkMode ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200'} border rounded-xl mb-6`}>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <Radio className="w-5 h-5 text-red-600" />
              <span className={`font-semibold ${darkMode ? 'text-red-400' : 'text-red-700'}`}>1 webinar is LIVE now!</span>
            </div>
            <ChevronRight className={`w-5 h-5 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className={`${cardBgClass} hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group`}>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <CardContent className="pt-6 relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className={`text-3xl font-bold ${textPrimaryClass} mb-1`}>{stat.value}</h3>
                  <p className={`text-sm ${textSecondaryClass} mb-1`}>{stat.label}</p>
                  <p className={`text-xs ${textMutedClass}`}>{stat.change}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Search and Filters */}
        <Card className={`${cardBgClass} mb-8 shadow-lg`}>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${textMutedClass}`} />
                <input
                  type="text"
                  placeholder="Search webinars, topics, or speakers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-11 pr-4 py-3 border ${inputBgClass} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={`${darkMode ? 'border-slate-600 text-slate-300' : 'border-slate-300'}`}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {showFilters ? <ChevronLeft className="w-4 h-4 ml-2" /> : <ChevronRight className="w-4 h-4 ml-2" />}
              </Button>
              <Button variant="outline" className={`${darkMode ? 'border-slate-600 text-slate-300' : 'border-slate-300'}`}>
                <Download className="w-4 h-4 mr-2" />
                Calendar
              </Button>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 mt-4">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all ${selectedCategory === category.id
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 border-blue-600 text-white'
                      : darkMode
                        ? 'border-slate-600 text-slate-300 hover:border-slate-500'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{category.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${selectedCategory === category.id
                      ? 'bg-white/20'
                      : darkMode
                        ? 'bg-slate-700'
                        : 'bg-slate-100'
                      }`}>
                      {category.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Navigation Tabs */}
        <div className={`flex gap-1 p-1 ${darkMode ? 'bg-slate-800' : 'bg-slate-100'} rounded-xl mb-8 overflow-x-auto`}>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 whitespace-nowrap px-6 py-3 rounded-lg font-medium transition-all ${activeTab === 'upcoming'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
              : `${textSecondaryClass} ${hoverBgClass}`
              }`}
          >
            Upcoming Webinars
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`flex-1 whitespace-nowrap px-6 py-3 rounded-lg font-medium transition-all ${activeTab === 'past'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
              : `${textSecondaryClass} ${hoverBgClass}`
              }`}
          >
            Past Recordings
          </button>
          <button
            onClick={() => setActiveTab('registered')}
            className={`flex-1 whitespace-nowrap px-6 py-3 rounded-lg font-medium transition-all ${activeTab === 'registered'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
              : `${textSecondaryClass} ${hoverBgClass}`
              }`}
          >
            My Registrations
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Webinar List */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'upcoming' && (
              <>
                {upcomingWebinars.map((webinar) => (
                  <Card key={webinar.id} className={`${cardBgClass} hover:shadow-2xl transition-all duration-300 overflow-hidden group`}>
                    <div className="relative">
                      {/* Thumbnail */}
                      <div className={`h-48 bg-gradient-to-br ${webinar.thumbnail === 'gradient-1' ? 'from-blue-500 to-cyan-500' :
                        webinar.thumbnail === 'gradient-2' ? 'from-purple-500 to-pink-500' :
                          webinar.thumbnail === 'gradient-3' ? 'from-green-500 to-emerald-500' :
                            webinar.thumbnail === 'gradient-4' ? 'from-orange-500 to-red-500' :
                              webinar.thumbnail === 'gradient-5' ? 'from-indigo-500 to-purple-500' :
                                'from-pink-500 to-rose-500'
                        } flex items-center justify-center relative overflow-hidden`}>
                        <PlayCircle className="w-16 h-16 text-white opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all" />

                        {/* Live Badge */}
                        {webinar.liveNow && (
                          <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1.5 rounded-lg shadow-lg">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            <span className="text-sm font-semibold">LIVE NOW</span>
                          </div>
                        )}

                        {/* Level Badge */}
                        <div className={`absolute top-4 right-4 ${webinar.level === 'Beginner' ? 'bg-green-600' :
                          webinar.level === 'Intermediate' ? 'bg-yellow-600' :
                            'bg-red-600'
                          } text-white px-3 py-1 rounded-lg text-sm font-semibold`}>
                          {webinar.level}
                        </div>

                        {/* Bookmark */}
                        <button
                          onClick={() => toggleBookmark(webinar.id)}
                          className="absolute bottom-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/30 transition-all"
                        >
                          <Bookmark className={`w-5 h-5 ${bookmarkedWebinars.includes(webinar.id) ? 'fill-white text-white' : 'text-white'}`} />
                        </button>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      {/* Category & Price */}
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'
                          }`}>
                          {webinar.category}
                        </span>
                        <span className={`text-lg font-bold ${webinar.price === 'Free'
                          ? darkMode ? 'text-green-400' : 'text-green-600'
                          : darkMode ? 'text-orange-400' : 'text-orange-600'
                          }`}>
                          {webinar.price}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className={`text-xl font-bold ${textPrimaryClass} mb-2 group-hover:text-blue-600 transition-colors`}>
                        {webinar.title}
                      </h3>

                      {/* Description */}
                      <p className={`${textSecondaryClass} text-sm mb-4 line-clamp-2`}>
                        {webinar.description}
                      </p>

                      {/* Speaker Info */}
                      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">
                          {webinar.speaker.image}
                        </div>
                        <div className="flex-1">
                          <p className={`font-semibold ${textPrimaryClass} text-sm`}>{webinar.speaker.name}</p>
                          <p className={`text-xs ${textMutedClass}`}>{webinar.speaker.role}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className={`text-sm font-semibold ${textPrimaryClass}`}>{webinar.speaker.rating}</span>
                        </div>
                      </div>

                      {/* Meta Info */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className={`w-4 h-4 ${textMutedClass}`} />
                          <span className={`text-sm ${textSecondaryClass}`}>{webinar.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className={`w-4 h-4 ${textMutedClass}`} />
                          <span className={`text-sm ${textSecondaryClass}`}>{webinar.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className={`w-4 h-4 ${textMutedClass}`} />
                          <span className={`text-sm ${textSecondaryClass}`}>{webinar.seats} seats</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Globe className={`w-4 h-4 ${textMutedClass}`} />
                          <span className={`text-sm ${textSecondaryClass}`}>{webinar.languages.join(', ')}</span>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {webinar.tags.map((tag, idx) => (
                          <span key={idx} className={`text-xs px-2 py-1 rounded-lg ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'
                            }`}>
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Features */}
                      <div className="flex items-center gap-4 mb-4 text-xs">
                        {webinar.certificateOffered && (
                          <div className="flex items-center gap-1 text-green-600">
                            <Award className="w-4 h-4" />
                            <span>Certificate</span>
                          </div>
                        )}
                        {webinar.recordingAvailable && (
                          <div className="flex items-center gap-1 text-blue-600">
                            <Video className="w-4 h-4" />
                            <span>Recording</span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3">
                        <Button
                          onClick={() => toggleRegistration(webinar.id)}
                          className={`flex-1 ${registeredWebinars.includes(webinar.id)
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                            } text-white`}
                        >
                          {registeredWebinars.includes(webinar.id) ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Registered
                            </>
                          ) : (
                            <>
                              <Calendar className="w-4 h-4 mr-2" />
                              Register Now
                            </>
                          )}
                        </Button>
                        <Button variant="outline" className={`${darkMode ? 'border-slate-600' : 'border-slate-300'}`}>
                          <Share2 className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" className={`${darkMode ? 'border-slate-600' : 'border-slate-300'}`}>
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}

            {activeTab === 'past' && (
              <>
                {pastWebinars.map((webinar) => (
                  <Card key={webinar.id} className={`${cardBgClass} hover:shadow-xl transition-all duration-300`}>
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center flex-shrink-0">
                          <Play className="w-12 h-12 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
                              {webinar.category}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'}`}>
                              Recording Available
                            </span>
                          </div>
                          <h3 className={`text-lg font-bold ${textPrimaryClass} mb-2`}>{webinar.title}</h3>
                          <p className={`text-sm ${textSecondaryClass} mb-3 line-clamp-2`}>{webinar.description}</p>

                          <div className="flex items-center gap-4 mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                                {webinar.speaker.image}
                              </div>
                              <span className={`text-sm ${textSecondaryClass}`}>{webinar.speaker.name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className={`text-sm ${textSecondaryClass}`}>{webinar.rating}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className={`w-4 h-4 ${textMutedClass}`} />
                              <span className={`text-sm ${textSecondaryClass}`}>{webinar.views} views</span>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                              <Play className="w-4 h-4 mr-2" />
                              Watch Recording
                            </Button>
                            <Button variant="outline" className={`${darkMode ? 'border-slate-600' : 'border-slate-300'}`}>
                              <Download className="w-4 h-4 mr-2" />
                              Resources
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}

            {activeTab === 'registered' && (
              <>
                {upcomingWebinars.filter(w => registeredWebinars.includes(w.id)).map((webinar) => (
                  <Card key={webinar.id} className={`${cardBgClass} hover:shadow-xl transition-all duration-300 border-2 border-green-500`}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-semibold text-green-600">You're Registered!</span>
                      </div>

                      <h3 className={`text-xl font-bold ${textPrimaryClass} mb-3`}>{webinar.title}</h3>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className={`w-4 h-4 ${textMutedClass}`} />
                          <span className={`text-sm ${textSecondaryClass}`}>{webinar.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className={`w-4 h-4 ${textMutedClass}`} />
                          <span className={`text-sm ${textSecondaryClass}`}>{webinar.time}</span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white">
                          <Calendar className="w-4 h-4 mr-2" />
                          Add to Calendar
                        </Button>
                        <Button variant="outline" className={`${darkMode ? 'border-slate-600' : 'border-slate-300'}`}>
                          <Mail className="w-4 h-4 mr-2" />
                          Reminder
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {registeredWebinars.length === 0 && (
                  <Card className={`${cardBgClass}`}>
                    <CardContent className="p-12 text-center">
                      <Calendar className={`w-16 h-16 ${textMutedClass} mx-auto mb-4`} />
                      <h3 className={`text-xl font-bold ${textPrimaryClass} mb-2`}>No Registrations Yet</h3>
                      <p className={`${textSecondaryClass} mb-6`}>Browse upcoming webinars and register to start learning!</p>
                      <Button onClick={() => setActiveTab('upcoming')} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                        Browse Webinars
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Featured Speakers */}
            <Card className={`${cardBgClass} shadow-lg`}>
              <CardHeader>
                <CardTitle className={`text-lg ${textPrimaryClass} flex items-center gap-2`}>
                  <Award className="w-5 h-5 text-blue-600" />
                  Featured Speakers
                </CardTitle>
                <CardDescription className={textSecondaryClass}>Learn from the best in the industry</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {featuredSpeakers.map((speaker) => (
                    <div key={speaker.id} className={`p-3 rounded-xl ${hoverBgClass} transition-colors cursor-pointer`}>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">
                          {speaker.image}
                        </div>
                        <div className="flex-1">
                          <p className={`font-semibold ${textPrimaryClass} text-sm`}>{speaker.name}</p>
                          <p className={`text-xs ${textMutedClass}`}>{speaker.company}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className={`text-xs ${textSecondaryClass}`}>{speaker.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className={textMutedClass}>{speaker.webinars} webinars</span>
                        <span className={textMutedClass}>{speaker.students} students</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trending Topics */}
            <Card className={`${cardBgClass} shadow-lg`}>
              <CardHeader>
                <CardTitle className={`text-lg ${textPrimaryClass} flex items-center gap-2`}>
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Trending Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trendingTopics.map((topic, idx) => (
                    <div key={idx} className={`flex items-center justify-between p-2 rounded-lg ${hoverBgClass} transition-colors cursor-pointer`}>
                      <div className="flex items-center gap-2">
                        {topic.trending && <Zap className="w-4 h-4 text-orange-500" />}
                        <span className={`text-sm font-medium ${textPrimaryClass}`}>{topic.name}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
                        {topic.count}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className={`${cardBgClass} shadow-lg`}>
              <CardHeader>
                <CardTitle className={`text-lg ${textPrimaryClass} flex items-center gap-2`}>
                  <Rocket className="w-5 h-5 text-purple-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <button className={`w-full text-left p-3 rounded-xl ${hoverBgClass} transition-all flex items-center gap-3`}>
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-semibold ${textPrimaryClass}`}>My Schedule</p>
                      <p className={`text-xs ${textMutedClass}`}>View all upcoming sessions</p>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${textMutedClass}`} />
                  </button>

                  <button className={`w-full text-left p-3 rounded-xl ${hoverBgClass} transition-all flex items-center gap-3`}>
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-semibold ${textPrimaryClass}`}>My Certificates</p>
                      <p className={`text-xs ${textMutedClass}`}>8 certificates earned</p>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${textMutedClass}`} />
                  </button>

                  <button className={`w-full text-left p-3 rounded-xl ${hoverBgClass} transition-all flex items-center gap-3`}>
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Bookmark className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-semibold ${textPrimaryClass}`}>Bookmarks</p>
                      <p className={`text-xs ${textMutedClass}`}>{bookmarkedWebinars.length} saved webinars</p>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${textMutedClass}`} />
                  </button>

                  <button className={`w-full text-left p-3 rounded-xl ${hoverBgClass} transition-all flex items-center gap-3`}>
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                      <Download className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-semibold ${textPrimaryClass}`}>Downloads</p>
                      <p className={`text-xs ${textMutedClass}`}>Resources & materials</p>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${textMutedClass}`} />
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card className={`${cardBgClass} shadow-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white`}>
              <CardContent className="pt-6">
                <Globe className="w-12 h-12 mb-4 opacity-80" />
                <h3 className="text-2xl font-bold mb-2">Join 28K+ Students</h3>
                <p className="text-blue-100 text-sm mb-4">Learning from industry experts every week</p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                    <p className="text-2xl font-bold">245+</p>
                    <p className="text-xs text-blue-100">Live Sessions</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                    <p className="text-2xl font-bold">4.8★</p>
                    <p className="text-xs text-blue-100">Avg Rating</p>
                  </div>
                </div>
                <Button className="w-full bg-white text-blue-600 hover:bg-blue-50">
                  Invite Friends
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming This Week */}
            <Card className={`${cardBgClass} shadow-lg`}>
              <CardHeader>
                <CardTitle className={`text-lg ${textPrimaryClass} flex items-center gap-2`}>
                  <Clock className="w-5 h-5 text-blue-600" />
                  This Week's Highlights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className={`p-3 rounded-xl border-2 border-blue-500 ${darkMode ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-xs font-semibold text-blue-600">Tomorrow</span>
                    </div>
                    <p className={`text-sm font-semibold ${textPrimaryClass} mb-1`}>Advanced Python</p>
                    <p className={`text-xs ${textMutedClass}`}>6:00 PM - Dr. Amit Sharma</p>
                  </div>

                  <div className={`p-3 rounded-xl border ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className={`w-3 h-3 ${textMutedClass}`} />
                      <span className={`text-xs ${textMutedClass}`}>Jan 30</span>
                    </div>
                    <p className={`text-sm font-semibold ${textPrimaryClass} mb-1`}>FAANG Interviews</p>
                    <p className={`text-xs ${textMutedClass}`}>7:00 PM - Priya Gupta</p>
                  </div>

                  <div className={`p-3 rounded-xl border ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className={`w-3 h-3 ${textMutedClass}`} />
                      <span className={`text-xs ${textMutedClass}`}>Feb 1</span>
                    </div>
                    <p className={`text-sm font-semibold ${textPrimaryClass} mb-1`}>React Masterclass</p>
                    <p className={`text-xs ${textMutedClass}`}>5:00 PM - Rahul Verma</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Newsletter Signup */}
        <Card className={`${cardBgClass} shadow-xl mt-12`}>
          <CardContent className="p-8">
            <div className="max-w-3xl mx-auto text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Bell className="w-8 h-8 text-white" />
              </div>
              <h2 className={`text-3xl font-bold ${textPrimaryClass} mb-3`}>Never Miss a Webinar</h2>
              <p className={`text-lg ${textSecondaryClass} mb-6`}>
                Get weekly updates about upcoming sessions, new speakers, and exclusive content
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={`flex-1 px-4 py-3 border ${inputBgClass} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8">
                  Subscribe
                </Button>
              </div>
              <p className={`text-xs ${textMutedClass} mt-3`}>
                Join 15,000+ students already subscribed
              </p>
            </div>
          </CardContent>
        </Card>
      </main >

      {/* Footer */}
      < footer className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border-t mt-16 py-8 transition-colors duration-300`
      }>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-12 h-12 flex items-center justify-center">
                  <img src={darkMode ? "/images/NextGen_dark.png" : "/images/NextGen_light.jpg"} alt="NextGen Logo" className="w-full h-full object-contain scale-125" />
                </div>
                <span className={`font-bold text-lg ${textPrimaryClass}`}>NextGen</span>
              </div>
              <p className={`text-sm ${textSecondaryClass}`}>
                Empowering students through live learning and expert guidance
              </p>
            </div>
            <div>
              <h3 className={`font-semibold ${textPrimaryClass} mb-4`}>Quick Links</h3>
              <ul className={`space-y-2 text-sm ${textSecondaryClass}`}>
                <li><a href="#" className={`${hoverBgClass} transition-colors`}>Browse Webinars</a></li>
                <li><a href="#" className={`${hoverBgClass} transition-colors`}>Become a Speaker</a></li>
                <li><a href="#" className={`${hoverBgClass} transition-colors`}>Certificates</a></li>
                <li><a href="#" className={`${hoverBgClass} transition-colors`}>Help Center</a></li>
              </ul>
            </div>
            <div>
              <h3 className={`font-semibold ${textPrimaryClass} mb-4`}>Resources</h3>
              <ul className={`space-y-2 text-sm ${textSecondaryClass}`}>
                <li><a href="#" className={`${hoverBgClass} transition-colors`}>Blog</a></li>
                <li><a href="#" className={`${hoverBgClass} transition-colors`}>FAQs</a></li>
                <li><a href="#" className={`${hoverBgClass} transition-colors`}>Community</a></li>
                <li><a href="#" className={`${hoverBgClass} transition-colors`}>Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className={`font-semibold ${textPrimaryClass} mb-4`}>Connect</h3>
              <div className="flex gap-3 mb-4">
                <a href="#" className={`w-10 h-10 ${darkMode ? 'bg-slate-700' : 'bg-slate-100'} rounded-lg flex items-center justify-center ${hoverBgClass} transition-colors`}>
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className={`w-10 h-10 ${darkMode ? 'bg-slate-700' : 'bg-slate-100'} rounded-lg flex items-center justify-center ${hoverBgClass} transition-colors`}>
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className={`w-10 h-10 ${darkMode ? 'bg-slate-700' : 'bg-slate-100'} rounded-lg flex items-center justify-center ${hoverBgClass} transition-colors`}>
                  <Mail className="w-5 h-5" />
                </a>
              </div>
              <p className={`text-sm ${textSecondaryClass}`}>
                support@campuscareer.com
              </p>
            </div>
          </div>
          <div className={`border-t ${darkMode ? 'border-slate-700' : 'border-slate-200'} pt-6 text-center`}>
            <p className={`text-sm ${textMutedClass}`}>
              &copy; 2026 NextGen. All rights reserved.
            </p>
          </div>
        </div>
      </footer >
    </div >
  );
}