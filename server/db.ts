import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@shared/schema";

// Create a PostgreSQL connection using postgres.js
const connectionString = process.env.DATABASE_URL!;
const sql = postgres(connectionString);

// Create a drizzle connection with the schema
export const db = drizzle(sql, { schema });