import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";

import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";

import { useLoginMutation } from "../api/auth-queries";
import { type LoginFormValues, loginSchema } from "../model/auth-schema";
import { AuthFormErrorAlert } from "./AuthFormErrorAlert";

interface LoginFormProps extends React.ComponentProps<"div"> {
  signUpTo: React.ComponentProps<typeof Link>["to"];
  onLoginSuccess: () => void;
}

export function LoginForm({ className, onLoginSuccess, signUpTo, ...props }: LoginFormProps) {
  const loginMutation = useLoginMutation();
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const isSubmitting = loginMutation.isPending;

  const handleLoginSubmit = handleSubmit(async (values) => {
    loginMutation.reset();

    try {
      await loginMutation.mutateAsync(values);
      onLoginSuccess();
    } catch {
      // Mutation error is rendered from loginMutation.error.
    }
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>로그인</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(event) => {
              void handleLoginSubmit(event);
            }}
            noValidate
          >
            <FieldGroup>
              {loginMutation.error ? (
                <AuthFormErrorAlert error={loginMutation.error} title="로그인에 실패했습니다." />
              ) : null}
              <Field data-invalid={!!errors.email}>
                <FieldLabel htmlFor="login-email">이메일</FieldLabel>
                <Input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  disabled={isSubmitting}
                  {...register("email")}
                />
                <FieldError errors={[errors.email]} />
              </Field>
              <Field data-invalid={!!errors.password}>
                <FieldLabel htmlFor="login-password">비밀번호</FieldLabel>
                <Input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  aria-invalid={!!errors.password}
                  disabled={isSubmitting}
                  {...register("password")}
                />
                <FieldError errors={[errors.password]} />
              </Field>
              <Field>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2Icon className="animate-spin" /> : null}
                  로그인
                </Button>
                <FieldDescription className="text-center">
                  계정이 없으신가요? <Link to={signUpTo}>회원가입</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
