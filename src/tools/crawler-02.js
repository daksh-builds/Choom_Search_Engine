import axios from "axios";
import * as cheerio from "cheerio";
import pool from "../../db/db.js";

// ---------------- CONFIG ----------------

const seed = [
  "https://www.edudose.com/gk/",
  "https://www.geeksforgeeks.org/",
  "https://developer.mozilla.org/",
  "https://nodejs.org/en/docs/",
  "https://www.britannica.com/",
  "https://www.nasa.gov/",
  "https://www.freecodecamp.org/news/",
];

const maxCrawls = 300;



let queue = [...seed];
let queued = new Set(seed);
let visited = new Set();

// ---------------- CRAWLER ----------------

async function crawler() {
  const allowedDomains = new Set(
    seed.map(url => new URL(url).origin)
  );

  while (
    queue.length > 0 &&
    visited.size < maxCrawls
  ) {
    const currentURL = queue.shift();

    if (visited.has(currentURL)) continue;

    visited.add(currentURL);

    console.log(`Crawling: ${currentURL}`);

    try {
      const response = await axios.get(
        currentURL,
        {
          timeout: 10000,
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
          },
        }
      );

      const $ = cheerio.load(response.data);

      // ---------------- TITLE ----------------

      const title =
        $("title").text().trim() ||
        "No Title";

      // ---------------- CLEAN PAGE ----------------

      $("script,style,noscript").remove();

      // ---------------- DESCRIPTION ----------------

      const description = $("body")
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
          description,
          content,
        ]
      );

      console.log(`Saved: ${title}`);

      // ---------------- FIND LINKS ----------------

      $("a[href]").each((i, el) => {
        try {
          let href = $(el).attr("href");

          if (!href) return;

          const parsed = new URL(
            href,
            currentURL
          );

          // Remove fragments
          parsed.hash = "";

          // Remove query params
          parsed.search = "";

          const normalizedUrl =
            parsed.href;

          // Skip media/files
          if (
            /\.(jpg|jpeg|png|gif|svg|webp|pdf|zip|rar|7z|mp4|mp3)$/i.test(
              normalizedUrl
            )
          ) {
            return;
          }

          // Crawl only allowed domains
          if (
            allowedDomains.has(
              parsed.origin
            ) &&
            !visited.has(
              normalizedUrl
            ) &&
            !queued.has(
              normalizedUrl
            )
          ) {
            queue.push(
              normalizedUrl
            );
            queued.add(
              normalizedUrl
            );
          }
        } catch (err) {
          // Ignore bad URLs
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
  .then(() =>
    console.log(
      "Crawling Finished"
    )
  )
  .catch(err =>
    console.error(err)
  );