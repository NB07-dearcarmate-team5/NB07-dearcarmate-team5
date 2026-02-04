import { Gender
 } from "@prisma/client";

//기본 구조
export interface CustomerData {
  id?: number ; //응답용 필드
  name: string;
  gender: Gender;
  phoneNumber: string;
  ageGroup: string | null ; 
  region: string | null;
  email: string | null;
  memo: string | null;
  userId: number; 
  companyId: number; 
  contractCount?: number; //응답용 필드
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
  gender: Gender;
  phoneNumber: string;
  ageGroup: string | null;
  region: string | null;
  email: string | null;
  memo: string | null;
  contractCount: number;
}