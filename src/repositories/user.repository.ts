import { Prisma } from '@prisma/client';
import { prismaClient as prisma } from '../prisma/prismaClient';

export class UserRepository {
  async findById(userId: number) {
    return await prisma.user.findUnique({
      where: { id: userId },
      include: { company: true }, 
    });
  }

  async update(userId: number, updateData: Prisma.UserUpdateInput) {
    return await prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: { company: true },
    });
  }

  async delete(userId: number) {
    return await prisma.user.delete({
      where: { id: userId },
    });
  }
}