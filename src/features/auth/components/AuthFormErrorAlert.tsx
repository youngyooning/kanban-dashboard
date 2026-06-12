import { AlertCircleIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert";

import { getAuthErrorMessage } from "../api/auth-errors";

interface AuthFormErrorAlertProps {
  error: unknown;
  title: string;
}

export function AuthFormErrorAlert({ error, title }: AuthFormErrorAlertProps) {
  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{getAuthErrorMessage(error)}</AlertDescription>
    </Alert>
  );
}
