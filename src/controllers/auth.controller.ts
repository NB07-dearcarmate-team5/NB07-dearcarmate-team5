import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  private authService = new AuthService();

  signUp = async (req: Request, res: Response, next: NextFunction) => {
    const result = await this.authService.signUp(req.body);
    return res.status(201).json(result);
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const tokens = await this.authService.login(email, password);
    return res.status(200).json(tokens);
  };

  refresh = async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body;
    const tokens = await this.authService.refreshTokens(refreshToken);
    return res.status(200).json(tokens);
  };
}