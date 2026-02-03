import 'dotenv/config';
//express 5 버전부터는 try/catch를 사용하지 않아도 알아서 에러를 넘겨줌
import express from 'express';
import contractRouter from './routes/contract.route';
import { errorHandler } from './errors/errorHandler';
import companiesRouter from './routes/companies.route';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// 1. 미들웨어 설정
app.use(express.json()); // JSON 요청 바디 파싱
app.use(express.urlencoded({ extended: true })); // URL-encoded 파싱

// 라우터 설정 (계획서의 routes 폴더 활용)
app.use('/contracts', contractRouter);
app.use('/companies', companiesRouter);

//에러 핸들러 설정 (반드시 라우터보다 아래에 위치!)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 서버가 포트 ${PORT}에서 실행 중입니다!`);
  console.log(`🔗 http://localhost:${PORT}`);
});

export default app;
