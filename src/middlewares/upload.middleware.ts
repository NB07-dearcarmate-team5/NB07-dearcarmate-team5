import multer from 'multer';
import path from 'path';
import { BadRequestError } from '../errors/errors';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // 파일명 중복을 방지하기 위해 타임스탬프와 난수 조합
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

export const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new BadRequestError("잘못된 요청입니다."));
    }
    cb(null, true);
  }
});