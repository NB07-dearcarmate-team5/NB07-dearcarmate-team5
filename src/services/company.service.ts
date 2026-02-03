import { ConflictError, NotFoundError } from '../errors/errors';
import {
  AdminUserListResponseDto,
  CompanyListResponseDto,
  CompanyResponseDto,
} from '../models/company.model';
import {
  createCompanyRepo,
  findCompanyByCode,
  findCompaniesRepo,
  getCompanyUsersRepo,
  findCompany,
  updateCompanyRepo,
  deleteCompanyRepo,
} from '../repositories/company.repository';
import {
  SearchByCompanyType,
  SearchByUsersType,
  UpdateFieldType,
} from '../structs/company.struct';

const validateCompanyExists = async (companyId: number) => {
  const company = await findCompany(companyId);
  if (!company) throw new NotFoundError('회사 정보가 없습니다.');
};

// 회사 등록
export const createCompanyService = async (
  companyName: string,
  companyCode: string,
) => {
  const existingCompany = await findCompanyByCode(companyCode);
  if (existingCompany) {
    throw new ConflictError('이미 등록된 기업코드 입니다.');
  }

  const company = await createCompanyRepo(companyName, companyCode);

  return new CompanyResponseDto(company);
};

// 회사 목록 조회
export const findCompaniesService = async (params: SearchByCompanyType) => {
  const { page, pageSize, searchBy, keyword } = params;
  const skip = (page - 1) * pageSize;

  const { companies, totalCount } = await findCompaniesRepo(
    skip,
    pageSize,
    searchBy,
    keyword,
  );

  return new CompanyListResponseDto(companies, totalCount, page, pageSize);
};

// 유저 목록 조회
export const getCompanyUsersService = async (params: SearchByUsersType) => {
  const { page, pageSize, searchBy, keyword } = params;
  const skip = (page - 1) * pageSize;

  const { users, totalCount } = await getCompanyUsersRepo(
    skip,
    pageSize,
    searchBy,
    keyword,
  );

  return new AdminUserListResponseDto(users, totalCount, page, pageSize);
};

export const updateCompanyService = async (
  params: UpdateFieldType,
  companyId: number,
) => {
  const { companyName, companyCode } = params;

  await validateCompanyExists(companyId); // 회사 존재 여부 검사

  const updateCompany = await updateCompanyRepo(
    companyId,
    companyName,
    companyCode,
  );

  return updateCompany;
};

export const deleteCompanyService = async (companyId: number) => {
  await validateCompanyExists(companyId);
  await deleteCompanyRepo(companyId);
};
