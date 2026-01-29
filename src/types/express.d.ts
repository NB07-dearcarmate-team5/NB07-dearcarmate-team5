import { User } from '../models/user.model';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        companyId: number;
      };
    }
  }
}

export {};