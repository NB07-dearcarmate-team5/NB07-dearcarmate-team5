export class ConstructDto {
  id: number;
  status: string;
  resolutionDate: Date | null;
  contractPrice: number;
  meetings: {
    date: Date;
    alarms: Date[];
  }[];
  user: { id: number; name: string };
  customer: { id: number; name: string };
  car: { id: number; model: string };

  constructor(data: any) {
    this.id = data.id;
    this.status = data.status;
    this.resolutionDate = data.resolutionDate;
    // BigInt를 안전하게 Number로 변환
    this.contractPrice = Number(data.contractPrice);

    // 관계 데이터 가공 (alrams -> alarms 및 평탄화)
    this.meetings = data.meetings.map((m: any) => ({
      date: m.date,
      alarms: m.alrams.map((a: any) => a.alarmTime),
    }));

    this.user = data.user;
    this.customer = data.customer;
    this.car = data.car;
  }
}
