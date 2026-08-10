import express from 'express';
import dotenv from 'dotenv';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import axios from "axios";
import * as cheerio from "cheerio";

import connecting from './src/controller/connect.js';
import pool from './db/db.js'; 
import Mainroute from './src/routes/home.js';
import SearchRoute from './src/routes/search.js';


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'src', 'views'));
// database connection
connecting();

app.use('/', Mainroute);
app.use('/api', SearchRoute);

app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
});