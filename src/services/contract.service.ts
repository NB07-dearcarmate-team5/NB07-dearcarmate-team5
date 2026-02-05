import { BadRequestError, NotFoundError } from '../errors/errors';
import {
  ContractListResponseDto,
  ContractResponseDto,
} from '../models/contract.model';
import prisma from '../prisma/prisma';
import { ContractRepo } from '../repositories/contract.repository';
import { CreateContractType, SearchOption } from '../structs/contract.struct';

export class ContractService {
  private contractRepo = new ContractRepo();

  // 계약 등록
  createContract = async (userId: number, data: CreateContractType) => {
    const car = await this.contractRepo.targetCar(data.carId);
    if (!car) throw new NotFoundError('해당 차량을 찾을 수 없습니다.');
    if (car.status !== 'POSSESSION') {
      throw new BadRequestError('현재 계약 가능한 차량이 아닙니다.');
    }

    //트랜잭션을 이용하여 계약 등록 및 차량 상태 변경 한번에 진행
    return await prisma.$transaction(async (tx) => {
      const contract = await this.contractRepo.createContract(
        userId,
        data,
        car.price,
        tx,
      );
      // 차량 status 변경
      await this.contractRepo.updateCarStatus(
        data.carId,
        'CONTRACT_PROCEEDING',
        tx,
      );
      return new ContractResponseDto(contract);
    });
  };

  // 계약 조회
  getContracts = async (searchData: SearchOption) => {
    const { searchBy, keyword } = searchData;
    const contracts = await this.contractRepo.getContracts(searchBy, keyword);

    const response = new ContractListResponseDto(contracts);

    return response.results;
  };

  // 회사 소유의 차량 조회(계약 등록, 수정시 사용)
  getCars = async (companyId: number) => {
    const cars = await this.contractRepo.getCars(companyId);

    return cars.map((c) => ({
      id: c.id,
      data: `${c.model}(${c.carNumber})`,
    }));
  };

  // 회사가 등록한 고객 목록(계약 등록시 사용)
  getCustomers = async (companyId: number) => {
    const customers = await this.contractRepo.getCustomers(companyId);

    return customers.map((c) => ({
      id: c.id,
      data: `${c.name}(${c.email})`,
    }));
  };

  // 회사 직원 조회(계약 수정시 사용)
  getUsers = async (companyId: number) => {
    const users = await this.contractRepo.getUsers(companyId);

    return users.map((u) => ({
      id: u.id,
      data: `${u.name}(${u.email})`,
    }));
  };
}
