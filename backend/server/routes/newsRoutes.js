const express = require('express');
const router = express.Router();
const db = require('../config/db');
const https = require('https');

/**
 * Helper to fetch fallback evergreen news from database
 */
async function getFallbackNews() {
    try {
        // Fetch all evergreen articles to rotate through them deterministically
        const [allArticles] = await db.query('SELECT title, description, url, urlToImage, created_at as publishedAt, source_name FROM news_articles WHERE is_evergreen = 1 ORDER BY id ASC');
        
        if (allArticles.length === 0) return [];

        const numToShow = 6;
        const rotationIntervalHours = 6;
        
        // Calculate the current "time block" index (changes every 6 hours)
        const timeBlock = Math.floor(Date.now() / (rotationIntervalHours * 60 * 60 * 1000));
        
        // Calculate the starting index for this time block
        // Moving by numToShow ensures each block has unique articles
        const startIndex = (timeBlock * numToShow) % allArticles.length;

        // Pick numToShow articles with wrapping logic
        let rotatedNews = [];
        for (let i = 0; i < numToShow; i++) {
            const articleIndex = (startIndex + i) % allArticles.length;
            const article = allArticles[articleIndex];
            rotatedNews.push({
                title: article.title,
                description: article.description,
                url: article.url,
                urlToImage: article.urlToImage,
                publishedAt: article.publishedAt,
                source: { name: article.source_name || 'Campus Portal' }
            });
        }

        return rotatedNews;
    } catch (err) {
        console.error("Database fallback news error:", err);
        // Ultra-fallback if even DB fails
        return [
            {
                title: "Career Preparation Guide",
                description: "Start preparing for your dream career with our comprehensive resource center.",
                url: "#",
                urlToImage: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800",
                publishedAt: new Date().toISOString(),
                source: { name: "System Admin" }
            }
        ];
    }
}

router.get('/tech-news', async (req, res) => {
    try {
        const apiKey = process.env.NEWS_API_KEY;

        // If no API key, serve from database immediately
        if (!apiKey?.trim()) {
            console.log("Serving evergreen news because NEWS_API_KEY is not configured.");
            const articles = await getFallbackNews();
            return res.status(200).json({ articles });
        }

        const newsApiBase = (process.env.NEWS_API_BASE_URL || 'https://newsdata.io/api/1/news').replace(/\/+$/, '');
        const url = `${newsApiBase}?apikey=${encodeURIComponent(apiKey)}&category=technology&language=en`;
        
        // Fetch from external API
        https.get(url, { headers: { 'User-Agent': 'NextGenAINewsApp/1.0' } }, async (apiRes) => {
            let data = '';

            apiRes.on('data', (chunk) => {
                data += chunk;
            });

            apiRes.on('end', async () => {
                try {
                    if (apiRes.statusCode !== 200) {
                        console.warn("External News API failed with status:", apiRes.statusCode, "Serving fallback.");
                        const articles = await getFallbackNews();
                        return res.status(200).json({ articles });
                    }

                    const parsedData = JSON.parse(data);
                    
                    if (!parsedData.results || parsedData.results.length === 0) {
                        const articles = await getFallbackNews();
                        return res.status(200).json({ articles });
                    }

                    // Map Newsdata.io's format to the frontend's expected format
                    const rawArticles = parsedData.results.map(article => ({
                        title: article.title,
                        description: article.description || "",
                        url: article.link,
                        urlToImage: article.image_url || null,
                        publishedAt: article.pubDate,
                        source: { name: article.source_id || 'Global Tech' }
                    }));

                    // Deduplicate articles to curb repetition (syndicated news)
                    const uniqueArticles = [];
                    const seenTitles = new Set();
                    const seenImages = new Set();

                    for (const article of rawArticles) {
                        // Create a normalized version of the title to catch slight variations
                        // (e.g. "OpenAI limits its latest..." vs "OpenAI limits latest...")
                        const normalizedTitle = (article.title || "").toLowerCase().replace(/[^a-z0-9]/g, "").substring(0, 40);
                        
                        // If we have seen a very similar title, or the exact same image (and it's not null)
                        if (seenTitles.has(normalizedTitle)) {
                            continue;
                        }
                        if (article.urlToImage && seenImages.has(article.urlToImage)) {
                            continue;
                        }
                        
                        seenTitles.add(normalizedTitle);
                        if (article.urlToImage) {
                            seenImages.add(article.urlToImage);
                        }
                        
                        uniqueArticles.push(article);
                    }

                    res.status(200).json({ articles: uniqueArticles });
                } catch (e) {
                    console.error("Error parsing Newsdata.io response, serving fallback:", e);
                    const articles = await getFallbackNews();
                    return res.status(200).json({ articles });
                }
            });
        }).on('error', async (err) => {
            console.error("News API request error, serving fallback:", err);
            const articles = await getFallbackNews();
            res.status(200).json({ articles });
        });

    } catch (error) {
        console.error("News route critical error:", error);
        const articles = await getFallbackNews();
        res.status(200).json({ articles });
    }
});

module.exports = router;

