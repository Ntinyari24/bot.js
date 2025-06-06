const fs = require('fs'); 

const axios = require('axios');
const cheerio = require('cheerio');


const url = "https://www.who.int/news-room/fact-sheets/detail/cervical-cancer";

async function scrapeWHO() {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const result = { };

    // Grab the main headings and paragraphs under them
    $('h2').each((i, el) => {
      const heading = $(el).text().trim();
      const content = [];

      let next = $(el).next();
      while (next.length && !next.is('h2')) {
        if (next.is('p')) content.push(next.text().trim());
        next = next.next();
      }

      result[heading] = content;
    });

    fs.writeFileSync('data.json', JSON.stringify(result, null, 2));
    console.log('Saved data to data.json');
  } catch (err) {
    console.error('Error scraping WHO:', err.message);
  }
}

scrapeWHO();