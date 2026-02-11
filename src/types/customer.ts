import { Gender
 } from "@prisma/client";

//기본 구조
interface BaseCustomer {
  name: string;
  gender: Gender;
  phoneNumber: string;
  ageGroup: string | null ; 
  region: string | null;
  email: string;
  memo: string | null;
  userId: number; 
  companyId: number; 
  contractCount?: number; //응답용 필드
}

// 생성할 때 쓰는 타입 (ID 없음)
export interface CreateCustomerRequest extends BaseCustomer {}

//ID 포함 
export interface CustomerData extends BaseCustomer {
  id: number; 
}

export interface UpdateCustomerRequest {
  name: string;
  gender: Gender; 
  phoneNumber: string;
  email: string;
  ageGroup?: string | null | undefined;
  region?: string | null | undefined;
  memo?: string | null | undefined;
  userId: number;
  companyId: number;
  contractCount?: number;
}

//목록 조회 응답 
export interface CustomerList {
  currentPage: number;
  totalPages: number;
  totalItemCount: number;
  data: CleanCustomer[]; 
}

export interface CleanCustomer {
  id: number;
  name: string;
  gender: Gender | 'male' | 'female';
  phoneNumber: string;
  ageGroup: string | null;
  region: string | null;
  email: string;
  memo: string | null;
  contractCount: number;
}