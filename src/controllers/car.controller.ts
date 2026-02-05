import { Request, Response, NextFunction } from 'express';
import { CarService } from '../services/car.service';
import { CustomError } from '../errors/customError';
import type { 
  CreateCarBodyType, 
  UpdateCarBodyType, 
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
        page: String(query.page || '1'),
        pageSize: String(query.pageSize || '10'),
      });
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  getCarModels = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new CustomError('로그인이 필요합니다', 401);
      }
      const result = await this.carService.getCarModels();
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  getCarById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { carId } = req.params; 
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
      const { carId } = req.params;
      const companyId = req.user!.companyId;

      const result = await this.carService.updateCar({
        ...req.body,
        carId: Number(carId),
        companyId: companyId
      });
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  deleteCar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { carId } = req.params;
      await this.carService.deleteCar(
        req.user!.companyId, 
        Number(carId)
      );
      res.status(200).json({ "message": "차량 삭제 성공" });
    } catch (err) {
      next(err);
    }
  };
}