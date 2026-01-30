import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  Search,
  Calendar,
  User,
  Clock,
  ChevronRight,
  BookOpen,
  TrendingUp,
  Filter,
  Eye,
  Heart,
  Share2,
  MessageCircle,
  Bookmark,
  Tag,
  ArrowRight,
  Star,
  Award,
  GraduationCap,
  Briefcase,
  Building,
  Users,
  TrendingDown,
  Target,
  ArrowLeft
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

// Mock data for blog posts
const BLOG_POSTS = [
  {
    id: 1,
    title: "The Future of AI in Career Development: 2024 Trends",
    excerpt: "Discover how artificial intelligence is revolutionizing career guidance and job searching for students and recent graduates.",
    content: "Artificial intelligence is no longer just a buzzword in the tech industry—it's actively transforming how students approach career development...",
    author: {
      name: "Dr. Sarah Johnson",
      role: "Career AI Researcher",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      verified: true
    },
    date: "2024-03-15",
    readTime: "8 min read",
    category: "AI & Technology",
    tags: ["AI", "Career Tech", "Future Trends", "Machine Learning"],
    views: 12458,
    likes: 892,
    comments: 142,
    featured: true,
    difficulty: "Intermediate",
    coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800",
    bookmarked: true
  },
  {
    id: 2,
    title: "How to Build a Standout Resume in 2024",
    excerpt: "Essential tips and modern strategies to create a resume that gets noticed by recruiters and ATS systems.",
    content: "In today's competitive job market, your resume needs to pass through multiple layers of screening...",
    author: {
      name: "Michael Chen",
      role: "Recruitment Director",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      verified: true
    },
    date: "2024-03-10",
    readTime: "6 min read",
    category: "Career Tips",
    tags: ["Resume", "Job Search", "ATS", "Recruitment"],
    views: 8923,
    likes: 654,
    comments: 89,
    featured: true,
    difficulty: "Beginner",
    coverImage: "https://images.unsplash.com/photo-1586282391129-76a6df230234?auto=format&fit=crop&w=800",
    bookmarked: false
  },
  {
    id: 3,
    title: "Mastering Behavioral Interviews: A Complete Guide",
    excerpt: "Learn how to effectively prepare for and ace behavioral interviews with our comprehensive guide.",
    content: "Behavioral interviews can be challenging, but with the right preparation, you can turn them into opportunities...",
    author: {
      name: "Jessica Williams",
      role: "HR Consultant",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
      verified: true
    },
    date: "2024-03-05",
    readTime: "10 min read",
    category: "Interview Skills",
    tags: ["Interview", "Soft Skills", "Preparation", "HR"],
    views: 15623,
    likes: 1023,
    comments: 156,
    featured: false,
    difficulty: "Intermediate",
    coverImage: "https://images.unsplash.com/photo-1551836026-d5c2c5af78e4?auto=format&fit=crop&w=800",
    bookmarked: true
  },
  {
    id: 4,
    title: "The Rise of Remote Internships: What You Need to Know",
    excerpt: "Exploring the benefits and challenges of remote internships in the post-pandemic world.",
    content: "Remote internships have become increasingly common, offering new opportunities and challenges...",
    author: {
      name: "David Rodriguez",
      role: "Internship Coordinator",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      verified: false
    },
    date: "2024-02-28",
    readTime: "7 min read",
    category: "Internships",
    tags: ["Remote Work", "Internships", "Digital Nomad", "Flexibility"],
    views: 7234,
    likes: 512,
    comments: 67,
    featured: false,
    difficulty: "Beginner",
    coverImage: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800",
    bookmarked: false
  },
  {
    id: 5,
    title: "Building Your Personal Brand as a Student",
    excerpt: "Strategies to develop and leverage your personal brand for career success while still in school.",
    content: "Your personal brand is more than just a LinkedIn profile—it's your professional identity...",
    author: {
      name: "Emma Thompson",
      role: "Brand Strategist",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
      verified: true
    },
    date: "2024-02-25",
    readTime: "9 min read",
    category: "Personal Development",
    tags: ["Personal Brand", "Networking", "LinkedIn", "Social Media"],
    views: 9456,
    likes: 723,
    comments: 94,
    featured: true,
    difficulty: "Intermediate",
    coverImage: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=800",
    bookmarked: true
  },
  {
    id: 6,
    title: "Navigating Career Changes: From Student to Professional",
    excerpt: "A roadmap for successfully transitioning from academic life to the professional world.",
    content: "The transition from student to professional can be daunting, but with proper planning...",
    author: {
      name: "Robert Kim",
      role: "Career Transition Coach",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
      verified: true
    },
    date: "2024-02-20",
    readTime: "11 min read",
    category: "Career Transition",
    tags: ["Career Change", "Transition", "Professional Life", "First Job"],
    views: 11234,
    likes: 845,
    comments: 123,
    featured: false,
    difficulty: "Advanced",
    coverImage: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=800",
    bookmarked: false
  },
  {
    id: 7,
    title: "The Importance of Networking in the Digital Age",
    excerpt: "How to build meaningful professional relationships in an increasingly digital world.",
    content: "Networking has evolved significantly with the rise of digital platforms...",
    author: {
      name: "Lisa Wang",
      role: "Network Specialist",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
      verified: true
    },
    date: "2024-02-15",
    readTime: "8 min read",
    category: "Networking",
    tags: ["Networking", "Digital", "Connections", "Professional"],
    views: 8765,
    likes: 612,
    comments: 78,
    featured: true,
    difficulty: "Intermediate",
    coverImage: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800",
    bookmarked: true
  },
  {
    id: 8,
    title: "Salary Negotiation Strategies for New Graduates",
    excerpt: "Confidently negotiate your first job offer with these proven strategies and techniques.",
    content: "Salary negotiation can be intimidating, especially for new graduates...",
    author: {
      name: "Thomas Anderson",
      role: "Compensation Analyst",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas",
      verified: true
    },
    date: "2024-02-10",
    readTime: "12 min read",
    category: "Salary",
    tags: ["Negotiation", "Salary", "Compensation", "Job Offer"],
    views: 13456,
    likes: 956,
    comments: 145,
    featured: false,
    difficulty: "Advanced",
    coverImage: "https://images.unsplash.com/photo-1580894894513-541e068a3e2b?auto=format&fit=crop&w=800",
    bookmarked: false
  }
];

// Mock data for categories
const CATEGORIES = [
  { id: 'all', label: 'All Articles', count: 48, icon: BookOpen },
  { id: 'ai-tech', label: 'AI & Technology', count: 12, icon: TrendingUp },
  { id: 'career-tips', label: 'Career Tips', count: 18, icon: Briefcase },
  { id: 'interview', label: 'Interview Skills', count: 9, icon: Target },
  { id: 'internships', label: 'Internships', count: 6, icon: Building },
  { id: 'personal-dev', label: 'Personal Development', count: 15, icon: Users },
  { id: 'networking', label: 'Networking', count: 8, icon: GraduationCap },
  { id: 'salary', label: 'Salary & Benefits', count: 7, icon: Award }
];

// Mock data for trending tags
const TRENDING_TAGS = [
  { name: 'AI', count: 24, trending: true },
  { name: 'Remote Work', count: 18, trending: true },
  { name: 'Resume Tips', count: 15, trending: false },
  { name: 'Interview Prep', count: 22, trending: true },
  { name: 'Career Growth', count: 16, trending: false },
  { name: 'Networking', count: 13, trending: false },
  { name: 'Soft Skills', count: 19, trending: true },
  { name: 'Job Search', count: 21, trending: true }
];

// Mock data for popular authors
const POPULAR_AUTHORS = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    role: 'AI Career Specialist',
    articles: 24,
    followers: 12450,
    verified: true,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Recruitment Expert',
    articles: 18,
    followers: 8920,
    verified: true,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael'
  },
  {
    id: 3,
    name: 'Jessica Williams',
    role: 'HR Consultant',
    articles: 15,
    followers: 7560,
    verified: true,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica'
  },
  {
    id: 4,
    name: 'Emma Thompson',
    role: 'Brand Strategist',
    articles: 12,
    followers: 6420,
    verified: true,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma'
  }
];

// Mock data for reading lists
const READING_LISTS = [
  {
    id: 1,
    title: 'AI Career Revolution',
    description: 'Essential reads about AI in career development',
    articles: 5,
    progress: 60,
    icon: TrendingUp
  },
  {
    id: 2,
    title: 'Interview Mastery',
    description: 'Master every type of job interview',
    articles: 8,
    progress: 25,
    icon: Target
  },
  {
    id: 3,
    title: 'First Job Success',
    description: 'Guide for new graduates',
    articles: 6,
    progress: 80,
    icon: GraduationCap
  }
];

interface BlogPostProps {
  post: typeof BLOG_POSTS[0];
  variant?: 'default' | 'compact' | 'featured';
}

const BlogPost: React.FC<BlogPostProps> = ({ post, variant = 'default' }) => {
  const [isBookmarked, setIsBookmarked] = useState(post.bookmarked);
  const [likes, setLikes] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(false);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  };

  if (variant === 'compact') {
    return (
      <Card className="group hover:shadow-lg transition-all duration-300 bg-card border-border overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-xs">
                  {post.category}
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {post.readTime}
                </span>
              </div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                {post.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={post.author.avatar} />
                    <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">{post.author.name}</span>
                  {post.author.verified && (
                    <Badge variant="outline" className="text-xs px-1 py-0 text-primary border-primary/20 bg-primary/5">
                      ✓
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-1 text-xs transition-colors ${isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-400'}`}
                  >
                    <Heart className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`} />
                    {likes}
                  </button>
                  <button
                    onClick={handleBookmark}
                    className={`transition-colors ${isBookmarked ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'featured') {
    return (
      <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-border bg-card shadow-lg">
        <div className="relative h-64 overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
          <div className="absolute top-4 left-4">
            <Badge className="bg-primary hover:bg-primary/90 text-white border-0">
              Featured
            </Badge>
          </div>
          <div className="absolute top-4 right-4">
            <button
              onClick={handleBookmark}
              className="bg-background/80 backdrop-blur-md p-2 rounded-full hover:bg-background transition-colors border border-border"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'text-primary fill-current' : 'text-foreground'}`} />
            </button>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-3">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
              {post.category}
            </Badge>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.readTime}
            </span>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {post.views.toLocaleString()}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors mb-3">
            {post.title}
          </h3>
          <p className="text-muted-foreground mb-4 line-clamp-2">
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={post.author.avatar} />
                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{post.author.name}</span>
                  {post.author.verified && (
                    <Badge variant="outline" className="text-xs text-primary border-primary/20 bg-primary/5">
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{post.author.role}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="group/btn text-primary hover:text-primary hover:bg-primary/10">
              Read More
              <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 h-full bg-card border-border overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <Badge className="bg-background/80 backdrop-blur-md text-foreground border-border hover:bg-background">
            {post.category}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <button
            onClick={handleBookmark}
            className="bg-background/80 backdrop-blur-md p-2 rounded-full hover:bg-background transition-colors border border-border"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'text-primary fill-current' : 'text-foreground'}`} />
          </button>
        </div>
      </div>
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
          <span className="text-sm text-muted-foreground">•</span>
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {post.readTime}
          </span>
          <span className="text-sm text-muted-foreground">•</span>
          <Badge variant="outline" className="text-xs border-primary/20 bg-primary/5 text-primary">
            {post.difficulty}
          </Badge>
        </div>
        <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors mb-3 line-clamp-2">
          {post.title}
        </h3>
        <p className="text-muted-foreground mb-4 line-clamp-3 italic">
          {post.excerpt}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {post.tags.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{post.tags.length - 2}
            </Badge>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={post.author.avatar} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-foreground">{post.author.name}</span>
                {post.author.verified && (
                  <span className="text-primary text-xs">✓</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{post.author.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 text-sm transition-colors ${isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-400'}`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              {likes}
            </button>
            <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
              <MessageCircle className="w-4 h-4" />
              {post.comments}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AuthorCard: React.FC<{ author: typeof POPULAR_AUTHORS[0] }> = ({ author }) => {
  return (
    <Card className="hover:shadow-md transition-shadow bg-card border-border">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={author.avatar} />
            <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-foreground truncate">{author.name}</h4>
              {author.verified && (
                <span className="text-primary">✓</span>
              )}
            </div>
            <p className="text-sm text-muted-foreground truncate">{author.role}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs text-muted-foreground">
                {author.articles} articles
              </span>
              <span className="text-xs text-muted-foreground">
                {author.followers.toLocaleString()} followers
              </span>
            </div>
          </div>
          <Button size="sm" variant="outline">
            Follow
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const ReadingListCard: React.FC<{ list: typeof READING_LISTS[0] }> = ({ list }) => {
  const Icon = list.icon;

  return (
    <Card className="hover:shadow-md transition-shadow bg-card border-border">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-foreground mb-1">{list.title}</h4>
            <p className="text-sm text-muted-foreground mb-3">{list.description}</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{list.articles} articles</span>
                <span>{list.progress}% complete</span>
              </div>
              <Progress value={list.progress} className="h-2" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const BlogPage: React.FC<any> = (props: any) => {
  const isDashboard = props?.isDashboard || false;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'trending'>('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleBack = () => {
    window.history.back();
  };

  // Filter and search logic
  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter(post => {
      // Search filter
      const matchesSearch = searchQuery === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      // Category filter
      const matchesCategory = selectedCategory === 'all' ||
        post.category.toLowerCase().includes(selectedCategory.toLowerCase());

      // Tags filter
      const matchesTags = selectedTags.length === 0 ||
        selectedTags.every(tag => post.tags.includes(tag));

      return matchesSearch && matchesCategory && matchesTags;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.views - a.views;
        case 'trending':
          return b.likes - a.likes;
        case 'recent':
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });
  }, [searchQuery, selectedCategory, selectedTags, sortBy]);

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  const handleTagClick = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className={`${!isDashboard ? "min-h-screen bg-background" : "bg-transparent"} dark:bg-black transition-colors duration-300`}>
      {/* Hero Section - Hide if in dashboard */}
      {!isDashboard && (
        <div className="bg-gradient-to-br from-primary via-primary/90 to-accent text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
            <div className="flex items-center justify-between mb-8">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="text-white hover:bg-white/20 backdrop-blur-sm"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <ThemeToggle />
            </div>
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-semibold tracking-wider uppercase text-white/80">Career Insights Blog</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Master Your <span className="text-white underline decoration-white/30 underline-offset-8">Career Journey</span>
              </h1>
              <p className="text-xl text-white/90 mb-10 max-w-2xl leading-relaxed">
                Expert advice, industry insights, and practical tips to accelerate your professional growth from those who have been there.
              </p>
              <div className="relative max-w-2xl group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5 group-focus-within:text-white transition-colors" />
                <Input
                  type="search"
                  placeholder="Search articles, topics, or authors..."
                  className="pl-12 py-7 text-lg rounded-2xl border-white/20 bg-white/10 backdrop-blur-md text-white placeholder:text-white/60 focus:bg-white/20 transition-all shadow-2xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`${!isDashboard ? "container mx-auto px-4 sm:px-6 lg:px-8 py-12" : "py-0"}`}>
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Categories */}
            <Card className="bg-card border-border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Filter className="w-5 h-5 text-primary" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {CATEGORIES.map((category) => {
                    const Icon = category.icon;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group ${selectedCategory === category.id ? 'bg-primary text-white shadow-md' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 ${selectedCategory === category.id ? 'text-white' : 'text-primary group-hover:scale-110 transition-transform'}`} />
                          <span className="font-medium text-sm">{category.label}</span>
                        </div>
                        <Badge variant={selectedCategory === category.id ? "outline" : "secondary"} className={selectedCategory === category.id ? "text-white border-white/30" : ""}>
                          {category.count}
                        </Badge>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Trending Tags */}
            <Card className="bg-card border-border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Trending Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {TRENDING_TAGS.map((tag) => (
                    <Badge
                      key={tag.name}
                      variant={selectedTags.includes(tag.name) ? "default" : "outline"}
                      className={`cursor-pointer transition-all duration-200 py-1.5 px-3 rounded-lg ${selectedTags.includes(tag.name) ? 'bg-primary text-white' : 'hover:bg-primary/10 hover:border-primary/30'} `}
                      onClick={() => handleTagClick(tag.name)}
                    >
                      {tag.trending && <TrendingUp className="w-3 h-3 mr-1" />}
                      {tag.name}
                      <span className="text-xs ml-1 opacity-75">({tag.count})</span>
                    </Badge>
                  ))}
                </div>
                {selectedTags.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-4 w-full"
                    onClick={() => setSelectedTags([])}
                  >
                    Clear filters
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Popular Authors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Top Authors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {POPULAR_AUTHORS.map((author) => (
                  <AuthorCard key={author.id} author={author} />
                ))}
              </CardContent>
            </Card>

            {/* Reading Lists */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bookmark className="w-5 h-5" />
                  Your Reading Lists
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {READING_LISTS.map((list) => (
                  <ReadingListCard key={list.id} list={list} />
                ))}
                <Button variant="outline" className="w-full" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New List
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Stats Bar */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">{BLOG_POSTS.length}</div>
                    <div className="text-sm text-slate-600">Total Articles</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">
                      {BLOG_POSTS.reduce((sum, post) => sum + post.views, 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-slate-600">Total Views</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">
                      {BLOG_POSTS.reduce((sum, post) => sum + post.likes, 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-slate-600">Total Likes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">
                      {BLOG_POSTS.reduce((sum, post) => sum + post.comments, 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-slate-600">Total Comments</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  Grid
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  List
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <Tabs value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                  <TabsList>
                    <TabsTrigger value="recent">Recent</TabsTrigger>
                    <TabsTrigger value="popular">Popular</TabsTrigger>
                    <TabsTrigger value="trending">Trending</TabsTrigger>
                  </TabsList>
                </Tabs>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Featured Posts */}
            {featuredPosts.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Featured Articles
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {featuredPosts.slice(0, 2).map((post) => (
                    <BlogPost key={post.id} post={post} variant="featured" />
                  ))}
                </div>
              </div>
            )}

            {/* All Articles */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  Latest Articles
                  <span className="text-sm font-normal text-slate-600 ml-2">
                    ({filteredPosts.length} articles)
                  </span>
                </h2>
                {filteredPosts.length > 0 && (
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>

              {filteredPosts.length === 0 ? (
                <Card className="p-12 text-center">
                  <div className="text-slate-400 mb-4">
                    <Search className="w-12 h-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No articles found</h3>
                  <p className="text-slate-600 mb-4">
                    Try adjusting your search or filter to find what you're looking for.
                  </p>
                  <Button onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedTags([]);
                  }}>
                    Clear Filters
                  </Button>
                </Card>
              ) : viewMode === 'grid' ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {regularPosts.map((post) => (
                    <BlogPost key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {regularPosts.map((post) => (
                    <BlogPost key={post.id} post={post} variant="compact" />
                  ))}
                </div>
              )}
            </div>

            {/* Newsletter CTA */}
            <Card className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 border-0">
              <CardContent className="p-8 text-center">
                <div className="max-w-2xl mx-auto">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <MessageCircle className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    Never Miss an Update
                  </h3>
                  <p className="text-slate-600 mb-6">
                    Join 10,000+ students who receive weekly career tips, industry insights, and exclusive content.
                  </p>
                  <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-1 bg-white"
                    />
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                      Subscribe
                    </Button>
                  </form>
                  <p className="text-sm text-slate-500 mt-4">
                    No spam. Unsubscribe anytime.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

// Utility component for the plus icon (missing from lucide-react imports)
const Plus: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

export default BlogPage;