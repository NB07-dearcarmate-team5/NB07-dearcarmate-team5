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

// contractId 타입 검증
export const ContractIdParam = object({
  contractId: number(),
});

// 계약 수정
export type UpdateContractDb = Omit<UpdateContract, 'contractPrice'> & {
  contractPrice?: bigint | undefined;
};

// 계약 수정시 들어오는 데이터 타입 검증
export const UpdateContractData = object({
  userId: optional(number()),
  carId: optional(number()),
  customerId: optional(number()),
  status: optional(
    enums([
      'carInspection',
      'priceNegotiation',
      'contractDraft',
      'contractSuccessful',
      'contractFailed',
    ]),
  ),
  contractPrice: optional(number()),
  resolutionDate: optional(string()),
  meetings: optional(
    array(
      object({
        date: string(),
        alarms: array(string()),
      }),
    ),
  ),
  contractDocuments: optional(
    array(
      object({
        id: number(),
        fileName: string(),
      }),
    ),
  ),
});

export type CreateContractType = Infer<typeof CreateContractStruct>;
export type SearchOption = Infer<typeof SearchByContracts>;
export type UpdateContract = Infer<typeof UpdateContractData>;
