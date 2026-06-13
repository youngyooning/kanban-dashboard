import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2Icon, Loader2Icon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";

import { cn } from "@/shared/lib/cn";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";

import { useSignupMutation } from "../api/auth-queries";
import { type SignupFormValues, signupSchema } from "../model/auth-schema";
import { AuthFormErrorAlert } from "./AuthFormErrorAlert";

interface SignupFormProps extends React.ComponentProps<"div"> {
  loginTo: React.ComponentProps<typeof Link>["to"];
}

export function SignupForm({ className, loginTo, ...props }: SignupFormProps) {
  const signupMutation = useSignupMutation();
  const [verificationEmail, setVerificationEmail] = useState<string | null>(null);
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const isSubmitting = signupMutation.isPending;
  const isVerificationEmailSent = !!verificationEmail;
  const isFormDisabled = isSubmitting || isVerificationEmailSent;

  const handleSignupSubmit = handleSubmit(async (values) => {
    const input = {
      displayName: values.displayName,
      email: values.email,
      password: values.password,
    };

    setVerificationEmail(null);
    signupMutation.reset();

    try {
      const result = await signupMutation.mutateAsync(input);

      if (result.status === "emailVerificationSent") {
        setVerificationEmail(result.email);
      }
    } catch {
      // Mutation error is rendered from signupMutation.error.
    }
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>회원가입</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(event) => {
              void handleSignupSubmit(event);
            }}
            noValidate
          >
            <FieldGroup>
              {signupMutation.error ? (
                <AuthFormErrorAlert error={signupMutation.error} title="회원가입에 실패했습니다." />
              ) : null}
              {verificationEmail ? (
                <Alert>
                  <CheckCircle2Icon />
                  <AlertTitle>인증 이메일을 보냈습니다.</AlertTitle>
                  <AlertDescription>
                    <p>
                      {verificationEmail}로 인증 이메일을 보냈습니다. 이메일 인증 후 로그인해
                      주세요.
                    </p>
                    <p>
                      <Link to={loginTo}>로그인으로 이동</Link>
                    </p>
                  </AlertDescription>
                </Alert>
              ) : null}
              <Field data-invalid={!!errors.displayName}>
                <FieldLabel htmlFor="sign-up-display-name">이름</FieldLabel>
                <Input
                  id="sign-up-display-name"
                  type="text"
                  autoComplete="name"
                  aria-invalid={!!errors.displayName}
                  disabled={isFormDisabled}
                  {...register("displayName")}
                />
                <FieldError errors={[errors.displayName]} />
              </Field>
              <Field data-invalid={!!errors.email}>
                <FieldLabel htmlFor="sign-up-email">이메일</FieldLabel>
                <Input
                  id="sign-up-email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  disabled={isFormDisabled}
                  {...register("email")}
                />
                <FieldError errors={[errors.email]} />
              </Field>
              <Field data-invalid={!!errors.password}>
                <FieldLabel htmlFor="sign-up-password">비밀번호</FieldLabel>
                <Input
                  id="sign-up-password"
                  type="password"
                  autoComplete="new-password"
                  aria-invalid={!!errors.password}
                  disabled={isFormDisabled}
                  {...register("password")}
                />
                {errors.password ? (
                  <FieldError errors={[errors.password]} />
                ) : (
                  <FieldDescription>
                    8자 이상, 영문 대소문자와 숫자를 포함해 주세요.
                  </FieldDescription>
                )}
              </Field>
              <Field data-invalid={!!errors.confirmPassword}>
                <FieldLabel htmlFor="sign-up-confirm-password">비밀번호 확인</FieldLabel>
                <Input
                  id="sign-up-confirm-password"
                  type="password"
                  autoComplete="new-password"
                  aria-invalid={!!errors.confirmPassword}
                  disabled={isFormDisabled}
                  {...register("confirmPassword")}
                />
                <FieldError errors={[errors.confirmPassword]} />
              </Field>
              <Field>
                <Button type="submit" disabled={isFormDisabled}>
                  {isSubmitting ? <Loader2Icon className="animate-spin" /> : null}
                  {isVerificationEmailSent ? "인증 이메일 발송 완료" : "회원가입"}
                </Button>
                <FieldDescription className="text-center">
                  이미 계정이 있으신가요? <Link to={loginTo}>로그인</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
