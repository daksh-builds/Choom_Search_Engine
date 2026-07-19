# CHOOM_Search_Engine
Full Working search engine with a limit of 300 crawls 
# CHOOM Search Engine

A simple search engine built with **Node.js**, **PostgreSQL**, and **EJS**. It crawls websites, stores page data in a PostgreSQL database, indexes the content, and allows users to search through the indexed pages.

## Features

- Web crawling
- Stores pages in PostgreSQL
- Full-text search
- Fast search results
- Clean EJS-based interface
- Duplicate URL prevention

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Template Engine:** EJS
- **Web Scraping:** Axios, Cheerio

## Project Structure

```
├── crawler.js
├── index.js
├── routes/
├── views/
├── public/
├── db/
├── package.json
└── README.md
```

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/choom-search-engine.git
cd choom-search-engine
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure PostgreSQL

Create a PostgreSQL database and update your database credentials.

### 4. Run the application

```bash
npm start
```

Open your browser:

```
http://localhost:3000
```

## How It Works

1. The crawler visits seed URLs.
2. Page title, description, and content are extracted.
3. Data is stored in PostgreSQL.
4. PostgreSQL full-text search indexes the content.
5. Users search through the web interface.

## Future Improvements

- Page ranking algorithm
- Better crawler scheduling
- Snippet generation
- Search suggestions
- Image search
- Distributed crawling

## License

This project is licensed under the MIT License.