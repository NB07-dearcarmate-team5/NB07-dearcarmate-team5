import { CarStatus, Prisma } from '@prisma/client';
import prisma from '../prisma/prisma';
import { CreateContractType } from '../structs/contract.struct';
import { contractResponseInclude } from '../models/contract.model';

export class ContractRepo {
  createContract = async (
    userId: number,
    data: CreateContractType,
    price: bigint,
    tx: Prisma.TransactionClient,
  ) => {
    return await tx.contract.create({
      data: {
        contractPrice: price,
        user: { connect: { id: userId } },
        car: { connect: { id: data.carId } },
        customer: { connect: { id: data.customerId } },
        meetings: {
          create: data.meetings.map((m) => ({
            date: new Date(m.date),
            alarms: {
              create: m.alarms.map((a: string) => ({ alarmTime: new Date(a) })),
            },
          })),
        },
      },
      // 응답 명세서에 필요한 데이터 포함
      include: contractResponseInclude,
    });
  };

  // 계약 등록시 차량 상태 없데이트
  updateCarStatus = async (
    carId: number,
    status: CarStatus,
    tx: Prisma.TransactionClient,
  ) => {
    return await tx.car.update({
      where: { id: carId },
      data: { status },
    });
  };

  // 계약 조회
  getContracts = async (searchBy?: string, keyword?: string) => {
    const where: Prisma.ContractWhereInput = {};

    // 검색 조건 처리
    if (searchBy && keyword) {
      if (searchBy === 'customerName') {
        where.customer = { name: { contains: keyword, mode: 'insensitive' } };
      } else if (searchBy === 'userName') {
        where.user = { name: { contains: keyword, mode: 'insensitive' } };
      }
    }

    const contracts = await prisma.contract.findMany({
      where,
      include: contractResponseInclude,
      orderBy: { created_at: 'desc' },
    });

    return contracts;
  };

  // 회사가 보유중인 차량(계약되지 않은 차량)
  getCars = async (companyId: number) => {
    const cars = await prisma.car.findMany({
      where: { companyId, status: 'POSSESSION' },
      select: { id: true, model: true, carNumber: true },
    });

    return cars;
  };

  //회사가 등록한 고객목록
  getCustomers = async (companyId: number) => {
    const customers = await prisma.customer.findMany({
      where: { companyId },
      select: { id: true, name: true, email: true },
    });

    return customers;
  };

  // 회사의 사원목록
  getUsers = async (companyId: number) => {
    const users = await prisma.user.findMany({
      where: { companyId },
      select: { id: true, name: true, email: true },
    });

    return users;
  };

  targetCar = async (carId: number) => {
    const car = await prisma.car.findUnique({
      where: { id: carId },
    });
    return car;
  };
}
