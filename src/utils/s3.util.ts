/**
 * S3/MinIO 유틸리티
 * @author 김민기
 *
 * MinIO 설정 (로컬 개발용):
 * - docker-compose up -d
 * - 콘솔: http://localhost:9001 (minioadmin/minioadmin)
 *
 * 환경변수 (.env):
 * - S3_ENDPOINT=http://localhost:9000
 * - S3_ACCESS_KEY=minioadmin
 * - S3_SECRET_KEY=minioadmin
 * - S3_BUCKET_NAME=contracts
 * - S3_REGION=ap-northeast-2
 */

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';

let s3Client: S3Client | null = null;

export const getS3Client = (): S3Client => {
  if (!s3Client) {
    s3Client = new S3Client({
      endpoint: process.env.S3_ENDPOINT,
      region: process.env.S3_REGION || 'ap-northeast-2',
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY,
      },
      forcePathStyle: true,
    });
  }
  return s3Client;
};

export const uploadFile = async (
  file: Buffer,
  key: string,
  mimeType: string
): Promise<void> => {
  const client = getS3Client();
  await client.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: mimeType,
    })
  );
};

export const getFileStream = async (key: string): Promise<Readable> => {
  const client = getS3Client();
  const response = await client.send(
    new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    })
  );
  return response.Body as Readable;
};

export const deleteFile = async (key: string): Promise<void> => {
  const client = getS3Client();
  await client.send(
    new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    })
  );
};

export const generateFileKey = (
  contractId: number,
  fileName: string
): string => {
  const timestamp = Date.now();
  const safeName = fileName.replace(/[^a-zA-Z0-9가-힣._-]/g, '_');
  return `contracts/${contractId}/${timestamp}_${safeName}`;
};
