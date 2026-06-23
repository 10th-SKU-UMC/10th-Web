import { useMemo, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import {
  IoChevronBack,
  IoEyeOffOutline,
  IoEyeOutline,
} from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { postSignup } from "../apis/auth";
import useForm from "../hooks/useForm";
import { validateSignup } from "../utils/validate";
import type { SignupFormValues } from "../utils/validate";

export default function SignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);



  const { values, errors, touched, getInputProps, handleBlur } =
    useForm<SignupFormValues>({
      initialValues: {
        email: "",
        password: "",
        passwordConfirm: "",
        nickname: "",
      },
      validate: validateSignup,
    });

  const handleGoogleLogin = () => {
    const baseURL = import.meta.env.VITE_SERVER_URL;

    if (!baseURL) {
      alert("서버 주소가 설정되지 않았습니다.");
      return;
    }

    window.location.href = `${baseURL}/v1/auth/google/login`;
  }

  const isStep1Valid = useMemo(() => {
    return values.email.trim() !== "" && !errors.email;
  }, [values.email, errors.email]);

  const isStep2Valid = useMemo(() => {
    return (
      values.password.trim() !== "" &&
      values.passwordConfirm.trim() !== "" &&
      !errors.password &&
      !errors.passwordConfirm
    );
  }, [
    values.password,
    values.passwordConfirm,
    errors.password,
    errors.passwordConfirm,
  ]);

  const isStep3Valid = useMemo(() => {
    return values.nickname.trim() !== "" && !errors.nickname;
  }, [values.nickname, errors.nickname]);

  const isCurrentStepValid =
    (step === 1 && isStep1Valid) ||
    (step === 2 && isStep2Valid) ||
    (step === 3 && isStep3Valid);

  const handleNext = async () => {
    if (isSubmitting) return; // 중복 제출 방지

    if (step === 1) {
      handleBlur("email");
      if (!isStep1Valid) return;
      setStep(2);
      return;
    }

    if (step === 2) {
      handleBlur("password");
      handleBlur("passwordConfirm");
      if (!isStep2Valid) return;
      setStep(3);
      return;
    }

    handleBlur("nickname");
    if (!isStep3Valid) return;

    try {
      setIsSubmitting(true);
      await postSignup({
        email: values.email,
        password: values.password,
        name: values.nickname,
      });
      alert("회원가입이 완료되었습니다.");
      navigate("/login");
    } catch (error) {
      console.error("회원가입 중 오류가 발생했습니다:", error);
      const message =
        error instanceof Error
          ? error.message
          : "회원가입 중 오류가 발생했습니다. 다시 시도해주세요.";
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (step === 1) {
      navigate(-1);
      return;
    }

    if (step === 2) {
      setStep(1);
      return;
    }

    setStep(2);
  };

  return (
    <div className="flex min-h-full items-center justify-center bg-black px-6 py-10 text-white">
      <form
        className="w-full max-w-[360px]"
        onSubmit={(e) => {
          e.preventDefault();
          handleNext();
        }}
      >

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-[360px]">
            <button
              type="button"
              onClick={handleBack}
              className="mb-6 flex items-center text-white"
            >
              <IoChevronBack size={24} />
            </button>

            <h2 className="mb-8 text-center text-3xl font-bold">회원가입</h2>

            {step === 1 && (
              <>
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

                <div className="mb-6">
                  <input
                    type="email"
                    placeholder="이메일을 입력해주세요!"
                    className="h-[48px] w-full rounded-md border border-gray-500 bg-[#111] px-4 text-white outline-none placeholder:text-gray-500 focus:border-blue-500"
                    {...getInputProps("email")}
                  />
                  <div className="mt-2 min-h-[20px] text-sm text-red-500">
                    {touched.email && errors.email}
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="mb-4 flex items-center gap-2 text-sm text-gray-300">
                  <MdEmail size={18} />
                  <span>{values.email}</span>
                </div>

                <div className="mb-4">
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="비밀번호를 입력해주세요!"
                      className="h-[48px] w-full rounded-md border border-gray-500 bg-[#111] px-4 pr-12 text-white outline-none placeholder:text-gray-500 focus:border-blue-500"
                      {...getInputProps("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? (
                        <IoEyeOutline size={20} />
                      ) : (
                        <IoEyeOffOutline size={20} />
                      )}
                    </button>
                  </div>
                  <div className="mt-2 min-h-[20px] text-sm text-red-500">
                    {touched.password && errors.password}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="relative">
                    <input
                      type={showPasswordConfirm ? "text" : "password"}
                      placeholder="비밀번호를 다시 한 번 입력해주세요!"
                      className="h-[48px] w-full rounded-md border border-gray-500 bg-[#111] px-4 pr-12 text-white outline-none placeholder:text-gray-500 focus:border-blue-500"
                      {...getInputProps("passwordConfirm")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordConfirm((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showPasswordConfirm ? (
                        <IoEyeOutline size={20} />
                      ) : (
                        <IoEyeOffOutline size={20} />
                      )}
                    </button>
                  </div>
                  <div className="mt-2 min-h-[20px] text-sm text-red-500">
                    {touched.passwordConfirm && errors.passwordConfirm}
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <div className="mb-6 flex flex-col items-center">
                <div className="mb-5 flex h-40 w-40 items-center justify-center rounded-full bg-gray-200">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-300" />
                </div>

                <div className="w-full">
                  <input
                    type="text"
                    placeholder="닉네임을 입력해주세요"
                    className="h-[48px] w-full rounded-md border border-gray-500 bg-[#111] px-4 text-white outline-none placeholder:text-gray-500 focus:border-blue-500"
                    {...getInputProps("nickname")}
                  />
                  <div className="mt-2 min-h-[20px] text-sm text-red-500">
                    {touched.nickname && errors.nickname}
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={!isCurrentStepValid || isSubmitting}
              className={`h-[48px] w-full rounded-md text-base font-semibold transition ${
                isCurrentStepValid && !isSubmitting
                  ? "bg-pink-500 text-white hover:bg-pink-600"
                  : "cursor-not-allowed bg-[#1f1f1f] text-gray-500"
              }`}
            >
              {isSubmitting ? "처리 중..." : step === 3 ? "회원가입 완료" : "다음"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}