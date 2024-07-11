import fs from "fs"
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
    region: 'eu-west-3',
    credentials: {
        accessKeyId: 'your_access_key_id',
        secretAccessKey: 'your_secret_access_key'
    }
});

export async function upload(filePath: string, key: string) {
    const fileStream = fs.createReadStream(filePath);

    const command = new PutObjectCommand({
        Bucket: "bucket",
        Key: key,
        Body: fileStream,
        ContentType: "audio/ogg"
    });

    try {
        const data = await s3Client.send(command);
        console.log(`Successfully uploaded ${key} to S3`);
        return data
    } catch (err) {
        console.error('Error uploading file to S3: ' + err.message);
    }
}