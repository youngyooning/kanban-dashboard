import { PATHS } from "@/app/routes/paths";
import { SignupForm } from "@/features/auth";

export function SignupPage() {
  return (
    <main>
      <SignupForm loginTo={PATHS.LOGIN} />
    </main>
  );
}
