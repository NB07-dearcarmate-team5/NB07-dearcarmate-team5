/**
 * 계약서 문서 관련 타입 정의
 * @author 김민기
 */

// ============================================
// 계약서 문서 엔티티
// ============================================
// TODO: ContractDocument 인터페이스 정의
// - id: 문서 고유 ID (UUID)
// - contractId: 계약 ID (Foreign Key)
// - fileName: 원본 파일명
// - fileKey: MinIO/S3 저장 키
// - fileSize: 파일 크기 (bytes)
// - mimeType: 파일 MIME 타입
// - createdAt, updatedAt: 생성/수정 일시
export interface ContractDocument {}

// ============================================
// 계약 정보 (목록 조회용)
// ============================================
// TODO: Contract 인터페이스 (계약서 업로드 시 선택할 계약 목록) -> api 문서 참고에 따른 수정 필요 
// - id: 계약 ID
// - contractName: 계약명
// - customerName: 고객명
// - vehicleNumber: 차량번호
// - 기타 필요한 필드...
export interface Contract {}

// ============================================
// 요청 DTO
// ============================================
// GET /contractDocuments 쿼리 파라미터
export interface ContractListQuery {
  page?: number;
  pageSize?: number;
  searchBy?: 'contractName' | 'userName';
  keyword?: string;
}

// export interface ContractListQuery {
//   page?: number | undefined;
//   pageSize?: number | undefined;
//   searchBy?: 'contractName' | 'userName' | undefined;
//   keyword?: string | undefined;
// }

// TODO: UploadContractDocumentDto - 계약서 업로드 요청
// - contractId: 계약 ID (필수)
// - files: 업로드 파일 배열 (multer)
export interface UploadContractDocumentDto {}

// ============================================
// 응답 DTO
// ============================================
// GET /contractDocuments/draft 응답
// 계약서 추가 시 계약 목록 조회용
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

// TODO: ContractDocumentResponseDto - 업로드 결과 응답
// POST /contractDocuments/upload 용
// - id: 문서 ID
// - fileName: 파일명
// - fileSize: 파일 크기
// - uploadedAt: 업로드 일시
export interface ContractDocumentResponseDto {}

// TODO: DownloadResponseDto - 다운로드 응답
// GET /contractDocuments/{id}/download 용
// - downloadUrl: Presigned URL (또는 스트림)
// - fileName: 원본 파일명
// - mimeType: MIME 타입
export interface DownloadResponseDto {}

// ============================================
// 파일 업로드 설정
// ============================================
// TODO: 허용 확장자 목록 -> 문서 내용에 따른 수정 필요
export const ALLOWED_EXTENSIONS = [
  '.pdf',
  '.doc',
  '.docx',
  '.jpg',
  '.jpeg',
  '.png',
];

// TODO: 허용 MIME 타입
export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
];

// TODO: 업로드 제한 설정
export const UPLOAD_LIMITS = {
  MAX_FILE_COUNT: 10, // 최대 파일 개수
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 파일당 50MB
  MAX_TOTAL_SIZE: 200 * 1024 * 1024, // 총 200MB
};
