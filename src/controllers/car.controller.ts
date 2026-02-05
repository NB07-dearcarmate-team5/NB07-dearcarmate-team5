import { Request, Response, NextFunction } from 'express';
import { CarService } from '../services/car.service';
import type { 
  CreateCarBodyType, 
  UpdateCarBodyType, 
  CarIdParamsType, 
  CarListQueryType 
} from '../structs/car.struct';

export class CarController {

  constructor(private readonly carService: CarService) {}

  createCar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = req.body as CreateCarBodyType;

      const created = await this.carService.createCar({
        ...body, 
        companyId: req.user!.companyId,
      });

      res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  };


  getCars = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = req.query as unknown as CarListQueryType;

      const result = await this.carService.getCars(req.user!.companyId, {
        ...query,
        page: String(query.page),
        pageSize: String(query.pageSize),
      });

      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };


  getCarById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { carId } = req.params as unknown as CarIdParamsType;
      
      const car = await this.carService.getCarById(
        req.user!.companyId, 
        Number(carId)
      );
      res.status(200).json(car);
    } catch (err) {
      next(err);
    }
  };


  updateCar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { carId } = req.params; // string 타입 "4"
    const companyId = req.user!.companyId;

    // [핵심 수정] input 객체에 carId를 명시적으로 숫자로 변환해서 넣습니다.
    const result = await this.carService.updateCar({
      ...req.body,
      carId: Number(carId), // 여기서 숫자로 확실히 변환!
      companyId: companyId
    });

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};


  deleteCar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { carId } = req.params as unknown as CarIdParamsType;

      await this.carService.deleteCar(
        req.user!.companyId, 
        Number(carId)
      );
      res.status(200).json({ "message": "차량 삭제 성공"});
    } catch (err) {
      next(err);
    }
  };
}