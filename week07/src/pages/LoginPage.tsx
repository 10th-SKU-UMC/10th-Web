import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useForm from "../hooks/useForm.ts";
import { type UserSigninInformation, validateSignin } from "../utils/validate.ts";
import { useAuth } from "../context/AuthContext.tsx";
import useLogin from "../hooks/mutations/useLogin.ts";

const LoginPage = () => {
  const { isAuthenticated, isAuthLoading } = useAuth();
  const { mutateAsync: login, isPending: isLoggingIn } = useLogin();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from ?? "/";

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [navigate, isAuthenticated, isAuthLoading, from]);

  const { values, error, touched, getInputProps } =
    useForm<UserSigninInformation>({
      initialValue: {
        email: "",
        password: "",
      },
      validate: validateSignin,
    });

  const [loginError, setLoginError] = useState("");

  const isDisabled =
    Object.values(error || {}).some((e: string) => e.length > 0) ||
    Object.values(values).some((value) => value === "");

  const isDisabledSubmit = isDisabled || isLoggingIn;

  const handleSubmit = async () => {
    try {
      setLoginError("");
      await login(values);
      navigate(from, { replace: true });
    } catch {
      setLoginError("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href =
      import.meta.env.VITE_SERVER_API_URL + "/v1/auth/google/login";
  };

  return (
    <div className="flex items-center justify-center h-full bg-gray-50">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">로그인</h1>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <input
              {...getInputProps("email")}
              name="email"
              type="email"
              placeholder="이메일"
              className={`w-full border px-4 py-3 rounded-md text-sm outline-none transition-colors focus:border-blue-500 ${
                error.email && touched.email
                  ? "border-red-400 bg-red-50"
                  : "border-gray-300"
              }`}
            />
            {error.email && touched.email && (
              <p className="text-red-500 text-xs">{error.email}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <input
              {...getInputProps("password")}
              type="password"
              placeholder="비밀번호"
              className={`w-full border px-4 py-3 rounded-md text-sm outline-none transition-colors focus:border-blue-500 ${
                error.password && touched.password
                  ? "border-red-400 bg-red-50"
                  : "border-gray-300"
              }`}
            />
            {error.password && touched.password && (
              <p className="text-red-500 text-xs">{error.password}</p>
            )}
          </div>

          {loginError && (
            <p className="text-red-500 text-sm text-center -mb-1">{loginError}</p>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isDisabledSubmit}
            className="w-full bg-blue-500 text-white py-3 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed mt-1"
          >
            {isLoggingIn ? "로그인 중..." : "로그인"}
          </button>

          <div className="relative flex items-center my-1">
            <div className="flex-1 border-t border-gray-200" />
            <span className="px-3 text-xs text-gray-400">또는</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <img
              src="/images/google.webp"
              alt="Google"
              className="w-5 h-5 object-contain"
            />
            구글로 로그인
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          계정이 없으신가요?{" "}
          <Link to="/signup" className="text-blue-500 font-medium hover:underline">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
