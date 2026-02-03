import prisma from '../prisma/prisma';
import { CreateContractInput } from '../structs/contract.sturuct';
import { ConstructDto } from '../models/construct.model';

// 계약 생성 전 검증을 위한 로직
export const findDataForContract = async (
  carId: number,
  customerId: number,
  userId: number,
) => {
  const [car, customer, user] = await Promise.all([
    prisma.car.findUnique({ where: { id: carId } }),
    prisma.customer.findUnique({ where: { id: customerId } }),
    prisma.user.findUnique({ where: { id: userId } }),
  ]);

  return { car, customer, user };
};

export const createContractRepo = async (
  carId: number,
  customerId: number,
  userId: number,
  meetings: CreateContractInput['meetings'],
  contractPrice: bigint,
) => {
  const construct = await prisma.contract.create({
    data: {
      contractPrice,
      // 1. carId: carId 대신 아래처럼 connect를 사용하세요.
      car: { connect: { id: carId } },
      customer: { connect: { id: customerId } },
      user: { connect: { id: userId } },

      // 2. 관계형 중첩 생성
      meetings: {
        create: meetings.map((m) => ({
          date: new Date(m.date),
          alrams: {
            // 스키마의 alrams(오타 반영)
            create: m.alrams.map((at) => ({
              alarmTime: new Date(at),
            })),
          },
        })),
      },
    },
    include: {
      user: { select: { id: true, name: true } },
      customer: { select: { id: true, name: true } },
      car: { select: { id: true, model: true } },
      meetings: {
        include: { alrams: true },
      },
    },
  });

  return new ConstructDto(construct);
};

export const availableCarsRepo = async (search?: string) => {
  const cars = await prisma.car.findMany({
    where: {
      status: 'POSSESSION',
      ...(search && { model: { contains: search, mode: 'insensitive' } }),
    },
    select: { id: true, model: true, carNumber: true },
  });

  return cars.map((car) => ({
    id: car.id,
    data: `${car.model}(${car.carNumber})`,
  }));
};

export const getCustomersRepo = async (search?: string) => {
  const customers = await prisma.customer.findMany({
    where: {
      ...(search && { name: { contains: search, mode: 'insensitive' } }),
    },
    select: { id: true, name: true, email: true },
  });

  return customers.map((customer) => ({
    id: customer.id,
    data: `${customer.name}(${customer.email})`,
  }));
};

export const getUsersRepo = async (search?: string) => {
  const users = await prisma.user.findMany({
    where: {
      ...(search && { name: { contains: search, mode: 'insensitive' } }),
    },
    select: { id: true, name: true, email: true },
  });

  return users.map((user) => ({
    id: user.id,
    data: `${user.name}(${user.email})`,
  }));
};
