import 'dotenv/config'

import { serve } from '@hono/node-server'
import { client } from "./db"
import api from "./api"

const port = 3000

async function main() {
  await client.connect()

  console.log(`Server is running on port ${port}`)

  serve({
    fetch: api.fetch,
    port
  })
}

main()