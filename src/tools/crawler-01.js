import axios from "axios";
import * as cheerio from "cheerio";
import pool from '../../db/db.js';
// ---- CONFIG ----
const seed = "https://en.wikipedia.org/wiki/Wiki";
const maxCrawls = 10;

// ---- DATA STRUCTURES ----
let queue = [seed];
let visited = new Set();//to remore duplicates

// ---- MAIN LOOP ----
async function crawler ()  {
  while (queue.length > 0 && visited.size < maxCrawls) {
    const currentURL = queue.shift();

    if (visited.has(currentURL)) continue;
    visited.add(currentURL);

    console.log(`Crawling: ${currentURL}`);

    try {
   const response = await axios.get(currentURL, {
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",//giving a valid header so bot will not get blocked
  }
});
      const $ = cheerio.load(response.data);

      // ---- LINK EXTRACTION ----
      $("a[href]").each((i, el) => {
        let url = $(el).attr("href");

        try {
          // normalize URL
          url = new URL(url, currentURL).href;

          // only wikipedia domain
          if (url.startsWith("https://en.wikipedia.org")) {
            if (!visited.has(url)) {
              queue.push(url);
            }
          }
        } catch (err) {
          console.err(err.message);
        }
      });

    } catch (err) {
      console.error(`Error: ${err.message}`);
    }
  }

  console.log("\nCrawling Done");
  console.log(`Total pages crawled: ${visited.size}`);
}
crawler();