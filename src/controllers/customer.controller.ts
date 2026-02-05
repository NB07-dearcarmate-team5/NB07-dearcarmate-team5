import { Request, Response} from 'express';
import { create } from 'superstruct';
import { CreateCustomerRequest, CustomerList } from "../types/customer";
import { CreateCustomer, CreateCustomerStruct, GetCustomerListParams, GetCustomerListParamsStruct, IdParams, IdParamsStruct, UpdateCustomer, UpdateCustomerStruct } from '../structs/customer.struct';
import * as customerService from '../services/customer.service';


//고객 생성
export async function createCustomer(req: Request, res: Response) {
  //id가 없는 생성용 
  const ValidatedData = create(req.body, CreateCustomerStruct,)as CreateCustomer;
  const {userId, companyId} = req.user!;

const result = await customerService.createCustomerService({
    ...ValidatedData,
    userId,
    companyId
  } as CreateCustomerRequest);

  res.status(201).json(result);
}
//고객 목록 조회
export async function getCustomersList(req: Request, res: Response) {
    const validatedParams = create(req.query, GetCustomerListParamsStruct) as GetCustomerListParams;
    const {companyId} = req.user!;

    const result: CustomerList = await customerService.getCustomersListService({
    ...validatedParams,
    companyId
  });
    res.status(200).json(result);
}

//고객 상세 정보 조회
export async function getCustomer(req: Request, res: Response) {
   const {customerId} = create(req.params, IdParamsStruct) as IdParams;
   const {companyId} = req.user!;

   const result = await customerService.getCustomerService(customerId, companyId);
  res.status(200).json(result );
}

//고객 수정
export async function updateCustomer(req: Request, res: Response) {
  const { customerId } = create(req.params, IdParamsStruct) as IdParams;
  const updateData = create(req.body, UpdateCustomerStruct) as UpdateCustomer;
  const { companyId } = req.user!;

  const result = await customerService.updateCustomerService(customerId, companyId, updateData);
  res.status(200).json(result);
}

//고객 삭제
export async function deleteCustomer(req: Request, res: Response) {
  const { customerId } = create(req.params, IdParamsStruct) as IdParams;
  const { companyId } = req.user!; 

  await customerService.deleteCustomerService(customerId, companyId);

  res.status(200).json({ message: "고객 삭제 성공" });
}