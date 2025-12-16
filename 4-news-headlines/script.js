// NewsAPI configuration
// Using local proxy server instead of direct API calls (NewsAPI doesn't allow browser requests)
const API_KEY = '1da062d1f601417c9489e77c71d138d5';
const PROXY_URL = 'http://localhost:3000/api/news';

// DOM elements
const newsList = document.getElementById('newsList');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const categorySelect = document.getElementById('categorySelect');

// Fetch news from API
async function fetchNews() {
    const category = categorySelect.value;
    
    loading.classList.remove('hidden');
    error.classList.add('hidden');
    newsList.innerHTML = '';
    
    try {
        const url = `${PROXY_URL}?category=${category}&pageSize=12`;
        
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status !== 'ok') {
            throw new Error(data.message || 'API error');
        }
        
        displayNews(data.articles);
        
    } catch (err) {
        console.error('News fetch error:', err);
        showError(`Failed to fetch news: ${err.message}`);
    } finally {
        loading.classList.add('hidden');
    }
}

// Display news articles
function displayNews(articles) {
    if (!articles || articles.length === 0) {
        newsList.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999;">No articles found.</p>';
        return;
    }

    articles.forEach(article => {
        const card = createNewsCard(article);
        newsList.appendChild(card);
    });
}

// Create news card element
function createNewsCard(article) {
    const card = document.createElement('div');
    card.className = 'news-card';
    
    const imageUrl = article.urlToImage || 'https://via.placeholder.com/300x200?text=No+Image';
    const title = article.title || 'Untitled';
    const description = article.description || 'No description available';
    const source = article.source?.name || 'Unknown Source';
    const date = new Date(article.publishedAt).toLocaleDateString();
    const url = article.url;
    
    card.innerHTML = `
        <img src="${imageUrl}" alt="${title}" class="news-image" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
        <div class="news-content">
            <span class="news-source">${source}</span>
            <h3 class="news-title">${title}</h3>
            <p class="news-description">${description.substring(0, 150)}...</p>
            <div class="news-meta">
                <span class="news-date">${date}</span>
                <a href="${url}" target="_blank" class="news-link">Read More</a>
            </div>
        </div>
    `;
    
    return card;
}

// Show error message
function showError(message) {
    error.textContent = message;
    error.classList.remove('hidden');
}

// Demo news data
function getDemoNews() {
    return [
        {
            source: { name: 'Tech News Daily' },
            title: 'Latest Advances in Artificial Intelligence Transform Industry',
            description: 'New breakthroughs in AI technology are reshaping how businesses operate and innovate.',
            urlToImage: 'https://via.placeholder.com/300x200?text=AI+Technology',
            publishedAt: new Date().toISOString(),
            url: '#'
        },
        {
            source: { name: 'Business Weekly' },
            title: 'Global Markets Show Strong Growth in Q4',
            description: 'Stock markets around the world are experiencing positive momentum as investors gain confidence.',
            urlToImage: 'https://via.placeholder.com/300x200?text=Markets',
            publishedAt: new Date(Date.now() - 86400000).toISOString(),
            url: '#'
        },
        {
            source: { name: 'Science Today' },
            title: 'Scientists Discover New Species in Amazon Rainforest',
            description: 'A groundbreaking expedition uncovers previously unknown species in the heart of the Amazon.',
            urlToImage: 'https://via.placeholder.com/300x200?text=Nature',
            publishedAt: new Date(Date.now() - 172800000).toISOString(),
            url: '#'
        },
        {
            source: { name: 'Sports Central' },
            title: 'Championship Team Wins Historic Victory',
            description: 'In an exciting match, the championship team secures their place in the finals.',
            urlToImage: 'https://via.placeholder.com/300x200?text=Sports',
            publishedAt: new Date(Date.now() - 259200000).toISOString(),
            url: '#'
        },
        {
            source: { name: 'Entertainment Now' },
            title: 'Blockbuster Movie Breaks Box Office Records',
            description: 'The latest film release sets new records on its opening weekend.',
            urlToImage: 'https://via.placeholder.com/300x200?text=Movies',
            publishedAt: new Date(Date.now() - 345600000).toISOString(),
            url: '#'
        },
        {
            source: { name: 'Health & Wellness' },
            title: 'New Study Reveals Benefits of Regular Exercise',
            description: 'Recent research confirms the positive impact of consistent physical activity on health.',
            urlToImage: 'https://via.placeholder.com/300x200?text=Health',
            publishedAt: new Date(Date.now() - 432000000).toISOString(),
            url: '#'
        }
    ];
}

// Initial fetch
fetchNews();
