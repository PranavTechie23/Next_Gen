import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  Search,
  Calendar,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Bookmark,
  TrendingUp,
  Filter,
  ArrowLeft,
  Sparkles,
  Flame,
  Zap,
  Star,
  BookMarked,
  Users,
  Globe,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Loader2,
  Hash,
  Award,
  BookOpen
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

// Types for Dev.to API
interface Article {
  id: number;
  title: string;
  description: string;
  url: string;
  published_at: string;
  tag_list: string[];
  reading_time_minutes: number;
  public_reactions_count: number;
  comments_count: number;
  cover_image: string | null;
  social_image: string;
  user: {
    name: string;
    username: string;
    profile_image: string;
    profile_image_90: string;
  };
  organization?: {
    name: string;
    username: string;
    profile_image: string;
  };
}

interface BlogPostProps {
  article: Article;
  variant?: 'default' | 'compact' | 'featured';
}

const BlogPost: React.FC<BlogPostProps> = ({ article, variant = 'default' }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likes, setLikes] = useState(article.public_reactions_count);
  const [isLiked, setIsLiked] = useState(false);

  const handleBookmark = () => setIsBookmarked(!isBookmarked);

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const published = new Date(date);
    const diffInHours = Math.floor((now.getTime() - published.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return published.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const coverImage = article.cover_image || article.social_image || `https://picsum.photos/seed/${article.id}/800/400`;

  if (variant === 'compact') {
    return (
      <Card className="group hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-900/80 dark:to-slate-900/40 border-white/20 dark:border-slate-700/50 backdrop-blur-xl overflow-hidden hover:-translate-y-0.5">
        <CardContent className="p-5">
          <div className="flex gap-4">
            {article.cover_image && (
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 block"
              >
                <img
                  src={coverImage}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </a>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                {article.tag_list.slice(0, 2).map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20 text-purple-700 dark:text-purple-300"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group/title"
              >
                <h3 className="font-bold text-foreground group-hover/title:text-purple-600 dark:group-hover/title:text-purple-400 transition-colors line-clamp-2 mb-2 text-lg">
                  {article.title}
                </h3>
              </a>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {article.reading_time_minutes} min
                </span>
                <span>•</span>
                <span>{getTimeAgo(article.published_at)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="w-7 h-7 border-2 border-white dark:border-slate-800">
                    <AvatarImage src={article.user.profile_image_90} />
                    <AvatarFallback>{article.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-foreground">{article.user.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-1 text-sm transition-colors ${isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-400'}`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                    <span className="text-xs font-semibold">{likes}</span>
                  </button>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors font-bold ml-1"
                  >
                    Read
                    <ExternalLink className="w-3 h-3" />
                  </a>
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
      <Card className="group hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white/90 to-white/60 dark:from-slate-900/90 dark:to-slate-900/60 border-white/30 dark:border-slate-700/50 backdrop-blur-2xl overflow-hidden hover:-translate-y-1">
        <div className="relative h-80 overflow-hidden">
          <img
            src={coverImage}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg">
              <Flame className="w-3 h-3 mr-1" />
              Featured
            </Badge>
            <Badge className="bg-black/40 backdrop-blur-md text-white border-white/20">
              <Clock className="w-3 h-3 mr-1" />
              {article.reading_time_minutes} min
            </Badge>
          </div>
          <div className="absolute top-4 right-4">
            <button
              onClick={handleBookmark}
              className="bg-black/40 backdrop-blur-md p-2.5 rounded-full hover:bg-black/60 transition-all border border-white/20 shadow-lg"
            >
              <Bookmark className={`w-5 h-5 ${isBookmarked ? 'text-yellow-400 fill-current' : 'text-white'}`} />
            </button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex flex-wrap gap-2 mb-3">
              {article.tag_list.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  className="bg-white/20 backdrop-blur-md text-white border-white/30 hover:bg-white/30"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 line-clamp-2">
              {article.title}
            </h3>
            <p className="text-white/90 mb-4 line-clamp-2">
              {article.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 border-2 border-white">
                  <AvatarImage src={article.user.profile_image} />
                  <AvatarFallback>{article.user.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-white">{article.user.name}</p>
                  <p className="text-sm text-white/70">{getTimeAgo(article.published_at)}</p>
                </div>
              </div>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white hover:bg-white/30 transition-all border border-white/30"
              >
                Read More
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-xl transition-all duration-500 bg-gradient-to-br from-white/90 to-white/60 dark:from-slate-900/90 dark:to-slate-900/60 border-white/30 dark:border-slate-700/50 backdrop-blur-2xl overflow-hidden hover:-translate-y-1">
      <div className="relative h-52 overflow-hidden">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full h-full"
        >
          <img
            src={coverImage}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        </a>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        <div className="absolute top-3 right-3">
          <button
            onClick={handleBookmark}
            className="bg-black/40 backdrop-blur-md p-2 rounded-full hover:bg-black/60 transition-all border border-white/20"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'text-yellow-400 fill-current' : 'text-white'}`} />
          </button>
        </div>
      </div>
      <CardContent className="p-5">
        <div className="flex flex-wrap gap-2 mb-3">
          {article.tag_list.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20 text-purple-700 dark:text-purple-300 hover:from-purple-500/20 hover:to-pink-500/20"
            >
              #{tag}
            </Badge>
          ))}
        </div>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block group/title"
        >
          <h3 className="font-bold text-lg text-foreground group-hover/title:text-purple-600 dark:group-hover/title:text-purple-400 transition-colors mb-2 line-clamp-2 leading-snug">
            {article.title}
          </h3>
        </a>
        <p className="text-muted-foreground mb-4 line-clamp-2 text-sm leading-relaxed">
          {article.description}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center gap-3">
            <Avatar className="w-9 h-9 border-2 border-white dark:border-slate-800">
              <AvatarImage src={article.user.profile_image_90} />
              <AvatarFallback>{article.user.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold text-foreground">{article.user.name}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{getTimeAgo(article.published_at)}</span>
                <span>•</span>
                <span>{article.reading_time_minutes} min read</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 text-sm transition-colors ${isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-400'}`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span className="font-medium">{likes}</span>
            </button>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors font-bold ml-2"
            >
              Read
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const LoadingSkeleton = () => (
  <div className="space-y-6">
    {[1, 2, 3].map((i) => (
      <Card key={i} className="overflow-hidden">
        <Skeleton className="h-52 w-full" />
        <CardContent className="p-5 space-y-3">
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
          </div>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex items-center gap-3 pt-3">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

const BlogPage: React.FC<any> = (props: any) => {
  const isDashboard = props?.isDashboard || false;
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const popularTags = [
    { name: 'webdev', icon: Globe, color: 'from-blue-500 to-cyan-500' },
    { name: 'javascript', icon: Zap, color: 'from-yellow-500 to-orange-500' },
    { name: 'react', icon: Sparkles, color: 'from-cyan-500 to-blue-500' },
    { name: 'python', icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
    { name: 'ai', icon: Flame, color: 'from-purple-500 to-pink-500' },
    { name: 'career', icon: Award, color: 'from-indigo-500 to-purple-500' },
  ];

  useEffect(() => {
    fetchArticles();
  }, [selectedTag, sortBy]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      let url = 'https://dev.to/api/articles?per_page=30';

      if (selectedTag) {
        url += `&tag=${selectedTag}`;
      }

      if (sortBy === 'popular') {
        url += '&top=30';
      }

      const response = await fetch(url);
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchesSearch = searchQuery === '' ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tag_list.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesSearch;
    });
  }, [articles, searchQuery]);

  const featuredArticles = filteredArticles.slice(0, 2);
  const regularArticles = filteredArticles.slice(2);

  const handleBack = () => window.history.back();

  const totalReactions = articles.reduce((sum, article) => sum + article.public_reactions_count, 0);
  const totalComments = articles.reduce((sum, article) => sum + article.comments_count, 0);

  return (
    <div className={`${!isDashboard ? "min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden" : "bg-transparent"} transition-colors duration-300`}>
      {/* Animated Background */}
      {!isDashboard && (
        <>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-400/20 to-transparent dark:from-purple-600/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-pink-400/20 to-transparent dark:from-pink-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-transparent dark:from-blue-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          </div>
        </>
      )}

      {/* Hero Section */}
      {!isDashboard && (
        <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAtMjBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6TTE2IDM0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wLTIwYzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
            <div className="flex items-center justify-between mb-8">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="text-white hover:bg-white/20 backdrop-blur-sm border border-white/20"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <ThemeToggle />
            </div>
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/30">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span className="text-sm font-semibold">Powered by Dev.to Community</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/80">
                Discover Amazing<br />Developer Stories
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed font-light">
                Read, learn, and grow with the latest insights from developers around the world
              </p>
              <div className="relative max-w-2xl mx-auto group">
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-white/60 w-6 h-6 group-focus-within:text-white transition-colors" />
                <Input
                  type="search"
                  placeholder="Search articles, topics, or tags..."
                  className="pl-14 pr-6 py-8 text-lg rounded-2xl border-2 border-white/30 bg-white/10 backdrop-blur-xl text-white placeholder:text-white/60 focus:bg-white/20 focus:border-white/50 transition-all shadow-2xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`${!isDashboard ? "container mx-auto px-4 sm:px-6 lg:px-8 py-12" : "py-0"} relative z-10`}>
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Stats Card */}
            <Card className="bg-gradient-to-br from-white/90 to-white/60 dark:from-slate-900/90 dark:to-slate-900/60 border-white/30 dark:border-slate-700/50 backdrop-blur-xl shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  Community Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <BookOpen className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Articles</p>
                      <p className="text-2xl font-bold text-foreground">{articles.length}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-xl border border-red-500/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-500/20 rounded-lg">
                      <Heart className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Reactions</p>
                      <p className="text-2xl font-bold text-foreground">{totalReactions.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <MessageCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Comments</p>
                      <p className="text-2xl font-bold text-foreground">{totalComments.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Popular Tags */}
            <Card className="bg-gradient-to-br from-white/90 to-white/60 dark:from-slate-900/90 dark:to-slate-900/60 border-white/30 dark:border-slate-700/50 backdrop-blur-xl shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Hash className="w-5 h-5 text-purple-600" />
                  Popular Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {popularTags.map((tag) => {
                    const Icon = tag.icon;
                    return (
                      <button
                        key={tag.name}
                        onClick={() => setSelectedTag(selectedTag === tag.name ? '' : tag.name)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group ${selectedTag === tag.name
                          ? `bg-gradient-to-r ${tag.color} text-white shadow-lg scale-105`
                          : 'hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-500/10 text-foreground border border-transparent hover:border-purple-500/20'
                          }`}
                      >
                        <div className={`p-2 rounded-lg ${selectedTag === tag.name ? 'bg-white/20' : 'bg-gradient-to-r ' + tag.color + ' bg-opacity-10'}`}>
                          <Icon className={`w-4 h-4 ${selectedTag === tag.name ? 'text-white' : ''}`} />
                        </div>
                        <span className="font-semibold text-sm">#{tag.name}</span>
                        <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${selectedTag === tag.name ? 'rotate-90' : ''}`} />
                      </button>
                    );
                  })}
                  {selectedTag && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => setSelectedTag('')}
                    >
                      Clear filter
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Refresh Button */}
            <Button
              onClick={fetchArticles}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-xl"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Articles
                </>
              )}
            </Button>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div className="flex items-center gap-3">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-gradient-to-r from-purple-600 to-pink-600' : ''}
                >
                  Grid View
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-gradient-to-r from-purple-600 to-pink-600' : ''}
                >
                  List View
                </Button>
              </div>
              <Tabs value={sortBy} onValueChange={(v) => setSortBy(v as any)} className="w-auto">
                <TabsList className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
                  <TabsTrigger value="recent" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">
                    <Clock className="w-4 h-4 mr-2" />
                    Recent
                  </TabsTrigger>
                  <TabsTrigger value="popular" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">
                    <Flame className="w-4 h-4 mr-2" />
                    Popular
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {loading ? (
              <LoadingSkeleton />
            ) : filteredArticles.length === 0 ? (
              <Card className="p-12 text-center bg-gradient-to-br from-white/90 to-white/60 dark:from-slate-900/90 dark:to-slate-900/60 border-white/30 dark:border-slate-700/50 backdrop-blur-xl">
                <div className="text-purple-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">No articles found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search or filters
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedTag('');
                  }}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Clear Filters
                </Button>
              </Card>
            ) : (
              <>
                {/* Featured Articles */}
                {featuredArticles.length > 0 && (
                  <div className="mb-10">
                    <div className="flex items-center gap-3 mb-6">
                      <Star className="w-6 h-6 text-yellow-500" />
                      <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                        Featured Stories
                      </h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6 mb-10">
                      {featuredArticles.map((article) => (
                        <BlogPost key={article.id} article={article} variant="featured" />
                      ))}
                    </div>
                  </div>
                )}

                {/* Regular Articles */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-foreground">
                      Latest Articles
                      <span className="text-sm font-normal text-muted-foreground ml-3">
                        ({filteredArticles.length} articles)
                      </span>
                    </h2>
                  </div>

                  {viewMode === 'grid' ? (
                    <div className="grid md:grid-cols-2 gap-6">
                      {regularArticles.map((article) => (
                        <BlogPost key={article.id} article={article} />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {regularArticles.map((article) => (
                        <BlogPost key={article.id} article={article} variant="compact" />
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;