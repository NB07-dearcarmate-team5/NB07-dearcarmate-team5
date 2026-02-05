import { 
  CreateCarBodyType as CreateCarInput, 
  UpdateCarBodyType as UpdateCarInput, 
  CarListQueryType as CarListQueryInput 
} from '../structs/car.struct'; 
import { Car, CarListResponse } from '../types/car.type';
import { CarRepository } from '../repositories/car.repository';
import { NotFoundError } from '../errors/errors';
import { CustomError } from '../errors/customError';

export class CarService {
  constructor(private readonly carRepository: CarRepository) {}

  async createCar(input: CreateCarInput & { companyId: number }): Promise<Car> {
    const exists = await this.carRepository.existsByCompanyIdAndCarNumber(
      input.companyId,
      input.carNumber
    );

    if (exists) {
      throw new CustomError('이미 존재하는 차량번호입니다.', 409);
    }

    return this.carRepository.create(input);
  }

  async getCars(companyId: number, query: CarListQueryInput): Promise<CarListResponse> {
    const page = Number(query.page) || 1;
    const pageSize = Number(query.pageSize) || 10;

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
    throw new CustomError('잘못된 요청입니다', 400);
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
    throw new CustomError('잘못된 요청입니다', 400);
  }

  const existing = await this.carRepository.findById(companyId, targetCarId);
  
  if (!existing) {
    throw new CustomError('존재하지 않는 차량입니다', 404);
  }

  const carNumberToCheck = input.carNumber || existing.carNumber;
  const exists = await this.carRepository.existsByCompanyIdAndCarNumber(
    companyId,
    carNumberToCheck,
    targetCarId 
  );

  if (exists) {
    throw new CustomError('이미 존재하는 차량번호입니다.', 400);
  }

  return this.carRepository.update({
    ...input,
    carId: targetCarId,
    companyId: companyId
  });
}


  async deleteCar(companyId: number, carId: number): Promise<{ message: string }> {
  if (!carId || isNaN(carId)) {
    throw new CustomError('잘못된 요청입니다', 400);
  }
  const existing = await this.carRepository.findById(companyId, carId);
  
  if (!existing) {
    throw new CustomError('존재하지 않는 차량입니다', 404);
  }

  await this.carRepository.delete(companyId, carId);
  return { message: '차량 삭제 성공' };
}
}