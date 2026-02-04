import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access-secret';
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh-secret';

export const generateAccessToken = (payload: {
  userId: number;
  companyId: number;
  isAdmin: boolean;
}) => {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: '1h' });
};

export const generateRefreshToken = (payload: { userId: number }) => {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });
};

export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, ACCESS_SECRET) as {
      userId: number;
      companyId: number;
      isAdmin: boolean;
    };
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, REFRESH_SECRET) as { userId: number };
  } catch (error) {
    return null;
  }
};
