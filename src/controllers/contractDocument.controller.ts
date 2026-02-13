/**
 * 계약서 문서 컨트롤러 - HTTP 요청 처리
 * @author 김민기
 */

import { Request, Response, NextFunction } from 'express';
import { ContractDocumentService } from '../services/contractDocument.service';
import { ContractListQuery } from '../types/contractDocument.type';
import { BadRequestError } from '../errors/errors';

export class ContractDocumentController {
  constructor(private service: ContractDocumentService) {}

  getContracts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query: ContractListQuery = {
        page: req.query.page ? Number(req.query.page) : undefined,
        pageSize: req.query.pageSize ? Number(req.query.pageSize) : undefined,
        searchBy: req.query.searchBy as 'contractName' | 'userName' | undefined,
        keyword: req.query.keyword as string | undefined,
      };
      const { companyId } = req.user!;
      const result = await this.service.getContracts(query, companyId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getDraftContracts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { companyId } = req.user!;
      const contracts = await this.service.getDraftContracts(companyId);
      res.status(200).json(contracts);
    } catch (error) {
      next(error);
    }
  };

  uploadDocuments = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const contractId = Number(req.body.contractId);
      if (!contractId || isNaN(contractId)) {
        throw new BadRequestError('계약 ID가 필요합니다');
      }

      const file = req.file;
      if (!file) {
        throw new BadRequestError('파일이 필요합니다');
      }

      const result = await this.service.uploadDocument(contractId, file);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  downloadDocument = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const contractDocumentId = Number(req.params.contractDocumentId);
      if (!contractDocumentId || isNaN(contractDocumentId)) {
        throw new BadRequestError('잘못된 요청입니다');
      }

      const { stream, fileName, mimeType } = await this.service.downloadDocument(
        contractDocumentId
      );

      res.setHeader('Content-Type', mimeType);
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${encodeURIComponent(fileName)}"`
      );
      stream.pipe(res);
    } catch (error) {
      next(error);
    }
  };

  deleteDocument = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const contractDocumentId = Number(req.params.contractDocumentId);
      if (!contractDocumentId || isNaN(contractDocumentId)) {
        throw new BadRequestError('잘못된 요청입니다');
      }

      await this.service.deleteDocument(contractDocumentId);
      res.status(200).json({ message: '계약서 문서가 삭제되었습니다' });
    } catch (error) {
      next(error);
    }
  };
}
