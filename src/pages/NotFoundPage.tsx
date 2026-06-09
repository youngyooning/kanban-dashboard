import { Link } from "react-router";

import { PATHS } from "@/app/routes/paths";

export function NotFoundPage() {
  return (
    <main>
      <h1>페이지를 찾을 수 없습니다.</h1>
      <Link to={PATHS.ROOT}>시작 화면으로 이동</Link>
    </main>
  );
}
