import type { Prisma } from '@prisma/client';
import { PrismaClient, Car as PrismaCar, CarStatus as PrismaCarStatus } from '@prisma/client';
import { 
  CreateCarBodyType, 
  UpdateCarBodyType,
  CarListQueryType,
  CarIdParamsType
} from '../structs/car.struct'; 
import type {
  Car,
  CarListItem,
  CarStatus,
} from '../types/car.type';
import prisma from '../prisma';

export interface CarRepository {
  existsByCompanyIdAndCarNumber(
    companyId: number,
    carNumber: string,
    excludeCarId?: number
  ): Promise<boolean>;

  create(data: CreateCarBodyType & { companyId: number }): Promise<Car>;

  findManyByCompanyId(
    companyId: number,
    query: CarListQueryType
  ): Promise<{ items: CarListItem[]; totalCount: number }>;

  findById(companyId: number, carId: number): Promise<Car | null>;

  update(data: UpdateCarBodyType & { carId: number; companyId: number }): Promise<Car>;

  delete(companyId: number, carId: number): Promise<void>;
}

const toPrismaStatus = (status: CarStatus): PrismaCarStatus => {
  const map: Record<CarStatus, PrismaCarStatus> = {
    possession: PrismaCarStatus.POSSESSION,
    contractProceeding: PrismaCarStatus.CONTRACT_PROCEEDING,
    contractCompleted: PrismaCarStatus.CONTRACT_COMPLETED,
  };
  return map[status];
};

const toApiStatus = (status: PrismaCarStatus): CarStatus => {
  const map: Record<PrismaCarStatus, CarStatus> = {
    [PrismaCarStatus.POSSESSION]: 'possession',
    [PrismaCarStatus.CONTRACT_PROCEEDING]: 'contractProceeding',
    [PrismaCarStatus.CONTRACT_COMPLETED]: 'contractCompleted',
  };
  return map[status];
};

const bigintToNumberSafe = (value: bigint, field: string): number => {
  if (value > BigInt(Number.MAX_SAFE_INTEGER) || value < BigInt(Number.MIN_SAFE_INTEGER)) {
    throw new Error(`${field} 값이 안전 정수 범위를 초과했습니다.`);
  }
  return Number(value);
};

const toCarEntity = (car: PrismaCar): Car => ({
  id: car.id,
  carNumber: car.carNumber,
  manufacturer: car.manufacturer,
  model: car.model,
  type: car.type as Car['type'],
  manufacturingYear: car.manufacturingYear,
  mileage: car.mileage,
  price: bigintToNumberSafe(car.price, 'price'),
  accidentCount: car.accidentCount,
  explanation: car.explanation ?? null,
  accidentDetails: car.accidentDetails ?? null,
  status: toApiStatus(car.status),
});


export class CarRepositoryImpl implements CarRepository {
  async existsByCompanyIdAndCarNumber(
    companyId: number,
    carNumber: string,
    excludeCarId?: number
  ): Promise<boolean> {
    const where: Prisma.CarWhereInput = { 
      companyId, 
      carNumber 
    };

    if (excludeCarId !== undefined && excludeCarId !== null) {
      where.id = { not: Number(excludeCarId) };
    }

    const found = await prisma.car.findFirst({
      where,
      select: { id: true },
    });
    
    return found !== null;
  }

  async create(input: CreateCarBodyType & { companyId: number }): Promise<Car> {
    const created = await prisma.car.create({
      data: {
        companyId: input.companyId,
        carNumber: input.carNumber,
        manufacturer: input.manufacturer,
        model: input.model,
        type: input.type,
        manufacturingYear: input.manufacturingYear,
        mileage: input.mileage,
        price: BigInt(input.price),
        accidentCount: input.accidentCount,
        explanation: input.explanation ?? null,
        accidentDetails: input.accidentDetails ?? null,
        status: PrismaCarStatus.POSSESSION,
      },
    });
    return toCarEntity(created);
  }

  async findManyByCompanyId(
    companyId: number,
    query: CarListQueryType
  ): Promise<{ items: CarListItem[]; totalCount: number }> {
    const where: Prisma.CarWhereInput = { companyId };

    if (query.status) where.status = toPrismaStatus(query.status);
    if (query.searchBy === 'carNumber' && query.keyword) {
      where.carNumber = { contains: query.keyword, mode: 'insensitive' };
    }
    if (query.searchBy === 'model' && query.keyword) {
      where.model = { contains: query.keyword, mode: 'insensitive' };
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

    return {
      totalCount,
      items: cars.map(toCarEntity), 
    };
  }

  async findById(companyId: number, carId: number): Promise<Car | null> {
    const car = await prisma.car.findFirst({
      where: { id: Number(carId), companyId },
    });
    return car ? toCarEntity(car) : null;
  }

  async update(input: UpdateCarBodyType & { carId: number; companyId: number }): Promise<Car> {
  try {
    const updated = await prisma.car.update({
      where: { 
        id: Number(input.carId),
        companyId: input.companyId 
      },
      data: {
        ...(input.carNumber && { carNumber: input.carNumber }),
        ...(input.manufacturer && { manufacturer: input.manufacturer }),
        ...(input.model && { model: input.model }),
        ...(input.manufacturingYear && { manufacturingYear: input.manufacturingYear }),
        ...(input.mileage !== undefined && { mileage: input.mileage }),
        ...(input.price !== undefined && { price: BigInt(input.price) }),
        ...(input.accidentCount !== undefined && { accidentCount: input.accidentCount }),
        ...(input.explanation !== undefined && { explanation: input.explanation }),
        ...(input.accidentDetails !== undefined && { accidentDetails: input.accidentDetails }),
        ...(input.status && { status: input.status as any }), 
      },
    });

    return toCarEntity(updated);
  } catch (error) {
    throw error;
  }
}

  async delete(companyId: number, carId: number): Promise<void> {
    await prisma.car.deleteMany({
      where: { id: Number(carId), companyId },
    });
  }
}