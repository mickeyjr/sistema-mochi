import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';

@Injectable()
export class S3Service {
  private s3 = new S3Client({
    region: 'us-east-2',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const fileName = `imagesByProduct/${uuid()}`;
    const command = new PutObjectCommand({
      Bucket: 'mochi-images-bucket',
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3.send(command);

    return `https://mochi-images-bucket.s3.us-east-2.amazonaws.com/${fileName}`;
  }
}