import pkg from 'pg';
import {Pool} from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool=new Pool(
  {
    host:process.env.DB_HOST,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
    user:process.env.DB_USER,
    port:process.env.DB_PORT,
  }
);


export default pool;