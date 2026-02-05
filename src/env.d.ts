export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      PORT: string;
      NODE_ENV: 'development' | 'production' | 'test';
    }
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SHADOW_DATABASE_URL: string;
      PORT: string;
      NODE_ENV: 'development' | 'production' | 'test';
    }
  }
}