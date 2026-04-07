import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ExternalLink } from "lucide-react";

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: { name: string };
}

export default function CorporateNews() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        // Using explicit URL based on user backend requirements
        const response = await axios.get("http://localhost:5000/api/tech-news");
        setNews(response.data.articles || []);
      } catch (err: any) {
        console.error("Failed to fetch news:", err);
        setError("Failed to load news articles. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-center p-6 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50 rounded-xl shadow-sm">
          <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-screen-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Technology & Corporate News</h1>
        <p className="text-muted-foreground">
          Stay updated with the latest headlines in the technology sector.
        </p>
      </div>

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
          <div className="col-span-full text-center py-20 text-muted-foreground bg-muted/30 rounded-2xl border border-dashed border-border">
            No technology news articles found at this moment.
          </div>
        )}
      </div>
    </div>
  );
}