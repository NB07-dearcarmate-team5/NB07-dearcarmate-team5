import { object, string, optional, pattern, refine, Infer } from 'superstruct';

export const Email = pattern(string(),/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
export const Phone = pattern(string(), /^\d{2,3}-\d{3,4}-\d{4}$/);
export const Password = pattern(string(), /^(?=.*[a-zA-Z])(?=.*\d).{8,16}$/);

export const SignUpStruct = refine(
  object({
    name: string(),
    email: Email,
    employeeNumber: string(),
    phoneNumber: Phone,
    password: Password,
    passwordConfirm: string(),
    companyName: string(),
    companyCode: string(),
  }),
  'SignUpStruct',
  (data) => data.password === data.passwordConfirm || '비밀번호가 일치하지 않습니다.'
);

export const LoginStruct = object({
  email: Email,
  password: string(),
});

export const UpdateUserStruct = refine(
  object({
    imageUrl: optional(string()),
    employeeNumber: optional(string()),
    phoneNumber: optional(Phone),
    password: optional(Password),
    passwordConfirm: optional(string()),
    currentPassword: string(),
  }),
  'UpdateUserStruct',
  (data) => {
    if (data.password && data.password !== data.passwordConfirm) {
      return '새 비밀번호가 일치하지 않습니다.';
    }
    return true;
  }
);

export type SignUpType = Infer<typeof SignUpStruct>;
export type LoginType = Infer<typeof LoginStruct>;
export type UpdateUserType = Infer<typeof UpdateUserStruct>;