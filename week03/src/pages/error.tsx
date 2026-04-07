import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError() as { status?: number; statusText?: string; message?: string };

  return (
    <main style={{ padding: 24 }}>
      <h1>에러가 발생했어요!</h1>
      <p>{error?.statusText || error?.message || '알 수 없는 에러가 발생했어요.'}</p>
      <a href="/">홈으로</a>
    </main>
  )
}

export default ErrorPage;