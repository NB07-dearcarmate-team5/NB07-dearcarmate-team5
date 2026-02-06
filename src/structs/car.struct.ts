import { object, string, number, enums, size, partial, Infer, Struct, defaulted, coerce, integer, min, create } from 'superstruct';
import { Request, Response, NextFunction } from 'express';


const CoercedInteger = coerce(
  min(integer(), 1),            
  string(),                    
  (value) => parseInt(value, 10)
);

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

export const CarListQuery = object({
  page: defaulted(CoercedInteger, 1),
  pageSize: defaulted(CoercedInteger, 10),
  status: CarStatus,
  searchBy: enums(['carNumber', 'model']),
  keyword: string(),
});

export const CarIdParams = object({
  carId: CoercedInteger,
});

export const validateRequest = <T, S>(
  location: 'body' | 'params' | 'query',
  struct: Struct<T, S>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const validatedData = create(req[location], struct);

    req[location] = validatedData as any;
    
    next();
  };
};

export type CreateCarBodyType = Infer<typeof CreateCarBody>;
export type UpdateCarBodyType = Infer<typeof UpdateCarBody>;
export type CarListQueryType = Infer<typeof CarListQuery>;
export type CarIdParamsType = Infer<typeof CarIdParams>;