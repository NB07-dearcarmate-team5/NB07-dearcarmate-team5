import { Prisma } from '@prisma/client';

//user 목록 조회시 검색어 타입
export type UserWithCompany = Prisma.UserGetPayload<{
  include: { company: { select: { companyName: true } } };
}>;

export interface CompanyData {
  id: number;
  companyName: string;
  companyCode: string;
  userCount: number;
}

export interface AdminUserList {
  id: number;
  name: string;
  email: string;
  employeeNumber: string;
  phoneNumber: string;
  company: {
    companyName: string;
  };
}
