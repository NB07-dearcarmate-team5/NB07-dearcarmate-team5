import { User as PrismaUser } from '@prisma/client';

export class User {
  id: number;
  email: string;
  name: string;
  employeeId: string | null;
  contact: string | null;
  companyId: number;

  constructor(data: PrismaUser) {
    this.id = data.id;
    this.email = data.email;
    this.name = data.name;
    this.employeeId = data.employeeId;
    this.contact = data.contact;
    this.companyId = data.companyId;
  }
}