import { object, string, enums, size, nullable,Infer, pattern, defaulted, integer, coerce, optional, nonempty } from 'superstruct';


//문자열을 숫자로 바꾸고 정수인지 확인하는 로직
const integerString = coerce(integer(), string(), (value) => parseInt(value));

const AGE_GROUPS = ['10대', '20대', '30대', '40대', '50대', '60대', '70대', '80대'] as const;
const REGIONS = [
  '서울', '경기', '인천', '강원', '충북', '충남', '세종', '대전', 
  '전북', '전남', '광주', '경북', '경남', '대구', '울산', '부산', '제주'
] as const;


//customerId 파라미터 타입
export const IdParamsStruct = object({
  customerId: integerString,
});


//페이지네이션 파라미터 타입
export const GetCustomerListParamsStruct = object({
page: defaulted(integerString, 1),
pageSize: defaulted(integerString, 10),
searchBy: optional(enums(['name', 'email'])),
keyword: optional(nonempty(string())),
});

//고객 생성용 타입
export const CreateCustomerStruct = object({
  name: pattern(size(string(), 1, 20),/^[a-zA-Z가-힣\s0-9]+$/),  //동명이인 방지       
  gender: enums(['MALE', 'FEMALE']),     
  phoneNumber: pattern(size(string(), 10, 15), /^[0-9-]+$/),  
  
  // 선택적 필드, undefined이면 null 할당
  ageGroup: defaulted(nullable(enums(AGE_GROUPS)), null),
  region: defaulted(nullable(enums(REGIONS)), null),
  email: nonempty(string()),
  memo: defaulted(nullable(string()), null),
});

//고객 수정용 타입
export const UpdateCustomerStruct = object({
  name: optional(pattern(size(string(), 1, 20), /^[a-zA-Z가-힣\s0-9]+$/)),
  gender: optional(enums(['MALE', 'FEMALE'])), 
  phoneNumber: optional(pattern(size(string(), 10, 15), /^[0-9-]+$/)),
  ageGroup: optional(nullable(enums(AGE_GROUPS))),
  region: optional(nullable(enums(REGIONS))),
  email: optional(nonempty(string())),
  memo: optional(nullable(string())),
});

export type IdParams = Infer<typeof IdParamsStruct>;
export type GetCustomerListParams = Infer<typeof GetCustomerListParamsStruct>;
export type CreateCustomer = Infer<typeof CreateCustomerStruct>;
export type UpdateCustomer = Infer<typeof UpdateCustomerStruct>;