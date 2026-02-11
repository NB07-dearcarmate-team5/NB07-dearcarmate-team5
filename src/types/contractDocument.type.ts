/**
 * 계약서 문서 관련 타입 정의
 * @author 김민기
 */

// 계약서 문서 엔티티
export interface ContractDocument {
  id: number;
  contractId: number;
  fileName: string;
  fileKey: string;
  fileSize: number;
  mimeType: string;
  createdAt: Date;
  updatedAt: Date;
}

// 요청 DTO
// GET /contractDocuments 쿼리 파라미터
export interface ContractListQuery {
  page?: number | undefined;
  pageSize?: number | undefined;
  searchBy?: 'contractName' | 'userName' | undefined;
  keyword?: string | undefined;
}

// 응답 DTO
// GET /contractDocuments/draft 응답
export interface DraftContractResponseDto {
  id: number;
  data: string; // "차량모델 - 고객명 고객님" 형식
}

// GET /contractDocuments 응답
export interface ContractDocumentItem {
  id: number;
  fileName: string;
}

export interface ContractListItem {
  id: number;
  contractName: string;
  resolutionDate: string; // ISO 8601 형식
  documentCount: number;
  userName: string;
  carNumber: string;
  documents: ContractDocumentItem[];
}

export interface ContractListResponseDto {
  currentPage: number;
  totalPages: number;
  totalItemCount: number;
  data: ContractListItem[];
}

// POST /contractDocuments/upload 응답
export interface ContractDocumentResponseDto {
  contractDocumentId: number;
}

// 파일 업로드 설정
export const ALLOWED_EXTENSIONS = [
  '.pdf',
  '.doc',
  '.docx',
  '.jpg',
  '.jpeg',
  '.png',
];

export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
];

export const UPLOAD_LIMITS = {
  MAX_FILE_COUNT: 10,
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 파일당 50MB
  MAX_TOTAL_SIZE: 200 * 1024 * 1024, // 총 200MB
};
