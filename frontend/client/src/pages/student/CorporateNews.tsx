import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { buildApiUrl } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ExternalLink, AlertCircle, RefreshCcw, Newspaper, Globe } from "lucide-react";

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: { name: string };
}

interface CorporateNewsProps {
  isDashboard?: boolean;
}

export default function CorporateNews({ isDashboard }: CorporateNewsProps = {}) {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      // Using explicit URL based on user backend requirements
      const response = await axios.get(buildApiUrl("/tech-news"));
      setNews(response.data.articles || []);
    } catch (err: any) {
      console.error("Failed to fetch news:", err);
      setError(err.response?.data?.error || "Failed to load news articles. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[50vh] space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-blue-500/10 flex items-center justify-center relative backdrop-blur-xl border border-blue-500/20 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-3xl animate-pulse" />
          <Loader2 className="w-10 h-10 animate-spin text-blue-500 relative z-10" />
        </div>
        <div className="text-center space-y-1">
          <h3 className="text-xl font-black text-foreground tracking-tight">Curating Latest Headlines</h3>
          <p className="text-xs font-black text-muted-foreground uppercase tracking-widest opacity-80">Gathering insights from the tech industry...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] p-4 w-full">
        <Card className="max-w-md w-full bg-white/80 dark:bg-[#0c0c14]/40 backdrop-blur-3xl border-slate-200 dark:border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden relative group hover:border-red-500/30 dark:hover:border-red-500/30 transition-all duration-500 mx-auto">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 shadow-[0_2px_20px_rgba(239,68,68,0.5)]" />
          <CardContent className="p-8 md:p-12 flex flex-col items-center text-center space-y-6 md:space-y-8">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-[2rem] bg-gradient-to-br from-red-500/10 to-orange-500/10 flex items-center justify-center relative group-hover:scale-110 transition-transform duration-500 shadow-inner">
              <AlertCircle className="w-10 h-10 md:w-12 md:h-12 text-red-500" />
            </div>
            <div className="space-y-3 w-full">
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-foreground tracking-tight">Connection Error</h3>
              <p className="text-xs md:text-sm font-bold text-slate-500 dark:text-muted-foreground leading-relaxed uppercase tracking-normal md:tracking-widest opacity-90 break-words">{error}</p>
            </div>
            <Button 
              onClick={fetchNews}
              className="mt-6 h-12 md:h-14 bg-gradient-to-r from-red-500 to-orange-500 hover:opacity-90 active:scale-95 transition-all text-white font-black rounded-2xl px-8 shadow-xl shadow-red-500/30 w-full flex items-center justify-center gap-3 text-xs md:text-sm uppercase tracking-widest"
            >
              <RefreshCcw className="w-4 h-4 md:w-5 md:h-5" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`${isDashboard ? '' : 'p-4 md:p-8 max-w-screen-2xl mx-auto space-y-8'} animate-in fade-in duration-500`}>
      {!isDashboard && (
        <div className="flex flex-col space-y-3 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-inner">
              <Newspaper className="w-7 h-7 text-blue-500" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight text-foreground">Technology & Corporate News</h1>
              <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mt-1 opacity-80">
                Stay updated with the latest headlines
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {news.map((article, index) => {
          // Fallback image focusing on corporate/tech feel if original is null or fails
          const fallbackImage = "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800";
          
          return (
            <Card key={index} className="overflow-hidden flex flex-col h-full bg-card hover:shadow-lg transition-all duration-300 border-border group hover:-translate-y-1">
              <div className="relative h-48 w-full bg-muted overflow-hidden">
                <img
                  src={article.urlToImage || fallbackImage}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = fallbackImage;
                  }}
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-background/90 backdrop-blur-sm text-xs font-semibold rounded-md shadow-sm">
                  {article.source.name}
                </div>
              </div>
              
              <CardContent className="flex flex-col flex-grow p-5 space-y-4">
                <div className="space-y-3 flex-grow">
                  <div className="flex justify-between items-center text-xs text-muted-foreground font-medium">
                    <span className="text-primary/80">{new Date(article.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <h3 className="font-bold text-lg leading-snug line-clamp-2 group-hover:text-primary transition-colors" title={article.title}>
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground/90 line-clamp-3 leading-relaxed">
                    {article.description || "Click 'Read full article' to learn more about this headline."}
                  </p>
                </div>
                
                <a 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors mt-auto pt-4 border-t border-border/50 w-fit"
                >
                  Read full article <ExternalLink className="w-4 h-4 ml-1.5" />
                </a>
              </CardContent>
            </Card>
          );
        })}

        {news.length === 0 && !loading && !error && (
          <div className="col-span-full py-24 flex flex-col items-center justify-center bg-card/30 backdrop-blur-xl rounded-[3rem] border border-dashed border-border/50 shadow-sm mt-8">
            <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-6">
              <Globe className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-2xl font-black text-foreground mb-2 tracking-tight">No News Available</h3>
            <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs opacity-70">No technology news articles found at this moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}