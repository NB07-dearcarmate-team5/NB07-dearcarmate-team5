import { DashboardResponseDto } from '../models/dashboard.model';
import { getDashboardData } from '../repositories/dashboard.repository';
import { DashboardData } from '../types/dashboard';


export async function getDashboardService(companyId: number): Promise<DashboardResponseDto> {
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  // 데이터 조회
  const { statusCounts, statsByCar } = await getDashboardData(companyId, lastMonthStart);

  const PROCEEDING_STATUSES = ['carInspection', 'priceNegotiation', 'contractDraft'];

  // 집계용 데이터 구조 (byType의 sales는 BigInt 그대로 유지)
  const stats = {
    monthlySales: 0n,
    lastMonthSales: 0n,
    proceedingContractsCount: 0,
    completedContractsCount: 0,
    byType: {
      '세단': { count: 0, sales: 0n },
      '경차': { count: 0, sales: 0n },
      'SUV': { count: 0, sales: 0n }
    }
  };

  // 상태별 카운트 집계
  statusCounts.forEach((s) => {
    if (s.status === 'contractSuccessful') {
      stats.completedContractsCount = s._count.id;
    } else if (PROCEEDING_STATUSES.includes(s.status)) {
      stats.proceedingContractsCount += s._count.id;
    }
  });

  // 매출 및 차종별 집계 
  statsByCar.forEach((car) => {
    const type = car.type as keyof typeof stats.byType;
    
    car.contracts.forEach((con) => {
      if (con.created_at >= thisMonthStart) {
        stats.monthlySales += con.contractPrice;
        if (stats.byType[type]) {
          stats.byType[type].count++;
          stats.byType[type].sales += con.contractPrice;
        }
      } else {
        stats.lastMonthSales += con.contractPrice;
      }
    });
  });

  //성장률 계산 
  const growthRate = stats.lastMonthSales > 0n 
    ? Number(((Number(stats.monthlySales - stats.lastMonthSales) / Number(stats.lastMonthSales)) * 100).toFixed(2))
    : (stats.monthlySales > 0n ? 100 : 0);



  const dashboardData: DashboardData = {
    monthlySales: stats.monthlySales,
    lastMonthSales: stats.lastMonthSales,
    growthRate,
    proceedingContractsCount: stats.proceedingContractsCount,
    completedContractsCount: stats.completedContractsCount,
    contractsByCarType: Object.entries(stats.byType).map(([carType, v]) => ({
      carType,
      count: v.count 
    })),
    salesByCarType: Object.entries(stats.byType).map(([carType, v]) => ({
      carType,
      count: v.sales 
    }))
  };


  return new DashboardResponseDto(dashboardData);
}