import dotenv from 'dotenv';

import axios from "axios";
import * as cheerio from "cheerio";
import pool from '../../db/db.js';
// ---- CONFIG ----

const seed = "https://www.edudose.com/gk/";
const maxCrawls = 20;

// ---- DATA STRUCTURES ----
let queue = [seed];
let visited = new Set();//to remore duplicates

// ---- MAIN LOOP ----
 async function crawler ()  {
  
  while (queue.length > 0 && visited.size < maxCrawls) {
    const currentURL = queue.shift();//Poping the first url and updating current url

    if (visited.has(currentURL)) continue;
    visited.add(currentURL);

   

    try {
   const response = await axios.get(currentURL, {
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",//giving a valid header so bot will not get blocked
  }
});
      const $ = cheerio.load(response.data);
      let title = $('title').text().trim() || 'N/A';
$('script,style,noscript').remove();

let discription = $('body')
  .text()
  .replace(/\s+/g, ' ')
  .trim()
  .slice(0, 1000);
let quotes = [];

$('.quote .text').each((i, el) => {
  quotes.push($(el).text().trim());
});
let authors = [];

$('.quote .author').each((i, el) => {
  authors.push($(el).text().trim());
});
let tags = [];

$('.tags a.tag').each((i, el) => {
  tags.push($(el).text().trim());
});

let content = [
  ...quotes,
  ...authors,
  ...tags
].join(' ');
await pool.query(
  'INSERT INTO pages(url, title, discription, content) VALUES ($1, $2, $3, $4) ON CONFLICT(url) DO NOTHING',
  
  [currentURL, title, discription, content]
);

      // ---- LINK EXTRACTION ----
      $("a[href]").each((i, el) => {
        let url = $(el).attr("href");

        try {
          // normalize URL
          url = new URL(url, currentURL).href;

          // only wikipedia domain
          if (url.startsWith("https://www.edudose.com/")) {
           if (
  !visited.has(url) &&
  !queue.includes(url)
) {
  queue.push(url);
}
          }


        } catch (err) {
          console.error(err.message);
        }
      });

    } catch (err) {
      console.error(`Error: ${err.message}`);
    }
  }

  console.log("\nCrawling Done");
  console.log(`Total pages crawled: ${visited.size}`);
}

