import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  Search,
  Book,
  MessageCircle,
  Settings,
  CreditCard,
  Shield,
  Zap,
  Users,
  ChevronRight,
  HelpCircle,
  Mail,
  Phone,
  Clock,
  TrendingUp,
  FileText,
  Video,
  ArrowLeft
} from 'lucide-react';

export default function HelpCenter() {
  const handleBack = () => {
    window.history.back();
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const categories = [
    {
      id: 'getting-started',
      icon: Book,
      title: 'Getting Started',
      description: 'Learn the basics and set up your account',
      articles: 24,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'account',
      icon: Users,
      title: 'Account & Settings',
      description: 'Manage your profile and preferences',
      articles: 18,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'billing',
      icon: CreditCard,
      title: 'Billing & Payments',
      description: 'Subscriptions, invoices, and payment methods',
      articles: 15,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'security',
      icon: Shield,
      title: 'Security & Privacy',
      description: 'Keep your data safe and secure',
      articles: 12,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'features',
      icon: Zap,
      title: 'Features & Tools',
      description: 'Explore advanced capabilities',
      articles: 32,
      color: 'from-indigo-500 to-purple-500'
    },
    {
      id: 'troubleshooting',
      icon: Settings,
      title: 'Troubleshooting',
      description: 'Fix common issues and errors',
      articles: 21,
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  const popularArticles = [
    { title: 'How to reset your password', views: '12.5k', icon: Shield },
    { title: 'Getting started with your first project', views: '10.2k', icon: Book },
    { title: 'Understanding your billing cycle', views: '8.7k', icon: CreditCard },
    { title: 'Keyboard shortcuts guide', views: '7.3k', icon: Zap },
    { title: 'Inviting team members', views: '6.9k', icon: Users }
  ];

  const resources = [
    {
      icon: Video,
      title: 'Video Tutorials',
      description: 'Step-by-step visual guides',
      link: 'Watch now'
    },
    {
      icon: FileText,
      title: 'Documentation',
      description: 'Comprehensive technical docs',
      link: 'Read docs'
    },
    {
      icon: MessageCircle,
      title: 'Community Forum',
      description: 'Connect with other users',
      link: 'Join discussion'
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-slate-900/40 backdrop-blur-3xl border-b border-slate-200 dark:border-white/5 transition-all duration-500">
        <div className="max-w-[1700px] mx-auto px-6 sm:px-10">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-6">
              <button
                onClick={handleBack}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white rounded-xl font-black text-sm tracking-tight hover:shadow-[0_10px_30px_rgba(37,99,235,0.4)] transition-all flex items-center gap-2 hover:scale-105 active:scale-95 group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                Back
              </button>
              <div className="h-10 w-px bg-slate-200 dark:bg-white/10 hidden sm:block"></div>
              <div className="flex items-center gap-0 group cursor-pointer" onClick={() => window.location.href = "/"}>
                <img src="/NG/NextGen_light.png" alt="NextGen Logo" className="h-12 w-12 object-contain flex-shrink-0 transition-transform duration-500 group-hover:scale-110" />
                <div className="hidden sm:flex flex-col">
                  <span className="font-black text-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-none">NextGen</span>
                  <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Help Center</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle className="!h-12 !w-12 bg-slate-100 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 hover:border-blue-500/30 !rounded-xl transition-all flex items-center justify-center shadow-lg hover:scale-110 text-slate-600 dark:text-white" />
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-black text-sm tracking-tight hover:shadow-[0_10px_30px_rgba(37,99,235,0.4)] transition-all flex items-center gap-2 hover:scale-105 active:scale-95 group">
                <MessageCircle className="w-5 h-5 mr-1" />
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
          How can we help you?
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Search our knowledge base or browse categories below
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <input
            type="text"
            placeholder="Search for articles, guides, and more..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-muted/50 backdrop-blur-md border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <h2 className="text-3xl font-bold text-foreground mb-8">Browse by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.id}
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
                className="group relative glass-card p-6 border-border hover:bg-muted/50 transition-all cursor-pointer overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity`} />

                <div className="relative">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="text-xl font-semibold text-foreground mb-2 flex items-center justify-between">
                    {category.title}
                    <ChevronRight className={`w-5 h-5 text-primary transition-transform ${hoveredCategory === category.id ? 'translate-x-1' : ''}`} />
                  </h3>

                  <p className="text-muted-foreground mb-4">{category.description}</p>

                  <div className="flex items-center text-sm text-primary">
                    <FileText className="w-4 h-4 mr-1" />
                    {category.articles} articles
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Popular Articles */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-foreground flex items-center">
            <TrendingUp className="w-8 h-8 mr-3 text-primary" />
            Popular Articles
          </h2>
          <button className="text-primary hover:opacity-80 transition-colors">
            View all →
          </button>
        </div>

        <div className="glass-card border-border overflow-hidden">
          {popularArticles.map((article, index) => {
            const Icon = article.icon;
            return (
              <div
                key={index}
                className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors border-b border-border last:border-0 cursor-pointer group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground group-hover:text-primary transition-colors">
                    {article.title}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-muted-foreground">{article.views} views</span>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Additional Resources */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <h2 className="text-3xl font-bold text-foreground mb-8">Additional Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resources.map((resource, index) => {
            const Icon = resource.icon;
            return (
              <div
                key={index}
                className="glass-card p-6 border-border hover:bg-muted/50 transition-all cursor-pointer group"
              >
                <Icon className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold text-foreground mb-2">{resource.title}</h3>
                <p className="text-muted-foreground mb-4">{resource.description}</p>
                <span className="text-primary group-hover:opacity-80 transition-colors">
                  {resource.link} →
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact Section */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 backdrop-blur-sm border border-border rounded-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Still need help?</h2>
            <p className="text-muted-foreground">Our support team is available 24/7 to assist you</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Live Chat</h3>
              <p className="text-muted-foreground text-sm mb-3">Get instant answers</p>
              <button className="text-primary hover:opacity-80 transition-colors">
                Start chat →
              </button>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Email Support</h3>
              <p className="text-muted-foreground text-sm mb-3">Response within 24h</p>
              <button className="text-primary hover:opacity-80 transition-colors">
                Send email →
              </button>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Phone Support</h3>
              <p className="text-muted-foreground text-sm mb-3">Mon-Fri, 9am-6pm EST</p>
              <button className="text-primary hover:opacity-80 transition-colors">
                Call now →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
