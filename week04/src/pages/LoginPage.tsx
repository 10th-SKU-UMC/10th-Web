import { useState } from "react";
import { useNavigate } from "react-router-dom";
import googleIcon from "../assets/googleIcon.svg";
import { loginSchema, type LoginFormData } from "../schema/authSchema";
import type { FieldError, Touched } from "../types/form";
import type { User } from "../types/auth";
import {
  getFieldErrors,
  getSingleFieldError,
  validateForm,
} from "../utils/validate";
import useLocalStorage from "../hooks/useLocalStorage";

export default function LoginPage() {
  const navigate = useNavigate();
  const [users] = useLocalStorage<User[]>("users", []);
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<FieldError<LoginFormData>>({});
  const [touched, setTouched] = useState<Touched<LoginFormData>>({});
  const [submitError, setSubmitError] = useState("");

  const handleChange =
    (field: keyof LoginFormData) =>
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
          [field]: getSingleFieldError(loginSchema, nextFormData, field),
        }));
      }
    };

  const handleBlur = (field: keyof LoginFormData) => () => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));

    setError((prev) => ({
      ...prev,
      [field]: getSingleFieldError(loginSchema, formData, field),
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = validateForm(loginSchema, formData);

    if (!result.success) {
      setError(getFieldErrors(loginSchema, formData));
      setTouched({
        email: true,
        password: true,
      });
      return;
    }

    const matchedUser = users.find(
      (user) =>
        user.email === result.data.email &&
        user.password === result.data.password,
    );

    if (!matchedUser) {
      setSubmitError("이메일 또는 비밀번호가 올바르지 않습니다.");
      return;
    }

    localStorage.setItem("isLoggedIn", JSON.stringify(true));
    localStorage.setItem("currentUser", JSON.stringify(matchedUser));
    setError({});
    setSubmitError("");
    navigate("/");
  };

  const isValid = validateForm(loginSchema, formData).success;

  return (
    <div className="min-h-screen flex justify-center items-center px-4">
      <div className="w-full max-w-[400px] p-6 flex flex-col gap-3 border rounded-2xl shadow justify-center items-center">
        <div className="text-xl font-bold text-center mb-2">로그인</div>

        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 border border-gray-400 py-2 rounded mb-4 cursor-pointer"
        >
          <img src={googleIcon} alt="Google" className="w-5 h-5" />
          <p>구글 로그인</p>
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

          {submitError && <p className="text-sm text-red-500">{submitError}</p>}

          <button
            type="submit"
            disabled={!isValid}
            className={`w-full p-2 rounded text-white ${
              isValid ? "bg-blue-600" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}
