import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ArrowLeft,
    Heart,
    Brain,
    Moon,
    Sun,
    Activity,
    TrendingUp,
    Calendar,
    Clock,
    Users,
    MessageSquare,
    Phone,
    Video,
    BookOpen,
    Headphones,
    Sparkles,
    Target,
    Award,
    Zap,
    CheckCircle2,
    AlertCircle,
    Info,
    Shield,
    Smile,
    Frown,
    Meh,
    ThumbsUp,
    Star,
    Play,
    Pause,
    SkipForward,
    Volume2,
    VolumeX,
    Repeat,
    Coffee,
    Footprints,
    Dumbbell,
    Apple,
    Wind,
    Waves,
    CloudRain,
    Flame,
    Leaf,
    Mountain,
    Sunrise,
    Music,
    PenTool,
    Palette,
    Settings,
    Bell,
    Search,
    Filter,
    Download,
    Share2,
    Bookmark,
    ChevronRight,
    ChevronDown,
    ChevronUp,
    MoreVertical,
    Plus,
    Minus,
    X,
    Check,
    Lock,
    Unlock,
    Eye,
    EyeOff,
    Mic,
    MicOff,
    Camera,
    Send,
    Mail,
    MapPin,
    Globe,
    Linkedin,
    Twitter,
    Facebook,
    Instagram,
    Youtube,
    TrendingDown,
    BarChart3,
    PieChart,
    LineChart
} from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function WellbeingHub(props: any) {
    const isDashboard = props?.isDashboard || false;
    const [activeTab, setActiveTab] = useState('overview');
    const [currentMood, setCurrentMood] = useState<string | null>(null);
    const [breathingActive, setBreathingActive] = useState(false);
    const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
    const [meditationPlaying, setMeditationPlaying] = useState(false);
    const [selectedMeditation, setSelectedMeditation] = useState<number | null>(null);
    const [stressLevel, setStressLevel] = useState(3);
    const [sleepHours, setSleepHours] = useState(7);
    const [waterIntake, setWaterIntake] = useState(6);
    const [exerciseMinutes, setExerciseMinutes] = useState(30);
    const [showGoalsModal, setShowGoalsModal] = useState(false);

    const handleBack = () => {
        window.history.back();
    };

    const moods = [
        { id: 'great', emoji: '😄', label: 'Great', color: 'from-green-500 to-emerald-500' },
        { id: 'good', emoji: '🙂', label: 'Good', color: 'from-blue-500 to-cyan-500' },
        { id: 'okay', emoji: '😐', label: 'Okay', color: 'from-yellow-500 to-orange-500' },
        { id: 'bad', emoji: '😔', label: 'Not Good', color: 'from-orange-500 to-red-500' },
        { id: 'terrible', emoji: '😢', label: 'Struggling', color: 'from-red-500 to-pink-500' },
    ];

    const stats = [
        {
            icon: Heart,
            label: 'Mood Score',
            value: '8.2/10',
            change: '+0.5 this week',
            color: 'from-pink-500 to-rose-500',
            trend: 'up'
        },
        {
            icon: Brain,
            label: 'Stress Level',
            value: 'Low',
            change: 'Improved',
            color: 'from-blue-500 to-cyan-500',
            trend: 'down'
        },
        {
            icon: Moon,
            label: 'Sleep Quality',
            value: '7.5hrs',
            change: '+30min',
            color: 'from-indigo-500 to-purple-500',
            trend: 'up'
        },
        {
            icon: Activity,
            label: 'Active Days',
            value: '5/7',
            change: 'On track',
            color: 'from-green-500 to-emerald-500',
            trend: 'up'
        },
    ];

    const moodHistory = [
        { date: 'Mon', mood: 8, color: '#10b981' },
        { date: 'Tue', mood: 7, color: '#3b82f6' },
        { date: 'Wed', mood: 6, color: '#f59e0b' },
        { date: 'Thu', mood: 8, color: '#10b981' },
        { date: 'Fri', mood: 9, color: '#10b981' },
        { date: 'Sat', mood: 8, color: '#10b981' },
        { date: 'Sun', mood: 7, color: '#3b82f6' },
    ];

    const quickActivities = [
        {
            id: 1,
            title: '5-Min Breathing',
            description: 'Quick stress relief exercise',
            icon: Wind,
            duration: '5 min',
            color: 'from-blue-500 to-cyan-500',
            difficulty: 'Easy'
        },
        {
            id: 2,
            title: 'Gratitude Journal',
            description: 'Write 3 things you\'re grateful for',
            icon: PenTool,
            duration: '10 min',
            color: 'from-purple-500 to-pink-500',
            difficulty: 'Easy'
        },
        {
            id: 3,
            title: 'Quick Meditation',
            description: 'Guided mindfulness session',
            icon: Brain,
            duration: '10 min',
            color: 'from-green-500 to-emerald-500',
            difficulty: 'Medium'
        },
        {
            id: 4,
            title: 'Desk Stretches',
            description: 'Release tension and improve posture',
            icon: Dumbbell,
            duration: '7 min',
            color: 'from-orange-500 to-red-500',
            difficulty: 'Easy'
        },
    ];

    const meditationTracks = [
        {
            id: 1,
            title: 'Morning Energy Boost',
            instructor: 'Sarah Johnson',
            duration: '10:00',
            category: 'Energy',
            plays: '12.5K',
            rating: 4.9,
            thumbnail: 'gradient-1'
        },
        {
            id: 2,
            title: 'Stress Relief Session',
            instructor: 'Dr. Mark Chen',
            duration: '15:00',
            category: 'Stress Relief',
            plays: '18.2K',
            rating: 4.8,
            thumbnail: 'gradient-2'
        },
        {
            id: 3,
            title: 'Sleep Meditation',
            instructor: 'Emma Williams',
            duration: '20:00',
            category: 'Sleep',
            plays: '25.8K',
            rating: 5.0,
            thumbnail: 'gradient-3'
        },
        {
            id: 4,
            title: 'Focus & Concentration',
            instructor: 'Alex Kumar',
            duration: '12:00',
            category: 'Focus',
            plays: '15.3K',
            rating: 4.7,
            thumbnail: 'gradient-4'
        },
    ];

    const supportResources = [
        {
            id: 1,
            type: 'Counseling',
            title: '24/7 Professional Counselors',
            description: 'Talk to licensed therapists anytime',
            icon: MessageSquare,
            color: 'from-blue-500 to-cyan-500',
            available: true,
            contact: 'Chat Now'
        },
        {
            id: 2,
            type: 'Hotline',
            title: 'Crisis Support Hotline',
            description: 'Immediate help for urgent situations',
            icon: Phone,
            color: 'from-red-500 to-pink-500',
            available: true,
            contact: '1800-XXX-XXXX'
        },
        {
            id: 3,
            type: 'Peer Support',
            title: 'Student Support Groups',
            description: 'Connect with peers facing similar challenges',
            icon: Users,
            color: 'from-purple-500 to-indigo-500',
            available: true,
            contact: 'Join Group'
        },
        {
            id: 4,
            type: 'Therapy',
            title: 'Video Therapy Sessions',
            description: 'Schedule one-on-one video sessions',
            icon: Video,
            color: 'from-green-500 to-emerald-500',
            available: true,
            contact: 'Book Session'
        },
    ];

    const wellnessArticles = [
        {
            id: 1,
            title: 'Managing Academic Stress: A Student\'s Guide',
            author: 'Dr. Priya Sharma',
            readTime: '8 min read',
            category: 'Stress Management',
            image: 'article-1',
            views: '5.2K',
            date: 'Jan 20, 2026'
        },
        {
            id: 2,
            title: 'The Importance of Sleep for Students',
            author: 'Prof. James Wilson',
            readTime: '6 min read',
            category: 'Sleep Health',
            image: 'article-2',
            views: '4.8K',
            date: 'Jan 18, 2026'
        },
        {
            id: 3,
            title: 'Building Healthy Study Habits',
            author: 'Sarah Mitchell',
            readTime: '10 min read',
            category: 'Productivity',
            image: 'article-3',
            views: '6.1K',
            date: 'Jan 15, 2026'
        },
    ];

    const dailyGoals = [
        { id: 1, title: 'Drink 8 glasses of water', completed: 6, total: 8, icon: Waves, color: 'text-blue-600' },
        { id: 2, title: 'Sleep 7-8 hours', completed: 1, total: 1, icon: Moon, color: 'text-indigo-600' },
        { id: 3, title: 'Exercise 30 minutes', completed: 30, total: 30, icon: Dumbbell, color: 'text-green-600' },
        { id: 4, title: 'Practice gratitude', completed: 0, total: 1, icon: Heart, color: 'text-pink-600' },
        { id: 5, title: 'Meditation session', completed: 0, total: 1, icon: Brain, color: 'text-purple-600' },
    ];

    const upcomingWorkshops = [
        {
            id: 1,
            title: 'Mindfulness for Exam Stress',
            instructor: 'Dr. Amit Verma',
            date: 'Jan 28, 2026',
            time: '6:00 PM',
            duration: '1 hour',
            seats: '45/50',
            category: 'Workshop',
            price: 'Free'
        },
        {
            id: 2,
            title: 'Building Resilience',
            instructor: 'Sarah Chen',
            date: 'Jan 30, 2026',
            time: '7:00 PM',
            duration: '1.5 hours',
            seats: '32/40',
            category: 'Webinar',
            price: 'Free'
        },
        {
            id: 3,
            title: 'Healthy Eating on Campus',
            instructor: 'Nutritionist Maya Patel',
            date: 'Feb 2, 2026',
            time: '5:30 PM',
            duration: '45 min',
            seats: '28/35',
            category: 'Workshop',
            price: 'Free'
        },
    ];

    const { theme } = useTheme();
    const darkMode = theme === "dark";

    const cardBgClass = `${darkMode ? 'bg-card/40' : 'bg-white/80'} backdrop-blur-3xl ${darkMode ? 'border-white/5' : 'border-slate-100'} shadow-[0_8px_30px_rgba(0,0,0,0.02)]`;
    const textPrimaryClass = `${darkMode ? 'text-white' : 'text-slate-900'}`;
    const textSecondaryClass = `${darkMode ? 'text-slate-400' : 'text-slate-600'}`;
    const textMutedClass = `${darkMode ? 'text-slate-500' : 'text-slate-500'}`;
    const headerBgClass = `${darkMode ? 'bg-black/80' : 'bg-white/80'} backdrop-blur-3xl border-border`;
    const inputBgClass = `${darkMode ? 'bg-white/5' : 'bg-slate-50/50'} border-border text-foreground`;
    const hoverBgClass = `${darkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`;


    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (breathingActive) {
            interval = setInterval(() => {
                setBreathingPhase(prev => {
                    if (prev === 'inhale') return 'hold';
                    if (prev === 'hold') return 'exhale';
                    return 'inhale';
                });
            }, 4000);
        }
        return () => clearInterval(interval);
    }, [breathingActive]);

    return (
        <div className={`${!isDashboard ? "min-h-screen bg-background" : "bg-transparent"} transition-colors duration-300`}>
            {/* Header - Only show if NOT in dashboard */}
            {!isDashboard && (
                <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm transition-colors duration-300">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center gap-3">
                                <Button variant="ghost" size="sm" onClick={handleBack}>
                                    <ArrowLeft className="w-4 h-4" />
                                </Button>
                                <div className={`h-6 w-px ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                                    <Heart className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <span className={`font-black text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent`}>Wellbeing Hub</span>
                                    <p className={`text-[10px] font-black uppercase tracking-widest ${textMutedClass}`}>Your Mental Health Companion</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <ThemeToggle />
                                <Button variant="ghost" size="sm" className="relative hover:bg-muted">
                                    <Bell className="w-4 h-4" />
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full"></span>
                                </Button>
                                <div className={`h-6 w-px ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                                        <span className="text-xs font-semibold text-purple-700">RK</span>
                                    </div>
                                    <span className={`text-sm font-medium ${textPrimaryClass} hidden sm:block`}>Rahul Kumar</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
            )}

            <main className={`${!isDashboard ? "container mx-auto px-4 sm:px-6 lg:px-8 py-8" : "py-0"}`}>
                {/* Hero Section - Hide if dashboard */}
                {!isDashboard && (
                    <div className="mb-8">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h1 className={`text-4xl font-black ${textPrimaryClass} mb-2 tracking-tight`}>
                                    Welcome Back, Rahul! 👋
                                </h1>
                                <p className={`text-lg font-medium ${textSecondaryClass}`}>
                                    How are you feeling today? Let's take care of your wellbeing together.
                                </p>
                            </div>
                            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                                <Phone className="w-4 h-4 mr-2" />
                                Emergency Help
                            </Button>
                        </div>
                    </div>
                )}

                {/* Mood Tracker */}
                <Card className={`${cardBgClass} shadow-lg mb-8`}>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Smile className="w-5 h-5 text-purple-600" />
                            <h3 className={`text-lg font-semibold ${textPrimaryClass}`}>How are you feeling right now?</h3>
                        </div>
                        <div className="grid grid-cols-5 gap-3">
                            {moods.map((mood) => (
                                <button
                                    key={mood.id}
                                    onClick={() => setCurrentMood(mood.id)}
                                    className={`p-4 rounded-3xl border-2 transition-all duration-300 ${currentMood === mood.id
                                        ? `bg-gradient-to-br ${mood.color} border-transparent text-white shadow-xl scale-105`
                                        : darkMode
                                            ? 'border-white/5 bg-white/5 hover:border-slate-500'
                                            : 'border-slate-50 bg-slate-50/50 hover:border-slate-200 shadow-sm shadow-blue-500/5'
                                        }`}
                                >
                                    <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">{mood.emoji}</div>
                                    <p className={`text-xs font-black uppercase tracking-widest ${currentMood === mood.id ? 'text-white' : textSecondaryClass}`}>
                                        {mood.label}
                                    </p>
                                </button>
                            ))}
                        </div>
                        {currentMood && (
                            <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 rounded-xl">
                                <p className={`text-sm ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                                    ✨ Thanks for sharing! We've logged your mood for today. Keep tracking to see your progress over time.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={index} className={`${cardBgClass} hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group`}>
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <CardContent className="pt-6 relative">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        {stat.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-600" />}
                                        {stat.trend === 'down' && <TrendingDown className="w-4 h-4 text-green-600" />}
                                    </div>
                                    <h3 className={`text-2xl md:text-3xl font-bold ${textPrimaryClass} mb-1`}>{stat.value}</h3>
                                    <p className={`text-sm ${textSecondaryClass} mb-1`}>{stat.label}</p>
                                    <p className={`text-xs ${textMutedClass}`}>{stat.change}</p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Breathing Exercise */}
                        <Card className={`${cardBgClass} shadow-lg overflow-hidden`}>
                            <CardHeader>
                                <CardTitle className={`${textPrimaryClass} flex items-center gap-2`}>
                                    <Wind className="w-5 h-5 text-blue-600" />
                                    Guided Breathing Exercise
                                </CardTitle>
                                <CardDescription className={textSecondaryClass}>
                                    Take a moment to relax and center yourself
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="relative">
                                    {/* Breathing Circle */}
                                    <div className="flex items-center justify-center h-64 relative">
                                        <div className={`absolute w-32 h-32 rounded-full transition-all duration-4000 ${breathingActive
                                            ? breathingPhase === 'inhale'
                                                ? 'scale-150 bg-gradient-to-br from-blue-400 to-cyan-400'
                                                : breathingPhase === 'hold'
                                                    ? 'scale-150 bg-gradient-to-br from-purple-400 to-pink-400'
                                                    : 'scale-100 bg-gradient-to-br from-green-400 to-emerald-400'
                                            : 'scale-100 bg-gradient-to-br from-slate-300 to-slate-400'
                                            } opacity-40 blur-xl`}></div>
                                        <div className={`w-32 h-32 rounded-full flex items-center justify-center shadow-2xl transition-all duration-4000 ${breathingActive
                                            ? breathingPhase === 'inhale'
                                                ? 'scale-150 bg-gradient-to-br from-blue-500 to-cyan-500'
                                                : breathingPhase === 'hold'
                                                    ? 'scale-150 bg-gradient-to-br from-purple-500 to-pink-500'
                                                    : 'scale-100 bg-gradient-to-br from-green-500 to-emerald-500'
                                            : 'scale-100 bg-gradient-to-br from-slate-400 to-slate-500'
                                            }`}>
                                            <div className="text-center text-white">
                                                {breathingActive ? (
                                                    <>
                                                        <p className="text-sm font-semibold capitalize">{breathingPhase}</p>
                                                        <p className="text-xs mt-1">4 seconds</p>
                                                    </>
                                                ) : (
                                                    <Wind className="w-12 h-12" />
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Controls */}
                                    <div className="flex justify-center gap-4 mt-6">
                                        <Button
                                            onClick={() => setBreathingActive(!breathingActive)}
                                            className={`${breathingActive
                                                ? 'bg-red-600 hover:bg-red-700'
                                                : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                                                } text-white`}
                                        >
                                            {breathingActive ? (
                                                <>
                                                    <Pause className="w-4 h-4 mr-2" />
                                                    Stop
                                                </>
                                            ) : (
                                                <>
                                                    <Play className="w-4 h-4 mr-2" />
                                                    Start
                                                </>
                                            )}
                                        </Button>
                                    </div>

                                    {/* Instructions */}
                                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl">
                                        <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                                            💡 <strong>Tip:</strong> Breathe in for 4 seconds, hold for 4 seconds, exhale for 4 seconds. Repeat for 5 minutes.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card >

                        {/* Quick Activities */}
                        < Card className={`${cardBgClass} shadow-lg`}>
                            <CardHeader>
                                <CardTitle className={`${textPrimaryClass} flex items-center gap-2`}>
                                    <Zap className="w-5 h-5 text-purple-600" />
                                    Quick Wellbeing Activities
                                </CardTitle>
                                <CardDescription className={textSecondaryClass}>
                                    5-10 minute exercises to boost your mood
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {quickActivities.map((activity) => {
                                        const Icon = activity.icon;
                                        return (
                                            <button
                                                key={activity.id}
                                                className={`p-4 rounded-xl border-2 ${darkMode ? 'border-slate-600' : 'border-slate-200'} ${hoverBgClass} transition-all text-left group hover:shadow-lg hover:-translate-y-1`}
                                            >
                                                <div className="flex items-start gap-3 mb-3">
                                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${activity.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                                        <Icon className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className={`font-semibold ${textPrimaryClass} mb-1`}>{activity.title}</h4>
                                                        <p className={`text-xs ${textMutedClass}`}>{activity.description}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className={`w-3 h-3 ${textMutedClass}`} />
                                                        <span className={`text-xs ${textSecondaryClass}`}>{activity.duration}</span>
                                                    </div>
                                                    <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
                                                        {activity.difficulty}
                                                    </span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card >

                        {/* Meditation Library */}
                        < Card className={`${cardBgClass} shadow-lg`}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className={`${textPrimaryClass} flex items-center gap-2`}>
                                            <Headphones className="w-5 h-5 text-green-600" />
                                            Guided Meditation Library
                                        </CardTitle>
                                        <CardDescription className={textSecondaryClass}>
                                            Professional meditation sessions for every mood
                                        </CardDescription>
                                    </div>
                                    <Button variant="ghost" size="sm">View All</Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {meditationTracks.map((track) => (
                                        <div
                                            key={track.id}
                                            className={`p-4 rounded-xl border-2 ${selectedMeditation === track.id
                                                ? 'border-green-500 bg-green-50 dark:bg-green-500/10'
                                                : darkMode
                                                    ? 'border-slate-600'
                                                    : 'border-slate-200'
                                                } ${hoverBgClass} transition-all`}
                                        >
                                            <div className="flex items-center gap-4">
                                                {/* Thumbnail */}
                                                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${track.thumbnail === 'gradient-1' ? 'from-orange-500 to-red-500' :
                                                    track.thumbnail === 'gradient-2' ? 'from-blue-500 to-cyan-500' :
                                                        track.thumbnail === 'gradient-3' ? 'from-indigo-500 to-purple-500' :
                                                            'from-green-500 to-emerald-500'
                                                    } flex items-center justify-center flex-shrink-0 shadow-lg`}>
                                                    {selectedMeditation === track.id && meditationPlaying ? (
                                                        <Pause className="w-6 h-6 text-white" />
                                                    ) : (
                                                        <Play className="w-6 h-6 text-white" />
                                                    )}
                                                </div>

                                                {/* Track Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className={`font-semibold ${textPrimaryClass} truncate`}>{track.title}</h4>
                                                        <span className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
                                                            {track.category}
                                                        </span>
                                                    </div>
                                                    <p className={`text-sm ${textSecondaryClass}`}>{track.instructor}</p>
                                                    <div className="flex items-center gap-4 mt-2 text-xs">
                                                        <div className="flex items-center gap-1">
                                                            <Clock className={`w-3 h-3 ${textMutedClass}`} />
                                                            <span className={textSecondaryClass}>{track.duration}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Users className={`w-3 h-3 ${textMutedClass}`} />
                                                            <span className={textSecondaryClass}>{track.plays}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                            <span className={textSecondaryClass}>{track.rating}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Play Button */}
                                                <Button
                                                    onClick={() => {
                                                        setSelectedMeditation(track.id);
                                                        setMeditationPlaying(!meditationPlaying);
                                                    }}
                                                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                                                >
                                                    {selectedMeditation === track.id && meditationPlaying ? (
                                                        <Pause className="w-4 h-4" />
                                                    ) : (
                                                        <Play className="w-4 h-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card >

                        {/* Daily Mood Chart */}
                        < Card className={`${cardBgClass} shadow-lg`}>
                            <CardHeader>
                                <CardTitle className={`${textPrimaryClass} flex items-center gap-2`}>
                                    <BarChart3 className="w-5 h-5 text-blue-600" />
                                    Your Mood This Week
                                </CardTitle>
                                <CardDescription className={textSecondaryClass}>
                                    Track your emotional wellbeing over time
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-end justify-between h-48 gap-2">
                                    {moodHistory.map((day, idx) => (
                                        <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                                            <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden flex-1 flex flex-col justify-end">
                                                <div
                                                    className="rounded-t-lg transition-all duration-500"
                                                    style={{
                                                        height: `${(day.mood / 10) * 100}%`,
                                                        backgroundColor: day.color
                                                    }}
                                                ></div>
                                            </div>
                                            <span className={`text-xs font-medium ${textSecondaryClass}`}>{day.date}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-500/10 dark:to-purple-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl">
                                    <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                                        📈 Great progress! Your mood has improved by 15% this week. Keep up the good habits!
                                    </p>
                                </div>
                            </CardContent>
                        </Card >

                        {/* Wellness Articles */}
                        < Card className={`${cardBgClass} shadow-lg`}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className={`${textPrimaryClass} flex items-center gap-2`}>
                                            <BookOpen className="w-5 h-5 text-purple-600" />
                                            Wellness Resources & Articles
                                        </CardTitle>
                                        <CardDescription className={textSecondaryClass}>
                                            Expert advice on mental health and wellbeing
                                        </CardDescription>
                                    </div>
                                    <Button variant="ghost" size="sm">View All</Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {wellnessArticles.map((article) => (
                                        <div
                                            key={article.id}
                                            className={`p-4 rounded-xl border ${darkMode ? 'border-slate-600' : 'border-slate-200'} ${hoverBgClass} transition-all cursor-pointer group`}
                                        >
                                            <div className="flex gap-4">
                                                <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0"></div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-700'}`}>
                                                            {article.category}
                                                        </span>
                                                        <span className={`text-xs ${textMutedClass}`}>{article.readTime}</span>
                                                    </div>
                                                    <h4 className={`font-semibold ${textPrimaryClass} mb-2 group-hover:text-purple-600 transition-colors`}>
                                                        {article.title}
                                                    </h4>
                                                    <div className="flex items-center gap-4 text-xs">
                                                        <span className={textSecondaryClass}>{article.author}</span>
                                                        <div className="flex items-center gap-1">
                                                            <Eye className={`w-3 h-3 ${textMutedClass}`} />
                                                            <span className={textSecondaryClass}>{article.views}</span>
                                                        </div>
                                                        <span className={textMutedClass}>{article.date}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card >
                    </div >

                    {/* Right Column - Sidebar */}
                    < div className="space-y-6" >
                        {/* Daily Goals */}
                        < Card className={`${cardBgClass} shadow-lg`}>
                            <CardHeader>
                                <CardTitle className={`text-lg ${textPrimaryClass} flex items-center gap-2`}>
                                    <Target className="w-5 h-5 text-blue-600" />
                                    Daily Wellness Goals
                                </CardTitle>
                                <CardDescription className={textSecondaryClass}>
                                    Track your daily habits
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {dailyGoals.map((goal) => {
                                        const Icon = goal.icon;
                                        const progress = (goal.completed / goal.total) * 100;
                                        return (
                                            <div key={goal.id}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <Icon className={`w-4 h-4 ${goal.color}`} />
                                                        <span className={`text-sm font-medium ${textPrimaryClass}`}>{goal.title}</span>
                                                    </div>
                                                    <span className={`text-xs ${textSecondaryClass}`}>
                                                        {goal.completed}/{goal.total}
                                                    </span>
                                                </div>
                                                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full bg-gradient-to-r ${progress === 100
                                                            ? 'from-green-500 to-emerald-500'
                                                            : 'from-blue-500 to-cyan-500'
                                                            } rounded-full transition-all duration-500`}
                                                        style={{ width: `${progress}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <Button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Custom Goal
                                </Button>
                            </CardContent>
                        </Card >

                        {/* Support Resources */}
                        < Card className={`${cardBgClass} shadow-lg`}>
                            <CardHeader>
                                <CardTitle className={`text-lg ${textPrimaryClass} flex items-center gap-2`}>
                                    <Shield className="w-5 h-5 text-green-600" />
                                    Support Resources
                                </CardTitle>
                                <CardDescription className={textSecondaryClass}>
                                    Professional help when you need it
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {supportResources.map((resource) => {
                                        const Icon = resource.icon;
                                        return (
                                            <button
                                                key={resource.id}
                                                className={`w-full p-4 rounded-xl border-2 ${darkMode ? 'border-slate-600' : 'border-slate-200'} ${hoverBgClass} transition-all text-left group hover:shadow-lg`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${resource.color} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                                                        <Icon className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className={`font-semibold ${textPrimaryClass} mb-1 text-sm`}>{resource.title}</h4>
                                                        <p className={`text-xs ${textMutedClass} mb-2`}>{resource.description}</p>
                                                        <div className="flex items-center gap-2">
                                                            {resource.available && (
                                                                <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 rounded-full">
                                                                    Available Now
                                                                </span>
                                                            )}
                                                            <span className="text-xs font-semibold text-blue-600">{resource.contact}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card >

                        {/* Crisis Support Banner */}
                        < Card className="bg-gradient-to-br from-red-500 to-pink-500 text-white shadow-lg border-0" >
                            <CardContent className="pt-6">
                                <AlertCircle className="w-12 h-12 mb-4 opacity-90" />
                                <h3 className="text-xl font-bold mb-2">Need Immediate Help?</h3>
                                <p className="text-sm text-red-100 mb-4">
                                    If you're in crisis or having thoughts of self-harm, please reach out immediately.
                                </p>
                                <div className="space-y-2">
                                    <Button className="w-full bg-white text-red-600 hover:bg-red-50">
                                        <Phone className="w-4 h-4 mr-2" />
                                        Call Crisis Hotline
                                    </Button>
                                    <Button className="w-full bg-white/20 text-white hover:bg-white/30 border border-white/30">
                                        <MessageSquare className="w-4 h-4 mr-2" />
                                        Chat with Counselor
                                    </Button>
                                </div>
                                <p className="text-xs text-red-100 mt-3 text-center">
                                    Available 24/7 • Confidential • Free
                                </p>
                            </CardContent>
                        </Card >

                        {/* Upcoming Workshops */}
                        < Card className={`${cardBgClass} shadow-lg`}>
                            <CardHeader>
                                <CardTitle className={`text-lg ${textPrimaryClass} flex items-center gap-2`}>
                                    <Calendar className="w-5 h-5 text-orange-600" />
                                    Upcoming Workshops
                                </CardTitle>
                                <CardDescription className={textSecondaryClass}>
                                    Live sessions on mental health
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {upcomingWorkshops.map((workshop) => (
                                        <div
                                            key={workshop.id}
                                            className={`p-3 rounded-xl border ${darkMode ? 'border-slate-600' : 'border-slate-200'} ${hoverBgClass} transition-all`}
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-700'}`}>
                                                    {workshop.category}
                                                </span>
                                                <span className="text-xs font-semibold text-green-600">{workshop.price}</span>
                                            </div>
                                            <h4 className={`font-semibold ${textPrimaryClass} text-sm mb-2`}>{workshop.title}</h4>
                                            <div className="space-y-1 text-xs mb-2">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className={`w-3 h-3 ${textMutedClass}`} />
                                                    <span className={textSecondaryClass}>{workshop.date} • {workshop.time}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Users className={`w-3 h-3 ${textMutedClass}`} />
                                                    <span className={textSecondaryClass}>{workshop.seats} seats</span>
                                                </div>
                                            </div>
                                            <Button size="sm" className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white text-xs">
                                                Register Now
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card >

                        {/* Self-Care Tips */}
                        < Card className={`${cardBgClass} shadow-lg`}>
                            <CardHeader>
                                <CardTitle className={`text-lg ${textPrimaryClass} flex items-center gap-2`}>
                                    <Sparkles className="w-5 h-5 text-yellow-600" />
                                    Daily Self-Care Tips
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'}`}>
                                        <div className="flex items-start gap-2">
                                            <Coffee className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                                                Take regular breaks during study sessions
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-green-500/10 border border-green-500/20' : 'bg-green-50 border border-green-200'}`}>
                                        <div className="flex items-start gap-2">
                                            <Footprints className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                            <p className={`text-sm ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
                                                Go for a 10-minute walk outdoors
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-purple-500/10 border border-purple-500/20' : 'bg-purple-50 border border-purple-200'}`}>
                                        <div className="flex items-start gap-2">
                                            <Heart className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                                            <p className={`text-sm ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                                                Connect with a friend or family member
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-orange-50 border border-orange-200'}`}>
                                        <div className="flex items-start gap-2">
                                            <Music className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                                            <p className={`text-sm ${darkMode ? 'text-orange-300' : 'text-orange-700'}`}>
                                                Listen to calming music or nature sounds
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card >

                        {/* Community Stats */}
                        < Card className="bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg border-0" >
                            <CardContent className="pt-6">
                                <Users className="w-12 h-12 mb-4 opacity-90" />
                                <h3 className="text-2xl font-bold mb-2">You're Not Alone</h3>
                                <p className="text-purple-100 text-sm mb-4">
                                    Join 15,000+ students prioritizing their mental health
                                </p>
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                                        <p className="text-2xl font-bold">89%</p>
                                        <p className="text-xs text-purple-100">Feel Better</p>
                                    </div>
                                    <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                                        <p className="text-2xl font-bold">24/7</p>
                                        <p className="text-xs text-purple-100">Support</p>
                                    </div>
                                </div>
                                <Button className="w-full bg-white text-purple-600 hover:bg-purple-50">
                                    Join Community
                                </Button>
                            </CardContent>
                        </Card >
                    </div >
                </div >

                {/* Bottom CTA Section */}
                < Card className={`${cardBgClass} shadow-2xl mt-12`}>
                    <CardContent className="p-8">
                        <div className="max-w-3xl mx-auto text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <Heart className="w-8 h-8 text-white" />
                            </div>
                            <h2 className={`text-3xl font-bold ${textPrimaryClass} mb-3`}>Your Mental Health Matters</h2>
                            <p className={`text-lg ${textSecondaryClass} mb-6`}>
                                Remember, taking care of your mental health is just as important as your studies. We're here to support you every step of the way.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                                <Button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                                    <MessageSquare className="w-4 h-4 mr-2" />
                                    Talk to Counselor
                                </Button>
                                <Button variant="outline" className={`flex-1 ${darkMode ? 'border-slate-600' : 'border-slate-300'}`}>
                                    <BookOpen className="w-4 h-4 mr-2" />
                                    Browse Resources
                                </Button>
                            </div>
                            <p className={`text-xs ${textMutedClass} mt-4`}>
                                Confidential • Professional • Always Available
                            </p>
                        </div>
                    </CardContent>
                </Card >
            </main >

            {/* Footer - Hide if dashboard */}
            {!isDashboard && (
                <footer className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border-t mt-16 py-8 transition-colors duration-300`}>
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-4 gap-8 mb-8">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <Heart className="w-5 h-5 text-white" />
                                    </div>
                                    <span className={`font-bold text-lg ${textPrimaryClass}`}>Wellbeing Hub</span>
                                </div>
                                <p className={`text-sm ${textSecondaryClass}`}>
                                    Supporting student mental health and wellbeing
                                </p>
                            </div>
                            <div>
                                <h3 className={`font-semibold ${textPrimaryClass} mb-4`}>Resources</h3>
                                <ul className={`space-y-2 text-sm ${textSecondaryClass}`}>
                                    <li><a href="#" className="hover:text-purple-600 transition-colors">Mental Health Guide</a></li>
                                    <li><a href="#" className="hover:text-purple-600 transition-colors">Self-Care Tips</a></li>
                                    <li><a href="#" className="hover:text-purple-600 transition-colors">Crisis Support</a></li>
                                    <li><a href="#" className="hover:text-purple-600 transition-colors">FAQs</a></li>
                                </ul>
                            </div>
                            <div>
                                <h3 className={`font-semibold ${textPrimaryClass} mb-4`}>Get Help</h3>
                                <ul className={`space-y-2 text-sm ${textSecondaryClass}`}>
                                    <li><a href="#" className="hover:text-purple-600 transition-colors">Talk to Counselor</a></li>
                                    <li><a href="#" className="hover:text-purple-600 transition-colors">Support Groups</a></li>
                                    <li><a href="#" className="hover:text-purple-600 transition-colors">Workshops</a></li>
                                    <li><a href="#" className="hover:text-purple-600 transition-colors">Emergency Hotline</a></li>
                                </ul>
                            </div>
                            <div>
                                <h3 className={`font-semibold ${textPrimaryClass} mb-4`}>Contact</h3>
                                <div className="space-y-3">
                                    <p className={`text-sm ${textSecondaryClass}`}>
                                        <strong>Crisis Hotline:</strong><br />
                                        1800-XXX-XXXX
                                    </p>
                                    <p className={`text-sm ${textSecondaryClass}`}>
                                        <strong>Email:</strong><br />
                                        support@wellbeing.com
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className={`border-t ${darkMode ? 'border-slate-700' : 'border-slate-200'} pt-6 text-center`}>
                            <p className={`text-sm ${textMutedClass}`}>
                                &copy; 2026 NextGen Wellbeing Hub. All rights reserved. • If you're in crisis, please call emergency services.
                            </p>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
}