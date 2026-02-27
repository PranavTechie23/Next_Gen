const express = require('express');
const router = express.Router();

router.get('/tech-news', (req, res) => {
    try {
        const apiKey = process.env.NEWS_API_KEY;
        if (!apiKey) {
            console.error("Missing NEWS_API_KEY in backend environment variables.");
            return res.status(500).json({ error: "News API key not configured on server" });
        }

        const url = `https://newsapi.org/v2/top-headlines?category=technology&language=en&pageSize=12&apiKey=${apiKey}`;
        
        // Using native https module to ensure compatibility with Node.js versions < 18
        const https = require('https');
        
        https.get(url, { headers: { 'User-Agent': 'NextGenPBLNewsApp/1.0' } }, (apiRes) => {
            let data = '';

            apiRes.on('data', (chunk) => {
                data += chunk;
            });

            apiRes.on('end', () => {
                if (apiRes.statusCode !== 200) {
                    console.error("NewsAPI returned error status:", apiRes.statusCode);
                    return res.status(500).json({ error: "Failed to fetch news from external API" });
                }

                try {
                    const parsedData = JSON.parse(data);
                    
                    if (!parsedData.articles) {
                        return res.status(500).json({ error: "Invalid response from NewsAPI" });
                    }

                    // Map down to only required fields as requested to minimize payload
                    const articles = parsedData.articles.map(article => ({
                        title: article.title,
                        description: article.description,
                        url: article.url,
                        urlToImage: article.urlToImage,
                        publishedAt: article.publishedAt,
                        source: { name: article.source?.name || 'Unknown' }
                    }));

                    res.status(200).json({ articles });
                } catch (e) {
                    console.error("Error parsing NewsAPI response:", e);
                    return res.status(500).json({ error: "Error parsing NewsAPI response" });
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
