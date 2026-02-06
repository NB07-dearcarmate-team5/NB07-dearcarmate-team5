import type { Prisma } from '@prisma/client';
import { CarStatus as PrismaCarStatusEnum } from '@prisma/client';
import { 
  CreateCarBodyType, 
  UpdateCarBodyType,
  CarListQueryType
} from '../structs/car.struct'; 
import type { Car, CarListItem, CarStatus } from '../types/car.type';
import prisma from '../prisma';
import { CarModel } from '../models/car.model'; 

export interface CarRepository {
  existsByCompanyIdAndCarNumber(companyId: number, carNumber: string, excludeCarId?: number): Promise<boolean>;
  create(data: CreateCarBodyType & { companyId: number }): Promise<Car>;
  findManyByCompanyId(companyId: number, query: CarListQueryType): Promise<{ items: CarListItem[]; totalCount: number }>;
  findById(companyId: number, carId: number): Promise<Car | null>;
  update(data: UpdateCarBodyType & { carId: number; companyId: number }): Promise<Car>;
  delete(companyId: number, carId: number): Promise<void>;
  getCarModels(): Promise<string[]>;
}

export class CarRepositoryImpl implements CarRepository {
  async existsByCompanyIdAndCarNumber(companyId: number, carNumber: string, excludeCarId?: number): Promise<boolean> {
    const where: Prisma.CarWhereInput = { companyId, carNumber };
    if (excludeCarId) where.id = { not: Number(excludeCarId) };

    const found = await prisma.car.findFirst({ where, select: { id: true } });
    return found !== null;
  }

  async create(input: CreateCarBodyType & { companyId: number }): Promise<Car> {
    const created = await prisma.car.create({
      data: {
        ...input,
        price: BigInt(input.price),
        status: PrismaCarStatusEnum.POSSESSION,
      },
    });
    return CarModel.toEntity(created);
  }

  async findManyByCompanyId(companyId: number, query: CarListQueryType): Promise<{ items: CarListItem[]; totalCount: number }> {
    const where: Prisma.CarWhereInput = { companyId };

    if (query.status) where.status = CarModel.toPrismaStatus(query.status);
    if (query.keyword) {
      const searchField = query.searchBy === 'model' ? 'model' : 'carNumber';
      where[searchField] = { contains: query.keyword, mode: 'insensitive' };
    }

    const page = Number(query.page) || 1;
    const pageSize = Number(query.pageSize) || 10;

    const [totalCount, cars] = await Promise.all([
      prisma.car.count({ where }),
      prisma.car.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return { totalCount, items: cars.map(car => CarModel.toEntity(car)) };
  }

  async findById(companyId: number, carId: number): Promise<Car | null> {
    const car = await prisma.car.findFirst({ where: { id: Number(carId), companyId } });
    return car ? CarModel.toEntity(car) : null;
  }

  async update(input: UpdateCarBodyType & { carId: number; companyId: number }): Promise<Car> {
  const { carId, companyId, ...rest } = input;

  const cleanData = Object.fromEntries(
    Object.entries(rest).filter(([_, v]) => v !== undefined)
  ) as any;

  if (cleanData.price !== undefined) cleanData.price = BigInt(cleanData.price);
  if (cleanData.status !== undefined) cleanData.status = CarModel.toPrismaStatus(cleanData.status);

  const updated = await prisma.car.update({
    where: { id: Number(carId), companyId },
    data: cleanData,
  });

  return CarModel.toEntity(updated);
}

  async delete(companyId: number, carId: number): Promise<void> {
    await prisma.car.deleteMany({ where: { id: Number(carId), companyId } });
  }

  async getCarModels(): Promise<string[]> {
    const cars = await prisma.car.findMany({
      select: { model: true },
      distinct: ['model'], 
      orderBy: { model: 'asc' }, 
    });
    return cars.map(car => car.model);
  }
}