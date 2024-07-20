import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import type { ReadStream } from "node:fs";

const s3Client = new S3Client({
  region: "eu-west-3",
  credentials: {
    accessKeyId: "your_access_key_id",
    secretAccessKey: "your_secret_access_key",
  },
});

interface UploadParams {
  stream: ReadableStream | ReadStream;
  key: string;
  contentType: string;
}

export async function upload(params: UploadParams) {
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: "bucket",
      Key: params.key,
      Body: params.stream,
      ContentType: params.contentType,
    },
  });

  try {
    const data = await upload.done();
    console.log(`Successfully uploaded ${params.key} to S3`);
    return data.Key;
  } catch (err) {
    console.error(`Error uploading file to S3: ${err}`);
    throw err;
  }
}

export async function getObjectStream(key: string) {
  const command = new GetObjectCommand({
    Bucket: "bucket",
    Key: key,
  });

  try {
    const data = await s3Client.send(command);
    console.log(`Successfully retrieved ${key} from S3`);
    return data.Body as ReadableStream;
  } catch (err) {
    console.error(`Error retrieving file from S3: ${err}`);
    throw err;
  }
}