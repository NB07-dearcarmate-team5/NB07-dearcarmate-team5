import { CompanyData, UserWithCompany } from '../types/company';
import { Prisma } from '@prisma/client';

type CompanyWithCount = Prisma.CompanyGetPayload<{
  include: { _count: { select: { users: true } } };
}>;

export class CompanyResponseDto {
  id: number;
  companyName: string;
  companyCode: string;
  userCount: number;

  constructor(data: CompanyWithCount) {
    this.id = data.id;
    this.companyName = data.companyName;
    this.companyCode = data.companyCode;
    // Prisma의 _count 객체를 명세서의 userCount 필드로 변환
    this.userCount = data._count?.users ?? 0;
  }
}

// 회사 목록 조회
export class CompanyListResponseDto {
  currentPage: number; // 가공전 database에서 데이터를 가져온 상태
  totalPages: number;
  totalItemCount: number;
  data: CompanyData[];

  constructor(
    companies: CompanyWithCount[],
    totalCount: number,
    page: number,
    pageSize: number,
  ) {
    this.currentPage = page;
    this.totalItemCount = totalCount;
    this.totalPages = Math.ceil(totalCount / pageSize);

    this.data = companies.map((c) => ({
      id: c.id,
      companyName: c.companyName,
      companyCode: c.companyCode,
      userCount: c._count?.users ?? 0,
    }));
  }
}

// 개별 유저 항목 (회사 정보 중첩)
export class AdminUserListItemDto {
  id: number;
  name: string;
  email: string;
  employeeNumber: string;
  phoneNumber: string;
  company: {
    companyName: string;
  };

  constructor(user: UserWithCompany) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.employeeNumber = user.employeeNumber;
    this.phoneNumber = user.phoneNumber;
    // 명세서 규격: company 객체 안에 companyName
    this.company = {
      companyName: user.company.companyName,
    };
  }
}

// 전체 응답 구조 (어드민 유저목록 조회)
export class AdminUserListResponseDto {
  currentPage: number;
  totalPages: number;
  totalItemCount: number;
  data: AdminUserListItemDto[];

  constructor(
    users: UserWithCompany[],
    totalCount: number,
    page: number,
    pageSize: number,
  ) {
    this.currentPage = page;
    this.totalPages = Math.ceil(totalCount / pageSize);
    this.totalItemCount = totalCount;
    // Prisma 유저 배열을 개별 DTO 배열로 변환
    this.data = users.map((user) => new AdminUserListItemDto(user));
  }
}

// 회사 수정 데이터
export class UpdateCompanyDto {
  id: number;
  companyName: string;
  companyCode: string;
  userCount: number;

  constructor(prismaData: any) {
    this.id = prismaData.id;
    this.companyName = prismaData.companyName;
    this.companyCode = prismaData.companyCode;
    // 조회시 유저수 카운팅 부분 변경
    this.userCount = prismaData._count?.users ?? 0;
  }
}
