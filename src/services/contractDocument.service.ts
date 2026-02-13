/**
 * 계약서 문서 서비스 - 비즈니스 로직
 * @author 김민기
 */

import { ContractDocumentRepository } from '../repositories/contractDocument.repository';
import {
  DraftContractResponseDto,
  ContractListQuery,
  ContractListResponseDto,
  ContractDocumentResponseDto,
} from '../types/contractDocument.type';
import { uploadFile, getFileStream, deleteFile, generateFileKey } from '../utils/s3.util';
import { sendContractEmail } from '../utils/email.util';
import { NotFoundError, BadRequestError } from '../errors/errors';
import { Readable } from 'stream';

export class ContractDocumentService {
  constructor(private repository: ContractDocumentRepository) {}

  async getContracts(
    query: ContractListQuery,
    companyId: number
  ): Promise<ContractListResponseDto> {
    const page = query.page || 1;
    const pageSize = query.pageSize || 10;

    const { data, total } = await this.repository.findContracts(query, companyId);

    return {
      currentPage: page,
      totalPages: total === 0 ? 1 : Math.ceil(total / pageSize),
      totalItemCount: total,
      data,
    };
  }

  async getDraftContracts(companyId: number): Promise<DraftContractResponseDto[]> {
    return this.repository.findDraftContracts(companyId);
  }

  async uploadDocument(
    contractId: number,
    file: Express.Multer.File
  ): Promise<ContractDocumentResponseDto> {
    if (!file) {
      throw new BadRequestError('파일이 필요합니다');
    }

    const fileKey = generateFileKey(contractId, file.originalname);
    await uploadFile(file.buffer, fileKey, file.mimetype);

    const document = await this.repository.create({
      contractId,
      fileName: file.originalname,
      fileKey,
      fileSize: file.size,
      mimeType: file.mimetype,
    });

    // 이메일 발송 (비동기 - 실패해도 업로드는 성공)
    try {
      const docWithContract = await this.repository.findById(document.id);
      if (docWithContract?.contract) {
        const contractName = `${docWithContract.contract.car.model} - ${docWithContract.contract.customer.name}`;
        await sendContractEmail(
          docWithContract.contract.customer.email,
          docWithContract.contract.customer.name,
          contractName,
          [{ filename: file.originalname, content: file.buffer }]
        );
      }
    } catch (emailError) {
      console.error('이메일 발송 실패:', emailError);
    }

    return { contractDocumentId: document.id };
  }

  async downloadDocument(
    contractDocumentId: number
  ): Promise<{ stream: Readable; fileName: string; mimeType: string }> {
    const document = await this.repository.findById(contractDocumentId);
    if (!document) {
      throw new NotFoundError('계약서 문서를 찾을 수 없습니다');
    }

    const stream = await getFileStream(document.fileKey);
    return {
      stream,
      fileName: document.fileName,
      mimeType: document.mimeType,
    };
  }

  async deleteDocument(contractDocumentId: number): Promise<void> {
    const document = await this.repository.findById(contractDocumentId);
    if (!document) {
      throw new NotFoundError('계약서 문서를 찾을 수 없습니다');
    }

    await deleteFile(document.fileKey);
    await this.repository.delete(contractDocumentId);
  }

  async deleteDocumentsByIds(documentIds: number[]): Promise<void> {
    const documents = await this.repository.findByIds(documentIds);
    if (documents.length === 0) {
      throw new NotFoundError('삭제할 문서를 찾을 수 없습니다');
    }

    await Promise.all(documents.map((doc) => deleteFile(doc.fileKey)));
    await this.repository.deleteByIds(documentIds);
  }
}
