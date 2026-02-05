import { object, string, number, enums, size, partial, Infer, pattern, Struct, assert, StructError } from 'superstruct';
import { Request, Response, NextFunction } from 'express';

const NumberString = pattern(string(), /^[0-9]+$/);

const Manufacturer = enums(['기아', '쉐보레', '현대', '제네시스', '삼성', '쌍용', '기타']);
const CarType = enums(['세단', '경차', 'SUV', '해치백', '쿠페', '트럭', 'RV']);
const CarStatus = enums(['possession', 'contractProceeding', 'contractCompleted']);

export const CreateCarBody = object({
  carNumber: size(string(), 1, 20),
  manufacturer: Manufacturer,
  model: size(string(), 1, 50),
  type: CarType,
  manufacturingYear: number(),
  mileage: number(),
  price: number(),
  accidentCount: number(),
  explanation: string(),
  accidentDetails: string(),
  status: CarStatus,
});

export const UpdateCarBody = partial(object({
  carNumber: size(string(), 1, 20),
  manufacturer: Manufacturer,
  model: size(string(), 1, 50),
  type: CarType,
  manufacturingYear: number(),
  mileage: number(),
  price: number(),
  accidentCount: number(),
  explanation: string(),
  accidentDetails: string(),
}));

export const CarListQuery = partial(object({
  page: NumberString,
  pageSize: NumberString,
  status: CarStatus,
  searchBy: enums(['carNumber', 'model']),
  keyword: string(),
}));

export const CarIdParams = object({
  carId: NumberString,
});

export const validateRequest = (
  location: 'body' | 'params' | 'query',
  struct: Struct<any, any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.headers.authorization) {
        return res.status(401).json({ message: "로그인이 필요합니다" });
      }

      assert(req[location], struct);
      next();
    } catch (error: any) {
      if (error instanceof StructError) {
        return res.status(400).json({
          message: "잘못된 요청입니다"
        });
      }
      if (error.status === 404) {
        return res.status(404).json({
          message: "존재하지 않는 차량입니다"
        });
      }
      next(error);
    }
  };
};

export type CreateCarBodyType = Infer<typeof CreateCarBody>;
export type UpdateCarBodyType = Infer<typeof UpdateCarBody>;
export type CarListQueryType = Infer<typeof CarListQuery>;
export type CarIdParamsType = Infer<typeof CarIdParams>;