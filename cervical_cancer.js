// Import necessary modules
const fs = require('fs');                       // For saving scraped data
const axios = require('axios');                 // For making HTTP requests
const cheerio = require('cheerio');             // For parsing and scraping HTML
const FastPriorityQueue = require('fastpriorityqueue'); // For link prioritization
const natural = require('natural');             // For tokenizing text
const tokenizer = new natural.WordTokenizer();  // Initialize tokenizer

// Base URL for internal link checking
const baseDomain = "https://www.mayoclinic.org";
// Starting page for the crawl
const seedUrl = "https://www.mayoclinic.org/diseases-conditions/cervical-cancer/symptoms-causes/syc-20352501";

// Track already visited URLs to prevent repeats
const visited = new Set();

// Priority queue to decide which URLs to crawl next based on relevance (cost)
const queue = new FastPriorityQueue((a, b) => a.cost < b.cost);
queue.add({ url: seedUrl, cost: 0 });

// Maximum number of pages to crawl
const MAX_PAGES = 10;

// Object to store scraped content
const crawledData = {};

// Keywords to prioritize during crawling
const TARGET_KEYWORDS = ['cervical', 'cancer', 'hpv', 'screening', 'vaccine', 'pap smear'];

// Main crawling function
async function crawl() {
  let count = 0;

  while (!queue.isEmpty() && count < MAX_PAGES) {
    const { url, cost } = queue.poll();   // Get next URL to crawl
    if (visited.has(url)) continue;       // Skip if already visited
    visited.add(url);
    count++;

    console.log(`Crawling [${count}]: ${url} (cost: ${cost})`);

    try {
      // Fetch and load the page
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);

      // Extract sections (h2 headings and following paragraphs)
      const sections = {};
      $('h2').each((_, el) => {
        const heading = $(el).text().trim();
        const content = [];
        let next = $(el).next();
        while (next.length && !next.is('h2')) {
          if (next.is('p')) content.push(next.text().trim());
          next = next.next();
        }
        sections[heading] = content;
        console.log(`  ▶ Section: ${heading}`);
      });

      // Store content in the main object
      crawledData[url] = sections;

      // Get full page text for keyword analysis
      const pageText = $('body').text();

      // Discover internal links for further crawling
      $('a[href^="/"], a[href^="' + baseDomain + '"]').each((_, el) => {
        let href = $(el).attr('href');
        if (!href) return;
        if (href.startsWith('/')) href = baseDomain + href; // Convert relative to absolute
        if (!href.startsWith(baseDomain)) return;           // Skip external links
        if (visited.has(href)) return;

        // Assign cost based on relevance
        const anchorText = $(el).text();
        const newCost = calculateCost(href, anchorText, pageText);
        queue.add({ url: href, cost: newCost });
      });

    } catch (err) {
      console.error(`❌ Failed to crawl ${url}: ${err.message}`);
    }

    // Pause between requests to avoid hammering the server
    await delay(1000); 
  }

  // Save scraped content to JSON file
  fs.writeFileSync('crawled-cervical-data.json', JSON.stringify(crawledData, null, 2));
  console.log("📁 Saved data to crawled-cervical-data.json");
}

// Helper function to delay between requests
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Calculate the priority cost of a URL based on keyword relevance
function calculateCost(url, anchorText, pageText) {
  let cost = 10;

  const words = tokenizer.tokenize(anchorText + ' ' + url);
  const pageWords = tokenizer.tokenize(pageText);

  const anchorMatch = words.filter(w => TARGET_KEYWORDS.includes(w.toLowerCase())).length;
  const bodyMatch = pageWords.filter(w => TARGET_KEYWORDS.includes(w.toLowerCase())).length;

  // Reduce cost for more relevant links (more matches = lower cost)
  cost -= Math.min(3, anchorMatch);
  cost -= Math.min(4, bodyMatch / 10);

  return Math.max(1, cost); // Ensure minimum cost stays above 0
}

// Start the crawl
crawl();

