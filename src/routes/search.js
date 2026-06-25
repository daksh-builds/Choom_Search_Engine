import { Router } from "express";
import pool from "../../db/db.js";

const route = Router();

route.get("/", (req, res) => {
    res.render("index");
});

route.get("/search", async (req, res) => {
    try {
        
console.log("QUERY =", req.query);
    console.log("Q =", req.query.q);
      const q = req.query.q;

        const result = await pool.query(
            `
    SELECT
    url,
    title,
    discription,
    ts_rank(
        search_vector,
        websearch_to_tsquery('english', $1)
    ) AS rank
FROM pages
WHERE search_vector @@ websearch_to_tsquery('english', $1)
ORDER BY rank DESC
LIMIT 20;
            `,
            [q]
        );

        res.render("results",{
          query:q,
          results:result.rows
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Error");
    }
});

export default route;