import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/token';
import { UnauthorizedError, BadRequestError } from '../errors/errors';

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    throw new UnauthorizedError('로그인이 필요합니다.');
  }

  const decoded = verifyAccessToken(token);

  if (!decoded) {
    throw new BadRequestError('잘못된 요청입니다.');
  }

  req.user = {
    userId: decoded.userId,
    companyId: decoded.companyId,
    isAdmin: decoded.isAdmin,
  };

  next();
}

