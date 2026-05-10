import { useNavigate } from "react-router-dom";
import useForm from "../hooks/useForm";
import { postSignup } from "../api/auth";
import { validateSignup } from "../utils/validate";
import { useState } from "react";

export default function SignupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { values, errors, touched, getInputProps } = useForm({
    initialValue: { name: "", email: "", password: "", confirmPassword: "" },
    validate: validateSignup,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (Object.values(errors).some((err) => err)) {
      console.log("유효성 검사 실패");
      return;
    }

    try {
      setLoading(true);
      const res = await postSignup({
        name: values.name,
        email: values.email,
        password: values.password,
      });

      if (res.status) {
        alert("회원가입 성공");
        navigate("/login");
      } else {
        alert(res.message || "회원가입 실패");
      }
    } catch (error) {
      console.error("error: ", error);
      alert("회원가입 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto mt-20 p-6 flex flex-col gap-3 border rounded-2xl shadow"
    >
      <h1 className="text-xl font-bold text-center mb-2">회원가입</h1>

      <button
        type="button"
        className="w-full flex items-center justify-center gap-2 border border-gray-400 py-2 rounded mb-4 cursor-pointer"
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          className="w-5 h-5"
        />
        <span>Google로 회원가입</span>
      </button>

      <div className="flex items-center my-2">
        <hr className="flex-grow border-gray-300" />
        <span className="px-2 text-gray-400 text-sm">OR</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      <input
        {...getInputProps("name")}
        placeholder="이름"
        className="border p-2 rounded"
      />
      {touched.name && errors.name && (
        <p className="text-red-500 text-sm">{errors.name}</p>
      )}

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

      <input
        {...getInputProps("confirmPassword")}
        type="password"
        placeholder="비밀번호 확인"
        className="border p-2 rounded"
      />
      {touched.confirmPassword && errors.confirmPassword && (
        <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:bg-gray-400"
      >
        {loading ? "가입 중..." : "회원가입"}
      </button>
    </form>
  );
}
