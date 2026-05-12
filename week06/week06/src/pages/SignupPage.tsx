import z from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSignup } from "../apis/auth";

const schema = z
  .object({
    email: z.string().email({ message: "이메일 형식이 올바르지 않습니다." }),
    password: z
      .string()
      .min(8, { message: "비밀번호는 8자 이상이어야 합니다." })
      .max(20, { message: "비밀번호는 20자 이하여야 합니다." }),
    passwordCheck: z
      .string()
      .min(8, { message: "비밀번호는 8자 이상이어야 합니다." })
      .max(20, { message: "비밀번호는 20자 이하여야 합니다." }),
    name: z.string().min(1, { message: "이름은 1자 이상이어야 합니다." }),
  })
  .refine((data) => data.password === data.passwordCheck, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordCheck"],
  });

type FormFields = z.infer<typeof schema>;

const SignupPage = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordCheck: "",
    },
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const { passwordCheck: _, ...rest } = data;
      await postSignup(rest);
      alert("회원가입 성공");
      navigate("/login");
    } catch (error) {
      console.error("회원가입 오류", error);
      alert("회원가입 실패");
    }
  };

  const fields: {
    name: keyof FormFields;
    placeholder: string;
    type: string;
  }[] = [
    { name: "email", placeholder: "이메일", type: "email" },
    { name: "password", placeholder: "비밀번호", type: "password" },
    { name: "passwordCheck", placeholder: "비밀번호 확인", type: "password" },
    { name: "name", placeholder: "이름", type: "text" },
  ];

  return (
    <div className="flex items-center justify-center h-full bg-gray-50">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">회원가입</h1>

        <div className="flex flex-col gap-3">
          {fields.map(({ name, placeholder, type }) => (
            <div key={name} className="flex flex-col gap-1">
              <input
                {...register(name)}
                type={type}
                placeholder={placeholder}
                className={`w-full border px-4 py-3 rounded-md text-sm outline-none transition-colors focus:border-blue-500 ${
                  errors[name] ? "border-red-400 bg-red-50" : "border-gray-300"
                }`}
              />
              {errors[name] && (
                <p className="text-red-500 text-xs">{errors[name]?.message}</p>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="w-full bg-blue-500 text-white py-3 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed mt-1"
          >
            회원가입
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          이미 계정이 있으신가요?{" "}
          <Link to="/login" className="text-blue-500 font-medium hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
