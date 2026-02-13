/**
 * 대용량 업로드 (CSV) 입력값 검증용 superstruct
 * @author 김민기
 */

import {
  object,
  string,
  enums,
  size,
  optional,
  coerce,
  number,
  Infer,
} from 'superstruct';

const Manufacturer = enums(['기아', '쉐보레', '현대', '제네시스', '삼성', '쌍용', '기타']);
const CarType = enums(['세단', '경차', 'SUV']);
const Gender = enums(['male', 'female', 'MALE', 'FEMALE']);

// 콤마 등 비숫자 문자를 제거한 뒤 number로 변환
const NumericString = coerce(number(), string(), (value) => {
  const cleaned = value.replace(/[^0-9.-]/g, '');
  const parsed = Number(cleaned);
  if (Number.isNaN(parsed)) throw new Error(`유효하지 않은 숫자입니다: ${value}`);
  return parsed;
});

export const VehicleCsvRowStruct = object({
  carNumber: size(string(), 1, 20),
  manufacturer: Manufacturer,
  model: size(string(), 1, 50),
  type: CarType,
  manufacturingYear: NumericString,
  mileage: NumericString,
  price: NumericString,
  accidentCount: optional(string()),
  explanation: optional(string()),
  accidentDetails: optional(string()),
});

export const CustomerCsvRowStruct = object({
  name: size(string(), 1, 20),
  email: size(string(), 1, 255),
  gender: Gender,
  phoneNumber: size(string(), 1, 15),
  region: optional(string()),
  ageGroup: optional(string()),
  memo: optional(string()),
});

export type ValidatedVehicleCsvRow = Infer<typeof VehicleCsvRowStruct>;
export type ValidatedCustomerCsvRow = Infer<typeof CustomerCsvRowStruct>;
