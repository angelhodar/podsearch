import axios from "axios"

// Function to get the input file stream from the provided URL
export async function getStreamFromFileUrl(inputFileUrl: string): Promise<ReadableStream> {
    const response = await axios({
        method: 'get',
        url: inputFileUrl,
        responseType: 'stream'
    });

    return response.data as ReadableStream;
}