/**
 * 파일 업로드 미들웨어 (Multer)
 * @author 김민기
 *
 * 필요 패키지: npm install multer @types/multer
 */

// TODO: import
// import multer from 'multer';
// import path from 'path';
// import { ALLOWED_EXTENSIONS, ALLOWED_MIME_TYPES, UPLOAD_LIMITS } from '../types/contractDocument.type';
// import { InvalidFileTypeError, FileSizeExceededError, FileCountExceededError } from '../errors/errorHandler';

// ============================================
// Multer 스토리지 설정
// ============================================
// TODO: memoryStorage - 메모리에 파일 저장 (S3 업로드용)
// const storage = multer.memoryStorage();

// ============================================
// 파일 필터 (확장자, MIME 타입 검증)
// ============================================
// TODO: fileFilter - 유효한 확장자/MIME 타입만 허용
// - ALLOWED_EXTENSIONS 체크
// - ALLOWED_MIME_TYPES 체크
// - 유효하지 않으면 InvalidFileTypeError
// const fileFilter = (req, file, cb) => {
//   TODO: 구현
// };

// ============================================
// 계약서 업로드 미들웨어
// ============================================
// TODO: contractDocumentUpload - 계약서 파일 업로드
// - storage: memoryStorage
// - fileFilter: 확장자/MIME 검증
// - limits: fileSize (MAX_FILE_SIZE)
// - 다중 파일: array('files', MAX_FILE_COUNT)
// export const contractDocumentUpload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: UPLOAD_LIMITS.MAX_FILE_SIZE },
// }).array('files', UPLOAD_LIMITS.MAX_FILE_COUNT);

// ============================================
// CSV 업로드 미들웨어 (대용량 업로드용)
// ============================================
// TODO: csvUpload - CSV 파일 업로드
// - storage: memoryStorage
// - fileFilter: CSV만 허용 (.csv, text/csv)
// - limits: fileSize (CSV_LIMITS.MAX_FILE_SIZE)
// - 단일 파일: single('file')
// export const csvUpload = multer({
//   storage,
//   fileFilter: csvFileFilter,
//   limits: { fileSize: CSV_LIMITS.MAX_FILE_SIZE },
// }).single('file');

// ============================================
// 총 용량 검증 미들웨어
// ============================================
// TODO: validateTotalSize - 업로드 파일 총 용량 검증
// - req.files의 총 size 합계 계산
// - MAX_TOTAL_SIZE 초과 시 FileSizeExceededError
// export const validateTotalSize = (req, res, next) => {
//   TODO: 구현
// };

export {};
