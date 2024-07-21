import axios from "axios";
import FormData from "form-data";
import config from "../config";
import type { StorageObject } from "../storage/s3";

interface TranscriptionSegment {
	id: number;
	seek: number;
	start: number;
	end: number;
	text: string;
	tokens: number[];
	temperature: number;
	avg_logprob: number;
	compression_ratio: number;
	no_speech_prob: number;
}

interface ParsedTranscriptionSegment {
	start: number;
	end: number;
	text: string;
}

interface GroqTranscriptionResponse {
	duration: number;
	language: string;
	segments: Array<TranscriptionSegment>;
	task: string;
	text: string;
	x_groq: { id: string };
}

export async function transcribeAudio(data: StorageObject): Promise<Array<ParsedTranscriptionSegment> | null> {
  const { stream, metadata} = data

	const form = new FormData();

	form.append("file", stream, {
		contentType: metadata.type,
		knownLength: metadata.size,
		filename: metadata.key,
	});
	form.append("model", config.GROQ_MODEL);
	form.append("temperature", "0");
	form.append("response_format", "verbose_json");
	form.append("language", "es");

	const headers = {
		Authorization: `Bearer ${config.GROQ_API_KEY}`,
		...form.getHeaders(),
	};

	try {
		const { data } = await axios.post<GroqTranscriptionResponse>(
			"https://api.groq.com/openai/v1/audio/transcriptions",
			form,
			{ headers },
		);
		return data.segments.map((segment) => ({
			...segment,
			text: segment.text.trim(),
		}));
	} catch (error) {
		console.error("Error transcribing audio: ", error);
		return null;
	}
}
