import {
  object,
  number,
  array,
  string,
  Infer,
  enums,
  optional,
  pattern,
  coerce,
  integer,
} from 'superstruct';

// 오전 9시
const Time0900Pattern = /T09:00:00(\.\d+)?(Z|[+-]\d{2}:\d{2})?$/;

export const CreateContractStruct = object({
  carId: number(),
  customerId: number(),
  meetings: array(
    object({
      date: string(), // 미팅 일시는 자유로운 시간 선택 가능
      alarms: array(
        // 알람은 meeting 날짜 기준 당일, 작일 오전 9시여야 함(알람은 오전 9시에만 가능)
        pattern(string(), Time0900Pattern),
      ),
    }),
  ),
});

export const SearchByContracts = object({
  searchBy: optional(enums(['customerName', 'userName'])),
  keyword: optional(string()),
});

// contractId 타입 검증
export const ContractIdParam = object({
  contractId: coerce(number(), string(), (value) => Number(value)),
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
  contractPrice: optional(integer()),
  resolutionDate: optional(string()),
  meetings: optional(
    array(
      object({
        date: string(),
        alarms: array(pattern(string(), Time0900Pattern)),
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
