import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/token';
import { UnauthorizedError, ForbiddenError } from '../errors/errors';

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    throw new UnauthorizedError('인증 토큰이 필요합니다.');
  }

  const decoded = verifyAccessToken(token);

  if (!decoded) {
    throw new ForbiddenError('만료되었거나 유효하지 않은 토큰입니다.');
  }

  req.user = {
    userId: decoded.userId,
    companyId: decoded.companyId,
    isAdmin: decoded.isAdmin,
  };

  next();
};
