import express from 'express';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8001;

app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
});





















