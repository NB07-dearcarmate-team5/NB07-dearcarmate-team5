<<<<<<< HEAD
import { PrismaClient, CarStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1. 테스트용 회사 생성 (회사 데이터가 있어야 차량 등록이 가능합니다)
  const company = await prisma.company.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      companyCode: 'TEST001',      // 에러 메시지에 있던 필드
      companyName: '데어카메이트',   // name 대신 companyName 사용
      // created_at, updated_at은 Prisma가 자동으로 넣어주므로 생략 가능합니다.
    },
  });

  console.log('✅ 테스트 회사 생성 완료:', company.companyName);

  // 2. 테스트용 차량 데이터 (Enum 타입 에러 방지를 위해 'as any' 또는 Enum 직접 사용)
  const cars = [
    {
      carNumber: '11가 1111',
      manufacturer: '현대',
      model: '아반떼 CN7',
      type: '세단',
      manufacturingYear: 2023,
      mileage: 5000,
      price: 25000000,
      accidentCount: 0,
      explanation: '신차급 상태, 비흡연 차량입니다.',
      accidentDetails: '사고 없음',
      status: 'possession' as CarStatus, // Prisma Enum 타입으로 명시
      companyId: company.id,
    },
    {
      carNumber: '22나 2222',
      manufacturer: '기아',
      model: '쏘렌토 MQ4',
      type: 'SUV',
      manufacturingYear: 2022,
      mileage: 25000,
      price: 38000000,
      accidentCount: 1,
      explanation: '가족용 SUV로 최고입니다.',
      accidentDetails: '단순 휀더 교환',
      status: 'possession' as CarStatus,
      companyId: company.id,
    },
    {
      carNumber: '33다 3333',
      manufacturer: '제네시스',
      model: 'G80',
      type: '세단',
      manufacturingYear: 2024,
      mileage: 1200,
      price: 65000000,
      accidentCount: 0,
      explanation: '전시차급 컨디션입니다.',
      accidentDetails: '무사고',
      status: 'contractProceeding' as CarStatus, // 계약 진행 중 상태
      companyId: company.id,
    }
  ];

  // 3. 차량 데이터 삽입 (중복 방지를 위해 carNumber 기준 upsert)
  for (const car of cars) {
    await prisma.car.upsert({
      where: { carNumber: car.carNumber },
      update: {},
      create: car,
    });
  }

  console.log(`🚗 ${cars.length}대의 차량 데이터 시딩 성공!`);
=======
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!, // postgresql://...
});

const prisma = new PrismaClient({ adapter });

function pad(num: number, size: number) {
  return String(num).padStart(size, '0');
}

function randomFrom<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function makeKoreanPhone(i: number) {
  // 010-XXXX-YYYY 형태로 유니크하게
  // i가 커져도 겹치지 않게 단순 규칙 생성
  const mid = 1000 + (i % 9000);
  const last = 1000 + ((i * 7) % 9000);
  return `010${mid}${last}`; // 하이픈 없이 저장 (String)
}

async function main() {
  const COMPANY_COUNT = 10; // "10개 이상"
  const USER_COUNT = 120; // "100명 이상"
  const ADMIN_EMAIL = 'admin@sample.com';

  // 1) 회사 생성 (idempotent: upsert)
  const companies = [];
  for (let i = 1; i <= COMPANY_COUNT; i++) {
    const companyCode = `COMP-${pad(i, 3)}`; // unique
    const companyName = `샘플회사${i}`;

    const company = await prisma.company.upsert({
      where: { companyCode },
      update: { companyName },
      create: { companyCode, companyName },
    });

    companies.push(company);
  }

  // 2) 어드민 1명 (첫번째 회사 소속)
  const adminCompany = companies[0];

  // 비밀번호는 해시해서 넣는 걸 추천(실서비스 로직과 동일하게)
  const adminPasswordHash = await bcrypt.hash('admin1234!', 10);

  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      name: '관리자',
      isAdmin: true,
      companyId: adminCompany.id,
    },
    create: {
      email: ADMIN_EMAIL,
      password: adminPasswordHash,
      name: '관리자',
      employeeNumber: 'EMP-ADMIN-0001', // unique
      phoneNumber: '01000000000',
      isAdmin: true,
      companyId: adminCompany.id,
      imageUrl: null,
      refreshToken: null,
    },
  });

  // 3) 일반 유저 100명 이상 생성
  // createMany는 속도가 빠르고, unique만 잘 맞추면 좋아.
  // (단, 이미 존재할 때는 skipDuplicates로 중복만 스킵)
  const defaultPasswordHash = await bcrypt.hash('user1234!', 10);

  const userRows = Array.from({ length: USER_COUNT }, (_, idx) => {
    const i = idx + 1;

    // 회사 골고루 분배
    const company = companies[idx % companies.length];

    const email = `user${pad(i, 4)}@sample.com`; // unique
    const employeeNumber = `EMP-${company.companyCode}-${pad(i, 5)}`; // unique
    const phoneNumber = makeKoreanPhone(i); // unique하게 생성

    const names = [
      '민수',
      '서연',
      '지훈',
      '하영',
      '예진',
      '도윤',
      '지민',
      '수아',
      '현우',
      '유진',
    ];
    const name = `${randomFrom(names)}${randomFrom(['', '', '', 'A', 'B', 'C'])}`;

    return {
      email,
      password: defaultPasswordHash,
      name,
      employeeNumber,
      phoneNumber,
      isAdmin: false,
      companyId: company.id,
      imageUrl: null,
      refreshToken: null,
    };
  });

  const created = await prisma.user.createMany({
    data: userRows,
    skipDuplicates: true,
  });

  console.log('✅ Companies seeded:', companies.length);
  console.log('✅ Admin upserted:', ADMIN_EMAIL);
  console.log('✅ Users createMany inserted:', created.count);
>>>>>>> develop
}

main()
  .catch((e) => {
<<<<<<< HEAD
    console.error('❌ 시딩 중 에러 발생:', e);
=======
    console.error('❌ Seed failed:', e);
>>>>>>> develop
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
<<<<<<< HEAD
  });
=======
  });
>>>>>>> develop
