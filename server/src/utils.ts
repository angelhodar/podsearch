import axios from "axios";

export async function getStreamFromFileUrl(inputFileUrl: string): Promise<ReadableStream> {
  const response = await axios({
    method: "get",
    url: inputFileUrl,
    responseType: "stream",
  });

  return response.data as ReadableStream;
}
