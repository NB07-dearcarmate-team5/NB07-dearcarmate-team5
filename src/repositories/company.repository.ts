import prisma from '../prisma/prisma';
import { Prisma } from '@prisma/client';

export const findCompany = async (companyId: number) => {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });

  return company;
};

// 기업코드 중복 확인용
export const findCompanyByCode = async (
  companyCode: string,
  companyId?: number,
) => {
  const company = await prisma.company.findFirst({
    where: {
      companyCode,
      ...(companyId && { id: { not: companyId } }),
    },
  });

  return company;
};

// 회사 등록
export const createCompanyRepo = async (
  companyName: string,
  companyCode: string,
) => {
  const company = await prisma.company.create({
    data: {
      companyName,
      companyCode,
    },
    include: { _count: { select: { users: true } } },
  });

  return company;
};

// 회사 목록 조회
export const findCompaniesRepo = async (
  skip: number,
  pageSize: number,
  searchBy?: string,
  keyword?: string,
) => {
  const where =
    searchBy && keyword
      ? { [searchBy]: { contains: keyword, mode: 'insensitive' } }
      : {};

  const [companies, totalCount] = await Promise.all([
    prisma.company.findMany({
      skip,
      take: pageSize,
      where,
      include: { _count: { select: { users: true } } },
      orderBy: { id: 'desc' },
    }),
    prisma.company.count({ where }),
  ]);

  return { companies, totalCount };
};

// 유저 목록 조회
export const getCompanyUsersRepo = async (
  skip: number,
  pageSize: number,
  searchBy?: string,
  keyword?: string,
) => {
  const where = buildUserSearchWhere(searchBy, keyword);

  const [users, totalCount] = await Promise.all([
    prisma.user.findMany({
      where,
      include: { company: true },
      skip,
      take: pageSize,
      // 정렬 기준 1순위 회사명 가나다 순, 2순위 생성 일자 내림차순
      orderBy: [{ company: { companyName: 'asc' } }, { created_at: 'desc' }],
    }),
    prisma.user.count({ where }),
  ]);

  return { users, totalCount };
};

// 유저 목록 조회 검색어 필터링
const buildUserSearchWhere = (
  searchBy?: string,
  keyword?: string,
): Prisma.UserWhereInput => {
  if (!keyword) return {};

  switch (searchBy) {
    case 'companyName':
      return {
        company: {
          companyName: { contains: keyword, mode: 'insensitive' }, // 회사명 포함 검색
        },
      };
    case 'name':
      return { name: { contains: keyword, mode: 'insensitive' } };
    case 'email':
      return { email: { contains: keyword, mode: 'insensitive' } };
    default:
      // searchBy가 없을 경우 통합 검색 (OR 조건)
      return {
        OR: [
          { name: { contains: keyword, mode: 'insensitive' } },
          { email: { contains: keyword, mode: 'insensitive' } },
          {
            company: {
              companyName: { contains: keyword, mode: 'insensitive' },
            },
          },
        ],
      };
  }
};

export const updateCompanyRepo = async (
  companyId: number,
  companyName?: string,
  companyCode?: string,
) => {
  const updateCompany = await prisma.company.update({
    where: { id: companyId },
    data: {
      ...(companyName !== undefined && { companyName }),
      ...(companyCode !== undefined && { companyCode }),
    },
    select: {
      id: true,
      companyName: true,
      companyCode: true,
      _count: {
        select: { users: true }, // 명세서의 userCount를 위해 사용
      },
    },
  });

  return updateCompany;
};

export const deleteCompanyRepo = async (companyId: number) => {
  await prisma.company.delete({
    where: { id: companyId },
  });
};
