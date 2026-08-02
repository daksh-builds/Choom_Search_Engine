# 🚀 CHOOM Search Engine

CHOOM is a full-featured web crawler and search engine application built with **Node.js (ES Modules)**, **Express.js**, **PostgreSQL Full-Text Search**, and **EJS**. It autonomously crawls target websites, extracts and cleans web content, stores indexed page metadata into PostgreSQL, and exposes a web interface that ranks query results using PostgreSQL's native `ts_rank` and `websearch_to_tsquery`.

---

## Features

- **Custom Web Crawlers**: Built with `axios` and `cheerio`. Supports multi-domain crawling, normalized URL resolution, media filtering, and configurable page limits (up to 300+ pages).
- 🔍 **Full-Text Search Engine**: Employs PostgreSQL's text search capabilities (`tsvector`, `ts_rank`, `websearch_to_tsquery`) to return relevant results ordered by ranking score.
- **Minimalist EJS UI**: Clean search page and dynamic results layout displaying page titles, URLs, descriptions, and calculated relevance scores.
- **Duplicate & Loop Prevention**: Normalized URL tracking and unique constraint handling (`ON CONFLICT (url) DO NOTHING`).
- **Modular Architecture**: Well-structured directory design with separated routers, views, database handlers, and crawler utilities.

---

## Tech Stack

- **Backend Framework**: Node.js, Express.js (ES Modules)
- **Database**: PostgreSQL (`pg` pool)
- **Web Scraping / Crawling**: Axios, Cheerio
- **Template Engine**: EJS
- **Development Tools**: Nodemon, Dotenv

---

## Project Structure

```
CHOOM-search engine/
├── .env                  # Database credentials & server configuration
├── .gitignore            # Files ignored by Git
├── app.js                # Application entry point & Express server setup
├── package.json          # Node.js dependencies & scripts
├── README.md             # Project documentation
├── db/
│   ├── data.sql          # PostgreSQL table schema definition
│   └── db.js             # Database pool connection instance
└── src/
    ├── controller/
    │   └── connect.js    # Database connection verification utility
    ├── routes/
    │   ├── home.js       # Home page router (`/api/`)
    │   └── search.js     # Search query router (`/api/search`)
    ├── tools/
    │   ├── crawler-01.js # Basic single-domain web crawler tool
    │   └── crawler-02.js # Advanced multi-domain crawler (up to 300 pages)
    └── views/
        ├── index.ejs     # Main search page view
        └── result.ejs    # Search results page view
```

---

## Installation & Setup

### 1. Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [PostgreSQL](https://www.postgresql.org/)

### 2. Clone & Install Dependencies
```bash
git clone https://github.com/yourusername/CHOOM-search-engine.git
cd "CHOOM-search engine"
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory and define your PostgreSQL credentials:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_NAME=choom_db
```

### 4. Database Setup
Execute the table creation schema in your PostgreSQL database:

```sql
CREATE TABLE IF NOT EXISTS pages (
  id SERIAL PRIMARY KEY NOT NULL,
  url TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  discription TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Usage

### 1. Run the Web Crawler
Populate your database with page data using the included multi-domain web crawler:

```bash
node src/tools/crawler-02.js
```

### 2. Start the Application Server
Run the Express application using Nodemon:

```bash
npm run dev
```

### 3. Access the Search Engine
Open your browser and navigate to:
```
http://localhost:3000/api
```

---

## API Routes

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/` | Renders the main search UI (`index.ejs`) |
| `GET` | `/api/search?q=<query>` | Performs PostgreSQL full-text search & renders results with relevance scores (`result.ejs`) |

---

## Future Enhancements

- [ ] Add PageRank algorithm for enhanced link-based ranking.
- [ ] Implement crawler rate-limiting & `robots.txt` parser compliance.
- [ ] Add keyword highlighting in search snippets.
- [ ] Support pagination for search results.
- [ ] Add background crawler task scheduling.

---

## License

This project is licensed under the [ISC License](LICENSE).