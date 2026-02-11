import {
  object,
  string,
  optional,
  pattern,
  refine,
  size,
  Infer,
  coerce,
  integer,
  min,
} from 'superstruct';

export const Email = pattern(
  string(),
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
);
export const Phone = pattern(string(), /^\d{2,3}-\d{3,4}-\d{4}$/);
export const Password = pattern(string(), /^(?=.*[a-zA-Z])(?=.*\d).{8,16}$/);

export const SignUpStruct = refine(
  object({
    name: size(string(), 1, 100),
    email: Email,
    employeeNumber: size(string(), 1, 100),
    phoneNumber: Phone,
    password: Password,
    passwordConfirm: size(string(), 1, 100),
    companyName: size(string(), 1, 100),
    companyCode: size(string(), 1, 100),
  }),
  'SignUpStruct',
  (data) =>
    data.password === data.passwordConfirm ||
    '비밀번호와 비밀번호 확인이 일치하지 않습니다.',
);

export const LoginStruct = object({
  email: Email,
  password: string(),
});

export const UpdateUserStruct = refine(
  object({
    imageUrl: optional(size(string(), 1, 1000)),
    employeeNumber: optional(size(string(), 1, 100)),
    phoneNumber: optional(Phone),
    password: optional(Password),
    passwordConfirm: optional(size(string(), 1, 100)),
    currentPassword: string(),
  }),
  'UpdateUserStruct',
  (data) => {
    if (data.password && data.password !== data.passwordConfirm) {
      return '비밀번호와 비밀번호 확인이 일치하지 않습니다.';
    }
    return true;
  },
);

export const UserIdParamStruct = object({
  userId: coerce(min(integer(), 1), string(), (value) => Number(value)),
});

export type SignUpType = Infer<typeof SignUpStruct>;
export type LoginType = Infer<typeof LoginStruct>;
export type UpdateUserType = Infer<typeof UpdateUserStruct>;
export type UserIdParamType = Infer<typeof UserIdParamStruct>;
