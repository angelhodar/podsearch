import fs from "fs"
import axios from "axios"
import FormData from "form-data"

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
    start: number
    end: number
    text: string
}

interface GroqTranscriptionResponse {
    duration: number
    language: string
    segments: Array<TranscriptionSegment>
    task: string
    text: string
    x_groq: { id: string }
}

export async function transcribeAudio(stream: fs.ReadStream, timeOffset: number): Promise<Array<ParsedTranscriptionSegment> | null> {
    const form = new FormData();

    form.append('file', stream);
    form.append('model', process.env.GROQ_MODEL || "whisper-large-v3");
    form.append('temperature', '0');
    form.append('response_format', 'verbose_json');
    form.append('language', 'es');

    const headers = {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        ...form.getHeaders(),
    };

    try {
        const { data } = await axios.post<GroqTranscriptionResponse>('https://api.groq.com/openai/v1/audio/transcriptions', form, { headers });
        return data.segments.map(({ start, end, text }) => ({ start: start + timeOffset, end: end + timeOffset, text: text.trim() }));
    } catch (error) {
        console.error('Error transcribing audio:', error);
        return null
    }
}

export async function transcribeJob() {
    
}