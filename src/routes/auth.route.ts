import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middleware/validation';
import { LoginStruct } from '../structs/user.struct';

const router = Router();
const authController = new AuthController();

router.post('/login', validate(LoginStruct), authController.login);
router.post('/refresh', authController.refresh);

export default router;