/* eslint-disable @typescript-eslint/no-unsafe-call */
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';

@Injectable()
export class S3Service {
  private s3: S3Client;
  private bucket: string;

  constructor() {
    const region = process.env.AWS_REGION;
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    const bucket = process.env.S3_BUCKET;

    if (!region || !accessKeyId || !secretAccessKey || !bucket) {
      throw new Error('Missing required AWS environment variables');
    }

    this.s3 = new S3Client({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });
    this.bucket = bucket;
  }

  async uploadBuffer(key: string, buffer: Buffer, contentType?: string) {
    try {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: buffer,
          ContentType: contentType,
        }),
      );
      return {
        key,
        url: `${process.env.S3_PUBLIC_BASE}/${key}`,
      };
    } catch (error) {
      console.error('Error uploading to S3:', error);
      throw new Error('Error uploading to S3');
    }
  }
}
