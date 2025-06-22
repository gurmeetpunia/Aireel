import axios from 'axios';

// Simple mapping for demo; in production, use a more robust approach or a sports DB
const sportKeywords: Record<string, string> = {
  'messi': 'football',
  'ronaldo': 'football',
  'neymar': 'football',
  'mbappe': 'football',
  'virat': 'cricket',
  'dhoni': 'cricket',
  'federer': 'tennis',
  'nadal': 'tennis',
  'serena': 'tennis',
  'bolt': 'athletics',
  'phelps': 'swimming',
  // Add more as needed
};

function getSportForCelebrity(celebrity: string): string {
  const lower = celebrity.toLowerCase();
  for (const key in sportKeywords) {
    if (lower.includes(key)) return sportKeywords[key];
  }
  return 'sports';
}

// Wikimedia Commons image fetch
export async function fetchCelebrityImage(celebrity: string): Promise<string | null> {
  // 1. Search for the celebrity's Wikipedia page
  const searchUrl = `https://en.wikipedia.org/w/api.php`;
  const searchParams = {
    action: 'query',
    list: 'search',
    srsearch: celebrity,
    format: 'json',
    origin: '*',
  };
  const searchRes = await axios.get(searchUrl, { params: searchParams });
  const searchResults = searchRes.data.query?.search;
  if (!searchResults || searchResults.length === 0) return null;
  const pageTitle = searchResults[0].title;

  // 2. Get the main image from the Wikipedia page
  const imageUrl = `https://en.wikipedia.org/w/api.php`;
  const imageParams = {
    action: 'query',
    prop: 'pageimages',
    titles: pageTitle,
    format: 'json',
    pithumbsize: 600,
    origin: '*',
  };
  const imageRes = await axios.get(imageUrl, { params: imageParams });
  const pages = imageRes.data.query?.pages;
  if (!pages) return null;
  const page = Object.values(pages)[0];
  if (page && page.thumbnail && page.thumbnail.source) {
    return page.thumbnail.source;
  }
  return null;
} 