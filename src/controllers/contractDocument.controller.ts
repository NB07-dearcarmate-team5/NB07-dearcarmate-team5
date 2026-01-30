/**
 * 계약서 문서 컨트롤러 - HTTP 요청 처리
 * @author 김민기
 */

import { Request, Response, NextFunction } from 'express';
import { ContractDocumentService } from '../services/contractDocument.service';
import { ContractListQuery } from '../types/contractDocument.type';

// ============================================
// ContractDocumentController
// ============================================
export class ContractDocumentController {
  constructor(private service: ContractDocumentService) {}

  // ==========================================
  // GET /contractDocuments
  // 계약서 업로드 시 계약 목록 조회
  // ==========================================
  getContracts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query: ContractListQuery = {
        page: req.query.page ? Number(req.query.page) : undefined,
        pageSize: req.query.pageSize ? Number(req.query.pageSize) : undefined,
        searchBy: req.query.searchBy as 'contractName' | 'userName' | undefined,
        keyword: req.query.keyword as string | undefined,
      };

      const result = await this.service.getContracts(query);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  // ==========================================
  // GET /contractDocuments/draft
  // 계약서 추가 시 계약 목록 조회
  // ==========================================
  getDraftContracts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const contracts = await this.service.getDraftContracts();
      res.status(200).json(contracts);
    } catch (error) {
      next(error);
    }
  };

  // ==========================================
  // POST /contractDocuments/upload
  // 계약서 업로드
  // ==========================================
  // TODO: uploadDocuments
  // @body contractId: string
  // @files files: 업로드 파일 배열 (multer)
  // 응답: 201 Created + ContractDocumentResponseDto[]
  uploadDocuments = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // TODO: 구현
      // 1. req.body.contractId 추출
      // 2. req.files 추출 (multer)
      // 3. service.uploadDocuments() 호출
      // 4. 201 응답 반환
      throw new Error('Not implemented');
    } catch (error) {
      next(error);
    }
  };

  // ==========================================
  // GET /contractDocuments/{contractDocumentId}/download
  // 계약서 다운로드
  // ==========================================
  // TODO: downloadDocument
  // @param contractDocumentId: string (URL 파라미터)
  // 응답: 200 OK + DownloadResponseDto (또는 파일 스트림)
  downloadDocument = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // TODO: 구현
      // 1. req.params.contractDocumentId 추출
      // 2. service.downloadDocument() 호출
      // 3. Presigned URL 또는 파일 스트림 응답
      throw new Error('Not implemented');
    } catch (error) {
      next(error);
    }
  };
}
