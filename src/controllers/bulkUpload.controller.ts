/**
 * 대용량 업로드 컨트롤러 - HTTP 요청 처리
 * @author 김민기
 */

import { Request, Response, NextFunction } from 'express';
import { BulkUploadService } from '../services/bulkUpload.service';
import { BadRequestError } from '../errors/errors';

export class BulkUploadController {
  constructor(private service: BulkUploadService) {}

  uploadCustomers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        throw new BadRequestError('잘못된 요청입니다');
      }
      const { userId, companyId } = req.user!;
      const result = await this.service.processCustomerUpload(req.file, userId, companyId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  uploadVehicles = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        throw new BadRequestError('잘못된 요청입니다');
      }
      const { companyId } = req.user!;
      const result = await this.service.processVehicleUpload(req.file, companyId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
