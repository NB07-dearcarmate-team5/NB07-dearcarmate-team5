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
}

main()
  .catch((e) => {
    console.error('❌ 시딩 중 에러 발생:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });