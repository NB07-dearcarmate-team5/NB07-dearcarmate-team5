import { CarTypeCount, DashboardData } from "../types/dashboard";

export class DashboardResponseDto {
  monthlySales!: number;
  lastMonthSales!: number;
  growthRate!: number;
  proceedingContractsCount!: number;
  completedContractsCount!: number;
  contractsByCarType!: CarTypeCount[];
  salesByCarType!: CarTypeCount[];

  constructor(data:DashboardData ) {
    this.monthlySales = Number(data.monthlySales); //BigInt 처리
    this.lastMonthSales = Number(data.lastMonthSales);//BigInt 처리
    this.growthRate = data.growthRate;
    this.proceedingContractsCount = data.proceedingContractsCount;
    this.completedContractsCount = data.completedContractsCount;
    this.contractsByCarType = data.contractsByCarType.map(item => ({
      carType: item.carType,
      count: Number(item.count) //BigInt 처리(contractPrice)
    }));
    this.salesByCarType = data.salesByCarType.map(item => ({
      carType: item.carType,
      count: Number(item.count) //BigInt 처리(contractPrice)
    }));
  }
} 