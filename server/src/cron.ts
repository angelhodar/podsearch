import schedule from "node-schedule";
import fs from "node:fs";
import path from "node:path";
import { eq } from "drizzle-orm";
import { db, episodes, segments, transcriptions, type CreateTranscription } from "./db";
import { transcribeAudio } from "./audio/transcribe";
import { splitAudio } from "./audio/split";
import { upload, getObject } from "./storage/s3";
import { getStreamFromFileUrl } from "./utils";
import config from "./config";

export async function processEpisode() {
  const episode = await db.query.episodes.findFirst({
    where: eq(episodes.processed, false),
    with: { segments: true, podcast: true },
  });

  console.log("Episode to process:");
  console.log(episode);

  if (!episode) {
    console.log("No episode to process found");
    return;
  }

  const episodeName = `${episode.podcast.title.toLowerCase().replaceAll(" ", "_")}_${episode.id}`;
  const episodeAudioKey = `podcasts/${episodeName}.mp3`;

  if (episode.audioFileUrl.startsWith("https")) {
    console.log(`Downloading audio file for ${episodeName} from ${episode.audioFileUrl}`);
    const audioStream = await getStreamFromFileUrl(episode.audioFileUrl);

    console.log(`Uploading audio file for ${episodeName} to ${episodeAudioKey}`);
    await upload({
      stream: audioStream,
      key: episodeAudioKey,
      contentType: "audio/mp3",
    });

    console.log(`Updating db value for episode ${episode.id} with new audio file ${episodeAudioKey}`);
    await db
      .update(episodes)
      .set({ audioFileUrl: episodeAudioKey })
      .where(eq(episodes.id, episode.id))
      .returning({ updatedId: episodes.id });
  }

  if (episode.segments.length === 0) {
    const audioInputPath = `/tmp/${episodeName}/input.mp3`
    const directoryPath = path.dirname(audioInputPath);

    if (!fs.existsSync(directoryPath)) fs.mkdirSync(directoryPath, { recursive: true })

    const fileStream = fs.createWriteStream(audioInputPath)
    const { stream: audioStream } = await getObject(episodeAudioKey)

     // Download the data by piping audioStream to fileStream
     audioStream.pipe(fileStream);

     await new Promise((resolve, reject) => {
         fileStream.on('finish', resolve);
         fileStream.on('error', reject);
     });

    console.log(`Generating audio segments db value for episode ${episode.id}...`);

    const splitPaths = await splitAudio({
      name: episodeName,
      inputPath: audioInputPath,
    });

    console.log("Generated audio segments");
    console.log(splitPaths);

    for (const [i, audioPath] of splitPaths.entries()) {
      const audioStream = fs.createReadStream(audioPath);
      const audioName = path.basename(audioPath);
      const audioKey = `segments/${audioName}`;

      console.log(`Uploading audio segment ${audioKey}`);

      await upload({
        stream: audioStream,
        key: audioKey,
        contentType: "audio/ogg",
      });

      console.log("Inserting audio segment...");

      const [newSegment] = await db
        .insert(segments)
        .values({
          episodeId: episode.id,
          duration: config.MAX_SEGMENT_DURATION,
          position: i,
          audioFileUrl: audioKey,
        })
        .returning();

      console.log(`Audio segment inserted: ${newSegment}`);

      episode.segments.push(newSegment);
      fs.unlinkSync(audioPath)
    }
  }

  const segmentsToProcess = episode.segments.filter((s) => !s.processed);

  console.log(`Segments to process: ${segmentsToProcess.length}`);

  for (const segment of segmentsToProcess.slice(12)) {
    console.log(`Fetching stream for audio segment ${segment.id}`);
    const data = await getObject(segment.audioFileUrl);

    console.log(`Generating transcription for audio segment ${segment.id}`);
    const transcription = await transcribeAudio(data);

    if (!transcription) {
      console.error(`Failed to generate transcription for audio segment ${segment.id}`);
      continue;
    }

    const offset = segment.position * segment.duration;

    const transcriptionsToInsert: CreateTranscription[] = transcription.map((tr) => {
      return {
        segmentId: segment.id,
        startTime: tr.start + offset,
        endTime: tr.end + offset,
        transcription: tr.text,
      };
    });

    console.log(`Inserting transcriptions for audio segment ${segment.id}`);
    await db.insert(transcriptions).values(transcriptionsToInsert);

    console.log(`Setting audio segment ${segment.id} as processed`);
    await db.update(segments).set({ processed: true }).where(eq(segments.id, segment.id));

    segment.processed = true;
  }

  // If all episode segments are processed then mark episode as processed
  if (segmentsToProcess.every((s) => s.processed)) {
    await db.update(episodes).set({ processed: true }).where(eq(episodes.id, episode.id));
  }
}

schedule.scheduleJob("0 */4 * * *", processEpisode);
