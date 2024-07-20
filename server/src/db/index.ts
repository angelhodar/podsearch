import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import config from "../config"
import * as schema from "./schema";

export * from "./schema";

// Initialize PostgreSQL client
export const client = new Client({
  connectionString: config.DB_URL,
});
export const db = drizzle(client, { schema });
