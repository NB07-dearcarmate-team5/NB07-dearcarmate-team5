/**
 * 파일 업로드 미들웨어 (Multer)
 * @author 김민기
 */

import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import {
  ALLOWED_EXTENSIONS,
  ALLOWED_MIME_TYPES,
  UPLOAD_LIMITS,
} from '../types/contractDocument.type';
import { CSV_LIMITS } from '../types/bulkUpload.type';
import { BadRequestError } from '../errors/errors';

const storage = multer.memoryStorage();

const contractDocumentFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return cb(new BadRequestError(`허용되지 않는 파일 확장자입니다: ${ext}`));
  }
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(new BadRequestError(`허용되지 않는 파일 형식입니다: ${file.mimetype}`));
  }
  cb(null, true);
};

export const contractDocumentUpload = multer({
  storage,
  fileFilter: contractDocumentFileFilter,
  limits: { fileSize: UPLOAD_LIMITS.MAX_FILE_SIZE },
}).single('contractDocument');

const csvFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== '.csv') {
    return cb(new BadRequestError('CSV 파일만 업로드 가능합니다'));
  }
  cb(null, true);
};

export const csvUpload = multer({
  storage,
  fileFilter: csvFileFilter,
  limits: { fileSize: CSV_LIMITS.MAX_FILE_SIZE },
}).single('file');
