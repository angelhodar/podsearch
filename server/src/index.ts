import 'dotenv/config'
import fs from "fs"
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { client, db, podcasts, episodes} from "./db"
import { parseFromRssFeed } from './parsers/rss'

/*async function transcribeAudioTest() {
  const audioStream = fs.createReadStream("./data/test/test_001.ogg")
  const transcription = await transcribeAudio(audioStream, 0)
  fs.writeFileSync("./data/transcription.json", JSON.stringify(transcription))
}

async function splitAudioTest() {
  const paths = await splitAudio({ name: "test", inputPath: "../data/input.mp3", outputPath: "../data/test", segmentTime: 600 })
  console.log(paths)
  console.log("Finished")
}
  */

const app = new Hono()
const port = 3000

app.get('/podcasts', async (c) => {
  const podcasts = await db.query.podcasts.findMany({
    with: {
      episodes: true
    }
  })

  return c.json(podcasts)
})

app.post('/podcasts', async (c) => {
  const { importer, url } = await c.req.json()

  if (importer !== "rss") throw new Error("Podcast importer not supported")

  const parsedPodcast = await parseFromRssFeed(url)

  const insertedPodcast = await db.insert(podcasts).values(parsedPodcast.podcast)

  const episodesToInsert = parsedPodcast.episodes.map(ep => { return { ...ep, podcastId: insertedPodcast.oid } })
  
  await db.insert(episodes).values(episodesToInsert)
  
  return c.json({ podcast: parsedPodcast })
})

async function main() {
  await client.connect()

  console.log(`Server is running on port ${port}`)

  serve({
    fetch: app.fetch,
    port
  })
}

main()