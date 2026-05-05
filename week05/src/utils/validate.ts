// 회원가입 타입
export type SignupInfo = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

// 회원가입 검증
export const validateSignup = (values: SignupInfo) => {
  const errors: Record<keyof SignupInfo, string> = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  if (!values.name.trim()) {
    errors.name = "닉네임을 입력해주세요.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "이메일 형식이 올바르지 않습니다.";
  }

  if (values.password.length < 6) {
    errors.password = "비밀번호는 6자 이상이어야 합니다.";
  }

  if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "비밀번호가 일치하지 않습니다.";
  }

  return errors;
};

// 로그인 타입
export type SigninInfo = {
  email: string;
  password: string;
};

// 로그인 검증
export const validateSignin = (values: SigninInfo) => {
  const errors: Record<keyof SigninInfo, string> = {
    email: "",
    password: "",
  };

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "이메일 형식이 올바르지 않습니다.";
  }

  if (values.password.length < 6) {
    errors.password = "비밀번호는 6자 이상이어야 합니다.";
  }

  return errors;
};
