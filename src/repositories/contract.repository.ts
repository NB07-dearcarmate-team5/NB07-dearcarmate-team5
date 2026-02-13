import { CarStatus, Prisma } from '@prisma/client';
import prisma from '../prisma/prisma';
import {
  CreateContractType,
  UpdateContractDb,
} from '../structs/contract.struct';
import { contractResponseInclude } from '../models/contract.model';

export class ContractRepo {
  // 계약 존재 확인
  findContract = async (contractId: number) => {
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
    });
    return contract;
  };

  // 계약 생성
  createContract = async (
    userId: number,
    companyId: number,
    data: CreateContractType,
    price: bigint,
    tx: Prisma.TransactionClient,
  ) => {
    return await tx.contract.create({
      data: {
        contractPrice: price,
        company: {
          connect: { id: companyId }, // 컨트롤러에서 받아온 companyId 사용
        },
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

  // 계약 등록, 수정, 삭제시 car status 변경
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
  getContracts = async (
    companyId: number,
    searchBy?: string,
    keyword?: string,
  ) => {
    const where: Prisma.ContractWhereInput = {
      companyId: companyId,
    };
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

  // 계약 수정
  updateContract = async (
    tx: Prisma.TransactionClient,
    contractId: number,
    data: UpdateContractDb,
  ) => {
    const {
      meetings,
      contractDocuments,
      contractPrice,
      resolutionDate,
      ...scalarFields
    } = data;

    // undefined인 키값들을 완전히 제거한 순수 필드 객체 생성
    const cleanScalarFields = Object.fromEntries(
      Object.entries(scalarFields).filter(([_, v]) => v !== undefined),
    );

    return await tx.contract.update({
      where: { id: contractId },
      data: {
        ...cleanScalarFields, // undefined가 제거된 필드들만 주입
        // 값이 있을 때만 객체 생성
        ...(contractPrice !== undefined && { contractPrice }),
        ...(resolutionDate && { resolutionDate: new Date(resolutionDate) }),
        //미팅 및 알람 업데이트
        ...(meetings && {
          meetings: {
            deleteMany: {},
            create: meetings.map((m) => ({
              date: new Date(m.date),
              alarms: {
                create: m.alarms.map((alarmTime) => ({
                  alarmTime: new Date(alarmTime),
                })),
              },
            })),
          },
        }),
        //계약서류 업데이트
        ...(contractDocuments && {
          contractDocument: {
            set: [],
            connect: contractDocuments.map((doc) => ({ id: doc.id })),
          },
        }),
      } as Prisma.ContractUpdateInput, // 타입을 명시적으로 지정하여 추론 에러 방지
      include: contractResponseInclude,
    });
  };

  // 담당자 변경(유저 삭제 시)
  changeContractUser = async (
    userId: number,
    successorId: number,
    tx: Prisma.TransactionClient,
  ) => {
    await tx.contract.updateMany({
      where: { userId },
      data: { userId: successorId },
    });
  };

  // 특정 유저의 계약 수 조회
  async countByUserId(userId: number, tx: Prisma.TransactionClient) {
    return await tx.contract.count({
      where: { userId },
    });
  }

  // 계약 삭제
  deleteContract = async (tx: Prisma.TransactionClient, contractId: number) => {
    await tx.contract.delete({
      where: { id: contractId },
    });
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
