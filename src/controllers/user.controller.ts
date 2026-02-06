import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';

export class UserController {
  private userService = new UserService();

  getProfile = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.userId;
    const user = await this.userService.getUserProfile(userId);
    return res.status(200).json({ success: true, data: user });
  };

  updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.userId;
    const updatedUser = await this.userService.updateUser(userId, req.body);
    return res.status(200).json({ success: true, data: updatedUser });
  };

  deleteAccount = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.userId;
    const result = await this.userService.deleteUser(userId);
    return res.status(200).json({ success: true, ...result });
  };
}