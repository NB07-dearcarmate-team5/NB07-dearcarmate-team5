import { Request, Response } from 'express';
import { create } from 'superstruct';
import {
  ValideCompanyId,
  newCompany,
  SearchByCompany,
  SearchByUsers,
  UpdateField,
} from '../structs/company.struct';
import {
  createCompanyService,
  findCompaniesService,
  getCompanyUsersService,
  updateCompanyService,
  deleteCompanyService,
} from '../services/company.service';

// 생성
export const createCompany = async (req: Request, res: Response) => {
  const { companyName, companyCode } = create(req.body, newCompany);

  const company = await createCompanyService(companyName, companyCode);

  res.status(201).json(company);
};

// 조회
export const findCompanies = async (req: Request, res: Response) => {
  const validated = create(req.query, SearchByCompany);

  const companies = await findCompaniesService(validated);

  res.status(200).json(companies);
};

// 회사별 유저 조회
export const getCompanyUsers = async (req: Request, res: Response) => {
  const validated = create(req.query, SearchByUsers);

  const users = await getCompanyUsersService(validated);

  res.status(200).json(users);
};

// 회사 수정
export const updateCompany = async (req: Request, res: Response) => {
  const validated = create(req.body, UpdateField);
  const { companyId } = create(req.params, ValideCompanyId);

  const updateCompany = await updateCompanyService(validated, companyId);

  res.status(200).json(updateCompany);
};

// 회사 삭제
export const deleteCompany = async (req: Request, res: Response) => {
  const { companyId } = create(req.params, ValideCompanyId);

  await deleteCompanyService(companyId);

  res.status(200).json({ message: '회사 삭제 성공' });
};
