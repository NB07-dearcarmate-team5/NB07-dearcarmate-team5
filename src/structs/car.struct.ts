import { object, string, number, enums, size, partial, Infer, pattern, Struct, assert, StructError, defaulted } from 'superstruct';
import { Request, Response, NextFunction } from 'express';


const integerString = pattern(string(), /^[0-9]+$/);

const Manufacturer = enums(['기아', '쉐보레', '현대', '제네시스', '삼성', '쌍용', '기타']);
const CarType = enums(['세단', '경차', 'SUV']);
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
  status: defaulted(CarStatus, 'possession'),
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
  status: CarStatus,
}));

export const CarListQuery = partial(object({
  page: defaulted(integerString, '1'),
  pageSize: defaulted(integerString, '10'),
  status: CarStatus,
  searchBy: enums(['carNumber', 'model']),
  keyword: string(),
}));

export const CarIdParams = object({
  carId: integerString,
});

export const validateRequest = (
  location: 'body' | 'params' | 'query',
  struct: Struct<any, any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      assert(req[location], struct);
      next();
    } catch (error: any) {
      if (error instanceof StructError) {
        const field = error.path.join('.') || '전체';
        return res.status(400).json({
          message: `데이터 형식이 올바르지 않습니다. 필드: [${field}]`,
          errorDetail: error.message
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