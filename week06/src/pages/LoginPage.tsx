import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useForm from "../hooks/useForm";
import { validateSignin } from "../utils/validate";
import { useAuth } from "../context/AuthContext";
import googleIcon from "../assets/googleIcon.svg";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const { values, errors, touched, getInputProps } = useForm({
    initialValue: { email: "", password: "" },
    validate: validateSignin,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (Object.values(errors).some((err) => err)) {
      console.log("유효성 검사 실패");
      return;
    }

    try {
      setLoading(true);
      await login({ email: values.email, password: values.password });
      navigate("/");
    } catch (error) {
      console.error("error: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href =
      import.meta.env.VITE_API_BASE_URL + "/v1/auth/google/login";
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto mt-20 p-6 flex flex-col gap-3 border rounded-2xl shadow"
    >
      <h1 className="text-xl font-bold text-center mb-2">로그인</h1>

      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-2 border border-gray-400 py-2 rounded mb-4 cursor-pointer"
      >
        <img src={googleIcon} alt="Google" className="w-5 h-5" />
        <span>구글 로그인</span>
      </button>

      <div className="flex items-center my-2">
        <hr className="flex-grow border-gray-300" />
        <span className="px-2 text-gray-400 text-sm">OR</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      <input
        {...getInputProps("email")}
        placeholder="이메일"
        className="border p-2 rounded"
      />
      {touched.email && errors.email && (
        <p className="text-red-500 text-sm">{errors.email}</p>
      )}

      <input
        {...getInputProps("password")}
        type="password"
        placeholder="비밀번호"
        className="border p-2 rounded"
      />
      {touched.password && errors.password && (
        <p className="text-red-500 text-sm">{errors.password}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "로그인 중..." : "로그인"}
      </button>
    </form>
  );
}
