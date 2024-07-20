import "dotenv/config";

import { serve } from "@hono/node-server";
import config from "./config";
import { client } from "./db";
import api from "./api";

async function main() {
  await client.connect();

  console.log(`Server is running on port ${config.PORT}`);

  serve({
    fetch: api.fetch,
    port: config.PORT,
  });
}

main();
