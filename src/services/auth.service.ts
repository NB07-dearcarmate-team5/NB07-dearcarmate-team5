import bcrypt from 'bcrypt';
import { AuthRepository } from '../repositories/auth.repository';
import { BadRequestError, UnauthorizedError, ConflictError, NotFoundError } from '../errors/errors';
import { 
  generateAccessToken, 
  generateRefreshToken, 
  verifyRefreshToken 
} from '../utils/token';
import { SignUpType } from '../structs/user.struct';
import { User } from '../models/user.model';

export class AuthService {
  private authRepository = new AuthRepository();

  async signUp(data: SignUpType) {
    const company = await this.authRepository.findCompanyByName(data.companyName);
    if (!company) {
      throw new BadRequestError('존재하지 않는 기업명입니다.');
    }
    if (company.companyCode !== data.companyCode) {
      throw new BadRequestError('기업 인증 코드가 일치하지 않습니다.');
    }

    const existingUser = await this.authRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError('이미 존재하는 이메일입니다.');
    }

    const existingEmployee = await this.authRepository.findByEmployeeNumber(data.employeeNumber);
    if (existingEmployee) {
      throw new ConflictError('이미 등록된 사원 번호입니다.');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await this.authRepository.createUser({
      email: data.email,
      password: hashedPassword,
      name: data.name,
      employeeNumber: data.employeeNumber,
      phoneNumber: data.phoneNumber,
      company: { connect: { id: company.id } },
    });

    return new User(newUser);
  }

  async login(email: string, password: string) {
    const user = await this.authRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundError('존재하지 않거나 비밀번호가 일치하지 않습니다');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    const accessToken = generateAccessToken({ 
      userId: user.id, 
      companyId: user.companyId ,
      isAdmin: user.isAdmin
    });
    const refreshToken = generateRefreshToken({ 
      userId: user.id 
    });

    await this.authRepository.updateRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken, user: new User(user) };
  }

  async refreshTokens(token: string) {
    const payload = verifyRefreshToken(token);
    if (!payload) {
      throw new UnauthorizedError('만료되었거나 유효하지 않은 리프레시 토큰입니다.');
    }

    const user = await this.authRepository.findById(payload.userId); 
    if (!user || user.refreshToken !== token) {
      throw new UnauthorizedError('인증 정보가 일치하지 않습니다.');
    }

    const accessToken = generateAccessToken({ 
      userId: user.id, 
      companyId: user.companyId,
      isAdmin: user.isAdmin
    });
    const newRefreshToken = generateRefreshToken({ 
      userId: user.id 
    });

    await this.authRepository.updateRefreshToken(user.id, newRefreshToken);

    return { accessToken, refreshToken: newRefreshToken };
  }
}