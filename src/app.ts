import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { errorHandler } from './errors/errorHandler';
import carRoutes from './routes/car.route';
import authRouter from './routes/auth.route';
import userRouter from './routes/user.route';
import companiesRouter from './routes/companies.route';
import customersRouter from './routes/customer.route';
import { PORT } from './utils/constants';
import path from 'path';
import imageRouter from './routes/image.route';

const app = express();

// 1. 공통 미들웨어 설정
app.use(morgan('dev')); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 

// 2. 라우터 등록
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/companies', companiesRouter);
app.use('/customers', customersRouter);
app.use('/cars', carRoutes);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/images', imageRouter);

// 3. 에러 핸들러 (모든 라우터 뒤에 위치)
app.use(errorHandler);

// 4. 서버 실행
app.listen(PORT, () => {
  console.log(`🚀 서버가 http://localhost:${PORT} 에서 실행 중입니다!`);
});

export default app;
