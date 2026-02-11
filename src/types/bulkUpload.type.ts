/**
 * 대용량 업로드 (CSV) 관련 타입 정의
 * @author 김민기
 */

export type BulkUploadTarget = 'customer' | 'vehicle';

// 고객 CSV 행 (name,email,gender,phoneNumber,region,ageGroup,memo)
export interface CustomerCsvRow {
  name: string;
  email: string;
  gender: string;
  phoneNumber: string;
  region?: string;
  ageGroup?: string;
  memo?: string;
}

// 차량 CSV 행 (carNumber,manufacturer,model,manufacturingYear,mileage,price,accidentCount,explanation,accidentDetails)
export interface VehicleCsvRow {
  carNumber: string;
  manufacturer: string;
  model: string;
  manufacturingYear: string;
  mileage: string;
  price: string;
  accidentCount?: string;
  explanation?: string;
  accidentDetails?: string;
}

export const CSV_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_ROWS: 10000,
};
