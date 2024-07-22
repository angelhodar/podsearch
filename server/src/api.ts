import { Hono } from "hono";
import { cors } from 'hono/cors'
import { sql, eq } from 'drizzle-orm';
import { db, podcasts, episodes, transcriptions, segments } from "./db";
import { parseFromRssFeed } from "./parsers/rss";

const app = new Hono();

app.use('/*', cors())

app.get("/", async (c) => {
  return c.json({ status: "ok" });
});

app.get("/podcasts", async (c) => {
  const podcasts = await db.query.podcasts.findMany();

  return c.json(podcasts);
});

app.get("/podcasts/:id", async (c) => {
  const id = Number.parseInt(c.req.param("id"));

  const podcast = await db.query.podcasts.findFirst({
    where: (podcasts, { eq }) => eq(podcasts.id, id),
    with: { episodes: { limit: 10 } }
  });

  return c.json(podcast);
});

app.get("/search", async (c) => {
  const query = c.req.query('q')

  const results = await db.select({
    transcription: transcriptions.transcription,
    startTime: transcriptions.startTime,
    endTime: transcriptions.endTime,
    position: segments.position,
    duration: segments.duration,
    thumbnailUrl: episodes.thumbnailUrl,
    audioFileUrl: segments.audioFileUrl,
    episodeTitle: episodes.title,
    releaseDate: episodes.releaseDate,
    podcastTitle: podcasts.title,
  })
  .from(transcriptions)
  .leftJoin(segments, eq(segments.id, transcriptions.segmentId))
  .leftJoin(episodes, eq(episodes.id, segments.episodeId))
  .leftJoin(podcasts, eq(podcasts.id, episodes.podcastId))
  .where(sql`to_tsvector('spanish', ${transcriptions.transcription}) @@ to_tsquery('spanish', ${query})`)
  .orderBy(sql`ts_rank(to_tsvector('spanish', ${transcriptions.transcription}), to_tsquery('spanish', ${query})) DESC`);

  return c.json(results)
})

app.post("/podcasts", async (c) => {
  const { importer, url } = await c.req.json();

  if (importer !== "rss") throw new Error("Podcast importer not supported");

  const parsedPodcast = await parseFromRssFeed(url);

  const [insertedPodcast] = await db.insert(podcasts).values(parsedPodcast.podcast).returning();

  const episodesToInsert = parsedPodcast.episodes.map((ep) => {
    return { ...ep, podcastId: insertedPodcast.id };
  });

  await db.insert(episodes).values(episodesToInsert);

  return c.json({ podcast: parsedPodcast });
});

export default app;
