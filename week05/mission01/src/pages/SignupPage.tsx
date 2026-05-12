import { useMemo, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import {
  IoChevronBack,
  IoEyeOffOutline,
  IoEyeOutline,
} from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import useForm from "../hooks/useForm";
import { validateSignup } from "../utils/validate";
import type { SignupFormValues } from "../utils/validate";

export default function SignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const validate = (values: SignupFormValues) =>
    validateSignup(values);

  const { values, errors, touched, getInputProps, handleBlur } =
    useForm<SignupFormValues>({
      initialValues: {
        email: "",
        password: "",
        passwordConfirm: "",
        nickname: "",
      },
      validate,
    });

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

  const handleNext = () => {
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

    console.log("회원가입 완료", values);
    navigate("/");
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
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-[1200px] flex-col px-6">
        <div className="flex items-center justify-between py-5">
          <h1 className="text-3xl font-extrabold text-pink-500">돌려돌려LP판</h1>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="rounded border border-gray-500 bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
            >
              로그인
            </button>

            <button
              type="button"
              className="rounded bg-pink-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-pink-600"
            >
              회원가입
            </button>
          </div>
        </div>

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
              type="button"
              onClick={handleNext}
              disabled={!isCurrentStepValid}
              className={`h-[48px] w-full rounded-md text-base font-semibold transition ${
                isCurrentStepValid
                  ? "bg-pink-500 text-white hover:bg-pink-600"
                  : "cursor-not-allowed bg-[#1f1f1f] text-gray-500"
              }`}
            >
              {step === 3 ? "회원가입 완료" : "다음"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}