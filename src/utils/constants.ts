
export const DATABASE_URL = process.env.DATABASE_URL;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = process.env.PORT || 3000;
export const PUBLIC_PATH = './public';
export const STATIC_PATH = '/public';

export const JWT_ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access-secret';
export const JWT_REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh-secret';
export const ACCESS_TOKEN_EXPIRES_IN = '1h';
export const REFRESH_TOKEN_EXPIRES_IN = '7d';