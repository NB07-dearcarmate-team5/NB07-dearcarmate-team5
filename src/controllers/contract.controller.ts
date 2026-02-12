import { Request, Response } from 'express';
import { ContractService } from '../services/contract.service';
import { create } from 'superstruct';
import { ValidateCompanyId, ValidateUserId } from '../structs/company.struct';
import {
  CreateContractStruct,
  SearchByContracts,
  UpdateContractData,
  ContractIdParam,
} from '../structs/contract.struct';

const getValidatedCompanyId = (req: Request) => {
  const { companyId } = create(req.user, ValidateCompanyId);
  return companyId;
};

export class ContractController {
  private contractService = new ContractService();

  // 계약 생성
  createContract = async (req: Request, res: Response) => {
    const { companyId } = create(req.user, ValidateCompanyId);
    const { userId } = create(req.user, ValidateUserId);
    const validated = create(req.body, CreateContractStruct);

    const contract = await this.contractService.createContract(
      userId,
      companyId,
      validated,
    );

    return res.status(201).json(contract);
  };

  // 계약 조회
  getContracts = async (req: Request, res: Response) => {
    const { companyId } = create(req.user, ValidateCompanyId);
    const validated = create(req.query, SearchByContracts);
    const contracts = await this.contractService.getContracts(
      validated,
      companyId,
    );

    return res.status(200).json(contracts);
  };

  //계약 수정
  updateContract = async (req: Request, res: Response) => {
    const { contractId } = create(req.params, ContractIdParam);
    const validated = create(req.body, UpdateContractData);
    const contract = await this.contractService.updateContract(
      contractId,
      validated,
    );

    return res.status(200).json(contract);
  };

  //계약 삭제
  deleteContract = async (req: Request, res: Response) => {
    const { contractId } = create(req.params, ContractIdParam);
    const message = await this.contractService.deleteContract(contractId);

    return res.status(200).json(message);
  };

  // 회사 소유 차량 조회
  getCars = async (req: Request, res: Response) => {
    const companyId = getValidatedCompanyId(req);
    const cars = await this.contractService.getCars(companyId);

    return res.status(200).json(cars);
  };

  // 회사 고객 조회
  getCustomers = async (req: Request, res: Response) => {
    const companyId = getValidatedCompanyId(req);
    const customers = await this.contractService.getCustomers(companyId);

    return res.status(200).json(customers);
  };

  // 회사 직원 조회
  getUsers = async (req: Request, res: Response) => {
    const companyId = getValidatedCompanyId(req);
    const users = await this.contractService.getUsers(companyId);

    return res.status(200).json(users);
  };
}
