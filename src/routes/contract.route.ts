import express from 'express';
import { ContractController } from '../controllers/contract.controller';
import { authenticateToken } from '../middlewares/authenticateToken';

const contractRouter = express.Router();
const contractController = new ContractController();

// 요청 라우터 전 로그인 했는지 확인
contractRouter.use(authenticateToken);

contractRouter.post('/', contractController.createContract);
contractRouter.get('/', contractController.getContracts);
contractRouter.get('/car', contractController.getCars);
contractRouter.get('/customers', contractController.getCustomers);
contractRouter.get('/users', contractController.getUsers);

export default contractRouter;
