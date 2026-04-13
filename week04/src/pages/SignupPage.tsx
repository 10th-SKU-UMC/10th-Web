import { useState } from "react";
import { useNavigate } from "react-router-dom";
import googleIcon from "../assets/googleIcon.svg";
import { signupSchema, type SignupFormData } from "../schema/authSchema";
import type { FieldError, Touched } from "../types/form";
import type { User } from "../types/auth";
import {
  getFieldErrors,
  getSingleFieldError,
  validateForm,
} from "../utils/validate";
import useLocalStorage from "../hooks/useLocalStorage";

export default function SignupPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useLocalStorage<User[]>("users", []);
  const [formData, setFormData] = useState<SignupFormData>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<FieldError<SignupFormData>>({});
  const [touched, setTouched] = useState<Touched<SignupFormData>>({});
  const [submitError, setSubmitError] = useState("");

  const handleChange =
    (field: keyof SignupFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const nextFormData = {
        ...formData,
        [field]: value,
      };

      setFormData(nextFormData);
      setSubmitError("");

      if (touched[field]) {
        setError((prev) => ({
          ...prev,
          [field]: getSingleFieldError(signupSchema, nextFormData, field),
        }));
      }

      if (
        (field === "password" || field === "confirmPassword") &&
        touched.confirmPassword
      ) {
        setError((prev) => ({
          ...prev,
          confirmPassword: getSingleFieldError(
            signupSchema,
            nextFormData,
            "confirmPassword",
          ),
        }));
      }
    };

  const handleBlur = (field: keyof SignupFormData) => () => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));

    setError((prev) => ({
      ...prev,
      [field]: getSingleFieldError(signupSchema, formData, field),
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = validateForm(signupSchema, formData);

    if (!result.success) {
      setError(getFieldErrors(signupSchema, formData));
      setTouched({
        email: true,
        password: true,
        confirmPassword: true,
      });
      return;
    }

    const isExist = users.some((user) => user.email === result.data.email);

    if (isExist) {
      setSubmitError("이미 가입된 이메일입니다.");
      return;
    }

    const newUser: User = {
      email: result.data.email,
      password: result.data.password,
    };

    setUsers([...users, newUser]);
    setError({});
    setSubmitError("");
    navigate("/login");
  };

  const isValid = validateForm(signupSchema, formData).success;

  return (
    <div className="min-h-screen flex justify-center items-center px-4">
      <div className="w-full max-w-[400px] p-6 flex flex-col gap-3 border rounded-2xl shadow justify-center items-center">
        <div className="text-xl font-bold text-center mb-2">회원가입</div>

        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 border border-gray-400 py-2 rounded mb-4 cursor-pointer"
        >
          <img src={googleIcon} alt="Google" className="w-5 h-5" />
          <p>구글로 회원가입</p>
        </button>

        <div className="w-full flex items-center my-2">
          <div className="flex-1 border-t border-gray-300" />
          <p className="px-2 text-gray-400 text-sm">OR</p>
          <div className="flex-1 border-t border-gray-300" />
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
          <div>
            <input
              type="email"
              placeholder="이메일"
              value={formData.email}
              onChange={handleChange("email")}
              onBlur={handleBlur("email")}
              className={`w-full border p-2 rounded ${
                touched.email && error.email
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {touched.email && error.email && (
              <p className="mt-1 text-sm text-red-500">{error.email}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="비밀번호"
              value={formData.password}
              onChange={handleChange("password")}
              onBlur={handleBlur("password")}
              className={`w-full border p-2 rounded ${
                touched.password && error.password
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {touched.password && error.password && (
              <p className="mt-1 text-sm text-red-500">{error.password}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="비밀번호 확인"
              value={formData.confirmPassword}
              onChange={handleChange("confirmPassword")}
              onBlur={handleBlur("confirmPassword")}
              className={`w-full border p-2 rounded ${
                touched.confirmPassword && error.confirmPassword
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {touched.confirmPassword && error.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">
                {error.confirmPassword}
              </p>
            )}
          </div>

          {submitError && <p className="text-sm text-red-500">{submitError}</p>}

          <button
            type="submit"
            disabled={!isValid}
            className={`w-full p-2 rounded text-white ${
              isValid ? "bg-blue-600" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
}
