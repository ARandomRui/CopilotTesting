# News Headlines App

**Prompt:** Generate a script that pulls the latest headlines from a news API and displays them in a styled webpage.

## Features
- Display latest news headlines from multiple categories
- Category filter (General, Business, Entertainment, Health, Science, Sports, Technology)
- Responsive card-based layout
- Images for each article
- Article source and publication date
- Direct links to full articles
- Modern, clean UI with gradient design
- Loading and error states

## How to Use
1. Open `index.html` in your browser
2. Select a category from the dropdown menu
3. Browse the latest news articles
4. Click "Read More" to visit the full article

## API Integration
- Uses NewsAPI.org for real news data
- Currently uses demo data for testing
- To enable live data:
  1. Sign up at [newsapi.org](https://newsapi.org)
  2. Get your API key
  3. Replace `const API_KEY = 'demo'` with your key
  4. Uncomment the real API call

## Categories
- General
- Business
- Entertainment
- Health
- Science
- Sports
- Technology

## Files
- `index.html` - HTML structure
- `styles.css` - Styling and responsive design
- `script.js` - API integration and article display

## Note
The current version uses demo data. To use live news, obtain an API key from [newsapi.org](https://newsapi.org) and update the configuration in `script.js`.
