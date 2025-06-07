require('dotenv').config();
const fs = require('fs');
const readline = require('readline');
//  import OpenAI from 'openai';
const { OpenAI } = require('openai'); 

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Load and flatten the scraped JSON
const raw = JSON.parse(fs.readFileSync('crawled-cervical-data.json', 'utf8'));
let context = '';

for (const [url, sections] of Object.entries(raw)) {
  for (const [heading, paragraphs] of Object.entries(sections)) {
    context += `## ${heading}\n${paragraphs.join('\n')}\n\n`;
  }
}

// Setup chatbot
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("🩺 Cervical Health Assistant (type 'exit' to quit)");

function askQuestion() {
  rl.question('\nYou: ', async (question) => {
    if (question.toLowerCase() === 'exit') return rl.close();

    try {
      const chat = await openai.chat.completions.create({
       model: 'gpt-3.5-turbo' ,
       messages: [  {
            role: 'system',
            content: `You are a helpful health assistant. Use the following context about cervical cancer to answer questions:\n\n${context}`
          },
          {
            role: 'user',
            content: question
          }
        ]
      });

      console.log(`🤖 ${chat.choices[0].message.content}`);
    } catch (err) {
      console.error('⚠️ Error:', err.message);
    }

    askQuestion();
  });
}

askQuestion();
