# CHOOM — Search Engine

CHOOM is a search engine built from scratch using **Node.js, Express, PostgreSQL Full-Text Search, and EJS**.

It crawls web pages, extracts and indexes their content, and returns ranked search results using PostgreSQL's native search capabilities.

## Features

- Custom multi-domain web crawler
- FIFO crawling with duplicate URL prevention
- URL normalization and link discovery
- HTML extraction using Axios and Cheerio
- PostgreSQL Full-Text Search
- `tsvector` + GIN indexing
- Relevance ranking with `ts_rank`
- User-friendly queries with `websearch_to_tsquery`
- Server-side rendered UI with EJS
- Deployed with Render + Neon

## How It Works

```text
Websites
   ↓
Crawler
   ↓
PostgreSQL
   ↓
Full-Text Search
   ↓
Relevance Ranking
   ↓
Search Results
```

The crawler starts from predefined seed URLs, discovers and normalizes links, prevents duplicates, and stores page content in PostgreSQL.

When a user searches, PostgreSQL's Full-Text Search finds matching pages and ranks them using `ts_rank`.

## Tech Stack

- **Runtime:** Node.js
- **Backend:** Express.js
- **Database:** PostgreSQL
- **Search:** PostgreSQL Full-Text Search
- **Crawler:** Axios + Cheerio
- **Templates:** EJS
- **Deployment:** Render
- **Database Hosting:** Neon

## Project Structure

```text
CHOOM-search-engine/
├── app.js
├── package.json
├── db/
│   ├── db.js
│   └── data.sql
├── public/
│   └── css/
│       └── style.css
└── src/
    ├── controller/
    ├── routes/
    ├── tools/
    │   ├── crawler-01.js
    │   └── crawler-02.js
    └── views/
        ├── index.ejs
        └── result.ejs
```

## Run Locally

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create a `.env` file:

```env
DATABASE_URL=your_postgresql_connection_string
PORT=3000
```

### Set up the database

Run the schema provided in:

```text
db/data.sql
```

### Crawl and index pages

```bash
node src/tools/crawler-02.js
```

### Start CHOOM

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Engineering Highlights

- **O(1) duplicate tracking** using JavaScript `Set`
- **FIFO crawl queue** for predictable crawling
- **URL normalization** using the native `URL` API
- **Idempotent ingestion** with `ON CONFLICT`
- **GIN indexing** for PostgreSQL Full-Text Search
- **Connection pooling** using `pg`
- **Server-side rendering** with Express + EJS

## Future Improvements

- [ ] PageRank-based ranking
- [ ] `robots.txt` support
- [ ] Crawl rate limiting
- [ ] Search snippets and highlighting
- [ ] Pagination
- [ ] Background crawl scheduling
- [ ] Distributed crawling

---

Built to understand how search engines work from the ground up.