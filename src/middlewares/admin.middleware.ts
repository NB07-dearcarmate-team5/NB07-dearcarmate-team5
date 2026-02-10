import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '../errors/errors';

export const isAdmin = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new UnauthorizedError('인증 정보가 없습니다.');
  }

  if (req.user.isAdmin === false) {
    throw new ForbiddenError('어드민 권한이 필요합니다.');
  }

  next();
};
