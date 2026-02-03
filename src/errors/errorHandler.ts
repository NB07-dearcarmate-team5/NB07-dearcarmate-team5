import { Request, Response, NextFunction } from 'express';
import { CustomError } from './customError';
import { StructError } from 'superstruct';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // superstruct 에러 발생시 400 BadRequest로 보내도록 추가
  if (err instanceof StructError) {
    return res.status(400).json({
      message: '잘못된 요청입니다', // 명세서 메시지 일치
    });
  }

  // 정의된 커스텀 에러 처리(400, 401, 403, 404)
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      succese: false,
      message: err.message,
    });
  }

  // 그 외 예상하지 못한 에러 처리 (500)
  console.error('예상치 못한 에러 발생:', err);
  return res.status(500).json({
    succese: false,
    message: '서버 내부 에러가 발생하였습니다.',
  });
};
