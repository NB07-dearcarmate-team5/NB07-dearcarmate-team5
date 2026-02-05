import "dotenv/config";
import express from 'express';
import { errorHandler } from './errors/errorHandler';
import carRoutes from './routes/car.route';
import authRouter from './routes/auth.route';
import userRouter from './routes/user.route';

const app = express();

// 1. 미들웨어 설정
app.use(express.json()); // JSON 요청 바디 파싱
app.use(express.urlencoded({ extended: true })); // URL-encoded 파싱

// 라우터 설정 (계획서의 routes 폴더 활용)

app.use('/cars', carRoutes);
app.use('/auth', authRouter);
app.use('/users', userRouter);


//에러 핸들러 설정 (반드시 라우터보다 아래에 위치!)
app.use(errorHandler);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 서버가 http://localhost:${PORT} 에서 실행 중입니다!`);

});

export default app;
