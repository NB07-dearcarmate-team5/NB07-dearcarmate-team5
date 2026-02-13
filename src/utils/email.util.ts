/**
 * 이메일 발송 유틸리티
 * @author 김민기
 *
 * 계약서 등록 시 고객에게 자동으로 이메일 발송
 *
 * 환경변수 (.env):
 * - SMTP_HOST=smtp.gmail.com
 * - SMTP_PORT=587
 * - SMTP_USER=your-email@gmail.com
 * - SMTP_PASS=your-app-password
 * - SMTP_FROM=noreply@dearcarmate.com
 */

import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter | null = null;

export const createTransporter = (): nodemailer.Transporter => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
};

export const sendContractEmail = async (
  to: string,
  customerName: string,
  contractName: string,
  attachments: { filename: string; content: Buffer }[]
): Promise<void> => {
  const transport = createTransporter();
  const html = getContractEmailTemplate(customerName, contractName);

  await transport.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: `[DearCarMate] ${contractName} 계약서가 등록되었습니다`,
    html,
    attachments: attachments.map((a) => ({
      filename: a.filename,
      content: a.content,
    })),
  });
};

export const getContractEmailTemplate = (
  customerName: string,
  contractName: string
): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333;">계약서 등록 안내</h2>
      <p>${customerName} 고객님, 안녕하세요.</p>
      <p><strong>${contractName}</strong> 관련 계약서가 등록되었습니다.</p>
      <p>첨부된 파일을 확인해 주시기 바랍니다.</p>
      <hr style="border: 1px solid #eee; margin: 20px 0;" />
      <p style="color: #888; font-size: 12px;">본 메일은 DearCarMate에서 자동 발송되었습니다.</p>
    </div>
  `;
};
