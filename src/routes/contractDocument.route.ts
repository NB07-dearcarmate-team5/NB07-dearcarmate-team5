/**
 * 계약서 문서 라우트
 * @author 김민기
 */

import { Router } from 'express';
import { ContractDocumentController } from '../controllers/contractDocument.controller';
import { ContractDocumentService } from '../services/contractDocument.service';
import { ContractDocumentRepository } from '../repositories/contractDocument.repository';
import { contractDocumentUpload } from '../middlewares/fileUpload.middleware';
import { authenticateToken } from '../middlewares/authenticateToken';

const router = Router();

// 의존성 주입
const repository = new ContractDocumentRepository();
const service = new ContractDocumentService(repository);
const controller = new ContractDocumentController(service);

// 인증 미들웨어 적용
router.use(authenticateToken);

/**
 * GET /contractDocuments
 * 계약서 업로드 시 계약 목록 조회
 */
router.get('/', controller.getContracts);

/**
 * GET /contractDocuments/draft
 * 계약서 추가 시 계약 목록 조회
 */
router.get('/draft', controller.getDraftContracts);

/**
 * POST /contractDocuments/upload
 * 계약서 업로드
 * Content-Type: multipart/form-data
 * Body: contractId, contractDocument (File)
 */
router.post('/upload', contractDocumentUpload, controller.uploadDocuments);

/**
 * GET /contractDocuments/:contractDocumentId/download
 * 계약서 다운로드
 */
router.get('/:contractDocumentId/download', controller.downloadDocument);

/**
 * DELETE /contractDocuments/:contractDocumentId
 * 계약서 문서 삭제
 */
router.delete('/:contractDocumentId', controller.deleteDocument);

export default router;
