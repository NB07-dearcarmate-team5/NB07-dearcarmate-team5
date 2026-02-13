import bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../models/user.model';
import {
  NotFoundError,
  UnauthorizedError,
  ConflictError,
  BadRequestError,
} from '../errors/errors';
import { UpdateUserType } from '../structs/user.struct';
import { ContractRepo } from '../repositories/contract.repository';
import fs from 'fs';
import path from 'path';
import prisma from '../prisma/prisma';

export class UserService {
  private userRepository = new UserRepository();
  private contractRepo = new ContractRepo();
  private async isUser(userId: number) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('존재하지 않는 사용자입니다.');
    }

    return user;
  }
  private deleteProfileImageFile(imageUrl: string) {
    try {
      const filename = imageUrl.split('/uploads/').pop();

      if (filename) {
        const filePath = path.join(process.cwd(), 'uploads', filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    } catch (error) {
      console.error('기존 프로필 이미지 삭제 실패:', error);
    }
  }

  async getUserProfile(userId: number) {
    const user = await this.isUser(userId);

    return new User(user);
  }

  async updateUser(userId: number, updateData: UpdateUserType) {
    const user = await this.isUser(userId);

    const isPasswordValid = await bcrypt.compare(
      updateData.currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedError('비밀번호가 일치하지 않습니다.');
    }

    const dataToUpdate: Prisma.UserUpdateInput = {};

    if (updateData.imageUrl !== undefined) {
      if (user.imageUrl && user.imageUrl !== updateData.imageUrl) {
        this.deleteProfileImageFile(user.imageUrl);
      }
      dataToUpdate.imageUrl = updateData.imageUrl;
    }
    if (
      updateData.employeeNumber !== undefined &&
      updateData.employeeNumber !== user.employeeNumber
    ) {
      const existingUser = await this.userRepository.findByEmployeeNumber(
        updateData.employeeNumber,
      );
      if (existingUser) {
        throw new ConflictError('이미 등록된 사원 번호입니다.');
      }
      dataToUpdate.employeeNumber = updateData.employeeNumber;
    }
    if (updateData.phoneNumber !== undefined)
      dataToUpdate.phoneNumber = updateData.phoneNumber;

    if (updateData.password !== undefined) {
      dataToUpdate.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedUser = await this.userRepository.update(userId, dataToUpdate);

    return new User(updatedUser);
  }

  async deleteUser(userId: number) {
    const user = await this.isUser(userId);

    if (user.imageUrl) {
      this.deleteProfileImageFile(user.imageUrl);
    }
    // 트랜잭션 시작
    await prisma.$transaction(async (tx) => {
      // 후임자 찾기
      const successor = await this.userRepository.findSuccessor(
        userId,
        user.companyId,
        tx,
      );
      // 후임자가 있으면 계약 이관, 없으면 계약 존재 여부 확인 후 삭제
      if (successor) {
        await this.contractRepo.changeContractUser(userId, successor.id, tx);
      } else {
        const contractCount = await this.contractRepo.countByUserId(userId, tx);
        if (contractCount > 0) {
          throw new BadRequestError(
            '해당 유저의 계약이 존재하여 삭제할 수 없습니다.',
          );
        }
      }
      await this.userRepository.deleteUser(userId, tx);
    });
    return { message: '유저 삭제 성공' };
  }

  async deleteUserByAdmin(targetUserId: number) {
    const targetUser = await this.userRepository.findById(targetUserId);

    if (!targetUser) {
      throw new NotFoundError('존재하지 않는 사용자입니다.');
    }

    if (targetUser.imageUrl) {
      this.deleteProfileImageFile(targetUser.imageUrl);
    }

    await this.userRepository.delete(targetUserId);
    return { message: '유저 삭제 성공' };
  }
}
