import fs from "fs"
import axios from "axios"

// Function to get the input file stream from the provided URL
export async function getInputFileStream(inputFileUrl: string): Promise<fs.ReadStream> {
    const response = await axios({
        method: 'get',
        url: inputFileUrl,
        responseType: 'stream'
    });

    return response.data as fs.ReadStream;
}