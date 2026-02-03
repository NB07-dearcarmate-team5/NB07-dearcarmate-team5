import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticateToken } from '../middlewares/authenticateToken';
import { validate } from '../middlewares/validation';
import { UpdateUserStruct } from '../structs/user.struct';
import { AuthController } from '../controllers/auth.controller';
import { SignUpStruct } from '../structs/user.struct';

const router = Router();
const userController = new UserController();
const authController = new AuthController();

router.post('/',validate(SignUpStruct), authController.signUp);

router.use(authenticateToken);

router.get('/me', userController.getProfile);
router.patch('/me', validate(UpdateUserStruct), userController.updateProfile);
router.delete('/me', userController.deleteAccount);

export default router;