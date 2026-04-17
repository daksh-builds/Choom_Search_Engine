import {Router} from 'express';
import pool from '../../db/db.js';
import crawler from '../tools/crawler-01.js';
const route=Router();
route.get('/',async (req,res)=>{
  crawler();

  res.render('index');
})
export default route;