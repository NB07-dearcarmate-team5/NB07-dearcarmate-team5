import { User as PrismaUser } from '@prisma/client';

export class User {
  id: number;
  email: string;
  name: string;
  employeeNumber: string;
  phoneNumber: string;
  imageUrl: String | null;
  isAdmin: boolean;
  company: {
    companyName: string;
  };

  constructor(data: PrismaUser) {
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
