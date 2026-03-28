import axios from "axios";
import * as cheerio from "cheerio";
import fs from 'fs';
// specify the URL of the site to crawl
const targetUrl = 'https://www.scrapingcourse.com/ecommerce/';

// add the target URL to an array of URLs to visit
let urlsToVisit = [targetUrl];

// define the desired crawl limit
const maxCrawlLength = 20;

const ProductData=[];
// define a crawler function
const crawler = async () => {
    // track the number of crawled URLs
    let crawledCount = 0;

    const paginedpages=/page\/\d+/i;//detect the right pages

    for (; urlsToVisit.length > 0 && crawledCount <= maxCrawlLength;) {
        // get the next URL from the list
        const currentUrl = urlsToVisit.shift();
        // increment the crawl count
        crawledCount++;

        try {
            // request the target website
            const response = await axios.get(currentUrl);
            // parse the website's HTML
            const $ = cheerio.load(response.data);

            // find all links on the page
            const linkElements = $('a[href]');
            linkElements.each((index, element) => {
                let url = $(element).attr('href');

                // check if the URL is a full link or a relative path
                if (!url.startsWith('http')) {
                    // remove leading slash if present
                    url = targetUrl + url.replace(/^\//, '');
                }

                // follow links within the target website
                if (url.startsWith(targetUrl) && !urlsToVisit.includes(url)) {
                    // update the URLs to visit
                    urlsToVisit.push(url);
                }
            });

            //extracting data from the links

            if(paginedpages.test(currentUrl)){
                const ProductContainers=$('.product');//select the products container
                ProductContainers.each((index,product)=>{
                    
                    const products={};
                   
                    products.name=$(product)
                    .find('.product-name').text().trim()||'N/A';

                    products.url=$(product)
                    .find('.woocommerce-LoopProduct-link')
                    .attr('href')||'N/A';
                    
                    products.image=$(product)
                    .find('img').attr('src');
                
                    products.price=$(product)
                    .find('.price').text().trim()||'N/A'; 
                    
                    ProductData.push(products);//pushing the data
                });
            }

        } catch (error) {
            // handle any error that occurs during the HTTP request
            console.error(`Error fetching ${currentUrl}: ${error.message}`);
        }
    }
    //writing in csv file

    try {
        const header='url,name,image,price\n';
const csvRow=ProductData.map((item)=>`${item.url},${item.name},${item.image},${item.price}`)
        .join('\n');//created the string
const csvData=header+csvRow;
fs.writeFileSync('Product.csv',csvData);
console.log("file successfully created 👌");

    } catch (error) {
     console.error({error:error.message});   
    }

};

// execute the crawler function
crawler();
