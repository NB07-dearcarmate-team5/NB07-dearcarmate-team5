import prisma from '../prisma/prisma';
import { CreateCustomerRequest, CustomerData } from '../types/customer';
import { UpdateCustomer } from '../structs/customer.struct';
import { Prisma } from '@prisma/client';

type CustomerWithCount = Prisma.CustomerGetPayload<{
  include: { _count: { select: { contracts: true } } }
}>;

//Prisma 결과물을 CustomerData 형식으로 변환
const mapToCustomerData = (customer: CustomerWithCount): CustomerData => {
  const { _count, ...rest } = customer;
  return {
    ...rest,
    contractCount: _count?.contracts ?? 0,
  }as CustomerData;
};

// 같은 회사 내에서 전화번호로 고객 조회
export async function findCustomerByPhone(
  phoneNumber: string, 
  companyId: number, 
  excludeId?: number 
) {
  return await prisma.customer.findFirst({
    where: {
      phoneNumber,
      companyId,
      ...(excludeId && { id: { not: excludeId } }),
    },
  });
}

// 새로운 고객 정보 저장
export async function saveCustomer(data: CreateCustomerRequest) {
  return await prisma.customer.create({
    data:  {
      name: data.name,
      gender: data.gender,
      phoneNumber: data.phoneNumber,
      ageGroup: data.ageGroup,
      region: data.region,
      email: data.email,
      memo: data.memo,
      userId: data.userId,
      companyId: data.companyId,
    },
  });
};

// 고객 목록을 페이징 처리하여 조회
export async function findCustomersWithPagination(params: {
  skip: number;
  take: number;
  searchBy?: 'name' | 'email'| undefined;
  keyword?: string | undefined;
  companyId: number;
}) {
  const { skip, take, searchBy, keyword, companyId } = params;

  //우리 회사 정보 가져오기 
  const where: Prisma.CustomerWhereInput = { companyId };
  //검색 조건 추가
  if (searchBy && keyword) {
    where[searchBy] = {
      contains: keyword,
      mode: 'insensitive', // 대소문자 구분 없이 검색
    };
  }

  const [customers, totalCount] = await Promise.all([
    prisma
.customer.findMany({
      where,
      skip,
      take,
      include: {
        _count: {
          select: { contracts: true } //contractCount 포함
        }
      },
      orderBy: { id: 'desc' },
    }),
    prisma
.customer.count({
      where,
    }),
  ]);

  return { 
    customers: customers.map(mapToCustomerData), 
    totalCount
  };
}


export async function findCustomerById(customerId: number, companyId: number) {
  const customer = await prisma.customer.findFirst({
    where: {
      id: customerId,
      companyId,
    },
    include: {
      _count: {
        select: { contracts: true },
      },
    },
  });

  return customer ? mapToCustomerData(customer) : null;
}


export async function updateCustomer(customerId: number, companyId: number, data: UpdateCustomer){

  const updateData = Object.fromEntries(
    Object.entries(data).filter(([_, v]) => v !== undefined)
  ) as Prisma.CustomerUpdateInput;

  const updated = await prisma.customer.update({
    where: { id : customerId, companyId: companyId },
    data: updateData,
    include: {
      _count: {
        select: { contracts: true },
      },
    },
  });

 return mapToCustomerData(updated);
}

export async function deleteCustomer(customerId: number, companyId: number) {
  await prisma.customer.delete({
    where: { id: customerId , companyId: companyId},
  });
}