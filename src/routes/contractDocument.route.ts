/**
 * 계약서 문서 라우트
 * @author 김민기
 */

import { Router } from 'express';
import { ContractDocumentController } from '../controllers/contractDocument.controller';
import { ContractDocumentService } from '../services/contractDocument.service';
import { ContractDocumentRepository } from '../repositories/contractDocument.repository';
// TODO: 추후 구현 시 import
// import { contractDocumentUpload, validateTotalSize } from '../middleware/upload.middleware';
// import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// 의존성 주입
const repository = new ContractDocumentRepository();
const service = new ContractDocumentService(repository);
const controller = new ContractDocumentController(service);

// TODO: 인증 미들웨어 적용 (필요시)
// router.use(authMiddleware);

/**
 * GET /contractDocuments
 * 계약서 업로드 시 계약 목록 조회
 */
// router.get('/', controller.getContracts);

/**
 * GET /contractDocuments/draft
 * 계약서 추가 시 계약 목록 조회
 */
router.get('/draft', controller.getDraftContracts);

/**
 * POST /contractDocuments/upload
 * 계약서 업로드
 * Content-Type: multipart/form-data
 * Body: contractId, files[]
 */
// router.post(
//   '/upload',
//   contractDocumentUpload,
//   validateTotalSize,
//   controller.uploadDocuments
// );

/**
 * GET /contractDocuments/:contractDocumentId/download
 * 계약서 다운로드
 */
// router.get('/:contractDocumentId/download', controller.downloadDocument);

export default router;
