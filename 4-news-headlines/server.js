const http = require('http');
const https = require('https');
const url = require('url');

const API_KEY = '1da062d1f601417c9489e77c71d138d5';
const API_URL = 'https://newsapi.org/v2/top-headlines';

const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    if (req.method === 'GET' && req.url.startsWith('/api/news')) {
        const queryParams = new url.URLSearchParams(url.parse(req.url).query);
        const category = queryParams.get('category') || 'general';
        const pageSize = queryParams.get('pageSize') || '12';

        const newsUrl = `${API_URL}?category=${category}&apiKey=${API_KEY}&pageSize=${pageSize}`;

        https.get(newsUrl, {
            headers: {
                'User-Agent': 'NewsHeadlinesApp/1.0 (News Headlines Reader)'
            }
        }, (newsRes) => {
            let data = '';

            newsRes.on('data', (chunk) => {
                data += chunk;
            });

            newsRes.on('end', () => {
                res.writeHead(newsRes.statusCode);
                res.end(data);
            });
        }).on('error', (err) => {
            console.error('API Error:', err);
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Failed to fetch news' }));
        });
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Not found' }));
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`News API endpoint: http://localhost:${PORT}/api/news?category=general`);
});
