import { useMemo, useState } from "react";

export type FormErrors<T> = Partial<Record<keyof T, string>>;
type FormTouched<T> = Partial<Record<keyof T, boolean>>;

interface UseFormProps<T extends object> {
  initialValues: T;
  validate: (values: T) => FormErrors<T>;
}

function useForm<T extends object>({
  initialValues,
  validate,
}: UseFormProps<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [touched, setTouched] = useState<FormTouched<T>>({});

  const errors = useMemo(() => {
    return validate(values);
  }, [values, validate]);

  const handleChange = (name: keyof T, value: string) => {
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleBlur = (name: keyof T) => {
    setTouched((prevTouched) => ({
      ...prevTouched,
      [name]: true,
    }));
  };

  const getInputProps = (name: keyof T) => ({
    name: String(name),
    value: String(values[name] ?? ""),
    onChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => handleChange(name, e.target.value),
    onBlur: () => handleBlur(name),
  });

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    getInputProps,
  };
}

export default useForm;