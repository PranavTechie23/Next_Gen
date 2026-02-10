import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Newspaper,
  Video,
  Github,
  MessageSquare,
  Briefcase,
  TrendingUp,
  Clock,
  Bookmark,
  Heart,
  Share2,
  ExternalLink,
  Search,
  Filter,
  X,
  Star,
  Eye,
  Calendar,
  Tag,
  Flame,
  Sparkles,
  Code,
  Play,
  ArrowUpRight,
  CheckCircle,
  ChevronDown,
  Layers,
  Zap,
  Award,
  Target,
  BookOpen,
  Lightbulb,
  Coffee,
  Globe,
  Users,
  ThumbsUp,
  Link2,
  RefreshCw,
  Settings,
  Bell,
  BellOff,
  Download,
  Upload,
  BarChart3,
  TrendingDown
} from 'lucide-react';

// ====================================
// TYPES & INTERFACES
// ====================================

interface FeedItem {
  id: string;
  type: 'article' | 'video' | 'repo' | 'discussion' | 'job';
  title: string;
  description: string;
  url: string;
  image?: string;
  author: {
    name: string;
    avatar?: string;
    url?: string;
  };
  platform: 'dev.to' | 'github' | 'youtube' | 'reddit' | 'medium' | 'hackernews' | 'stackoverflow';
  publishedAt: string;
  tags: string[];
  stats: {
    views?: number;
    likes?: number;
    comments?: number;
    stars?: number;
  };
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  readTime?: string;
  isBookmarked?: boolean;
  isLiked?: boolean;
}

interface UserProfile {
  skills: string[];
  interests: string[];
  learningGoals: string[];
}

// ====================================
// MOCK USER PROFILE (Replace with real data)
// ====================================

const MOCK_USER: UserProfile = {
  skills: ['React', 'TypeScript', 'Node.js', 'Python', 'JavaScript'],
  interests: ['Web Development', 'AI/ML', 'Cloud', 'DevOps'],
  learningGoals: ['Next.js', 'Docker', 'AWS']
};

// ====================================
// API HELPER FUNCTIONS
// ====================================

// TODO: Replace with your actual API keys
const API_KEYS = {
  youtube: '', // Get from: https://console.cloud.google.com/
  news: '', // Get from: https://newsapi.org/
  github: '' // Optional, increases rate limit
};

// Fetch Dev.to articles
const fetchDevToArticles = async (tags: string[]): Promise<FeedItem[]> => {
  try {
    const tag = tags[0]?.toLowerCase() || 'javascript';
    const response = await fetch(`https://dev.to/api/articles?tag=${tag}&per_page=10`);
    const data = await response.json();
    
    return data.map((article: any) => ({
      id: `dev-${article.id}`,
      type: 'article' as const,
      title: article.title,
      description: article.description || article.title,
      url: article.url,
      image: article.cover_image || article.social_image,
      author: {
        name: article.user.name,
        avatar: article.user.profile_image,
        url: `https://dev.to/${article.user.username}`
      },
      platform: 'dev.to' as const,
      publishedAt: article.published_at,
      tags: article.tag_list,
      stats: {
        views: article.page_views_count,
        likes: article.public_reactions_count,
        comments: article.comments_count
      },
      readTime: `${article.reading_time_minutes} min read`,
      isBookmarked: false,
      isLiked: false
    }));
  } catch (error) {
    console.error('Error fetching Dev.to articles:', error);
    return [];
  }
};

// Fetch GitHub trending repos
const fetchGitHubRepos = async (language: string = 'javascript'): Promise<FeedItem[]> => {
  try {
    const response = await fetch(
      `https://api.github.com/search/repositories?q=language:${language}+stars:>1000&sort=stars&order=desc&per_page=10`,
      {
        headers: API_KEYS.github ? {
          'Authorization': `token ${API_KEYS.github}`
        } : {}
      }
    );
    const data = await response.json();
    
    return data.items?.map((repo: any) => ({
      id: `github-${repo.id}`,
      type: 'repo' as const,
      title: repo.full_name,
      description: repo.description || 'No description available',
      url: repo.html_url,
      image: repo.owner.avatar_url,
      author: {
        name: repo.owner.login,
        avatar: repo.owner.avatar_url,
        url: repo.owner.html_url
      },
      platform: 'github' as const,
      publishedAt: repo.created_at,
      tags: repo.topics || [repo.language],
      stats: {
        stars: repo.stargazers_count,
        views: repo.watchers_count
      },
      isBookmarked: false,
      isLiked: false
    })) || [];
  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    return [];
  }
};

// Fetch Reddit posts
const fetchRedditPosts = async (subreddit: string = 'reactjs'): Promise<FeedItem[]> => {
  try {
    const response = await fetch(`https://www.reddit.com/r/${subreddit}/hot.json?limit=10`);
    const data = await response.json();
    
    return data.data?.children?.map((post: any) => ({
      id: `reddit-${post.data.id}`,
      type: 'discussion' as const,
      title: post.data.title,
      description: post.data.selftext?.substring(0, 200) || post.data.title,
      url: `https://reddit.com${post.data.permalink}`,
      image: post.data.thumbnail !== 'self' && post.data.thumbnail !== 'default' ? post.data.thumbnail : undefined,
      author: {
        name: post.data.author,
        url: `https://reddit.com/u/${post.data.author}`
      },
      platform: 'reddit' as const,
      publishedAt: new Date(post.data.created_utc * 1000).toISOString(),
      tags: [subreddit],
      stats: {
        likes: post.data.ups,
        comments: post.data.num_comments
      },
      isBookmarked: false,
      isLiked: false
    })) || [];
  } catch (error) {
    console.error('Error fetching Reddit posts:', error);
    return [];
  }
};

// Fetch Hacker News stories
const fetchHackerNews = async (): Promise<FeedItem[]> => {
  try {
    const topStoriesRes = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
    const topStoryIds = await topStoriesRes.json();
    
    const stories = await Promise.all(
      topStoryIds.slice(0, 10).map(async (id: number) => {
        const storyRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
        return storyRes.json();
      })
    );
    
    return stories.map((story: any) => ({
      id: `hn-${story.id}`,
      type: 'article' as const,
      title: story.title,
      description: story.title,
      url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
      author: {
        name: story.by,
        url: `https://news.ycombinator.com/user?id=${story.by}`
      },
      platform: 'hackernews' as const,
      publishedAt: new Date(story.time * 1000).toISOString(),
      tags: ['tech', 'news'],
      stats: {
        likes: story.score,
        comments: story.descendants || 0
      },
      isBookmarked: false,
      isLiked: false
    }));
  } catch (error) {
    console.error('Error fetching Hacker News:', error);
    return [];
  }
};

// ====================================
// MOCK DATA (Fallback when APIs fail)
// ====================================

const MOCK_FEED_ITEMS: FeedItem[] = [
  {
    id: '1',
    type: 'article',
    title: 'Building Scalable React Applications with TypeScript',
    description: 'Learn how to architect large-scale React apps using TypeScript, featuring best practices for type safety and maintainability.',
    url: 'https://dev.to',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800',
    author: {
      name: 'Sarah Dev',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
    },
    platform: 'dev.to',
    publishedAt: new Date().toISOString(),
    tags: ['React', 'TypeScript', 'Architecture'],
    stats: {
      views: 12450,
      likes: 892,
      comments: 45
    },
    difficulty: 'Intermediate',
    readTime: '8 min read',
    isBookmarked: false,
    isLiked: false
  },
  {
    id: '2',
    type: 'video',
    title: 'Next.js 14 Full Course - Build Production Ready Apps',
    description: 'Complete tutorial covering App Router, Server Components, and best practices for modern Next.js development.',
    url: 'https://youtube.com',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800',
    author: {
      name: 'Code Masters',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Code'
    },
    platform: 'youtube',
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    tags: ['Next.js', 'React', 'Tutorial'],
    stats: {
      views: 45200,
      likes: 3400,
      comments: 234
    },
    difficulty: 'Beginner',
    readTime: '2h 15min',
    isBookmarked: true,
    isLiked: false
  },
  {
    id: '3',
    type: 'repo',
    title: 'awesome-react-components',
    description: 'Curated list of awesome React components, libraries, and resources for building modern web applications.',
    url: 'https://github.com',
    image: 'https://api.dicebear.com/7.x/identicon/svg?seed=awesome',
    author: {
      name: 'react-community',
      avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=react'
    },
    platform: 'github',
    publishedAt: new Date(Date.now() - 172800000).toISOString(),
    tags: ['React', 'Components', 'Library'],
    stats: {
      stars: 45600,
      views: 1200
    },
    isBookmarked: false,
    isLiked: true
  }
];

const FeedCard: React.FC<{ item: FeedItem; onBookmark: () => void; onLike: () => void }> = ({ 
  item, 
  onBookmark, 
  onLike 
}) => {
  const getTypeIcon = () => {
    switch (item.type) {
      case 'article': return <Newspaper className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'repo': return <Github className="h-4 w-4" />;
      case 'discussion': return <MessageSquare className="h-4 w-4" />;
      case 'job': return <Briefcase className="h-4 w-4" />;
    }
  };

  const getPlatformColor = () => {
    switch (item.platform) {
      case 'dev.to': return 'from-purple-500 to-pink-500';
      case 'github': return 'from-gray-700 to-gray-900';
      case 'youtube': return 'from-red-500 to-red-700';
      case 'reddit': return 'from-orange-500 to-red-500';
      case 'hackernews': return 'from-orange-600 to-orange-800';
      default: return 'from-blue-500 to-indigo-500';
    }
  };

  const formatNumber = (num?: number) => {
    if (!num) return '0';
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  const getTimeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + 'y ago';
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + 'mo ago';
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + 'd ago';
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + 'h ago';
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + 'm ago';
    
    return 'Just now';
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-2 border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 overflow-hidden">
      {/* Image */}
      {item.image && (
        <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          {item.type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                <Play className="h-8 w-8 text-red-600 ml-1" />
              </div>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <Badge className={`bg-gradient-to-r ${getPlatformColor()} text-white border-0 shadow-lg`}>
              {getTypeIcon()}
              <span className="ml-1.5 capitalize">{item.platform}</span>
            </Badge>
          </div>
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                onBookmark();
              }}
              className="p-2 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 transition-colors shadow-lg"
            >
              <Bookmark className={`h-4 w-4 ${item.isBookmarked ? 'fill-blue-600 text-blue-600' : 'text-slate-600 dark:text-slate-300'}`} />
            </button>
          </div>
        </div>
      )}

      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={item.author.avatar} />
              <AvatarFallback className="text-xs">{item.author.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">{item.author.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{getTimeAgo(item.publishedAt)}</p>
            </div>
          </div>
          {item.difficulty && (
            <Badge
              variant="outline"
              className={
                item.difficulty === 'Beginner'
                  ? 'border-green-500 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/20'
                  : item.difficulty === 'Intermediate'
                  ? 'border-yellow-500 text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/20'
                  : 'border-red-500 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/20'
              }
            >
              {item.difficulty}
            </Badge>
          )}
        </div>

        {/* Title & Description */}
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block mb-3 group/link"
        >
          <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover/link:text-blue-600 dark:group-hover/link:text-blue-400 transition-colors line-clamp-2 mb-2">
            {item.title}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
            {item.description}
          </p>
        </a>

        {/* Tags */}
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {item.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
            {item.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{item.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
            {item.stats.views && (
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{formatNumber(item.stats.views)}</span>
              </div>
            )}
            {item.stats.stars && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{formatNumber(item.stats.stars)}</span>
              </div>
            )}
            {item.stats.likes !== undefined && (
              <button
                onClick={onLike}
                className={`flex items-center gap-1 transition-colors ${
                  item.isLiked ? 'text-red-500' : 'hover:text-red-500'
                }`}
              >
                <Heart className={`h-4 w-4 ${item.isLiked ? 'fill-current' : ''}`} />
                <span>{formatNumber(item.stats.likes)}</span>
              </button>
            )}
            {item.stats.comments !== undefined && (
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>{formatNumber(item.stats.comments)}</span>
              </div>
            )}
            {item.readTime && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{item.readTime}</span>
              </div>
            )}
          </div>

          <Button variant="ghost" size="sm" asChild>
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const LoadingSkeleton: React.FC = () => (
  <Card className="overflow-hidden">
    <Skeleton className="h-48 w-full" />
    <CardContent className="p-5">
      <div className="flex items-center gap-2 mb-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-4 w-24 mb-1" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <Skeleton className="h-6 w-full mb-2" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-3/4 mb-4" />
      <div className="flex gap-2 mb-4">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-16" />
      </div>
      <div className="flex items-center gap-4">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-12" />
      </div>
    </CardContent>
  </Card>
);


export default function Blog(props: any) {
  const isDashboard = props?.isDashboard || false;

  // State
  const [feedItems, setFeedItems] = useState<FeedItem[]>(MOCK_FEED_ITEMS);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'for-you' | 'trending' | 'saved'>('for-you');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [userProfile] = useState<UserProfile>(MOCK_USER);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Refs
  const observerTarget = useRef(null);

  // Fetch feed data
  const fetchFeedData = useCallback(async () => {
    setLoading(true);
    try {
      const [devArticles, githubRepos, redditPosts, hnStories] = await Promise.all([
        fetchDevToArticles(userProfile.skills),
        fetchGitHubRepos('javascript'),
        fetchRedditPosts('reactjs'),
        fetchHackerNews()
      ]);

      const allItems = [
        ...devArticles,
        ...githubRepos,
        ...redditPosts,
        ...hnStories
      ];

      // Sort by date
      allItems.sort((a, b) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );

      setFeedItems(allItems.length > 0 ? allItems : MOCK_FEED_ITEMS);
    } catch (error) {
      console.error('Error fetching feed:', error);
      setFeedItems(MOCK_FEED_ITEMS);
    } finally {
      setLoading(false);
    }
  }, [userProfile.skills]);

  // Initial fetch
  useEffect(() => {
    fetchFeedData();
  }, [fetchFeedData]);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loading) {
          // Load more items
          console.log('Load more...');
        }
      },
      { threshold: 1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [loading]);

  // Filter feed items
  const filteredItems = feedItems.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(item.type);
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => item.tags.includes(tag));

    const matchesTab = 
      activeTab === 'for-you' ? true :
      activeTab === 'saved' ? item.isBookmarked :
      activeTab === 'trending' ? (item.stats.likes || 0) > 500 : true;

    return matchesSearch && matchesType && matchesTags && matchesTab;
  });

  // Handlers
  const handleBookmark = (id: string) => {
    setFeedItems(items =>
      items.map(item =>
        item.id === id ? { ...item, isBookmarked: !item.isBookmarked } : item
      )
    );
  };

  const handleLike = (id: string) => {
    setFeedItems(items =>
      items.map(item => {
        if (item.id === id) {
          const newLikes = item.isLiked 
            ? (item.stats.likes || 0) - 1 
            : (item.stats.likes || 0) + 1;
          return {
            ...item,
            isLiked: !item.isLiked,
            stats: { ...item.stats, likes: newLikes }
          };
        }
        return item;
      })
    );
  };

  const toggleType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // Get available tags from feed
  const availableTags = Array.from(
    new Set(feedItems.flatMap(item => item.tags))
  ).slice(0, 15);

  const contentTypes = [
    { id: 'article', label: 'Articles', icon: Newspaper, count: feedItems.filter(i => i.type === 'article').length },
    { id: 'video', label: 'Videos', icon: Video, count: feedItems.filter(i => i.type === 'video').length },
    { id: 'repo', label: 'Repos', icon: Github, count: feedItems.filter(i => i.type === 'repo').length },
    { id: 'discussion', label: 'Discussions', icon: MessageSquare, count: feedItems.filter(i => i.type === 'discussion').length }
  ];

  return (
    <div className={`${!isDashboard ? "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" : "bg-transparent"} transition-colors duration-300`}>
      <div className={`${!isDashboard ? "container mx-auto px-4 py-8 max-w-7xl" : "p-0"}`}>
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className="border-2"
              >
                {notificationsEnabled ? (
                  <Bell className="h-4 w-4 text-blue-600" />
                ) : (
                  <BellOff className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchFeedData}
                disabled={loading}
                className="border-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  type="search"
                  placeholder="Search articles, videos, repos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 rounded-xl"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    <X className="h-4 w-4 text-slate-400 hover:text-slate-600" />
                  </button>
                )}
              </div>

              <Button
                variant={showFilters ? 'default' : 'outline'}
                onClick={() => setShowFilters(!showFilters)}
                className="border-2 h-12 px-6"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {(selectedTypes.length > 0 || selectedTags.length > 0) && (
                  <Badge variant="secondary" className="ml-2 bg-white dark:bg-slate-800">
                    {selectedTypes.length + selectedTags.length}
                  </Badge>
                )}
              </Button>
            </div>

            {/* Expandable Filters */}
            {showFilters && (
              <Card className="border-2 border-slate-200 dark:border-slate-800 animate-in slide-in-from-top-2 duration-300">
                <CardContent className="p-6 space-y-6">
                  {/* Content Types */}
                  <div>
                    <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                      <Layers className="h-4 w-4 text-blue-600" />
                      Content Type
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {contentTypes.map(type => {
                        const Icon = type.icon;
                        const isSelected = selectedTypes.includes(type.id);
                        return (
                          <Button
                            key={type.id}
                            variant={isSelected ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => toggleType(type.id)}
                            className="border-2"
                          >
                            <Icon className="h-4 w-4 mr-2" />
                            {type.label}
                            <Badge variant="secondary" className="ml-2">
                              {type.count}
                            </Badge>
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                      <Tag className="h-4 w-4 text-purple-600" />
                      Topics
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {availableTags.map(tag => (
                        <Badge
                          key={tag}
                          variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                          className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
                          onClick={() => toggleTag(tag)}
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Clear Filters */}
                  {(selectedTypes.length > 0 || selectedTags.length > 0) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedTypes([]);
                        setSelectedTags([]);
                      }}
                      className="w-full"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear All Filters
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-3 h-12">
            <TabsTrigger value="for-you" className="text-base">
              <Sparkles className="h-4 w-4 mr-2" />
              For You
            </TabsTrigger>
            <TabsTrigger value="trending" className="text-base">
              <Flame className="h-4 w-4 mr-2" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="saved" className="text-base">
              <Bookmark className="h-4 w-4 mr-2" />
              Saved
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Stats Bar */}
        <Card className="mb-6 border-2 border-slate-200 dark:border-slate-800">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {filteredItems.length}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Articles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {filteredItems.filter(i => i.isBookmarked).length}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Saved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {filteredItems.reduce((sum, item) => sum + (item.stats.views || 0), 0).toLocaleString()}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Total Views</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {userProfile.skills.length}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Your Skills</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feed Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && feedItems.length === 0 ? (
            Array.from({ length: 6 }).map((_, i) => <LoadingSkeleton key={i} />)
          ) : filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <FeedCard
                key={item.id}
                item={item}
                onBookmark={() => handleBookmark(item.id)}
                onLike={() => handleLike(item.id)}
              />
            ))
          ) : (
            <div className="col-span-full">
              <Card className="border-2 border-dashed border-slate-300 dark:border-slate-700">
                <CardContent className="py-16 text-center">
                  <Search className="h-16 w-16 mx-auto mb-4 text-slate-400" />
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    No content found
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Try adjusting your filters or search query
                  </p>
                  <Button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedTypes([]);
                      setSelectedTags([]);
                    }}
                  >
                    Clear All Filters
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Infinite Scroll Target */}
        <div ref={observerTarget} className="h-10" />

        {/* Loading More */}
        {loading && feedItems.length > 0 && (
          <div className="flex justify-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        )}

        {/* CTA Section */}
        {!isDashboard && (
          <Card className="mt-12 border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
            <CardContent className="p-8 text-center">
              <Coffee className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-2xl font-bold mb-3">Stay Updated</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto">
                Get personalized tech content delivered to your feed daily. Never miss important updates in your tech stack.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  onClick={() => setNotificationsEnabled(true)}
                >
                  <Bell className="mr-2 h-5 w-5" />
                  Enable Notifications
                </Button>
                <Button size="lg" variant="outline">
                  <Settings className="mr-2 h-5 w-5" />
                  Customize Feed
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}