import { Request, Response } from 'express';
import {
  availableCarsService,
  getCustomersService,
  getUsersService,
  createContractService,
} from '../services/contract.service';
import { CreateContract, SearchQuery } from '../structs/contract.sturuct';
import { create } from 'superstruct';

export const createContractController = async (req: Request, res: Response) => {
  const { carId, customerId, meetings } = create(req.body, CreateContract);
  const userId = req.user!.userId;

  const newContract = await createContractService(
    carId,
    customerId,
    userId,
    meetings,
  );

  res.status(201).json({ message: '계약 생성 성공', data: newContract });
};

// 차량 조회(미계약 상태 차량만)
export const getAvailableCars = async (req: Request, res: Response) => {
  const query = create(req.query, SearchQuery);

  const cars = await availableCarsService(query.search);

  res.status(200).json({ data: cars });
};

// 고객 조회
export const getCustomers = async (req: Request, res: Response) => {
  const query = create(req.query, SearchQuery);

  const customers = await getCustomersService(query.search);

  res.status(200).json({ data: customers });
};

// 담당자 조회(계약 수정시 사용)
export const getUsers = async (req: Request, res: Response) => {
  const query = create(req.query, SearchQuery);

  const users = await getUsersService(query.search);

  res.status(200).json({ data: users });
};
