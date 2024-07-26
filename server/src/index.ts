import { serve } from "@hono/node-server";
import config from "./config";
import { client } from "./db";
import api from "./api";
import { startBackgroundJobs } from "./cron"

async function main() {
  await client.connect();

  startBackgroundJobs()
  
  console.log(`Server is running on port ${config.PORT}`);

  serve({
    fetch: api.fetch,
    port: config.PORT,
  });
}

main();
