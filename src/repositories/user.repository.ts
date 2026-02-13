import { Prisma } from '@prisma/client';
import prisma from '../prisma/prisma';

export class UserRepository {
  async findById(userId: number) {
    return await prisma.user.findUnique({
      where: { id: userId },
      include: { company: true },
    });
  }

  async findByEmployeeNumber(employeeNumber: string) {
    return await prisma.user.findUnique({
      where: { employeeNumber },
    });
  }

  async update(userId: number, updateData: Prisma.UserUpdateInput) {
    return await prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: { company: true },
    });
  }

  async delete(userId: number, tx: Prisma.TransactionClient) {
    return await tx.user.delete({
      where: { id: userId },
    });
  }

  async findSuccessor(
    userId: number,
    companyId: number,
    tx: Prisma.TransactionClient,
  ) {
    return await tx.user.findFirst({
      where: { companyId, id: { not: userId } },
      orderBy: { id: 'asc' },
    });
  }
}
