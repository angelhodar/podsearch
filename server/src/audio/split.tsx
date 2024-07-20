import path from "node:path";
import fs from "node:fs";
import { spawn } from "node:child_process";

interface SplitAudioParams {
  name: string;
  inputPath: string;
  outputPath: string;
}

const SPLIT_SEGMENT_DURATION = 600;

export async function splitAudio(params: SplitAudioParams): Promise<string[]> {
  const { name, inputPath, outputPath } = params;

  const outputBasePath = path.join(__dirname, outputPath);

  const input = path.join(__dirname, inputPath);
  const output = path.join(outputBasePath, `${name}_%d.ogg`);

  return new Promise<string[]>((resolve, reject) => {
    const ffmpegArgs = [
      "-i",
      input, // Input file
      "-ac",
      "1", // Convert to mono
      "-ar",
      "16000", // Set sample rate to 16000 Hz
      "-acodec",
      "libvorbis", // Use Vorbis codec
      "-map_metadata",
      "-1", // Strip all metadata
      "-qscale:a",
      "5", // Set quality scale to 5
      "-f",
      "segment", // Split the output into segments
      "-segment_time",
      SPLIT_SEGMENT_DURATION.toString(), // Duration of each segment
      "-reset_timestamps",
      "1", // Reset timestamps for segments
      "-loglevel",
      "error",
      output,
    ];

    const ffmpegProcess = spawn("ffmpeg", ffmpegArgs);

    ffmpegProcess.on("close", (code) => {
      if (code !== 0)
        reject(new Error(`FFmpeg process exited with code ${code}`));

      console.log(`Audio segments created successfully for ${name}!`);

      const segments = fs.readdirSync(outputBasePath);
      const paths = segments.map((s) => path.join(outputBasePath, s));

      resolve(paths);
    });

    ffmpegProcess.on("error", (err: Error) => {
      console.error(`Error during audio processing: ${err.message}`);
      reject(err);
    });

    ffmpegProcess.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    ffmpegProcess.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
    });
  });
}
