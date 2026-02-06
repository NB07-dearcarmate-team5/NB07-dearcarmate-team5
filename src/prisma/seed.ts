import 'dotenv/config';
import {
  PrismaClient,
  CarStatus,
  Gender,
  ContractStatus,
} from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
// bcryptjs 대신 bcrypt 사용
import bcrypt from 'bcrypt';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

// 헬퍼 함수들 (기존과 동일)
function pad(num: number, size: number) {
  return String(num).padStart(size, '0');
}
function makeKoreanPhone(i: number) {
  return `010${1000 + (i % 9000)}${1000 + ((i * 7) % 9000)}`;
}
function makeCarNumber(i: number) {
  return `${10 + (i % 90)}${['가', '나', '다'][i % 3]}${1000 + ((i * 13) % 9000)}`;
}
function addDays(base: Date, days: number) {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

async function main() {
  const COMPANY_COUNT = 2;
  const USER_COUNT = 4;
  const ADMIN_EMAIL = 'admin@sample.com';

  // 1) 회사 생성
  const companies = [];
  for (let i = 1; i <= COMPANY_COUNT; i++) {
    const companyCode = `COMP-${pad(i, 3)}`;
    const company = await prisma.company.upsert({
      where: { companyCode },
      update: { companyName: `테스트회사${i}` },
      create: { companyCode, companyName: `테스트회사${i}` },
    });
    companies.push(company);
  }

  // 2) 어드민 생성 (bcrypt.hash 사용)
  const adminPasswordHash = await bcrypt.hash('admin1234!', 10);
  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      password: adminPasswordHash,
      isAdmin: true,
    },
    create: {
      email: ADMIN_EMAIL,
      password: adminPasswordHash,
      name: '관리자',
      employeeNumber: 'ADMIN-001',
      phoneNumber: '01000000000',
      isAdmin: true,
      companyId: companies[0].id,
    },
  });

  // 3) 일반 유저 생성 (bcrypt.hash 사용)
  const userPasswordHash = await bcrypt.hash('password1234!', 10);
  for (let i = 1; i <= USER_COUNT; i++) {
    const company = companies[i % companies.length];
    await prisma.user.upsert({
      where: { email: `user${i}@test.com` },
      update: { password: userPasswordHash },
      create: {
        email: `user${i}@test.com`,
        password: userPasswordHash,
        name: `사원${i}`,
        employeeNumber: `EMP-${i}`,
        phoneNumber: makeKoreanPhone(i),
        companyId: company.id,
      },
    });
  }

  // 4) 차량 생성
  const carRows = [];
  let carSeq = 1;
  for (const company of companies) {
    for (let j = 0; j < 5; j++) {
      carRows.push({
        carNumber: makeCarNumber(carSeq++),
        manufacturer: '현대',
        model: '아반떼',
        type: '세단',
        manufacturingYear: 2022,
        mileage: 10000,
        price: BigInt(25000000),
        status: CarStatus.POSSESSION,
        companyId: company.id,
      });
    }
  }
  await prisma.car.createMany({ data: carRows, skipDuplicates: true });

  // 5) 고객 생성
  const allUsers = await prisma.user.findMany({ where: { isAdmin: false } });
  const customerRows = [];
  let custSeq = 1;
  for (const u of allUsers) {
    for (let k = 0; k < 3; k++) {
      customerRows.push({
        name: `고객${custSeq}`,
        gender: Gender.MALE,
        phoneNumber: makeKoreanPhone(100 + custSeq),
        email: `cust${custSeq++}@test.com`,
        userId: u.id,
        companyId: u.companyId,
      });
    }
  }
  await prisma.customer.createMany({
    data: customerRows,
    skipDuplicates: true,
  });

  // 6) 계약 & 미팅 & 알람
  const cars = await prisma.car.findMany();
  const customers = await prisma.customer.findMany();
  const statuses = Object.values(ContractStatus);

  for (let i = 0; i < statuses.length; i++) {
    const car = cars[i % cars.length];
    const customer = customers[i % customers.length];

    await prisma.contract.create({
      data: {
        contractPrice: car.price,
        status: statuses[i],
        carId: car.id,
        customerId: customer.id,
        userId: customer.userId,
        resolutionDate: statuses[i].includes('Successful') ? new Date() : null,
        meetings: {
          create: {
            date: addDays(new Date(), 7),
            alarms: { create: { alarmTime: addDays(new Date(), 6) } },
          },
        },
      },
    });
  }

  console.log('🚀 시딩 완료! (bcrypt 사용)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });