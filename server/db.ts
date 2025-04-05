import { drizzle } from "drizzle-orm/neon-serverless";
import { neon } from "@neondatabase/serverless";
import * as schema from "@shared/schema";

// Create a PostgreSQL connection pool
const sql = neon(process.env.DATABASE_URL!);

// Create a drizzle connection with the schema
export const db = drizzle(sql, { schema });