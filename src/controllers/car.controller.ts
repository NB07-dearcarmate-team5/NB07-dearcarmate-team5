import { Request, Response, NextFunction } from 'express';
import { CarService } from '../services/car.service';
import type {
  CreateCarBodyType,
  UpdateCarBodyType,
  CarListQueryType,
  CarIdParamsType,
} from '../structs/car.struct';

export class CarController {
  constructor(private readonly carService: CarService) {}

  createCar = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const body = req.body as CreateCarBodyType;
    const created = await this.carService.createCar({
      ...body,
      companyId: req.user!.companyId,
    });
    res.status(201).json(created);
  };

  getCars = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const query = req.query as unknown as CarListQueryType;
    const result = await this.carService.getCars(req.user!.companyId, query);
    res.status(200).json(result);
  };

  getCarModels = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const result = await this.carService.getCarModels();
    res.status(200).json(result);
  };

  getCarById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { carId } = req.params as unknown as CarIdParamsType;
    const car = await this.carService.getCarById(req.user!.companyId, carId);
    res.status(200).json(car);
  };

  updateCar = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { carId } = req.params as unknown as CarIdParamsType;
    const body = req.body as UpdateCarBodyType;
    const companyId = req.user!.companyId;
    const result = await this.carService.updateCar({
      ...body,
      carId,
      companyId,
    });
    res.status(200).json(result);
  };

  deleteCar = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { carId } = req.params as unknown as CarIdParamsType;
    await this.carService.deleteCar(req.user!.companyId, carId);
    res.status(200).json({ message: '차량 삭제 성공' });
  };
}
