const express = require('express');
const router = express.Router();

router.get('/tech-news', (req, res) => {
    try {
        const apiKey = process.env.NEWS_API_KEY;
        if (!apiKey || apiKey === 'your_copied_api_key_here') {
            console.log("Serving mock tech news because NEWS_API_KEY is not configured.");
            
            return res.status(200).json({
                articles: [
                    {
                        title: "The Future of AI: Google DeepMind unveils breakthrough in Agentic Coding",
                        description: "New AI models are fundamentally changing how software is developed, giving rise to autonomous coding subagents that solve complex problems.",
                        url: "https://deepmind.google/",
                        urlToImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
                        publishedAt: new Date().toISOString(),
                        source: { name: "Tech Daily" }
                    },
                    {
                        title: "Web Development in 2026: Why React and Next.js remain dominant",
                        description: "Despite emerging frameworks, the React ecosystem continues to lead the industry through massive architectural upgrades and server components.",
                        url: "https://react.dev/",
                        urlToImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800",
                        publishedAt: new Date(Date.now() - 86400000).toISOString(),
                        source: { name: "Developer Weekly" }
                    },
                    {
                        title: "Global Tech Hiring Shifts Towards Cybersecurity Specializations",
                        description: "As cyber threats multiply, corporations are allocating 40% more budget toward recruiting top-tier security analysts and full-stack devs.",
                        url: "https://cybersecurity.com",
                        urlToImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
                        publishedAt: new Date(Date.now() - 172800000).toISOString(),
                        source: { name: "Industry Insights" }
                    },
                    {
                        title: "Cloud Computing Architectures Transition to Edge Deployments",
                        description: "Reducing latency using edge networks is the new standard for web application deployments across major corporate platforms.",
                        url: "https://cloud.com",
                        urlToImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
                        publishedAt: new Date(Date.now() - 259200000).toISOString(),
                        source: { name: "Cloud Native" }
                    }
                ]
            });
        }

        const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&category=technology&language=en`;
        
        // Using native https module to ensure compatibility with Node.js versions < 18
        const https = require('https');
        
        https.get(url, { headers: { 'User-Agent': 'NextGenPBLNewsApp/1.0' } }, (apiRes) => {
            let data = '';

            apiRes.on('data', (chunk) => {
                data += chunk;
            });

            apiRes.on('end', () => {
                if (apiRes.statusCode !== 200) {
                    console.error("Newsdata.io returned error status:", apiRes.statusCode);
                    console.error("Error body:", data);
                    return res.status(500).json({ error: "Failed to fetch news from external API. Check API key." });
                }

                try {
                    const parsedData = JSON.parse(data);
                    
                    if (!parsedData.results) {
                        return res.status(500).json({ error: "Invalid response from Newsdata.io" });
                    }

                    // Map Newsdata.io's format to the frontend's expected format
                    const articles = parsedData.results.map(article => ({
                        title: article.title,
                        description: article.description || "",
                        url: article.link,
                        urlToImage: article.image_url || null,
                        publishedAt: article.pubDate,
                        source: { name: article.source_id || 'Unknown' }
                    }));

                    res.status(200).json({ articles });
                } catch (e) {
                    console.error("Error parsing Newsdata.io response:", e);
                    return res.status(500).json({ error: "Error parsing API response" });
                }
            });
        }).on('error', (err) => {
            console.error("Error fetching tech news:", err);
            res.status(500).json({ error: "Internal Server Error while fetching news" });
        });

    } catch (error) {
        console.error("Error setting up tech news request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
