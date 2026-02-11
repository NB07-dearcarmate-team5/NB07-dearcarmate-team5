/**
 * 대용량 업로드 리포지토리 - DB 접근 계층
 * @author 김민기
 */

import prisma from '../prisma/prisma';
import { Gender } from '@prisma/client';

export class BulkUploadRepository {
  async bulkCreateCustomers(
    customers: {
      name: string;
      email: string;
      gender: Gender;
      phoneNumber: string;
      region?: string;
      ageGroup?: string;
      memo?: string;
    }[],
    userId: number,
    companyId: number
  ): Promise<number> {
    const result = await prisma.customer.createMany({
      data: customers.map((c) => ({
        ...c,
        userId,
        companyId,
        region: c.region || null,
        ageGroup: c.ageGroup || null,
        memo: c.memo || null,
      })),
      skipDuplicates: true,
    });
    return result.count;
  }

  async bulkCreateVehicles(
    vehicles: {
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
    }[],
    companyId: number
  ): Promise<number> {
    const result = await prisma.car.createMany({
      data: vehicles.map((v) => ({
        ...v,
        companyId,
        explanation: v.explanation || null,
        accidentDetails: v.accidentDetails || null,
      })),
      skipDuplicates: true,
    });
    return result.count;
  }
}
