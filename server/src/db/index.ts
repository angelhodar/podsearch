import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "./schema";

export * from "./schema";

// Initialize PostgreSQL client
export const client = new Client({
  connectionString: process.env.DB_URL as string,
});
export const db = drizzle(client, { schema });
