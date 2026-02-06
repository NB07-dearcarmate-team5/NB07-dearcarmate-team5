import { Router } from 'express';
import { upload } from '../middlewares/upload.middleware';
import { authenticateToken } from '../middlewares/authenticateToken';
import { BadRequestError } from '../errors/errors';

const router = Router();

router.post('/upload', authenticateToken, upload.single('image'), (req, res) => {
  if (!req.file) {
    throw new BadRequestError("잘못된 요청입니다");
  }

  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  
  res.status(200).json({ imageUrl });
});

export default router;