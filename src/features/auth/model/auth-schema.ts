import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .min(1, "이메일을 입력해 주세요.")
  .max(320, "이메일은 320자 이하여야 합니다.")
  .pipe(z.email("올바른 형식의 이메일 주소를 입력해 주세요."))
  .transform((email) => email.toLowerCase());

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 72;

const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, "비밀번호는 8자 이상이어야 합니다.")
  .max(PASSWORD_MAX_LENGTH, "비밀번호는 72자 이하여야 합니다.")
  .regex(/[a-z]/, "비밀번호에는 소문자가 포함되어야 합니다.")
  .regex(/[A-Z]/, "비밀번호에는 대문자가 포함되어야 합니다.")
  .regex(/[0-9]/, "비밀번호에는 숫자가 포함되어야 합니다.");

export const signupSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "비밀번호 확인을 입력해 주세요."),
    displayName: z
      .string()
      .trim()
      .min(1, "이름을 입력해 주세요.")
      .max(30, "이름은 30자 이하여야 합니다."),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "비밀번호가 일치하지 않습니다.",
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "비밀번호를 입력해 주세요."),
});

export type SignupFormValues = z.infer<typeof signupSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
