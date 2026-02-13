declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      PORT: string;
      NODE_ENV: 'development' | 'production' | 'test';
      S3_ENDPOINT: string;
      S3_ACCESS_KEY: string;
      S3_SECRET_KEY: string;
      S3_BUCKET_NAME: string;
      S3_REGION: string;
      SMTP_HOST: string;
      SMTP_PORT: string;
      SMTP_USER: string;
      SMTP_PASS: string;
      SMTP_FROM: string;
    }
  }
}

export {};
