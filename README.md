Cervical Cancer Health Assistant

This is a Node.js-based project that combines web scraping and AI-powered Q&A to help users learn about cervical cancer, its symptoms, causes, prevention, and treatment. It consists of two main components:

    cervical_cancer.js: A web crawler that scrapes structured cervical cancer health content from Mayo Clinic.

    bot.js: An interactive terminal chatbot powered by OpenAI, which uses the scraped data to answer user questions.

📂 Project Structure

scraper_js/
│
├── bot.js                      # Terminal chatbot powered by OpenAI
├── cervical_cancer.js          # Intelligent web crawler using axios + cheerio
├── crawled-cervical-data.json  # Structured JSON data from scraped pages
├── .env                        # Environment variables (for your API key)
├── package.json                # Project dependencies and scripts
└── README.md                   # Project documentation (you are here)

🚀 Features

    ✅ Smart Web Crawler: Extracts relevant sections (headings + content) from cervical cancer pages on Mayo Clinic.

    ✅ Keyword-Priority Queuing: Crawls the most relevant internal links first using custom scoring logic.

    ✅ AI Chatbot: Uses the scraped medical data as a knowledge base and answers questions in natural language.

    ✅ Command Line Interface: Lightweight and easy to run in the terminal.

📦 Prerequisites

Make sure you have the following installed:

    Node.js (v18+ recommended)

    An OpenAI API key

🔧 Setup Instructions

    Clone the Repository

git clone https://github.com/Ntinyari24/bot.js.git
cd bot.js
    Install Dependencies

npm install

    Create Your .env File

Create a .env file in the root folder and paste your OpenAI API key:

OPENAI_API_KEY=your-api-key-here

    Run the Web Crawler

This will fetch up to 10 pages of relevant cervical cancer content from Mayo Clinic and save it to a local file.

node cervical_cancer.js

    Start the Chatbot

After crawling is complete, launch the chatbot:

node bot.js

You can now ask questions like:

    "What is cervical cancer?"

    "What are the symptoms?"

    "How is it diagnosed?"

    "Is it preventable?"

Type exit to quit.
🤖 How It Works
cervical_cancer.js (Web Crawler)

    Uses axios to fetch web pages and cheerio to parse them.

    Scans <h2> sections and adjacent paragraphs.

    Crawls only internal links with a priority scoring algorithm based on target keywords.

bot.js (AI Assistant)

    Loads the structured data from crawled-cervical-data.json.

    Uses the OpenAI Chat API (gpt-3.5-turbo) to respond to questions with system-level context.

    Continuously loops to handle multiple questions in the terminal.

📈 Sample Output

🩺 Cervical Health Assistant (type 'exit' to quit)

You: What causes cervical cancer?

🤖 Most cervical cancer is caused by long-lasting infection with certain types of human papillomavirus (HPV). HPV is a common sexually transmitted infection that can lead to abnormal changes in the cervix and, over time, cancer.

🛑 Disclaimer

This tool is for informational and educational purposes only. It does not provide medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider with any questions regarding your health.
🧠 Technologies Used

    Node.js

    Axios

    Cheerio

    OpenAI GPT (via openai package)

    Natural (for keyword tokenization)

    fastpriorityqueue

