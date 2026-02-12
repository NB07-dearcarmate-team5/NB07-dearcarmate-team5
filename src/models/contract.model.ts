import { Prisma, ContractStatus } from '@prisma/client';

// 리포지토리에서 사용하는 include 구조를 정의
export const contractResponseInclude = {
  user: { select: { id: true, name: true } },
  customer: { select: { id: true, name: true } },
  car: { select: { id: true, model: true } },
  meetings: { include: { alarms: true } },
} satisfies Prisma.ContractInclude;

// 위 include 구조가 반영된 Contract 타입을 추출
export type ContractWithRelations = Prisma.ContractGetPayload<{
  include: typeof contractResponseInclude;
}>;

// 데이터 반환
export class ContractResponseDto {
  id: number;
  status: ContractStatus;
  resolutionDate: Date | null;
  contractPrice: number;
  meetings: {
    date: Date;
    alarms: string[];
  }[];
  user: { id: number; name: string } | null;
  customer: { id: number; name: string };
  car: { id: number; model: string };

  constructor(contract: ContractWithRelations) {
    this.id = contract.id;
    this.status = contract.status;
    this.resolutionDate = contract.resolutionDate;
    this.contractPrice = Number(contract.contractPrice);

    this.meetings = contract.meetings.map((m) => ({
      date: m.date,
      alarms: m.alarms.map((a) => a.alarmTime.toISOString()), // 명세서 규격
    }));

    this.user = contract.user
      ? { id: contract.user.id, name: contract.user.name }
      : null;
    this.customer = contract.customer;
    this.car = { id: contract.car.id, model: contract.car.model };
  }
}

export type GroupedContracts = {
  [key in ContractStatus]?: {
    totalItemCount: number;
    data: ContractResponseDto[];
  };
};

export class ContractListResponseDto {
  results: GroupedContracts;

  constructor(contracts: ContractWithRelations[]) {
    this.results = this.groupByStatus(contracts);
  }

  private groupByStatus(contracts: ContractWithRelations[]): GroupedContracts {
    const initialGroups: GroupedContracts = {
      carInspection: { totalItemCount: 0, data: [] },
      priceNegotiation: { totalItemCount: 0, data: [] },
      contractDraft: { totalItemCount: 0, data: [] },
      contractSuccessful: { totalItemCount: 0, data: [] },
      contractFailed: { totalItemCount: 0, data: [] },
    };

    return contracts.reduce((acc: GroupedContracts, contract) => {
      const status = contract.status;

      if (!acc[status]) {
        acc[status] = {
          totalItemCount: 0,
          data: [],
        };
      }
      acc[status]!.data.push(new ContractResponseDto(contract));
      acc[status]!.totalItemCount++;

      return acc;
    }, initialGroups);
  }
}
