import { Request, Response } from 'express';
import { create } from 'superstruct';
import {
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
} from '../services/company.service';

// 생성
export const createCompany = async (req: Request, res: Response) => {
  const { companyName, companyCode } = create(req.body, newCompany);

  const company = await createCompanyService(companyName, companyCode);

  res.status(201).json({ data: company });
};

// 조회
export const findCompanies = async (req: Request, res: Response) => {
  const validated = create(req.body, SearchByCompany);

  const companies = await findCompaniesService(validated);

  res.status(200).json({ message: '기업 목록 조회 성공', data: companies });
};

// 회사별 유저 조회
export const getCompanyUsers = async (req: Request, res: Response) => {
  const validated = create(req.body, SearchByUsers);

  const users = await getCompanyUsersService(validated);

  res.status(200).json({ message: '유저 목록 조회 성공', data: users });
};

// 회사 수정
export const updateCompany = async (req: Request, res: Response) => {
  const validated = create(req.body, UpdateField);

  const updateCompany = await updateCompanyService(validated);

  res.status(200).json({ data: updateCompany });
};
