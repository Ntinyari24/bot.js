const fs = require('fs');
const readline = require('readline');

// Load data from the file
const data = JSON.parse(fs.readFileSync('data.json', 'utf-8'));

// Set up input/output
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask() {
  rl.question('Ask me something about cervical cancer: ', (input) => {
    const query = input.toLowerCase();
    let found = false;

    for (const heading in data) {
      if (heading.toLowerCase().includes(query)) {
        console.log(`\n📘 ${heading}:`);
        data[heading].forEach((paragraph, i) => {
          console.log(`- ${paragraph}`);
        });
        found = true;
        break;
      }
    }

    if (!found) {
      console.log("❌ Sorry, I couldn't find anything relevant.");
    }

    console.log(); // blank line
    ask(); // ask again
  });
}

ask();  // start the bot
