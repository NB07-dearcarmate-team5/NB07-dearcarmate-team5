import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { UserIdParamStruct } from '../structs/user.struct';
import { UnauthorizedError } from '../errors/errors';
import { create } from 'superstruct';

export class UserController {
  private userService = new UserService();

  getProfile = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.userId;
    const user = await this.userService.getUserProfile(userId);
    return res.status(200).json(user);
  };

  updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.userId;
    const updatedUser = await this.userService.updateUser(userId, req.body);
    return res.status(200).json(updatedUser);
  };

  deleteAccount = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.userId;
    const result = await this.userService.deleteUser(userId);
    return res.status(200).json(result);
  };

  deleteUserByAdmin = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.isAdmin) {
      throw new UnauthorizedError('관리자 권한이 필요합니다.');
    }

    const { userId } = create(req.params, UserIdParamStruct);
    const result = await this.userService.deleteUserByAdmin(userId);
    res.status(200).json(result);
  };
}