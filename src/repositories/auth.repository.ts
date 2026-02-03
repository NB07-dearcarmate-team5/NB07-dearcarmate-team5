import { Prisma } from '@prisma/client';
import { prismaClient as prisma } from '../prisma/prismaClient';

export class AuthRepository {
  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async findByEmployeeNumber(employeeNumber: string) {
    return await prisma.user.findUnique({
      where: { employeeNumber },
    });
  }

  async findById(id: number) {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  async findCompanyByName(companyName: string) {
    return await prisma.company.findFirst({
      where: { companyName },
    });
  }

  async createUser(data: Prisma.UserCreateInput) {
    return await prisma.user.create({
      data,
      include: { company: true },
    });
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    return await prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }
}