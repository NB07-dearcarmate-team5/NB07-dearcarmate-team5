import {
  string,
  object,
  enums,
  coerce,
  integer,
  defaulted,
  optional,
  Infer,
  refine,
} from 'superstruct';

// 생성
export const newCompany = object({
  companyName: string(),
  companyCode: string(),
});

export type NewCompanyType = Infer<typeof newCompany>;

const NumberFromString = coerce(integer(), string(), (value) => Number(value));

// 회사 페이징 + 검색어
export const SearchByCompany = object({
  page: defaulted(NumberFromString, 1), // 값이 안들어 오면 기본값 1
  pageSize: defaulted(NumberFromString, 8), // 값이 안들어 오면 기본값 8
  searchBy: optional(enums(['companyName', 'companyCode'])),
  keyword: optional(string()),
});

export type SearchByCompanyType = Infer<typeof SearchByCompany>;

// 유저 페이징 + 검색어
export const SearchByUsers = object({
  page: defaulted(NumberFromString, 1),
  pageSize: defaulted(NumberFromString, 8),
  searchBy: optional(enums(['companyName', 'name', 'email'])),
  keyword: optional(string()),
});

export type SearchByUsersType = Infer<typeof SearchByUsers>;

// 회사 정보 수정
const UpdateFieldStruct = object({
  companyName: optional(string()),
  companyCode: optional(string()),
});

export const UpdateField = refine(UpdateFieldStruct, 'UpdateField', (value) => {
  const hasKeys = Object.keys(value).length > 0;
  return hasKeys || '수정할 정보를 최소 하나 이상 입력해야 합니다.';
});

export type UpdateFieldType = Infer<typeof UpdateField>;
