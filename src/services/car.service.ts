import { 
  CreateCarBodyType as CreateCarInput, 
  UpdateCarBodyType as UpdateCarInput, 
  CarListQueryType as CarListQueryInput 
} from '../structs/car.struct'; 
import { Car, CarListResponse } from '../types/car.type';
import { CarRepository } from '../repositories/car.repository';
import { ConflictError, BadRequestError, NotFoundError } from '../errors/errors';

export class CarService {
  constructor(private readonly carRepository: CarRepository) {}

  async createCar(input: CreateCarInput & { companyId: number }): Promise<Car> {
    const exists = await this.carRepository.existsByCompanyIdAndCarNumber(
      input.companyId,
      input.carNumber
    );

    if (exists) {
      throw new BadRequestError("잘못된 요청입니다");
    }

    return this.carRepository.create(input);
  }

  async getCars(companyId: number, query: CarListQueryInput): Promise<CarListResponse> {
    const page = Number(query.page) || 1;
    const pageSize = Number(query.pageSize) || 10;

    if (page < 1 || pageSize < 1) {
      throw new BadRequestError("잘못된 요청입니다");
    }

    const { items, totalCount } = await this.carRepository.findManyByCompanyId(companyId, query);
    const totalPages = totalCount === 0 ? 1 : Math.ceil(totalCount / pageSize);

    return {
      currentPage: page, 
      totalPages: totalPages,
      totalItemCount: totalCount,
      data: items,
    };
  }

  async getCarById(companyId: number, carId: number): Promise<Car> {
    if (!carId || isNaN(carId)) {
      throw new BadRequestError('잘못된 요청입니다');
    }

    const car = await this.carRepository.findById(companyId, carId);
    
    if (!car) {
      throw new NotFoundError('존재하지 않는 차량입니다'); 
    }

    return car;
  }

  async updateCar(input: UpdateCarInput & { carId: number; companyId: number }): Promise<Car> {
    const targetCarId = Number(input.carId);
    const companyId = Number(input.companyId);

    if (!targetCarId || isNaN(targetCarId)) {
      throw new BadRequestError('잘못된 요청입니다');
    }

    const existing = await this.carRepository.findById(companyId, targetCarId);
    
    if (!existing) {
      throw new NotFoundError('존재하지 않는 차량입니다');
    }

    const carNumberToCheck = input.carNumber || existing.carNumber;
    const exists = await this.carRepository.existsByCompanyIdAndCarNumber(
      companyId,
      carNumberToCheck,
      targetCarId 
    );

    if (exists) {
      throw new NotFoundError('이미 존재하는 차량번호입니다.');
    }

    return this.carRepository.update({
      ...input,
      carId: targetCarId,
      companyId: companyId
    });
  }

  async deleteCar(companyId: number, carId: number): Promise<{ message: string }> {
    if (!carId || isNaN(carId)) {
      throw new BadRequestError('잘못된 요청입니다');
    }

    const existing = await this.carRepository.findById(companyId, carId);
    
    if (!existing) {
      throw new NotFoundError('존재하지 않는 차량입니다');
    }

    await this.carRepository.delete(companyId, carId);
    return { message: '차량 삭제 성공' };
  }

  async getCarModels(): Promise<string[]> {
    const models = await this.carRepository.getCarModels();
    if (!models) {
      throw new BadRequestError('잘못된 요청입니다');
    }
    return models;
  }
}