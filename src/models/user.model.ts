import { Prisma } from '@prisma/client';

/**
 * User 모델에 Company 관계 데이터를 포함시킨 확장 타입
 * Prisma 조회 시 { include: { company: true } } 옵션을 사용할 때 대응됩니다.
 */
type UserWithCompany = Prisma.UserGetPayload<{
  include: { company: true };
}>;

export class User {
  id: number;
  email: string;
  name: string;
  employeeNumber: string;
  phoneNumber: string;
  imageUrl: string | null;
  isAdmin: boolean;
  company: {
    companyName: string;
  };

  constructor(data: UserWithCompany) {
    this.id = data.id;
    this.email = data.email;
    this.name = data.name;
    this.employeeNumber = data.employeeNumber;
    this.phoneNumber = data.phoneNumber;
    this.imageUrl = data.imageUrl;
    this.isAdmin = data.isAdmin;
    this.company = {
      companyName: data.company.companyName,
    };
  }
}
