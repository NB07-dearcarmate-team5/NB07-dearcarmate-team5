export interface CarTypeCount {
  carType: string;
  count: number | bigint;
}

export interface DashboardData {
  monthlySales: number | bigint;
  lastMonthSales: number | bigint;
  growthRate: number;
  proceedingContractsCount: number;
  completedContractsCount: number;
  contractsByCarType: CarTypeCount[];
  salesByCarType: CarTypeCount[];
}