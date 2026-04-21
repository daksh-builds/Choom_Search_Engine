import dotenv from 'dotenv';

import axios from "axios";
import * as cheerio from "cheerio";
import pool from '../../db/db.js';
// ---- CONFIG ----

const seed = "https://quotes.toscrape.com/";
const maxCrawls = 3;

// ---- DATA STRUCTURES ----
let queue = [seed];
let visited = new Set();//to remore duplicates

// ---- MAIN LOOP ----

 export default async function crawler ()  {
  
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
let discription = $('.quote .text').first().text().trim() || 'N/A';

await pool.query(
  'INSERT INTO pages(url, title, discription) VALUES ($1, $2, $3)',
  [currentURL, title, discription]
);

      // ---- LINK EXTRACTION ----
      $("a[href]").each((i, el) => {
        let url = $(el).attr("href");

        try {
          // normalize URL
          url = new URL(url, currentURL).href;

          // only wikipedia domain
          if (url.startsWith("https://quotes.toscrape.com/")) {
            if (!visited.has(url)) {
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

crawler();