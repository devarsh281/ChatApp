import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import dotenv from "dotenv";

dotenv.config();
const url=process.env.DATABASE_URL;
if(!url){
  console.log("Database Url is not defined")
}else{
  console.log("Database Connected Succesfully!")
}

const pool = new Pool({
  connectionString: url, 
});

export const db = drizzle(pool, { schema });
