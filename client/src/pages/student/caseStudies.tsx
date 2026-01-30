import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
    Search,
    Filter,
    TrendingUp,
    Users,
    Building,
    Award,
    Star,
    Target,
    Rocket,
    GraduationCap,
    Briefcase,
    DollarSign,
    MapPin,
    Calendar,
    Clock,
    ChevronRight,
    ChevronLeft,
    ExternalLink,
    Download,
    Share2,
    Bookmark,
    Heart,
    MessageSquare,
    Eye,
    BarChart,
    CheckCircle,
    Zap,
    Sparkles,
    Shield,
    Globe,
    ArrowLeft,
    PlayCircle,
    BookOpen,
    UserCheck,
    TrendingDown,
    Layers,
    PieChart,
    LineChart,
    Target as TargetIcon,
    Trophy,
    Medal,
    Crown,
    Lightbulb,
    Brain,
    Cpu,
    Database,
    Code,
    Smartphone,
    Laptop,
    Cloud,
    Network,
    Database as DatabaseIcon,
    Server,
    ShieldCheck,
    Lock,
    Unlock,
    Mail,
    Phone,
    MapPin as MapPinIcon,
    Clock as ClockIcon,
    Users as UsersIcon,
    Building as BuildingIcon,
    Award as AwardIcon,
    Star as StarIcon
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Case Studies Data
const CASE_STUDIES = [
    {
        id: 1,
        title: 'From CS Student to Google Engineer in 12 Months',
        student: {
            name: 'Alex Johnson',
            university: 'Stanford University',
            major: 'Computer Science',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
            grade: '3.8 GPA'
        },
        company: {
            name: 'Google',
            logo: 'https://cdn.worldvectorlogo.com/logos/google-2015.svg',
            industry: 'Technology',
            role: 'Software Engineer L4'
        },
        stats: {
            salary: '$145,000',
            preparationTime: '8 months',
            interviews: 5,
            successRate: '100%',
            skillImprovement: 85
        },
        category: 'tech',
        difficulty: 'Hard',
        duration: '12 months',
        featured: true,
        tags: ['Google', 'FAANG', 'Software Engineering', 'CS Major'],
        excerpt: 'How a Stanford CS student used NextGen\'s AI coaching to land a Google SWE role with a $145k package.',
        readTime: '12 min read',
        views: 15420,
        likes: 892,
        shares: 345,
        date: '2026-01-15'
    },
    {
        id: 2,
        title: 'Business Major Secures Investment Banking Role at Goldman Sachs',
        student: {
            name: 'Maya Rodriguez',
            university: 'Harvard Business School',
            major: 'Business Administration',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya',
            grade: 'Summa Cum Laude'
        },
        company: {
            name: 'Goldman Sachs',
            logo: 'https://cdn.worldvectorlogo.com/logos/goldman-sachs.svg',
            industry: 'Finance',
            role: 'Investment Banking Analyst'
        },
        stats: {
            salary: '$110,000',
            preparationTime: '6 months',
            interviews: 8,
            successRate: '87%',
            skillImprovement: 92
        },
        category: 'finance',
        difficulty: 'Very Hard',
        duration: '8 months',
        featured: true,
        tags: ['Investment Banking', 'Finance', 'Goldman Sachs', 'MBA'],
        excerpt: 'Harvard Business School graduate breaks into competitive investment banking with personalized career coaching.',
        readTime: '15 min read',
        views: 12850,
        likes: 756,
        shares: 289,
        date: '2026-01-10'
    },
    {
        id: 3,
        title: 'Non-Tech Background to Product Manager at Microsoft',
        student: {
            name: 'David Chen',
            university: 'University of Michigan',
            major: 'Psychology',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
            grade: '3.7 GPA'
        },
        company: {
            name: 'Microsoft',
            logo: 'https://cdn.worldvectorlogo.com/logos/microsoft-icon.svg',
            industry: 'Technology',
            role: 'Associate Product Manager'
        },
        stats: {
            salary: '$125,000',
            preparationTime: '10 months',
            interviews: 6,
            successRate: '95%',
            skillImprovement: 78
        },
        category: 'product',
        difficulty: 'Medium',
        duration: '14 months',
        featured: false,
        tags: ['Product Management', 'Career Switch', 'Microsoft', 'Non-Tech'],
        excerpt: 'Psychology graduate successfully transitions to tech with zero coding background using our skill-building platform.',
        readTime: '18 min read',
        views: 9650,
        likes: 543,
        shares: 167,
        date: '2026-01-05'
    },
    {
        id: 4,
        title: 'International Student Lands Data Science Role at Amazon',
        student: {
            name: 'Sofia Martinez',
            university: 'MIT',
            major: 'Data Science',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia',
            grade: '4.0 GPA'
        },
        company: {
            name: 'Amazon',
            logo: 'https://cdn.worldvectorlogo.com/logos/amazon-icon.svg',
            industry: 'E-commerce & Tech',
            role: 'Data Scientist II'
        },
        stats: {
            salary: '$135,000',
            preparationTime: '7 months',
            interviews: 4,
            successRate: '100%',
            skillImprovement: 88
        },
        category: 'data',
        difficulty: 'Hard',
        duration: '9 months',
        featured: false,
        tags: ['Data Science', 'Amazon', 'International Student', 'Machine Learning'],
        excerpt: 'International student overcomes visa challenges to secure Amazon data science role with sponsorship.',
        readTime: '14 min read',
        views: 11200,
        likes: 678,
        shares: 234,
        date: '2025-12-28'
    },
    {
        id: 5,
        title: 'Community College Transfer to Software Engineer at Apple',
        student: {
            name: 'James Wilson',
            university: 'UC Berkeley (Transfer)',
            major: 'Computer Science',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
            grade: '3.9 GPA'
        },
        company: {
            name: 'Apple',
            logo: 'https://cdn.worldvectorlogo.com/logos/apple-black.svg',
            industry: 'Technology',
            role: 'iOS Software Engineer'
        },
        stats: {
            salary: '$140,000',
            preparationTime: '9 months',
            interviews: 7,
            successRate: '92%',
            skillImprovement: 81
        },
        category: 'tech',
        difficulty: 'Hard',
        duration: '15 months',
        featured: false,
        tags: ['Apple', 'iOS Development', 'Community College', 'Transfer Student'],
        excerpt: 'Community college transfer student beats Ivy League competition for Apple engineering role.',
        readTime: '16 min read',
        views: 8750,
        likes: 432,
        shares: 156,
        date: '2025-12-20'
    },
    {
        id: 6,
        title: 'Liberal Arts Major to UX Designer at Meta',
        student: {
            name: 'Emma Thompson',
            university: 'Brown University',
            major: 'Art History',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
            grade: '3.6 GPA'
        },
        company: {
            name: 'Meta',
            logo: 'https://cdn.worldvectorlogo.com/logos/meta-1.svg',
            industry: 'Social Media',
            role: 'UX Designer'
        },
        stats: {
            salary: '$115,000',
            preparationTime: '5 months',
            interviews: 5,
            successRate: '90%',
            skillImprovement: 76
        },
        category: 'design',
        difficulty: 'Medium',
        duration: '11 months',
        featured: false,
        tags: ['UX Design', 'Meta', 'Liberal Arts', 'Career Transition'],
        excerpt: 'Art history major successfully pivots to UX design at Meta with portfolio-building guidance.',
        readTime: '13 min read',
        views: 10250,
        likes: 589,
        shares: 198,
        date: '2025-12-15'
    }
];

// University Partners
const UNIVERSITY_PARTNERS = [
    {
        id: 1,
        name: 'Stanford University',
        logo: 'https://cdn.worldvectorlogo.com/logos/stanford-university-1.svg',
        students: 450,
        successRate: 94,
        avgSalary: '$128,500',
        topCompanies: ['Google', 'Apple', 'Microsoft', 'Meta']
    },
    {
        id: 2,
        name: 'MIT',
        logo: 'https://cdn.worldvectorlogo.com/logos/massachusetts-institute-of-technology-mit-seeklogo.svg',
        students: 380,
        successRate: 96,
        avgSalary: '$132,000',
        topCompanies: ['Google', 'Amazon', 'Apple', 'SpaceX']
    },
    {
        id: 3,
        name: 'Harvard University',
        logo: 'https://cdn.worldvectorlogo.com/logos/harvard-university.svg',
        students: 320,
        successRate: 92,
        avgSalary: '$125,000',
        topCompanies: ['Goldman Sachs', 'McKinsey', 'Google', 'Microsoft']
    },
    {
        id: 4,
        name: 'UC Berkeley',
        logo: 'https://cdn.worldvectorlogo.com/logos/uc-berkeley-seeklogo.svg',
        students: 520,
        successRate: 89,
        avgSalary: '$118,000',
        topCompanies: ['Apple', 'Google', 'Amazon', 'Tesla']
    }
];

// Company Partners
const COMPANY_PARTNERS = [
    {
        id: 1,
        name: 'Google',
        logo: 'https://cdn.worldvectorlogo.com/logos/google-2015.svg',
        hires: 125,
        avgSalary: '$145,000',
        roles: ['SWE', 'PM', 'DS', 'UX'],
        difficulty: 'Very High'
    },
    {
        id: 2,
        name: 'Microsoft',
        logo: 'https://cdn.worldvectorlogo.com/logos/microsoft-icon.svg',
        hires: 98,
        avgSalary: '$135,000',
        roles: ['SWE', 'PM', 'DS', 'Sales'],
        difficulty: 'High'
    },
    {
        id: 3,
        name: 'Amazon',
        logo: 'https://cdn.worldvectorlogo.com/logos/amazon-icon.svg',
        hires: 112,
        avgSalary: '$130,000',
        roles: ['SDE', 'PM', 'DS', 'BIE'],
        difficulty: 'High'
    },
    {
        id: 4,
        name: 'Goldman Sachs',
        logo: 'https://cdn.worldvectorlogo.com/logos/goldman-sachs.svg',
        hires: 76,
        avgSalary: '$120,000',
        roles: ['IBD', 'Quant', 'Risk', 'Tech'],
        difficulty: 'Very High'
    }
];

// Success Metrics
const SUCCESS_METRICS = [
    { label: 'Students Placed', value: '15,000+', change: '+42%', icon: Users },
    { label: 'Average Salary', value: '$128K', change: '+18%', icon: DollarSign },
    { label: 'Success Rate', value: '92%', change: '+7%', icon: Target },
    { label: 'Company Partners', value: '850+', change: '+35%', icon: Building },
    { label: 'University Partners', value: '500+', change: '+28%', icon: GraduationCap },
    { label: 'Interview Success', value: '89%', change: '+12%', icon: Trophy }
];

// Categories
const CATEGORIES = [
    { id: 'all', name: 'All Case Studies', count: 48, icon: BookOpen },
    { id: 'tech', name: 'Tech & Engineering', count: 18, icon: Cpu },
    { id: 'finance', name: 'Finance & Consulting', count: 12, icon: DollarSign },
    { id: 'product', name: 'Product Management', count: 8, icon: Layers },
    { id: 'data', name: 'Data Science & Analytics', count: 6, icon: Database },
    { id: 'design', name: 'Design & UX', count: 4, icon: Database }
];

// Difficulty Levels
const DIFFICULTY_LEVELS = [
    { level: 'Easy', color: 'bg-green-100 text-green-800' },
    { level: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { level: 'Hard', color: 'bg-orange-100 text-orange-800' },
    { level: 'Very Hard', color: 'bg-red-100 text-red-800' }
];

const CaseStudyCard: React.FC<{ study: typeof CASE_STUDIES[0]; variant?: 'featured' | 'grid' }> = ({ study, variant = 'grid' }) => {
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(study.likes);

    const handleBookmark = () => {
        setIsBookmarked(!isBookmarked);
    };

    const handleLike = () => {
        if (isLiked) {
            setLikeCount(likeCount - 1);
        } else {
            setLikeCount(likeCount + 1);
        }
        setIsLiked(!isLiked);
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    if (variant === 'featured') {
        return (
            <Card className="relative overflow-hidden group border-0 shadow-2xl rounded-[3rem]">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 z-0" />
                <div className="relative z-10">
                    <div className="grid lg:grid-cols-2 gap-0">
                        <div className="relative h-96 lg:h-auto overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600" />
                            <div className="absolute inset-0 flex items-center justify-center p-12">
                                <div className="text-white text-center">
                                    <div className="flex items-center justify-center gap-4 mb-6">
                                        <Avatar className="w-20 h-20 border-4 border-white/30">
                                            <AvatarImage src={study.student.avatar} />
                                            <AvatarFallback>{study.student.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="text-left">
                                            <h3 className="text-2xl font-black">{study.student.name}</h3>
                                            <p className="text-white/80 font-medium">{study.student.university}</p>
                                            <p className="text-sm text-white/60 font-medium">{study.student.major}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center gap-6">
                                        <div className="text-center">
                                            <div className="text-3xl font-black">{study.stats.salary}</div>
                                            <div className="text-sm text-white/80 font-bold uppercase tracking-wider">Starting Salary</div>
                                        </div>
                                        <div className="h-12 w-px bg-white/30" />
                                        <div className="text-center">
                                            <div className="text-3xl font-black">{study.stats.successRate}</div>
                                            <div className="text-sm text-white/80 font-bold uppercase tracking-wider">Success Rate</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute top-6 left-6">
                                <Badge className="bg-white/20 text-white backdrop-blur-sm border-0 font-bold px-4 py-1.5">
                                    Featured Success
                                </Badge>
                            </div>
                        </div>

                        <CardContent className="p-8 lg:p-12 bg-white/10 dark:bg-background/40 backdrop-blur-3xl">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <Badge className={`${DIFFICULTY_LEVELS.find(d => d.level === study.difficulty)?.color} font-bold px-3 py-1`}>
                                        {study.difficulty} Difficulty
                                    </Badge>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon" onClick={handleBookmark} className="rounded-xl hover:bg-black/5 dark:hover:bg-white/5">
                                            <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-blue-500 text-blue-500' : 'text-slate-500'}`} />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={handleLike} className="rounded-xl hover:bg-black/5 dark:hover:bg-white/5">
                                            <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-slate-500'}`} />
                                        </Button>
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">{study.title}</h2>
                                    <p className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">{study.excerpt}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                                            <Clock className="w-4 h-4" />
                                            <span>Preparation: {study.stats.preparationTime}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                                            <Target className="w-4 h-4" />
                                            <span>Interviews: {study.stats.interviews} rounds</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                                            <Calendar className="w-4 h-4" />
                                            <span>{formatDate(study.date)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                                            <Eye className="w-4 h-4" />
                                            <span>{study.views.toLocaleString()} views</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-black/5 dark:border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <img src={study.company.logo} alt={study.company.name} className="w-10 h-10 object-contain" />
                                            <div>
                                                <div className="font-black text-slate-900 dark:text-white leading-tight">{study.company.name}</div>
                                                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{study.company.role}</div>
                                            </div>
                                        </div>
                                        <Separator orientation="vertical" className="h-8" />
                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                            {study.readTime} • {likeCount} likes
                                        </div>
                                    </div>
                                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black uppercase tracking-widest px-8 rounded-2xl h-14 shadow-xl shadow-blue-500/20">
                                        Read Story
                                        <ChevronRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card className="group hover:shadow-2xl transition-all duration-500 h-full rounded-[2rem] bg-white/80 dark:bg-slate-900/50 backdrop-blur-3xl border-slate-100 dark:border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12 border-2 border-border">
                            <AvatarImage src={study.student.avatar} />
                            <AvatarFallback>{study.student.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-bold text-slate-900">{study.student.name}</h3>
                            <p className="text-sm text-slate-600">{study.student.university}</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={handleBookmark}>
                        <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-blue-500 text-blue-500' : ''}`} />
                    </Button>
                </div>

                <h4 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {study.title}
                </h4>

                <div className="flex items-center gap-2 mb-4">
                    <img src={study.company.logo} alt={study.company.name} className="w-6 h-6" />
                    <span className="text-sm font-medium">{study.company.name}</span>
                    <span className="text-sm text-muted-foreground">•</span>
                    <Badge variant="outline" className="text-xs">
                        {study.company.role}
                    </Badge>
                </div>

                <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Salary:</span>
                        <span className="font-black text-green-600 text-lg">{study.stats.salary}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Success Rate:</span>
                        <span className="font-black text-blue-600 text-lg">{study.stats.successRate}</span>
                    </div>
                    <div>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Skill Improvement</span>
                            <span className="font-black text-slate-900 dark:text-white">{study.stats.skillImprovement}%</span>
                        </div>
                        <Progress value={study.stats.skillImprovement} className="h-2 rounded-full" />
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                    {study.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                        </Badge>
                    ))}
                    {study.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                            +{study.tags.length - 2}
                        </Badge>
                    )}
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {study.readTime}
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-1 ${isLiked ? 'text-red-500' : 'text-muted-foreground'}`}
                        >
                            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                            {likeCount}
                        </button>
                        <Button variant="ghost" size="sm" className="h-8">
                            Read More
                            <ChevronRight className="ml-1 w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const UniversityPartnerCard: React.FC<{ university: typeof UNIVERSITY_PARTNERS[0] }> = ({ university }) => {
    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center p-3">
                        <img src={university.logo} alt={university.name} className="w-full h-full object-contain" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">{university.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Users className="w-4 h-4" />
                            {university.students} students placed
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Success Rate:</span>
                        <Badge className="bg-green-100 text-green-800">
                            {university.successRate}%
                        </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Avg Salary:</span>
                        <span className="font-bold text-green-600">{university.avgSalary}</span>
                    </div>
                </div>

                <Separator className="my-4" />

                <div>
                    <h4 className="text-sm font-semibold mb-2">Top Companies:</h4>
                    <div className="flex flex-wrap gap-2">
                        {university.topCompanies.map(company => (
                            <Badge key={company} variant="outline" className="text-xs">
                                {company}
                            </Badge>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const CompanyPartnerCard: React.FC<{ company: typeof COMPANY_PARTNERS[0] }> = ({ company }) => {
    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Very High': return 'bg-red-100 text-red-800';
            case 'High': return 'bg-orange-100 text-orange-800';
            case 'Medium': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-green-100 text-green-800';
        }
    };

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center p-2">
                        <img src={company.logo} alt={company.name} className="w-full h-full object-contain" />
                    </div>
                    <Badge className={getDifficultyColor(company.difficulty)}>
                        {company.difficulty}
                    </Badge>
                </div>

                <h3 className="font-bold text-lg mb-2">{company.name}</h3>

                <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Hires:</span>
                        <span className="font-bold">{company.hires}+</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Avg Salary:</span>
                        <span className="font-bold text-green-600">{company.avgSalary}</span>
                    </div>
                </div>

                <div>
                    <h4 className="text-sm font-semibold mb-2">Common Roles:</h4>
                    <div className="flex flex-wrap gap-2">
                        {company.roles.map(role => (
                            <Badge key={role} variant="secondary" className="text-xs">
                                {role}
                            </Badge>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const CaseStudiesPage: React.FC<any> = (props: any) => {
    const isDashboard = props?.isDashboard || false;
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
    const [sortBy, setSortBy] = useState('recent');
    const [activeTab, setActiveTab] = useState('case-studies');

    const featuredStudies = CASE_STUDIES.filter(study => study.featured);
    const regularStudies = CASE_STUDIES.filter(study => !study.featured);

    const filteredStudies = useMemo(() => {
        let filtered = regularStudies;

        // Category filter
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(study => study.category === selectedCategory);
        }

        // Difficulty filter
        if (selectedDifficulty !== 'all') {
            filtered = filtered.filter(study => study.difficulty === selectedDifficulty);
        }

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(study =>
                study.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                study.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                study.student.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
                study.company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                study.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        // Sort
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'salary':
                    const salaryA = parseInt(a.stats.salary.replace(/[$,]/g, ''));
                    const salaryB = parseInt(b.stats.salary.replace(/[$,]/g, ''));
                    return salaryB - salaryA;
                case 'popular':
                    return b.views - a.views;
                case 'recent':
                default:
                    return new Date(b.date).getTime() - new Date(a.date).getTime();
            }
        });

        return filtered;
    }, [searchQuery, selectedCategory, selectedDifficulty, sortBy]);

    const handleBack = () => {
        window.history.back();
    };

    return (
        <div className={`${!isDashboard ? "min-h-screen bg-background" : "bg-transparent"} dark:bg-black transition-colors duration-300`}>
            {/* Hero Section - Hide if in dashboard */}
            {!isDashboard && (
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
                    <div className="container mx-auto px-4 py-20">
                        <div className="max-w-6xl mx-auto">
                            <Button
                                variant="ghost"
                                onClick={handleBack}
                                className="mb-6 text-white hover:bg-white/20"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Show Header Title ONLY if dashboard */}
            {!isDashboard ? (
                <div className="text-center py-10 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
                    <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Trophy className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-4">
                        Success Stories <span className="text-white/80">& Case Studies</span>
                    </h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                        Discover how students from diverse backgrounds landed their dream roles at top companies using our platform.
                    </p>
                </div>
            ) : null}

            <div className={`${!isDashboard ? "container mx-auto px-4 py-12" : "py-0"}`}>
                <div className="relative max-w-2xl mx-auto">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                        type="search"
                        placeholder="Search case studies by student, company, or role..."
                        className="pl-12 py-6 text-lg rounded-xl border border-border bg-background/50 backdrop-blur-sm shadow-lg text-foreground placeholder:text-muted-foreground focus:ring-primary"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                {/* Success Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
                    {SUCCESS_METRICS.map((metric) => {
                        const Icon = metric.icon;
                        return (
                            <Card key={metric.label} className="glass-card border-none text-center hover:shadow-lg transition-transform hover:-translate-y-1">
                                <CardContent className="p-4">
                                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className="text-2xl font-bold text-foreground">{metric.value}</div>
                                    <div className="text-sm text-muted-foreground">{metric.label}</div>
                                    <div className="text-xs text-green-500 mt-1 flex items-center justify-center font-medium">
                                        <TrendingUp className="w-3 h-3 mr-1" />
                                        {metric.change}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-12">
                    <TabsList className="grid grid-cols-4 mb-8">
                        <TabsTrigger value="case-studies">
                            <BookOpen className="w-4 h-4 mr-2" />
                            Case Studies
                        </TabsTrigger>
                        <TabsTrigger value="universities">
                            <GraduationCap className="w-4 h-4 mr-2" />
                            University Partners
                        </TabsTrigger>
                        <TabsTrigger value="companies">
                            <Building className="w-4 h-4 mr-2" />
                            Company Partners
                        </TabsTrigger>
                        <TabsTrigger value="trends">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Industry Trends
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="case-studies" className="space-y-12">
                        {/* Featured Case Studies */}
                        {featuredStudies.length > 0 && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-slate-900">Featured Success Stories</h2>
                                    <Badge variant="outline" className="text-blue-600 border-blue-600">
                                        Top Performers
                                    </Badge>
                                </div>
                                {featuredStudies.map(study => (
                                    <CaseStudyCard key={study.id} study={study} variant="featured" />
                                ))}
                            </div>
                        )}

                        {/* Filters and Sort */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="grid md:grid-cols-4 gap-4">
                                    <div>
                                        <Label className="mb-2 block">Category</Label>
                                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="All Categories" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {CATEGORIES.map(category => (
                                                    <SelectItem key={category.id} value={category.id}>
                                                        {category.name} ({category.count})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label className="mb-2 block">Difficulty</Label>
                                        <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="All Difficulties" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Difficulties</SelectItem>
                                                {DIFFICULTY_LEVELS.map(level => (
                                                    <SelectItem key={level.level} value={level.level}>
                                                        {level.level}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label className="mb-2 block">Sort By</Label>
                                        <Select value={sortBy} onValueChange={setSortBy}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sort by" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="recent">Most Recent</SelectItem>
                                                <SelectItem value="salary">Highest Salary</SelectItem>
                                                <SelectItem value="popular">Most Popular</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex items-end">
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            onClick={() => {
                                                setSelectedCategory('all');
                                                setSelectedDifficulty('all');
                                                setSearchQuery('');
                                                setSortBy('recent');
                                            }}
                                        >
                                            <Filter className="w-4 h-4 mr-2" />
                                            Clear Filters
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Case Studies Grid */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-slate-900">
                                    All Success Stories
                                    <span className="text-sm font-normal text-slate-600 ml-2">
                                        ({filteredStudies.length} case studies)
                                    </span>
                                </h2>
                                <div className="text-sm text-slate-600">
                                    Showing results for: {selectedCategory === 'all' ? 'All Categories' : CATEGORIES.find(c => c.id === selectedCategory)?.name}
                                </div>
                            </div>

                            {filteredStudies.length === 0 ? (
                                <Card className="py-12 text-center">
                                    <div className="text-slate-400 mb-4">
                                        <Search className="w-12 h-12 mx-auto" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No case studies found</h3>
                                    <p className="text-slate-600 mb-4">
                                        Try adjusting your search or filter criteria
                                    </p>
                                    <Button
                                        onClick={() => {
                                            setSelectedCategory('all');
                                            setSelectedDifficulty('all');
                                            setSearchQuery('');
                                        }}
                                    >
                                        Clear Filters
                                    </Button>
                                </Card>
                            ) : (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredStudies.map(study => (
                                        <CaseStudyCard key={study.id} study={study} variant="grid" />
                                    ))}
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="universities" className="space-y-12">
                        {/* University Partners */}
                        <div className="text-center mb-8">
                            <GraduationCap className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                            <h2 className="text-3xl font-bold mb-4">University Partnerships</h2>
                            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                                We partner with leading universities worldwide to provide career readiness programs for their students.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {UNIVERSITY_PARTNERS.map(university => (
                                <UniversityPartnerCard key={university.id} university={university} />
                            ))}
                        </div>

                        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
                            <CardContent className="p-8 text-center">
                                <div className="max-w-2xl mx-auto">
                                    <h3 className="text-2xl font-bold mb-4">Become a Partner University</h3>
                                    <p className="text-slate-600 mb-6">
                                        Join our network of 500+ universities and provide your students with industry-leading career preparation tools.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90">
                                            <Mail className="mr-2 h-4 w-4" />
                                            Request Partnership
                                        </Button>
                                        <Button variant="outline">
                                            <Download className="mr-2 h-4 w-4" />
                                            Download Brochure
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="companies" className="space-y-12">
                        {/* Company Partners */}
                        <div className="text-center mb-8">
                            <Building className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                            <h2 className="text-3xl font-bold mb-4">Company Partnerships</h2>
                            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                                We work with top companies to connect them with pre-vetted, job-ready talent from our platform.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {COMPANY_PARTNERS.map(company => (
                                <CompanyPartnerCard key={company.id} company={company} />
                            ))}
                        </div>

                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                <div>
                                    <h3 className="text-2xl font-bold mb-4">Hire Top Talent</h3>
                                    <p className="text-blue-100 mb-6">
                                        Access our pool of pre-vetted, job-ready candidates who have completed our comprehensive career readiness programs.
                                    </p>
                                    <Button variant="secondary" className="bg-white text-blue-600 hover:bg-white/90">
                                        Become a Hiring Partner
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/10 p-4 rounded-xl text-center">
                                        <div className="text-2xl font-bold mb-1">92%</div>
                                        <div className="text-sm text-blue-200">Retention Rate</div>
                                    </div>
                                    <div className="bg-white/10 p-4 rounded-xl text-center">
                                        <div className="text-2xl font-bold mb-1">30%</div>
                                        <div className="text-sm text-blue-200">Faster Hiring</div>
                                    </div>
                                    <div className="bg-white/10 p-4 rounded-xl text-center">
                                        <div className="text-2xl font-bold mb-1">85%</div>
                                        <div className="text-sm text-blue-200">Interview to Offer</div>
                                    </div>
                                    <div className="bg-white/10 p-4 rounded-xl text-center">
                                        <div className="text-2xl font-bold mb-1">$25K</div>
                                        <div className="text-sm text-blue-200">Avg. Savings</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="trends" className="space-y-12">
                        {/* Industry Trends */}
                        <Card className="border-0 shadow-2xl">
                            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-2xl">
                                <CardTitle className="text-2xl flex items-center gap-2">
                                    <TrendingUp className="w-6 h-6" />
                                    Industry Trends & Insights
                                </CardTitle>
                                <CardDescription>
                                    Latest salary data, hiring trends, and in-demand skills
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="grid md:grid-cols-3 gap-8">
                                    <div className="space-y-4">
                                        <h3 className="font-bold text-lg">Top Paying Roles 2026</h3>
                                        <div className="space-y-3">
                                            {[
                                                { role: 'AI/ML Engineer', salary: '$165K', growth: '+25%' },
                                                { role: 'Quantitative Analyst', salary: '$160K', growth: '+22%' },
                                                { role: 'Data Scientist', salary: '$145K', growth: '+20%' },
                                                { role: 'Product Manager', salary: '$140K', growth: '+18%' },
                                                { role: 'SWE (Senior)', salary: '$135K', growth: '+15%' }
                                            ].map((item, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg">
                                                    <div>
                                                        <div className="font-medium">{item.role}</div>
                                                        <div className="text-sm text-muted-foreground">Avg. Salary</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-bold text-green-600">{item.salary}</div>
                                                        <div className="text-sm text-green-500">{item.growth}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="font-bold text-lg">Fastest Growing Skills</h3>
                                        <div className="space-y-3">
                                            {[
                                                { skill: 'Generative AI', demand: '+300%' },
                                                { skill: 'Cloud Architecture', demand: '+85%' },
                                                { skill: 'Cybersecurity', demand: '+75%' },
                                                { skill: 'Data Engineering', demand: '+70%' },
                                                { skill: 'DevOps', demand: '+65%' }
                                            ].map((item, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg">
                                                    <div className="font-medium">{item.skill}</div>
                                                    <Badge className="bg-blue-100 text-blue-800">
                                                        {item.demand}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="font-bold text-lg">Hiring Trends</h3>
                                        <div className="space-y-4">
                                            <div className="p-4 bg-blue-50 rounded-xl">
                                                <div className="text-sm text-slate-600 mb-1">Remote Work Adoption</div>
                                                <div className="flex items-center justify-between">
                                                    <div className="text-2xl font-bold">68%</div>
                                                    <TrendingUp className="w-5 h-5 text-green-600" />
                                                </div>
                                            </div>
                                            <div className="p-4 bg-green-50 rounded-xl">
                                                <div className="text-sm text-slate-600 mb-1">Entry-level Hires</div>
                                                <div className="flex items-center justify-between">
                                                    <div className="text-2xl font-bold">+42%</div>
                                                    <TrendingUp className="w-5 h-5 text-green-600" />
                                                </div>
                                            </div>
                                            <div className="p-4 bg-purple-50 rounded-xl">
                                                <div className="text-sm text-slate-600 mb-1">Diversity Hiring</div>
                                                <div className="flex items-center justify-between">
                                                    <div className="text-2xl font-bold">+35%</div>
                                                    <TrendingUp className="w-5 h-5 text-green-600" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* CTA Section */}
                <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 mt-16">
                    <CardContent className="p-12">
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div>
                                <Sparkles className="w-12 h-12 mb-4 opacity-90" />
                                <h2 className="text-3xl font-bold mb-4">Start Your Success Story</h2>
                                <p className="text-blue-100 mb-6">
                                    Join thousands of students who have transformed their careers with NextGen.
                                    Get personalized guidance, build in-demand skills, and land your dream job.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Button size="lg" className="bg-white text-blue-600 hover:bg-white/90">
                                        <Rocket className="mr-2 h-5 w-5" />
                                        Start Free Trial
                                    </Button>
                                    <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                                        <PlayCircle className="mr-2 h-5 w-5" />
                                        Watch Success Stories
                                    </Button>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/10 p-4 rounded-xl text-center">
                                    <div className="text-2xl font-bold mb-1">92%</div>
                                    <div className="text-sm text-blue-200">Placement Rate</div>
                                </div>
                                <div className="bg-white/10 p-4 rounded-xl text-center">
                                    <div className="text-2xl font-bold mb-1">$128K</div>
                                    <div className="text-sm text-blue-200">Avg. Starting Salary</div>
                                </div>
                                <div className="bg-white/10 p-4 rounded-xl text-center">
                                    <div className="text-2xl font-bold mb-1">850+</div>
                                    <div className="text-sm text-blue-200">Hiring Partners</div>
                                </div>
                                <div className="bg-white/10 p-4 rounded-xl text-center">
                                    <div className="text-2xl font-bold mb-1">50K+</div>
                                    <div className="text-sm text-blue-200">Students Helped</div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div >
    );
};

// Custom Palette icon
const Palette: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
);

// Custom Label component
const Label: React.FC<{ children: React.ReactNode; className?: string; htmlFor?: string }> = ({
    children,
    className = '',
    htmlFor
}) => (
    <label
        htmlFor={htmlFor}
        className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
    >
        {children}
    </label>
);

export default CaseStudiesPage;