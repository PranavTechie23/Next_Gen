import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  ArrowLeft,
  Calendar,
  TrendingUp,
  Award,
  Users,
  ExternalLink,
  ChevronRight,
  Search,
  Filter,
  Share2,
  Bookmark,
  Heart,
  MessageCircle,
  Eye,
  Download,
  Printer,
  Clock,
  Globe,
  Target,
  Briefcase,
  University,
  Building,
  FileText,
  Newspaper,
  Microscope,
  Cpu,
  LineChart,
  Shield,
  Mail,
  Grid3x3,
  List,
  Trophy
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Custom icon components
const Handshake: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
  </svg>
);

const Presentation: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
  </svg>
);

// Mock data for news articles
const NEWS_ARTICLES = [
  {
    id: 1,
    category: 'partnerships',
    title: 'Strategic Partnership with Google Cloud to Revolutionize AI Career Training',
    excerpt: 'We are proud to announce a groundbreaking partnership with Google Cloud that will provide students with access to cutting-edge AI tools, cloud credits, and specialized training programs. This collaboration aims to bridge the skill gap in AI and machine learning fields.',
    content: `In a landmark move for student career development, NextGen has partnered with Google Cloud to create an unprecedented learning ecosystem. This multi-year partnership includes:
    
    1. **$10M in Google Cloud Credits**: Providing students free access to enterprise-grade AI tools
    2. **Specialized AI Curriculum**: Co-developed courses in machine learning, data science, and cloud computing
    3. **Industry Certifications**: Google Cloud Professional Certifications for qualifying students
    4. **Live Projects**: Real-world problem-solving using Google Cloud Platform
    5. **Mentorship Program**: Direct access to Google engineers and AI specialists
    
    This partnership is expected to impact over 50,000 students annually, preparing them for high-demand roles in AI and cloud computing.`,
    date: '2026-01-20',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h-600&fit=crop',
    featured: true,
    readTime: '8 min read',
    views: 12500,
    likes: 892,
    comments: 156,
    shares: 423,
    author: {
      name: 'Dr. Sarah Johnson',
      role: 'CEO & Founder',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      verified: true
    },
    tags: ['Google', 'AI', 'Cloud Computing', 'Partnership', 'Training'],
    companyImpact: {
      placements: 500,
      revenue: 2500000,
      reach: 50000
    }
  },
  {
    id: 2,
    category: 'awards',
    title: 'NextGen Wins "Best EdTech Platform 2026" at Global Education Summit',
    excerpt: 'Our platform has been honored with the prestigious "Best EdTech Platform 2026" award at the Global Education Summit in Singapore, recognizing our innovative approach to career readiness and student success.',
    content: `At the 2026 Global Education Summit held in Singapore, NextGen was recognized as the premier EdTech platform for career development. The award committee cited our innovative features:
    
    - **AI-Powered Career Path Optimization**: Personalized learning journeys for each student
    - **Real-time Industry Alignment**: Curriculum updated based on current job market demands
    - **Success Tracking**: 85% placement rate across partnered institutions
    - **Accessibility**: Available in 15 languages, serving diverse student populations
    
    The award was presented by Dr. Michael Chen, President of the International Education Association, who praised our "transformative impact on student employability."`,
    date: '2026-01-18',
    image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=1200&h=600&fit=crop',
    featured: true,
    readTime: '6 min read',
    views: 8920,
    likes: 645,
    comments: 89,
    shares: 234,
    author: {
      name: 'Michael Chen',
      role: 'Awards Committee Chair',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
      verified: true
    },
    tags: ['Award', 'Recognition', 'EdTech', 'Global', 'Innovation']
  },
  {
    id: 3,
    category: 'growth',
    title: 'Expanding to 500+ Universities Across Asia-Pacific Region',
    excerpt: 'NextGen announces major expansion across the Asia-Pacific region, partnering with 500+ universities to provide career readiness services to over 2 million students by 2027.',
    content: `In our largest expansion to date, NextGen is partnering with 500+ universities across the Asia-Pacific region. Key highlights:
    
    ## Expansion Details:
    - **India**: 200+ institutions including IITs, NITs, and leading private universities
    - **Southeast Asia**: 150+ universities in Singapore, Malaysia, Thailand, Vietnam
    - **Australia & New Zealand**: 100+ higher education institutions
    - **East Asia**: 50+ partnerships in Japan, South Korea, Taiwan
    
    ## Impact Metrics:
    - 🎯 **2M+ Students** to be served by 2027
    - 💼 **200K+ Job Placements** projected annually
    - 🌐 **15 Local Languages** supported
    - 🤝 **1000+ Corporate Partners** engaged
    
    This expansion represents our commitment to democratizing career readiness across the region.`,
    date: '2026-01-15',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=600&fit=crop',
    featured: false,
    readTime: '10 min read',
    views: 15600,
    likes: 1023,
    comments: 145,
    shares: 312,
    author: {
      name: 'Rajesh Kumar',
      role: 'Expansion Director',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh',
      verified: true
    },
    tags: ['Expansion', 'Asia-Pacific', 'Universities', 'Growth', 'Partnership']
  }
  // Additional articles can be added here...
];

const CATEGORIES = [
  { id: 'all', name: 'All News', icon: Newspaper, count: 48, color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
  { id: 'partnerships', name: 'Partnerships', icon: Handshake, count: 18, color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  { id: 'awards', name: 'Awards & Recognition', icon: Trophy, count: 12, color: 'bg-amber-50 text-amber-700 border-amber-100' },
  { id: 'growth', name: 'Growth & Expansion', icon: TrendingUp, count: 15, color: 'bg-violet-50 text-violet-700 border-violet-100' },
  { id: 'technology', name: 'Technology', icon: Cpu, count: 8, color: 'bg-blue-50 text-blue-700 border-blue-100' },
  { id: 'research', name: 'Research', icon: Microscope, count: 5, color: 'bg-rose-50 text-rose-700 border-rose-100' }
];

const COMPANY_METRICS = [
  { label: 'Students Impacted', value: '250,000+', change: '+25%', icon: Users },
  { label: 'Placements Secured', value: '75,000+', change: '+40%', icon: Briefcase },
  { label: 'University Partners', value: '1,200+', change: '+30%', icon: University },
  { label: 'Corporate Partners', value: '850+', change: '+35%', icon: Building },
  { label: 'Countries Served', value: '25+', change: '+20%', icon: Globe },
  { label: 'Success Rate', value: '92%', change: '+8%', icon: Target }
];

const LEADERSHIP_TEAM = [
  { name: 'Dr. Sarah Johnson', role: 'CEO & Founder', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', department: 'Executive' },
  { name: 'Michael Chen', role: 'CTO', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael', department: 'Technology' },
  { name: 'Emma Williams', role: 'Head of Partnerships', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma', department: 'Business' },
  { name: 'David Kumar', role: 'Head of Expansion', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David', department: 'Operations' }
];

const TIMELINE_EVENTS = [
  { year: 2022, event: 'Company Founded', description: 'Launched with 10 university partners' },
  { year: 2023, event: 'Series A Funding', description: 'Raised $15M from top investors' },
  { year: 2024, event: 'AI Platform Launch', description: 'Introduced AI Career Coach' },
  { year: 2025, event: 'International Expansion', description: 'Expanded to 15 countries' },
  { year: 2026, event: 'Google Partnership', description: 'Strategic partnership announced' }
];

interface NewsArticle {
  id: number;
  category: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image: string;
  featured: boolean;
  readTime: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  author: {
    name: string;
    role: string;
    avatar: string;
    verified: boolean;
  };
  tags: string[];
  companyImpact?: {
    placements: number;
    revenue: number;
    reach: number;
  };
}

const NewsArticleCard: React.FC<{ article: NewsArticle; variant?: 'featured' | 'grid' | 'list' }> = ({
  article,
  variant = 'grid'
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(article.likes);
  const [viewCount, setViewCount] = useState(article.views);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    // In a real app, you would show a toast notification
  };

  useEffect(() => {
    // Simulate view count increment
    const timer = setTimeout(() => {
      setViewCount(viewCount + 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (variant === 'featured') {
    return (
      <Card className="relative overflow-hidden group border-0 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 z-0" />
        <div className="relative z-10">
          <div className="grid lg:grid-cols-2 gap-0">
            <div className="relative h-96 lg:h-auto overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute top-6 left-6">
                <Badge className="bg-background/90 text-foreground hover:bg-background/100 backdrop-blur-sm">
                  Featured
                </Badge>
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <Badge className={`mb-3 ${CATEGORIES.find(c => c.id === article.category)?.color}`}>
                  {CATEGORIES.find(c => c.id === article.category)?.name}
                </Badge>
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3 drop-shadow-lg">
                  {article.title}
                </h2>
                <div className="flex items-center text-white/90">
                  <Avatar className="w-8 h-8 mr-3 border-2 border-white/30">
                    <AvatarImage src={article.author.avatar} />
                    <AvatarFallback>{article.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{article.author.name}</p>
                    <p className="text-sm opacity-80">{article.author.role}</p>
                  </div>
                </div>
              </div>
            </div>
            <CardContent className="p-8 lg:p-12 bg-background/95 backdrop-blur-sm">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(article.date)}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="w-4 h-4 mr-2" />
                      {article.readTime}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" onClick={handleBookmark}>
                      <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-blue-500 text-blue-500' : ''}`} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleShare}>
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                <p className="text-lg text-foreground/80 leading-relaxed">
                  {article.excerpt}
                </p>

                {article.companyImpact && (
                  <div className="grid grid-cols-3 gap-4 p-4 bg-background/60 backdrop-blur-sm border border-border rounded-xl">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{article.companyImpact.placements}+</div>
                      <div className="text-sm text-muted-foreground">Placements</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">${(article.companyImpact.revenue / 1000000).toFixed(1)}M</div>
                      <div className="text-sm text-muted-foreground">Revenue Impact</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">{article.companyImpact.reach.toLocaleString()}+</div>
                      <div className="text-sm text-muted-foreground">Students Reached</div>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {article.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="hover:bg-primary/10 cursor-pointer">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-6">
                    <button
                      onClick={handleLike}
                      className={`flex items-center space-x-2 ${isLiked ? 'text-red-500' : 'text-muted-foreground'}`}
                    >
                      <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                      <span>{likeCount}</span>
                    </button>
                    <button className="flex items-center space-x-2 text-muted-foreground">
                      <MessageCircle className="w-5 h-5" />
                      <span>{article.comments}</span>
                    </button>
                    <button className="flex items-center space-x-2 text-muted-foreground">
                      <Eye className="w-5 h-5" />
                      <span>{viewCount.toLocaleString()}</span>
                    </button>
                  </div>
                  <Button className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90">
                    Read Full Story
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </div>
        </div>
      </Card>
    );
  }

  if (variant === 'list') {
    return (
      <Card className="glass-card border-none hover:shadow-lg transition-all group">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <div className="relative h-48 md:h-full rounded-lg overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <Badge className={CATEGORIES.find(c => c.id === article.category)?.color}>
                    {CATEGORIES.find(c => c.id === article.category)?.name}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="md:w-2/3">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                    {article.title}
                  </h3>
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(article.date)}
                    <span className="mx-2">•</span>
                    <Clock className="w-4 h-4 mr-2" />
                    {article.readTime}
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={handleBookmark}>
                  <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-blue-500 text-blue-500' : ''}`} />
                </Button>
              </div>

              <p className="text-muted-foreground mb-4 line-clamp-2">
                {article.excerpt}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={article.author.avatar} />
                    <AvatarFallback>{article.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm text-foreground">{article.author.name}</p>
                    <p className="text-xs text-muted-foreground">{article.author.role}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleLike}
                    className={`flex items-center space-x-1 text-sm ${isLiked ? 'text-red-500' : 'text-muted-foreground'}`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                    <span>{likeCount}</span>
                  </button>
                  <Button variant="ghost" size="sm">
                    Read More
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid variant (default)
  return (
    <Card className="glass-card border-none group hover:shadow-xl transition-all duration-300 h-full">
      <div className="relative h-48 overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <Badge className={CATEGORIES.find(c => c.id === article.category)?.color}>
            {CATEGORIES.find(c => c.id === article.category)?.name}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Button
            variant="ghost"
            size="icon"
            className="bg-background/80 hover:bg-background backdrop-blur-sm"
            onClick={handleBookmark}
          >
            <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-primary text-primary' : ''}`} />
          </Button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <div className="flex items-center text-white/90 text-sm">
            <Calendar className="w-4 h-4 mr-2" />
            {formatDate(article.date)}
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-3 line-clamp-2">
          {article.title}
        </h3>

        <p className="text-muted-foreground mb-4 line-clamp-3">
          {article.excerpt}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Avatar className="w-8 h-8 mr-3">
              <AvatarImage src={article.author.avatar} />
              <AvatarFallback>{article.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-foreground">{article.author.name}</p>
              <p className="text-xs text-muted-foreground">{article.author.role}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleLike}
              className={`flex items-center ${isLiked ? 'text-red-500' : 'text-muted-foreground'}`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <button className="text-muted-foreground">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{article.readTime}</span>
          <span>{viewCount.toLocaleString()} views</span>
        </div>
      </CardContent>
    </Card>
  );
};

const CorporateNewsPage: React.FC<any> = (props: any) => {
  const isDashboard = props?.isDashboard || false;
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState('all');
  const [selectedYear, setSelectedYear] = useState('2026');

  const featuredArticles = NEWS_ARTICLES.filter(article => article.featured);
  const regularArticles = NEWS_ARTICLES.filter(article => !article.featured);

  const filteredArticles = useMemo(() => {
    let filtered = regularArticles;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();

      switch (dateRange) {
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          filterDate.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      filtered = filtered.filter(article => new Date(article.date) >= filterDate);
    }

    // Sort articles
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.views - a.views;
        case 'trending':
          return (b.likes + b.shares) - (a.likes + a.shares);
        case 'recent':
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

    return filtered;
  }, [selectedCategory, searchQuery, sortBy, dateRange]);

  const handleBack = () => {
    window.history.back();
  };

  const handleDownloadReport = () => {
    // In a real app, this would generate and download a report
    alert('Downloading corporate report...');
  };

  const handlePrintPage = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-48 w-full mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`${!isDashboard ? "min-h-screen bg-background" : "bg-transparent"} dark:bg-black transition-colors duration-300`}>
      <div className={`${!isDashboard ? "container mx-auto px-4 py-8 max-w-7xl" : "p-0"}`}>
        {/* Header Section - Hide if in dashboard */}
        {!isDashboard && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-8">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="hover:bg-slate-100 transition-colors rounded-xl"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
              <ThemeToggle />
            </div>

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
              <div>
                <h1 className="text-4xl lg:text-5xl font-black mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent tracking-tight">
                  Corporate News & Updates
                </h1>
                <p className="text-xl text-slate-600 font-medium max-w-3xl leading-relaxed">
                  Official announcements, strategic partnerships, company milestones, and insights from NextGen leadership.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={handleDownloadReport}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
                <Button variant="outline" onClick={handlePrintPage}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Company Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-12">
          {COMPANY_METRICS.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card key={metric.label} className="glass-card border-none hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Icon className="w-5 h-5 text-primary" />
                    <Badge variant={metric.change.startsWith('+') ? 'default' : 'destructive'} className={metric.change.startsWith('+') ? 'bg-green-500/20 text-green-400 border-green-500/30' : ''}>
                      {metric.change}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">{metric.value}</div>
                  <div className="text-sm text-muted-foreground">{metric.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search */}
            <Card className="glass-card border-none">
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search news..."
                    className="pl-10 bg-background/50 border-border"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card className="glass-card border-none">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {CATEGORIES.map(cat => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${selectedCategory === cat.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'}`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${selectedCategory === cat.id ? 'text-white' : 'text-slate-400'}`} />
                        <span className="text-sm font-bold">{cat.name}</span>
                      </div>
                      <Badge variant="secondary" className={`${selectedCategory === cat.id ? 'bg-white/20 text-white border-0' : 'bg-slate-100 text-slate-600'}`}>{cat.count}</Badge>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Filters */}
            <Card className="glass-card border-none">
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between text-foreground">
                  <span>Filters</span>
                  <Button variant="ghost" size="sm" onClick={() => setShowFilters(!showFilters)}>
                    <Filter className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>

              {showFilters && (
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Sort By</Label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recent">Most Recent</SelectItem>
                        <SelectItem value="popular">Most Popular</SelectItem>
                        <SelectItem value="trending">Trending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Date Range</Label>
                    <Select value={dateRange} onValueChange={setDateRange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Date range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="week">Last Week</SelectItem>
                        <SelectItem value="month">Last Month</SelectItem>
                        <SelectItem value="quarter">Last Quarter</SelectItem>
                        <SelectItem value="year">Last Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Year</Label>
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {['2026', '2025', '2024', '2023'].map(year => (
                          <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setSelectedCategory('all');
                      setSearchQuery('');
                      setSortBy('recent');
                      setDateRange('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              )}
            </Card>

            {/* Leadership Team */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Leadership Team</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {LEADERSHIP_TEAM.map(member => (
                  <div key={member.name} className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-slate-600">{member.role}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Company Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {TIMELINE_EVENTS.map(event => (
                  <div key={event.year} className="relative pl-6 pb-4 last:pb-0">
                    <div className="absolute left-0 top-0 w-2 h-2 bg-blue-600 rounded-full"></div>
                    <div className="absolute left-0.5 top-2 w-0.5 h-full bg-slate-200"></div>
                    <div className="font-bold text-blue-600">{event.year}</div>
                    <div className="text-sm font-medium">{event.event}</div>
                    <div className="text-xs text-slate-600">{event.description}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            {/* Featured Articles */}
            {featuredArticles.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900">Featured Stories</h2>
                  <Badge variant="outline" className="text-blue-600 border-blue-600">
                    Latest Updates
                  </Badge>
                </div>
                {featuredArticles.map(article => (
                  <NewsArticleCard key={article.id} article={article} variant="featured" />
                ))}
              </div>
            )}

            {/* Regular Articles */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">
                  Latest News
                  <span className="text-sm font-normal text-slate-600 ml-2">
                    ({filteredArticles.length} articles)
                  </span>
                </h2>

                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {filteredArticles.length === 0 ? (
                <Card className="py-12 text-center">
                  <div className="text-slate-400 mb-4">
                    <Search className="w-12 h-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No articles found</h3>
                  <p className="text-slate-600 mb-4">
                    Try adjusting your search or filter criteria
                  </p>
                  <Button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSearchQuery('');
                    }}
                  >
                    Clear Filters
                  </Button>
                </Card>
              ) : viewMode === 'grid' ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredArticles.map(article => (
                    <NewsArticleCard key={article.id} article={article} variant="grid" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredArticles.map(article => (
                    <NewsArticleCard key={article.id} article={article} variant="list" />
                  ))}
                </div>
              )}
            </div>

            {/* Newsletter Subscription */}
            <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">
              <CardContent className="p-8">
                <div className="text-center max-w-2xl mx-auto">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mail className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
                  <p className="text-blue-100 mb-6">
                    Subscribe to our corporate newsletter for exclusive updates, investor relations, and company announcements.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="bg-white/10 border-white/30 text-white placeholder:text-white/70"
                    />
                    <Button variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                      Subscribe
                    </Button>
                  </div>
                  <p className="text-sm text-blue-200 mt-4">
                    By subscribing, you agree to our Privacy Policy
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Investor Relations Section */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="w-6 h-6" />
                Investor Relations
              </CardTitle>
              <CardDescription>
                Financial reports, investor presentations, and corporate governance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="hover:shadow-lg cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <FileText className="w-8 h-8 text-blue-600" />
                      <div>
                        <h4 className="font-bold">Annual Report 2025</h4>
                        <p className="text-sm text-slate-600">PDF • 12 MB</p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Presentation className="w-8 h-8 text-green-600" />
                      <div>
                        <h4 className="font-bold">Investor Deck</h4>
                        <p className="text-sm text-slate-600">Q4 2025 • PDF</p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Online
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Shield className="w-8 h-8 text-purple-600" />
                      <div>
                        <h4 className="font-bold">Governance</h4>
                        <p className="text-sm text-slate-600">Policies & Compliance</p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      <ChevronRight className="mr-2 h-4 w-4" />
                      Explore
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CorporateNewsPage;