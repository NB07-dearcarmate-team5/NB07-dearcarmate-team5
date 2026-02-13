/**
 * 계약서 문서 리포지토리 - DB 접근 계층
 * @author 김민기
 */

import prisma from '../prisma/prisma';
import { Prisma } from '@prisma/client';
import {
  DraftContractResponseDto,
  ContractListItem,
  ContractListQuery,
} from '../types/contractDocument.type';

export class ContractDocumentRepository {
  async findContracts(
    query: ContractListQuery,
    companyId: number
  ): Promise<{ data: ContractListItem[]; total: number }> {
    const { page = 1, pageSize = 10, searchBy, keyword } = query;

    const where: Prisma.ContractWhereInput = {
      user: { companyId },
    };

    if (keyword && searchBy) {
      if (searchBy === 'contractName') {
        where.car = { model: { contains: keyword, mode: 'insensitive' } };
      } else if (searchBy === 'userName') {
        where.user = { companyId, name: { contains: keyword, mode: 'insensitive' } };
      }
    }

    const [contracts, total] = await Promise.all([
      prisma.contract.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { created_at: 'desc' },
        include: {
          car: { select: { model: true, carNumber: true } },
          customer: { select: { name: true } },
          user: { select: { name: true } },
          contractDocument: { select: { id: true, fileName: true } },
        },
      }),
      prisma.contract.count({ where }),
    ]);

    const data: ContractListItem[] = contracts.map((contract) => ({
      id: contract.id,
      contractName: `${contract.car.model} - ${contract.customer.name}`,
      resolutionDate: contract.resolutionDate
        ? contract.resolutionDate.toISOString()
        : '',
      documentCount: contract.contractDocument.length,
      userName: contract.user.name,
      carNumber: contract.car.carNumber,
      documents: contract.contractDocument.map((doc: { id: number; fileName: string }) => ({
        id: doc.id,
        fileName: doc.fileName,
      })),
    }));

    return { data, total };
  }

  async findDraftContracts(companyId: number): Promise<DraftContractResponseDto[]> {
    const contracts = await prisma.contract.findMany({
      where: { user: { companyId } },
      include: {
        car: { select: { model: true } },
        customer: { select: { name: true } },
      },
      orderBy: { created_at: 'desc' },
    });

    return contracts.map((contract) => ({
      id: contract.id,
      data: `${contract.car.model} - ${contract.customer.name} 고객님`,
    }));
  }

  async create(data: {
    contractId: number;
    fileName: string;
    fileKey: string;
    fileSize: number;
    mimeType: string;
  }) {
    return prisma.contractDocument.create({ data });
  }

  async findById(id: number) {
    return prisma.contractDocument.findUnique({
      where: { id },
      include: {
        contract: {
          include: {
            car: { select: { model: true } },
            customer: { select: { name: true, email: true } },
          },
        },
      },
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.contractDocument.delete({ where: { id } });
  }

  async deleteByIds(ids: number[]): Promise<void> {
    await prisma.contractDocument.deleteMany({
      where: { id: { in: ids } },
    });
  }

  async findByIds(ids: number[]) {
    return prisma.contractDocument.findMany({
      where: { id: { in: ids } },
    });
  }
}
