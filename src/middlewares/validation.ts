import { Request, Response, NextFunction } from "express";
import { assert, Struct } from "superstruct";
import { BadRequestError } from "../errors/errors";

export const validate = <T, S>(struct: Struct<T, S>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      assert(req.body, struct); 
      next();
    } catch (error) {
      throw new BadRequestError('잘못된 요청입니다'); 
    }
  };
};