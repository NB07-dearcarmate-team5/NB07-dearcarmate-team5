import { BadRequestError } from '../errors/errors';
import {
  availableCarsRepo,
  getCustomersRepo,
  getUsersRepo,
  findDataForContract,
  createContractRepo,
} from '../repositories/construct.repository';
import { CreateContractInput } from '../structs/contract.sturuct';

export const createContractService = async (
  carId: number,
  customerId: number,
  userId: number,
  meetings: CreateContractInput['meetings'],
) => {
  const { car, customer, user } = await findDataForContract(
    carId,
    customerId,
    userId,
  );

  if (!car) throw new BadRequestError('차량 정보가 없습니다.');
  if (car.status !== 'POSSESSION') {
    throw new BadRequestError('현재 계약 가능한 차량이 아닙니다.');
  }
  if (!customer) throw new BadRequestError('고객 정보가 없습니다.');
  if (!user) throw new BadRequestError('담당자 정보가 없습니다.');

  const newContract = await createContractRepo(
    carId,
    customerId,
    userId,
    meetings,
    car.price,
  );

  return newContract;
};

export const availableCarsService = async (search?: string) => {
  const cars = await availableCarsRepo(search);

  return cars;
};

export const getCustomersService = async (search?: string) => {
  const customers = await getCustomersRepo(search);

  return customers;
};

export const getUsersService = async (search?: string) => {
  const users = await getUsersRepo(search);

  return users;
};
