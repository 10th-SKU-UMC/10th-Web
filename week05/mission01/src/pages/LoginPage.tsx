import { FcGoogle } from "react-icons/fc";
import { IoChevronBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import useForm from "../hooks/useForm";
import { useAuth } from "../hooks/useAuth";
import { validateLogin } from "../utils/validate";
import type { LoginFormValues } from "../utils/validate";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const { values, errors, touched, getInputProps, handleBlur } =
    useForm<LoginFormValues>({
      initialValues: {
        email: "",
        password: "",
      },
      validate: validateLogin,
    });

  const isFormValid =
    values.email.trim() !== "" &&
    values.password.trim() !== "" &&
    !errors.email &&
    !errors.password;

  const handleSubmit = async () => {
    handleBlur("email");
    handleBlur("password");

    if (!isFormValid) return;

    await login({
      email: values.email,
      password: values.password,
    });

    navigate("/mypage");
  };

  return (
    <div className="flex min-h-full items-center justify-center bg-black px-6 py-10 text-white">
      <div className="w-full max-w-[360px]">
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
            className="h-[48px] w-full rounded-md border border-gray-500 bg-[#111] px-4 text-white outline-none placeholder:text-gray-500 focus:border-blue-500"
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
            className="h-[48px] w-full rounded-md border border-gray-500 bg-[#111] px-4 text-white outline-none placeholder:text-gray-500 focus:border-blue-500"
            {...getInputProps("password")}
          />
          <div className="mt-2 min-h-[20px] text-sm text-red-500">
            {touched.password && errors.password}
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isFormValid}
          className={`h-[48px] w-full rounded-md text-base font-semibold transition ${
            isFormValid
              ? "bg-pink-500 text-white hover:bg-pink-600"
              : "cursor-not-allowed bg-[#1f1f1f] text-gray-500"
          }`}
        >
          로그인
        </button>
      </div>
    </div>
  );
}