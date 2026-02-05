import {
  object,
  number,
  array,
  string,
  Infer,
  enums,
  optional,
} from 'superstruct';

export const CreateContractStruct = object({
  carId: number(),
  customerId: number(),
  meetings: array(
    object({
      date: string(), // ISO8601 날짜 문자열
      alarms: array(string()), // ISO8601 날짜 문자열 배열
    }),
  ),
});

export const SearchByContracts = object({
  searchBy: optional(enums(['customerName', 'userName'])),
  keyword: optional(string()),
});

export type CreateContractType = Infer<typeof CreateContractStruct>;
export type SearchOption = Infer<typeof SearchByContracts>;
