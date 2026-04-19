import crawler from "./tools/crawler-01.js";
try {
crawler();
console.log("Crawler started...");    
} catch (error) {
    console.error("error in crawlering:", error);
}
