import axios from "axios";
import * as cheerio from "cheerio";
import pool from "../../db/db.js";

// ---------------- CONFIG ----------------

const seed = "https://www.edudose.com/gk/";
const maxCrawls = 20;

// ---------------- DATA STRUCTURES ----------------

let queue = [seed];
let visited = new Set();

// ---------------- CRAWLER ----------------

async function crawler() {
  const domain = new URL(seed).origin;

  while (queue.length > 0 && visited.size < maxCrawls) {
    const currentURL = queue.shift();

    if (visited.has(currentURL)) continue;

    visited.add(currentURL);

    console.log(`Crawling: ${currentURL}`);

    try {
      const response = await axios.get(currentURL, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        },
      });

      const $ = cheerio.load(response.data);

      // ---------------- TITLE ----------------

      const title = $("title").text().trim() || "No Title";

      // ---------------- CLEAN PAGE ----------------

      $("script,style,noscript").remove();

      // ---------------- DESCRIPTION ----------------

      const discription = $("body")
        .text()
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 500);

      // ---------------- FULL CONTENT ----------------

      const content = $("body")
        .text()
        .replace(/\s+/g, " ")
        .trim();

      // ---------------- SAVE TO DB ----------------

      await pool.query(
        `
        INSERT INTO pages(url,title,discription,content)
        VALUES($1,$2,$3,$4)
        ON CONFLICT(url) DO NOTHING
        `,
        [
          currentURL,
          title,
          discription,
          content,
        ]
      );

      console.log(`Saved: ${title}`);

      // ---------------- FIND LINKS ----------------

      $("a[href]").each((i, el) => {
        try {
          let url = $(el).attr("href");

          url = new URL(url, currentURL).href;

          // only crawl same website

          if (url.startsWith(domain)) {
            if (
              !visited.has(url) &&
              !queue.includes(url)
            ) {
              queue.push(url);
            }
          }
        } catch (err) {
          // ignore invalid urls
        }
      });
    } catch (err) {
      console.error(
        `Failed: ${currentURL}`
      );
      console.error(err.message);
    }
  }

  console.log("\nCrawling Done");
  console.log(
    `Total pages crawled: ${visited.size}`
  );
}
crawler()
  .then(() => console.log("Crawling Finished"))
  .catch(err => console.error(err));
