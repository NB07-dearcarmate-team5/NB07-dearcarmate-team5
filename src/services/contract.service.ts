import { ContractStatus } from '@prisma/client';
import { BadRequestError, NotFoundError } from '../errors/errors';
import {
  ContractListResponseDto,
  ContractResponseDto,
} from '../models/contract.model';
import prisma from '../prisma/prisma';
import { ContractRepo } from '../repositories/contract.repository';
import {
  CreateContractType,
  SearchOption,
  UpdateContract,
} from '../structs/contract.struct';

export class ContractService {
  private contractRepo = new ContractRepo();

  // 계약 존재 확인
  validateContract = async (contractId: number) => {
    const contract = await this.contractRepo.findContract(contractId);
    if (!contract) throw new NotFoundError('계약을 찾을 수 없습니다.');

    return contract;
  };

  // 계약 상태 변화를 확인하여 차량 상태 변경
  determineCarStatus = (contractStatus: ContractStatus) => {
    switch (contractStatus) {
      case 'contractSuccessful':
        return 'CONTRACT_COMPLETED';

      case 'contractFailed':
        return 'POSSESSION';

      default:
        return 'CONTRACT_PROCEEDING';
    }
  };

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

  // 계약 수정
  updateContract = async (contractId: number, params: UpdateContract) => {
    const contract = await this.validateContract(contractId);
    const carId = contract.carId;

    if (Object.keys(params).length === 0) {
      throw new BadRequestError('수정할 데이터가 최소 한개이상 있어야 합니다.');
    }
    // 데이터 구조 분해 할당 + price 빅인트 변환
    const updateData = {
      ...params,
      contractPrice: params.contractPrice
        ? BigInt(params.contractPrice)
        : undefined,
    };

    const update = await prisma.$transaction(async (tx) => {
      const updateContract = await this.contractRepo.updateContract(
        tx,
        contractId,
        updateData,
      );
      // car status 변경을 위해 업데이트된 계약의 status 확인
      const targetCarStatus = this.determineCarStatus(updateContract.status);
      // 변경된 계약 상태를 반영하여 차량 상태 업데이트
      await this.contractRepo.updateCarStatus(carId, targetCarStatus, tx);
      return updateContract;
    });

    return new ContractResponseDto(update);
  };

  // 계약 삭제
  deleteContract = async (contractId: number) => {
    const contract = await this.validateContract(contractId);
    const carId = contract.carId;

    await prisma.$transaction(async (tx) => {
      await this.contractRepo.deleteContract(tx, contractId);
      await this.contractRepo.updateCarStatus(carId, 'POSSESSION', tx);
    });

    return { message: '계약 삭제 완료' };
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
