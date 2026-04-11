import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import axios from "axios";
import * as cheerio from "cheerio";


import Mainroute from './src/routes/home.js';
import crawler from './src/crawler.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine','ejs');
app.set('views','./views');

app.use('/api',Mainroute);

app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
});






















