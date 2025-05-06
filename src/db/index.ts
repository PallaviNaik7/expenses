import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

/*Db credentials shouldn't be hardcoded in the code. It's a good practice to store it in env files and add the .env file to gitignore 
so that you don't push the credentials to github*/

export const pool = new Pool({
    user: process.env.DATABASE_USER,
    database: process.env.DATABASE_NAME,
    port: 5432,
    host: process.env.DATABASE_HOST,
    password: process.env.DATABASE_PASSWORD,
    ssl: true
})