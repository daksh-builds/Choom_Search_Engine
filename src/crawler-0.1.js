// Crawler for search engine processing
import * as cheerio from 'cheerio';
import axios from 'axios';

const seeds=[
  'https://en.wikipedia.org/wiki/Main_Page',
  'https://developer.mozilla.org/en-US/',
  'https://developers.cloudflare.com/style-guide/ai-tooling/'
];
let ToqueueCrawl=[...seeds];
const maxCrawls=20;
let crawlcount=0;

for(;ToqueueCrawl.length> 0 && crawlcount <=maxCrawls;){
//Whole logic here
}
