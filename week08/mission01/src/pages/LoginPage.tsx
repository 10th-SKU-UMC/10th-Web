import { FcGoogle } from "react-icons/fc";
import { IoChevronBack } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import useForm from "../hooks/useForm";
import { useAuth } from "../hooks/useAuth";
import { validateLogin } from "../utils/validate";
import type { LoginFormValues } from "../utils/validate";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // location.state.from이 string임을 확인했으므로 그대로 사용
  // (as {from:string}).from 처럼 다시 객체로 단언하면 undefined가 됨)
  const from =
    typeof location.state === "object" &&
    location.state !== null &&
    typeof location.state.from === "string"
      ? location.state.from
      : "/";
  const { values, errors, touched, getInputProps, handleBlur } =
    useForm<LoginFormValues>({
      initialValues: {
        email: "",
        password: "",
      },
      validate: validateLogin,
    });

  const handleGoogleLogin = () => {
    const baseURL = import.meta.env.VITE_SERVER_URL;

    if (!baseURL) {
      alert("서버 주소가 설정되지 않았습니다.");
      return;
    }

    window.location.href = `${baseURL}/v1/auth/google/login`;
  };

  const isFormValid =
    values.email.trim() !== "" &&
    values.password.trim() !== "" &&
    !errors.email &&
    !errors.password;

  const loginMutation = useMutation({
    mutationFn: () => login({ email: values.email, password: values.password }),
    onSuccess: () => {
      alert("로그인에 성공했습니다.");
      navigate(from, { replace: true });
    },
    onError: () => {
      alert("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
    },
  });

  const handleSubmit = () => {
    handleBlur("email");
    handleBlur("password");
    if (!isFormValid) return;
    loginMutation.mutate();
  };

  return (
    <div className="flex min-h-full items-center justify-center bg-black px-6 py-10 text-white">
      <form
        className="w-full max-w-[360px]"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-white"
        >
          <IoChevronBack size={24} />
        </button>

        <h2 className="mb-8 text-center text-3xl font-bold">로그인</h2>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="mb-6 flex h-[48px] w-full items-center justify-center gap-3 rounded-md border border-gray-400 bg-black text-white transition-colors hover:bg-gray-800"
        >
          <FcGoogle size={22} />
          <span className="font-medium">구글 로그인</span>
        </button>

        <div className="mb-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-500" />
          <span className="text-sm font-semibold text-gray-300">OR</span>
          <div className="h-px flex-1 bg-gray-500" />
        </div>

        <div className="mb-4">
          <input
            type="email"
            placeholder="이메일을 입력해주세요"
            className="h-[48px] w-full rounded-md border border-gray-500 bg-[#111] px-4 text-white outline-none placeholder:text-gray-500 focus:border-pink-500"
            {...getInputProps("email")}
          />
          <div className="mt-2 min-h-[20px] text-sm text-red-500">
            {touched.email && errors.email}
          </div>
        </div>

        <div className="mb-6">
          <input
            type="password"
            placeholder="비밀번호를 입력해주세요"
            className="h-[48px] w-full rounded-md border border-gray-500 bg-[#111] px-4 text-white outline-none placeholder:text-gray-500 focus:border-pink-500"
            {...getInputProps("password")}
          />
          <div className="mt-2 min-h-[20px] text-sm text-red-500">
            {touched.password && errors.password}
          </div>
        </div>

        <button
          type="submit"
          disabled={!isFormValid || loginMutation.isPending}
          className={`h-[48px] w-full rounded-md text-base font-semibold transition ${
            isFormValid
              ? "bg-pink-500 text-white hover:bg-pink-600 disabled:opacity-70"
              : "cursor-not-allowed bg-[#1f1f1f] text-gray-500"
          }`}
        >
          {loginMutation.isPending ? "로그인 중..." : "로그인"}
        </button>
      </form>
    </div>
  );
}