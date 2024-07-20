import schedule from 'node-schedule';
import fs from "fs"
import path from "path"
import { eq } from 'drizzle-orm';
import { db, episodes, segments, transcriptions, CreateTranscription } from "./db"
import { transcribeAudio } from './audio/transcribe';
import { splitAudio } from './audio/split';
import { upload, getObjectStream } from './storage/s3';
import { getStreamFromFileUrl } from './utils';

schedule.scheduleJob('0 */4 * * *', async function processAudio() {
    const episode = await db.query.episodes.findFirst({ where: eq(episodes.processed, false), with: { segments: true } })

    if (!episode) {
        console.log("No episode to process found")
        return
    }

    const episodeName = episode.title.toLowerCase().replace(" ", "_")
    const episodeAudioKey = episodeName + ".mp3"

    if (episode.audioFileUrl.startsWith("https")) {
        const audioStream = await getStreamFromFileUrl(episode.audioFileUrl)
        await upload({ stream: audioStream, key: `podcasts/${episodeAudioKey}`, contentType: "audio/mp3" })
        await db.update(episodes)
            .set({ audioFileUrl: episodeAudioKey })
            .where(eq(episodes.id, episode.id))
            .returning({ updatedId: episodes.id });
    }

    if (episode.segments.length === 0) {
        const splitPaths = await splitAudio({
            name: episodeName,
            inputPath: `../data/${episodeName}/input.mp3`,
            outputPath: `../data/${episodeName}/splits`
        })

        for (const [i, audioPath] of splitPaths.entries()) {
            const audioStream = fs.createReadStream(audioPath)
            const audioName = path.basename(audioPath)
            await upload({ stream: audioStream, key: `segments/${audioName}`, contentType: "audio/ogg" })
            const [newSegment] = await db.insert(segments).values({ episodeId: episode.id, duration: 600, position: i, audioFileUrl: `segments/${audioName}` }).returning()
            episode.segments.push(newSegment)
        }
    }

    const segmentsToProcess = episode.segments.filter(s => !s.processed)

    for (const segment of segmentsToProcess) {
        const initialOffset = segment.position * segment.duration
        const audioStream = await getObjectStream(segment.audioFileUrl)
        const transcription = await transcribeAudio(audioStream)

        if (!transcription) continue;

        const transcriptionsToInsert: CreateTranscription[] = transcription.map(tr => {
            return { segmentId: segment.id, startTime: tr.start + initialOffset, endTime: tr.end + initialOffset, transcription: tr.text }
        })

        await db.insert(transcriptions).values(transcriptionsToInsert)
        await db.update(segments).set({ processed: true }).where(eq(segments.id, segment.id))

        segment.processed = true
    }

    // If all episode segments are processed then mark episode as processed
    if (segmentsToProcess.every(s => s.processed)) {
        await db.update(episodes)
            .set({ processed: true })
            .where(eq(episodes.id, episode.id))
    }
});
