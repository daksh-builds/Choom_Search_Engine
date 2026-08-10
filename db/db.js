import pkg from 'pg';
import {Pool} from 'pg';
import dotenv from 'dotenv';



dotenv.config();

console.log(process.cwd());
const pool=new Pool({
    connectionString: process.env.DATABASE_URL,
});
export default pool;