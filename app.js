import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { createReadStream } from 'fs';
import { parse } from 'csv-parse';
import axios from "axios";
import * as cheerio from "cheerio";
import fs from 'fs';

import crawler from './src/crawler.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine','ejs');
app.set('views','./views');

//display on a page

app.get('/testme',(req,res)=>{
const results=[];
fs.createReadStream('Product.csv')
.pipe(parse({
  columns: true,
  skip_empty_lines: true
}))
.on('data',(data)=>results.push(data))
.on('end',()=>{
  res.render('index',{data:results});
})
.on('error', (error) => {
   console.error(error);
   res.status(500).send('Error reading CSV'); });
});

app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
});






















