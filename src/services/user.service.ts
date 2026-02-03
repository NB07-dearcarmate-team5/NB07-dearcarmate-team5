import bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../models/user.model';
import { NotFoundError, UnauthorizedError } from '../errors/errors';
import { UpdateUserType } from '../structs/user.struct';

export class UserService {
  private userRepository = new UserRepository();

  async getUserProfile(userId: number) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError('존재하지 않는 사용자입니다.');
    }

    return new User(user);
  }

  async updateUser(userId: number, updateData: UpdateUserType) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('존재하지 않는 사용자입니다.');
    }

    const isPasswordValid = await bcrypt.compare(updateData.currentPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('비밀번호가 일치하지 않습니다.');
    }

    const dataToUpdate: Prisma.UserUpdateInput = {};

    if (updateData.imageUrl !== undefined) dataToUpdate.imageUrl = updateData.imageUrl;
    if (updateData.employeeNumber !== undefined) dataToUpdate.employeeNumber = updateData.employeeNumber;
    if (updateData.phoneNumber !== undefined) dataToUpdate.phoneNumber = updateData.phoneNumber;
    
    if (updateData.password !== undefined) {
      dataToUpdate.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedUser = await this.userRepository.update(userId, dataToUpdate);
    
    return new User(updatedUser);
  }

  async deleteUser(userId: number) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('존재하지 않는 사용자입니다.');
    }

    await this.userRepository.delete(userId);
    return { message: '유저 삭제 성공' };
  }
}