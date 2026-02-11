import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🛡️ 초기 어드민 계정 생성을 시작합니다...');

  // 1. 필수 회사 정보 생성 (어드민이 소속될 기본 회사)
  const company = await prisma.company.upsert({
    where: { companyCode: 'MAIN-001' },
    update: {}, // 이미 있으면 업데이트 안 함
    create: {
      companyCode: 'MAIN-001',
      companyName: '(주) 디어카메이트 본사',
    },
  });

  // 2. 어드민 계정 정보 설정
  const ADMIN_EMAIL = 'admin@sample.com'; // 로컬 .env의 정보와 맞춰주세요
  const ADMIN_PASSWORD = 'admin1234!'; // 실제 사용하실 비밀번호
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

  // 3. 어드민 계정 생성
  const adminUser = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      password: hashedPassword,
      isAdmin: true, // 이미 있는 계정도 어드민 권한 부여
    },
    create: {
      email: ADMIN_EMAIL,
      password: hashedPassword,
      name: '시스템관리자',
      employeeNumber: 'ADMIN-001',
      phoneNumber: '01000000000',
      isAdmin: true,
      companyId: company.id,
    },
  });

  console.log(`✅ 어드민 계정 생성 완료: ${adminUser.email}`);
}

main()
  .catch((e) => {
    console.error('❌ 시딩 중 에러 발생:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
