import { FcGoogle } from "react-icons/fc";
import { IoChevronBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import useForm from "../hooks/useForm";
import { validateLogin } from "../utils/validate";
import type { LoginFormValues } from "../utils/validate";

export default function LoginPage() {
  const navigate = useNavigate();

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

  const handleSubmit = () => {
    handleBlur("email");
    handleBlur("password");

    if (!isFormValid) return;

    console.log("로그인 시도", values);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-[1200px] flex-col px-6">
        <div className="flex items-center justify-between py-5">
          <h1 className="text-3xl font-extrabold text-pink-500">돌려돌려LP판</h1>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded bg-black px-4 py-2 text-sm font-medium text-white border border-gray-500 hover:bg-gray-800 transition-colors"
            >
              로그인
            </button>
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="rounded bg-pink-500 px-4 py-2 text-sm font-medium text-white hover:bg-pink-600 transition-colors"
            >
              회원가입
            </button>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center">
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
              className="mb-6 flex h-[48px] w-full items-center justify-center gap-3 rounded-md border border-gray-400 bg-black text-white hover:bg-gray-800 transition-colors"
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
      </div>
    </div>
  );
}