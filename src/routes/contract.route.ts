import express from 'express';
import {
  createContractController,
  getAvailableCars,
  getCustomers,
  getUsers,
} from '../controllers/contract.controller';
import { authenticateToken } from '../middlewares/authenticateToken';

const contractRouter = express.Router();

// 라우터를 거치기 전 토큰 인증을 먼저 진행, 로그인 확인
contractRouter.use(authenticateToken);

// 계약생성, 수정시 차량, 고객, 담당자 지정을 위한 조회 api
contractRouter.get('/cars', getAvailableCars);
contractRouter.get('/costomers', getCustomers);
contractRouter.get('/users', getUsers);

// 계약 CRUD
contractRouter.post('/', createContractController);
export default contractRouter;
