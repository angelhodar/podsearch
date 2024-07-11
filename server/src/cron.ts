import schedule from 'node-schedule';
import { transcribeJob } from './jobs/transcribe';
import { processAudioJob } from './jobs/process-audio';
import { downloadAudioJob } from './jobs/download-audio';

// Job to run every 4 hours
export const transcription = schedule.scheduleJob('0 */4 * * *', transcribeJob);

// Job to run every minute
export const jobEveryMinute = schedule.scheduleJob('* * * * *', downloadAudioJob);

// Job to run every 5 minutes
export const jobEveryFiveMinutes = schedule.scheduleJob('*/5 * * * *', processAudioJob);
