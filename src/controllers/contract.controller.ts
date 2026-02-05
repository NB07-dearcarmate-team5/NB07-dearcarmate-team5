import { Request, Response } from 'express';
import { ContractService } from '../services/contract.service';
import { create } from 'superstruct';
import { UserAndCompanyParams } from '../structs/company.struct';
import {
  CreateContractStruct,
  SearchByContracts,
} from '../structs/contract.struct';

const getValidatedCompanyId = (req: Request): number => {
  const { companyId } = create(req.user, UserAndCompanyParams);
  return companyId;
};

export class ContractController {
  private contractService = new ContractService();

  // 계약 생성
  createContract = async (req: Request, res: Response) => {
    const { userId } = create(req.body, UserAndCompanyParams);
    const validated = create(req.body, CreateContractStruct);

    const contract = await this.contractService.createContract(
      userId,
      validated,
    );

    return res.status(201).json(contract);
  };

  // 계약 조회
  getContracts = async (req: Request, res: Response) => {
    const validated = create(req.query, SearchByContracts);
    const contracts = await this.contractService.getContracts(validated);

    return res.status(200).json(contracts);
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
