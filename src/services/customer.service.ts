import { BadRequestError, NotFoundError } from "../errors/errors";
import { CustomerDto } from "../models/customer.model";
import * as customerRepository from '../repositories/customer.repository';
import { GetCustomerListParams } from "../structs/customer.struct";
import { CleanCustomer, CreateCustomerRequest, CustomerData, CustomerList, UpdateCustomerRequest } from "../types/customer";


async function validateCustomerExists(customerId: number, companyId: number): Promise<CustomerData> {
  const customer = await customerRepository.findCustomerById(customerId, companyId);
  if (!customer) {
    throw new NotFoundError('존재하지 않는 고객입니다');
  }
  return customer;
}

async function existingCustomer(phoneNumber: string, companyId: number, customerId?: number) {
  const existing = await customerRepository.findCustomerByPhone(phoneNumber, companyId, customerId);
  if (existing) {
    throw new BadRequestError('이미 등록된 전화번호입니다');
  }
}


export async function createCustomerService(data: CreateCustomerRequest): Promise<CleanCustomer> {
  // 같은 회사 안에 중복 전화번호 확인 (등록된 고객인지)
  await existingCustomer(data.phoneNumber, data.companyId); 
  const newCustomer = await customerRepository.saveCustomer(data);
  // contractCount 포함
const customerData: CustomerData = {
    ...newCustomer,
    contractCount: 0
  };
  
  return new CustomerDto(customerData).toResponse();
}

export async function getCustomersListService(params: GetCustomerListParams 
  & { companyId: number } ) : Promise<CustomerList> {
const {page, pageSize, searchBy, keyword, companyId} = params;
const skip = (page - 1) * pageSize;
const take = pageSize;

const { customers, totalCount } = await customerRepository.findCustomersWithPagination({
    skip,
    take,
    searchBy,
    keyword,
    companyId,
  });

const data: CleanCustomer[] = customers.map((customer) => 
  new CustomerDto(customer).toResponse()
);
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    currentPage: page,
    totalPages,
    totalItemCount: totalCount,
    data,
  };
}


export async function getCustomerService(customerId: number, companyId: number): Promise<CleanCustomer> {
  const customer = await validateCustomerExists(customerId, companyId);

  return new CustomerDto(customer).toResponse();
}


export async function updateCustomerService(
  customerId: number, 
  companyId: number, 
  updateData: UpdateCustomerRequest
): Promise<CleanCustomer> {
  await validateCustomerExists(customerId, companyId);
  // 전화번호 수정시 중복 확인
  if (updateData.phoneNumber) {
    await existingCustomer(updateData.phoneNumber, companyId, customerId);
  }

  const updatedCustomer = await customerRepository.updateCustomer(customerId, companyId,updateData);
  return new CustomerDto(updatedCustomer).toResponse();
}
  

export async function deleteCustomerService(customerId: number, companyId: number): Promise<void> {
  // 다른 회사 소속 고객 삭제하지 못하도록 검증
  await validateCustomerExists(customerId, companyId);
  await customerRepository.deleteCustomer(customerId,companyId);
}