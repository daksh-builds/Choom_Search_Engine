import {Router} from 'express';
import pool from '../../db/db.js';
const route=Router();
route.get('/',async (req,res)=>{


  res.render('index');
})
export default route;