import { Request, Response, NextFunction } from "express";
import { assert, Struct } from "superstruct";
import { BadRequestError } from "../errors/errors";

export const validate = <T, S>(struct: Struct<T, S>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try{
      assert(req.body, struct);
      next();
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'message' in error) {
        const message = (error as { message: string }).message;
        throw new BadRequestError(message);
      }
      throw new BadRequestError('요청 데이터 형식이 올바르지 않습니다.');
    }
  }
}