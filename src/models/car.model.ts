import { Car as PrismaCar, CarStatus as PrismaCarStatus } from '@prisma/client';
import type { Car, CarStatus } from '../types/car.type';

export class CarModel {
  static toApiStatus(status: PrismaCarStatus): CarStatus {
    const map: Record<PrismaCarStatus, CarStatus> = {
      [PrismaCarStatus.POSSESSION]: 'possession',
      [PrismaCarStatus.CONTRACT_PROCEEDING]: 'contractProceeding',
      [PrismaCarStatus.CONTRACT_COMPLETED]: 'contractCompleted',
    };
    return map[status];
  }

  static toPrismaStatus(status: CarStatus): PrismaCarStatus {
    const map: Record<CarStatus, PrismaCarStatus> = {
      possession: PrismaCarStatus.POSSESSION,
      contractProceeding: PrismaCarStatus.CONTRACT_PROCEEDING,
      contractCompleted: PrismaCarStatus.CONTRACT_COMPLETED,
    };
    return map[status];
  }

  static bigintToNumberSafe(value: bigint, field: string): number {
    if (value > BigInt(Number.MAX_SAFE_INTEGER) || value < BigInt(Number.MIN_SAFE_INTEGER)) {
      throw new Error(`${field} 값이 안전 정수 범위를 초과했습니다.`);
    }
    return Number(value);
  }

  static toEntity(car: PrismaCar): Car {
    return {
      id: car.id,
      companyId: car.companyId,
      carNumber: car.carNumber,
      manufacturer: car.manufacturer,
      model: car.model,
      type: car.type as Car['type'],
      manufacturingYear: car.manufacturingYear,
      mileage: car.mileage,
      price: this.bigintToNumberSafe(car.price, 'price'),
      accidentCount: car.accidentCount,
      explanation: car.explanation ?? null,
      accidentDetails: car.accidentDetails ?? null,
      status: this.toApiStatus(car.status),
    };
  }
}