export type CarStatus = 'possession' | 'contractProceeding' | 'contractCompleted';
export type CarType = '세단' | '경차' | 'SUV';

export interface Car {
  id: number;
  companyId: number;
  carNumber: string;
  manufacturer: string;
  model: string;
  type: CarType;
  manufacturingYear: number;
  mileage: number;
  price: number;
  accidentCount: number;
  explanation?: string | null;
  accidentDetails?: string | null;
  status: CarStatus;
}

export interface CreateCarRequestBody {
  carNumber: string;
  manufacturer: string;
  model: string;
  type: CarType;
  manufacturingYear: number;
  mileage: number;
  price: number;
  accidentCount: number;
  explanation?: string;
  accidentDetails?: string;
}

export interface CreateCarInput extends CreateCarRequestBody {
  companyId: number;
}

export interface UpdateCarRequestBody {
  carNumber: string;
  manufacturer: string;
  model: string;
  manufacturingYear: number;
  mileage: number;
  price: number;
  accidentCount: number;
  explanation?: string;
  accidentDetails?: string;
}

export interface UpdateCarInput extends UpdateCarRequestBody {
  companyId: number;
  carId: number;
}

export type CarSearchBy = 'carNumber' | 'model';

export interface CarListQuery {
  page: number;
  pageSize: number;
  status?: CarStatus | undefined;
  searchBy?: CarSearchBy | undefined;
  keyword?: string | undefined;
}

export interface CarListItem {
  id: number;
  carNumber: string;
  manufacturer: string;
  model: string;
  type: CarType;
  manufacturingYear: number;
  mileage: number;
  price: number;
  accidentCount: number;
  explanation?: string | null;
  accidentDetails?: string | null;
  status: CarStatus;
}

export interface CarListResponse {
  currentPage: number;
  totalPages: number;
  totalItemCount: number;
  data: CarListItem[];
}


