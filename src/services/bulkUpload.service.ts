/**
 * 대용량 업로드 서비스 - 비즈니스 로직
 * @author 김민기
 */

import { Readable } from 'stream';
import csvParser from 'csv-parser';
import { BulkUploadRepository } from '../repositories/bulkUpload.repository';
import { CustomerCsvRow, VehicleCsvRow, CSV_LIMITS } from '../types/bulkUpload.type';
import { BadRequestError } from '../errors/errors';
import { Gender } from '@prisma/client';

export class BulkUploadService {
  constructor(private repository: BulkUploadRepository) {}

  async processCustomerUpload(
    file: Express.Multer.File,
    userId: number,
    companyId: number
  ): Promise<{ message: string }> {
    if (!file) {
      throw new BadRequestError('잘못된 요청입니다');
    }

    const rows = await this.parseCsv<CustomerCsvRow>(file.buffer);

    if (rows.length === 0) {
      throw new BadRequestError('잘못된 요청입니다');
    }

    if (rows.length > CSV_LIMITS.MAX_ROWS) {
      throw new BadRequestError('잘못된 요청입니다');
    }

    const genderMap: Record<string, Gender> = {
      male: Gender.MALE,
      female: Gender.FEMALE,
      MALE: Gender.MALE,
      FEMALE: Gender.FEMALE,
    };

    const customers = rows.map((row) => {
      const result: {
        name: string;
        email: string;
        gender: Gender;
        phoneNumber: string;
        region?: string;
        ageGroup?: string;
        memo?: string;
      } = {
        name: row.name.trim(),
        email: row.email.trim(),
        gender: genderMap[row.gender.trim()] || Gender.MALE,
        phoneNumber: row.phoneNumber.trim(),
      };
      if (row.region?.trim()) result.region = row.region.trim();
      if (row.ageGroup?.trim()) result.ageGroup = row.ageGroup.trim();
      if (row.memo?.trim()) result.memo = row.memo.trim();
      return result;
    });

    await this.repository.bulkCreateCustomers(customers, userId, companyId);
    return { message: '성공적으로 등록되었습니다' };
  }

  async processVehicleUpload(
    file: Express.Multer.File,
    companyId: number
  ): Promise<{ message: string }> {
    if (!file) {
      throw new BadRequestError('잘못된 요청입니다');
    }

    const rows = await this.parseCsv<VehicleCsvRow>(file.buffer);

    if (rows.length === 0) {
      throw new BadRequestError('잘못된 요청입니다');
    }

    if (rows.length > CSV_LIMITS.MAX_ROWS) {
      throw new BadRequestError('잘못된 요청입니다');
    }

    const vehicles = rows.map((row) => {
      const result: {
        carNumber: string;
        manufacturer: string;
        model: string;
        type: string;
        manufacturingYear: number;
        mileage: number;
        price: bigint;
        accidentCount: number;
        explanation?: string;
        accidentDetails?: string;
      } = {
        carNumber: row.carNumber.trim(),
        manufacturer: row.manufacturer.trim(),
        model: row.model.trim(),
        type: '세단',
        manufacturingYear: Number(row.manufacturingYear),
        mileage: Number(row.mileage),
        price: BigInt(row.price),
        accidentCount: Number(row.accidentCount) || 0,
      };
      if (row.explanation?.trim()) result.explanation = row.explanation.trim();
      if (row.accidentDetails?.trim()) result.accidentDetails = row.accidentDetails.trim();
      return result;
    });

    await this.repository.bulkCreateVehicles(vehicles, companyId);
    return { message: '성공적으로 등록되었습니다' };
  }

  private parseCsv<T>(buffer: Buffer): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const results: T[] = [];
      const stream = Readable.from(buffer);
      stream
        .pipe(csvParser())
        .on('data', (data: T) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', (error) => reject(new BadRequestError('잘못된 요청입니다')));
    });
  }
}
