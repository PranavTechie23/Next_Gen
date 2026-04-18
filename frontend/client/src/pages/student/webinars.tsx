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
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedWebinars, setBookmarkedWebinars] = useState<number[]>([]);
  const [registeredWebinars, setRegisteredWebinars] = useState<number[]>([1, 3]);
  const [showFilters, setShowFilters] = useState(false);

  // Theme-aware styles
  const cardBgClass = 'bg-white/5 dark:bg-slate-900/40 border-white/10 backdrop-blur-3xl premium-card-glow transition-all duration-500 hover:border-primary/50';
  const textPrimaryClass = 'text-foreground';
  const textSecondaryClass = 'text-muted-foreground';
  const textMutedClass = 'text-muted-foreground/70';
  const inputBgClass = 'bg-white/5 dark:bg-slate-900/40 border-white/10 text-foreground';
  const hoverBgClass = 'hover:bg-white/10 dark:hover:bg-slate-800/60 transition-colors duration-300';
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
      title: "SQL One Shot - Complete Database Course",
      description: "Learn databases, queries, and more in one session by Shraddha Khapra. Perfect for beginners.",
      speaker: {
        name: "Shraddha Khapra",
        role: "Co-founder, Apna College",
        image: "SK",
        rating: 4.9,
        students: "5M+"
      },
      date: "Feb 10, 2026",
      time: "6:00 PM IST",
      duration: "3.5 hours",
      category: "Technical Skills",
      level: "Beginner",
      seats: "unlimited",
      price: "Free",
      tags: ["SQL", "Database"],
      thumbnail: "https://img.youtube.com/vi/hlGoQC332VM/hqdefault.jpg",
      url: "https://www.youtube.com/watch?v=hlGoQC332VM",
      liveNow: true,
      registered: 1245,
      rating: 4.9,
    },
    {
      id: 13,
      title: "SDE Sheet - Complete Placement Guide",
      description: "The ultimate guide to crack top tech interviews. Master DSA with the famous Striver's SDE Sheet.",
      speaker: {
        name: "Striver",
        role: "Founder, takeUforward",
        image: "RV",
        rating: 5.0,
        students: "2M+"
      },
      date: "Feb 12, 2026",
      time: "8:00 PM IST",
      duration: "1 hour",
      category: "Interview Prep",
      level: "Advanced",
      seats: "unlimited",
      price: "Free",
      tags: ["DSA", "Placement"],
      thumbnail: "https://img.youtube.com/vi/WNtzUR_MwUQ/hqdefault.jpg",
      url: "https://www.youtube.com/watch?v=WNtzUR_MwUQ",
      liveNow: false,
      registered: 4500,
      rating: 5.0,
    },
    {
      id: 17,
      title: "Full Stack Web3 Development Cohort",
      description: "Learn Blockchains, Smart Contracts, and DApps from scratch by Harkirat Singh.",
      speaker: {
        name: "Harkirat Singh",
        role: "Founder, 100xDevs",
        image: "HS",
        rating: 4.9,
        students: "500K+"
      },
      date: "Feb 15, 2026",
      time: "9:00 PM IST",
      duration: "3 hours",
      category: "Technical Skills",
      level: "Advanced",
      seats: "limited",
      price: "Free",
      tags: ["Web3", "Blockchain"],
      thumbnail: "https://i.ytimg.com/vi/M576WGiDBdQ/hqdefault.jpg",
      url: "https://www.youtube.com/watch?v=M576WGiDBdQ",
      liveNow: true,
      registered: 8900,
      rating: 4.9,
    },
    {
      id: 14,
      title: "Java Full Course for Beginners",
      description: "Master Java programming from scratch in one go by Bro Code.",
      speaker: {
        name: "Bro Code",
        role: "Tech Educator",
        image: "BC",
        rating: 4.9,
        students: "3M+"
      },
      date: "Feb 18, 2026",
      time: "10:00 PM IST",
      duration: "12 hours",
      category: "Technical Skills",
      level: "Beginner",
      seats: "unlimited",
      price: "Free",
      tags: ["Java", "Programming"],
      thumbnail: "https://i.ytimg.com/vi/xk4_1vDrzzo/hqdefault.jpg",
      url: "https://www.youtube.com/watch?v=xk4_1vDrzzo",
      liveNow: false,
      registered: 3200,
      rating: 4.9,
    },
    {
      id: 3,
      title: "JavaScript Mastery - Chai aur Code",
      description: "Deep dive into JavaScript core concepts with Hitesh Choudhary.",
      speaker: {
        name: "Hitesh Choudhary",
        role: "Founder, Chai aur Code",
        image: "HC",
        rating: 4.8,
        students: "1M+"
      },
      date: "Feb 20, 2026",
      time: "5:00 PM IST",
      duration: "20 hours",
      category: "Technical Skills",
      level: "Intermediate",
      seats: "unlimited",
      price: "Free",
      tags: ["JavaScript", "Web Dev"],
      thumbnail: "https://i.ytimg.com/vi/Hr5iLG7sUa0/hqdefault.jpg",
      url: "https://www.youtube.com/watch?v=Hr5iLG7sUa0",
      liveNow: false,
      registered: 1567,
      rating: 4.8,
    },
    {
      id: 4,
      title: "Complete DSA Roadmap 2026",
      description: "Master Data Structures and Algorithms with Love Babbar.",
      speaker: {
        name: "Love Babbar",
        role: "Founder, CodeHelp",
        image: "LB",
        rating: 5.0,
        students: "2M+"
      },
      date: "Feb 22, 2026",
      time: "7:00 PM IST",
      duration: "10 hours",
      category: "Interview Prep",
      level: "Beginner",
      seats: "unlimited",
      price: "Free",
      tags: ["DSA", "Placement"],
      thumbnail: "https://img.youtube.com/vi/WQoB2z67hvY/hqdefault.jpg",
      url: "https://www.youtube.com/watch?v=WQoB2z67hvY",
      liveNow: false,
      registered: 2134,
      rating: 5.0,
    },
    {
      id: 5,
      title: "React.js Complete Course 2026",
      description: "Build modern web apps with React 19 by CodeWithHarry.",
      speaker: {
        name: "Harry",
        role: "Founder, CodeWithHarry",
        image: "CH",
        rating: 4.9,
        students: "4M+"
      },
      date: "Feb 25, 2026",
      time: "7:00 PM IST",
      duration: "5 hours",
      category: "Technical Skills",
      level: "Intermediate",
      seats: "unlimited",
      price: "Free",
      tags: ["React", "Frontend"],
      thumbnail: "https://img.youtube.com/vi/6l8RWV8D-Yo/hqdefault.jpg",
      url: "https://www.youtube.com/watch?v=6l8RWV8D-Yo",
      liveNow: false,
      registered: 1200,
      rating: 4.9,
    },
    {
      id: 6,
      title: "Next.js 14 Ultimate Guide",
      description: "Learn Next.js 14/15 with JS Mastery.",
      speaker: {
        name: "Adrian Hajdin",
        role: "Founder, JS Mastery",
        image: "AH",
        rating: 4.9,
        students: "800K+"
      },
      date: "Feb 27, 2026",
      time: "6:00 PM IST",
      duration: "6 hours",
      category: "Technical Skills",
      level: "Advanced",
      seats: "unlimited",
      price: "Free",
      tags: ["Next.js", "Fullstack"],
      thumbnail: "https://img.youtube.com/vi/wm5gMKuwSYk/hqdefault.jpg",
      url: "https://www.youtube.com/watch?v=wm5gMKuwSYk",
      liveNow: false,
      registered: 1890,
      rating: 4.9,
    }
  ];

  const pastWebinars = [
    {
      id: 7,
      title: "Python Full Course for Beginners",
      description: "Master Python programming with Mosh Hamedani. The most comprehensive and popular Python course for absolute beginners.",
      speaker: {
        name: "Mosh Hamedani",
        role: "Software Engineer & Educator",
        image: "MH",
        rating: 4.9,
      },
      date: "Jan 25, 2026",
      duration: "6 hours",
      category: "Technical Skills",
      views: "44M",
      rating: 4.9,
      thumbnail: "https://i.ytimg.com/vi/_uQrJ0TkZlc/hqdefault.jpg",
      url: "https://www.youtube.com/watch?v=_uQrJ0TkZlc",
      recordingAvailable: true,
    },
    {
      id: 15,
      title: "C Full Course for Beginners",
      description: "Master C programming with Bro Code. The best starting point for every coder.",
      speaker: {
        name: "Bro Code",
        role: "Tech Educator",
        image: "BC",
        rating: 4.9,
      },
      date: "Jan 22, 2026",
      duration: "4 hours",
      category: "Technical Skills",
      views: "1.5M",
      rating: 4.9,
      thumbnail: "https://img.youtube.com/vi/87SH2Cn0s9A/hqdefault.jpg",
      url: "https://www.youtube.com/watch?v=87SH2Cn0s9A",
      recordingAvailable: true,
    },
    {
      id: 18,
      title: "System Design Concepts for Beginners",
      description: "Learn the core principles of building scalable systems: vertical vs horizontal scaling, load balancing, and more with NeetCode.",
      speaker: {
        name: "FreeCodeCamp",
        role: "Coding Education Platform",
        image: "FC",
        rating: 5.0,
      },
      date: "Jan 18, 2026",
      duration: "1 hour",
      category: "Technical Skills",
      views: "4.5M",
      rating: 5.0,
      thumbnail: "https://i.ytimg.com/vi/F2FmTdLtb_4/hqdefault.jpg",
      url: "https://youtu.be/F2FmTdLtb_4?si=4FYe2OEgRaq5uGXb",
      recordingAvailable: true,
    },
    {
      id: 16,
      title: "Git & GitHub Tutorial",
      description: "Learn version control from scratch by Kunal Kushwaha. Essential for developer life.",
      speaker: {
        name: "Kunal Kushwaha",
        role: "Founder, WeMakeDevs",
        image: "KK",
        rating: 5.0,
      },
      date: "Jan 15, 2026",
      duration: "2 hours",
      category: "Technical Skills",
      views: "800K",
      rating: 5.0,
      thumbnail: "https://img.youtube.com/vi/apGV9Kg7ics/hqdefault.jpg",
      url: "https://www.youtube.com/watch?v=apGV9Kg7ics",
      recordingAvailable: true,
    },
    {
      id: 8,
      title: "MongoDB Tutorial for Beginners",
      description: "Complete MongoDB course in Hindi. Learn NoSQL databases with local setup and cloud atlas.",
      speaker: {
        name: "Harry",
        role: "Founder, CodeWithHarry",
        image: "CH",
        rating: 4.9,
      },
      date: "Jan 18, 2026",
      duration: "3 hours",
      category: "Technical Skills",
      views: "1.2M",
      rating: 4.9,
      thumbnail: "https://img.youtube.com/vi/oSIv-E60NiU/hqdefault.jpg",
      url: "https://www.youtube.com/watch?v=oSIv-E60NiU",
      recordingAvailable: true,
    },
    {
      id: 9,
      title: "Complete CSS Tutorial for Beginners",
      description: "Learn CSS from basic to advanced including Flexbox and Grid in one shot by Apna College.",
      speaker: {
        name: "Shraddha Khapra",
        role: "Co-founder, Apna College",
        image: "SK",
        rating: 4.9,
      },
      date: "Jan 15, 2026",
      duration: "9 hours",
      category: "Technical Skills",
      views: "3.5M",
      rating: 4.9,
      thumbnail: "https://img.youtube.com/vi/ESnrn1kAD4E/hqdefault.jpg",
      url: "https://www.youtube.com/watch?v=ESnrn1kAD4E",
      recordingAvailable: true,
    },
    {
      id: 12,
      title: "HTML Full Course for Beginners",
      description: "Learn HTML5 from scratch in this one-shot course by Apna College. Every tag explained.",
      speaker: {
        name: "Shraddha Khapra",
        role: "Co-founder, Apna College",
        image: "SK",
        rating: 4.9,
      },
      date: "Jan 12, 2026",
      duration: "2 hours",
      category: "Technical Skills",
      views: "4M",
      rating: 4.9,
      thumbnail: "https://img.youtube.com/vi/HcOc7P5BMi4/hqdefault.jpg",
      url: "https://www.youtube.com/watch?v=HcOc7P5BMi4",
      recordingAvailable: true,
    }
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
    <div className={`${!isDashboard ? "relative min-h-dvh overflow-x-hidden bg-transparent" : "bg-transparent"} transition-colors duration-300`}>
      {/* Premium Background Glows */}
      {!isDashboard && (
        <div className="premium-glow-bg">
          <div className="premium-glow-1" />
          <div className="premium-glow-2" />
          <div className="premium-glow-3" />
        </div>
      )}
      {!isDashboard && (
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm transition-colors duration-300">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={handleBack} className="hover:bg-muted">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div className="h-6 w-px bg-border"></div>
                <div className="flex items-center gap-0">
                  <img src="/NG/NextGen_light.png" alt="NextGen Logo" className="h-12 w-12 object-contain flex-shrink-0" />
                  <div>
                    <span className="font-bold text-lg bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Webinars</span>
                    <p className="text-xs text-muted-foreground">Live Learning Sessions</p>
                  </div>
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
          <div className={`flex items-center gap-2 p-4 ${darkMode ? 'bg-red-500/10 border-red-500/90' : 'bg-red-50 border-red-200'} border rounded-xl mb-6`}>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <Radio className="w-5 h-5 text-red-600" />
              <span className={`font-semibold ${darkMode ? 'text-red-500' : 'text-red-700'}`}>1 webinar is LIVE now!</span>
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

        {/* Main Content Grid - Side by side layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-12">
          {activeTab === 'upcoming' && (
            <>
              {upcomingWebinars.map((webinar) => (
                <Card
                  key={webinar.id}
                  className={`${cardBgClass} hover:shadow-2xl transition-all duration-300 overflow-hidden group border-2 border-transparent hover:border-blue-500/30 cursor-pointer flex flex-col h-full`}
                  onClick={() => (webinar as any).url && window.open((webinar as any).url, '_blank')}
                >
                  <div className="relative">
                    {/* Thumbnail */}
                    <div className="h-56 relative overflow-hidden">
                      <img
                        src={webinar.thumbnail}
                        alt={webinar.title}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80";
                        }}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center transform group-hover:scale-110 transition-all border border-white/30">
                          <Play className="w-8 h-8 text-white fill-current" />
                        </div>
                      </div>

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
                        } text-white px-3 py-1 rounded-lg text-sm font-semibold shadow-md`}>
                        {webinar.level}
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6 flex-1 flex flex-col">
                    {/* Category & Price */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'
                        }`}>
                        {webinar.category}
                      </span>
                      <span className="text-sm font-black text-blue-500">FREE</span>
                    </div>

                    {/* Title */}
                    <h3 className={`text-xl font-black ${textPrimaryClass} mb-3 leading-tight group-hover:text-blue-500 transition-colors`}>
                      {webinar.title}
                    </h3>

                    {/* Description */}
                    <p className={`${textSecondaryClass} text-sm mb-6 line-clamp-2`}>
                      {webinar.description}
                    </p>

                    {/* Speaker Info */}
                    <div className="flex items-center gap-4 mb-6 pt-4 border-t border-slate-200 dark:border-slate-800 mt-auto">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black shadow-lg">
                        {webinar.speaker.image}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`font-bold ${textPrimaryClass} text-sm truncate`}>{webinar.speaker.name}</p>
                          <svg className="w-4 h-4 text-blue-500 fill-current" viewBox="0 0 24 24">
                            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zM10 17l-5-5 1.4-1.4 3.6 3.6 7.6-7.6L19 8l-9 9z" />
                          </svg>
                        </div>
                        <p className={`text-xs ${textMutedClass} font-medium truncate`}>{webinar.speaker.role}</p>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-500/10 rounded-lg flex-shrink-0">
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        <span className={`text-sm font-black ${textPrimaryClass}`}>{webinar.speaker.rating}</span>
                      </div>
                    </div>

                    {/* Meta Info Grid */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-6">
                      <div className="flex items-center gap-2.5">
                        <Calendar className={`w-4 h-4 ${textMutedClass}`} />
                        <span className={`text-xs font-bold ${textSecondaryClass}`}>{webinar.date}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Clock className={`w-4 h-4 ${textMutedClass}`} />
                        <span className={`text-xs font-bold ${textSecondaryClass}`}>{webinar.duration}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Users className={`w-4 h-4 ${textMutedClass}`} />
                        <span className={`text-xs font-bold ${textSecondaryClass}`}>{webinar.speaker.students} Students</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Globe className={`w-4 h-4 ${textMutedClass}`} />
                        <span className={`text-xs font-bold ${textSecondaryClass}`}>YouTube Live</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Button
                        asChild
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black tracking-wide h-12 rounded-xl shadow-lg shadow-blue-500/20"
                      >
                        <a href={webinar.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                          <PlayCircle className="w-5 h-5 mr-2" />
                          Watch on YouTube
                        </a>
                      </Button>
                      <Button variant="outline" className={`w-12 h-12 p-0 rounded-xl ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                        <Share2 className="w-5 h-5" />
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
                <Card
                  key={webinar.id}
                  className={`${cardBgClass} hover:shadow-2xl transition-all duration-300 overflow-hidden group border-2 border-transparent hover:border-blue-500/30 cursor-pointer flex flex-col`}
                  onClick={() => (webinar as any).url && window.open((webinar as any).url, '_blank')}
                >
                  <div className="relative">
                    {/* Thumbnail */}
                    <div className="h-56 relative overflow-hidden">
                      <img
                        src={webinar.thumbnail}
                        alt={webinar.title}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80";
                        }}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center transform group-hover:scale-110 transition-all border border-white/30">
                          <Play className="w-8 h-8 text-white fill-current" />
                        </div>
                      </div>

                      {/* Category Badge */}
                      <div className="absolute top-4 left-4 flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg shadow-lg">
                        <span className="text-sm font-semibold uppercase">{webinar.category}</span>
                      </div>

                      {/* Views Badge */}
                      <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-lg">
                        <Eye className="w-4 h-4" />
                        <span className="text-xs font-bold">{webinar.views} views</span>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
                        }`}>
                        Recorded Session
                      </span>
                    </div>

                    <h3 className={`text-xl font-black ${textPrimaryClass} mb-3 leading-tight group-hover:text-blue-500 transition-colors`}>
                      {webinar.title}
                    </h3>

                    <p className={`${textSecondaryClass} text-sm mb-6 line-clamp-2`}>
                      {webinar.description}
                    </p>

                    <div className="flex items-center gap-4 mb-6 pt-4 border-t border-slate-200 dark:border-slate-800 mt-auto">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black shadow-lg">
                        {webinar.speaker.image}
                      </div>
                      <div className="flex-1">
                        <p className={`font-bold ${textPrimaryClass} text-sm`}>{webinar.speaker.name}</p>
                        <p className={`text-xs ${textMutedClass} font-medium`}>{webinar.speaker.role}</p>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-500/10 rounded-lg">
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        <span className={`text-sm font-black ${textPrimaryClass}`}>{webinar.rating}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-6">
                      <div className="flex items-center gap-2.5">
                        <Calendar className={`w-4 h-4 ${textMutedClass}`} />
                        <span className={`text-xs font-bold ${textSecondaryClass}`}>{webinar.date}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Clock className={`w-4 h-4 ${textMutedClass}`} />
                        <span className={`text-xs font-bold ${textSecondaryClass}`}>{webinar.duration}</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        asChild
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black tracking-wide h-12 rounded-xl shadow-lg shadow-blue-500/20"
                      >
                        <a href={webinar.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                          <PlayCircle className="w-5 h-5 mr-2" />
                          Watch Recording
                        </a>
                      </Button>
                      <Button variant="outline" className={`w-12 h-12 p-0 rounded-xl ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                        <Share2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          )}

          {activeTab === 'registered' && (
            <>
              {upcomingWebinars.filter(w => registeredWebinars.includes(w.id)).map((webinar) => (
                <Card
                  key={webinar.id}
                  className={`${cardBgClass} hover:shadow-xl transition-all duration-300 border-2 border-green-500 cursor-pointer`}
                  onClick={() => webinar.url && window.open(webinar.url, '_blank')}
                >
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
      </main>
    </div>
  );
}