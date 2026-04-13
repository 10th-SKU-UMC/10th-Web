import type { FormErrors } from "../hooks/useForm";

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface SignupFormValues {
  email: string;
  password: string;
  passwordConfirm: string;
  nickname: string;
}

export const validateLogin = (
  values: LoginFormValues
): FormErrors<LoginFormValues> => {
  const errors: FormErrors<LoginFormValues> = {};

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!values.email.trim()) {
    errors.email = "이메일을 입력해주세요.";
  } else if (!emailRegex.test(values.email)) {
    errors.email = "올바른 이메일 형식을 입력해주세요.";
  }

  if (!values.password.trim()) {
    errors.password = "비밀번호를 입력해주세요.";
  } else if (values.password.length < 8) {
    errors.password = "비밀번호는 8자 이상이어야 합니다.";
  }

  return errors;
};

export const validateSignupByStep = (
  values: SignupFormValues,
  step: number
): FormErrors<SignupFormValues> => {
  const errors: FormErrors<SignupFormValues> = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (step === 1) {
    if (!values.email.trim()) {
      errors.email = "이메일을 입력해주세요.";
    } else if (!emailRegex.test(values.email)) {
      errors.email = "올바른 이메일 형식을 입력해주세요.";
    }
  }

  if (step === 2) {
    if (!values.password.trim()) {
      errors.password = "비밀번호를 입력해주세요.";
    } else if (values.password.length < 8) {
      errors.password = "비밀번호는 8자 이상이어야 합니다.";
    }

    if (!values.passwordConfirm.trim()) {
      errors.passwordConfirm = "비밀번호를 다시 한 번 입력해주세요.";
    } else if (values.password !== values.passwordConfirm) {
      errors.passwordConfirm = "비밀번호가 일치하지 않습니다.";
    }
  }

  if (step === 3) {
    if (!values.nickname.trim()) {
      errors.nickname = "닉네임을 입력해주세요.";
    }
  }

  return errors;
};