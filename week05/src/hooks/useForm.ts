import { useState, useEffect, type ChangeEvent } from "react";

interface UseFormProps<T> {
  initialValue: T;
  validate: (values: T) => Record<keyof T, string>;
}

export default function useForm<T>({
  initialValue,
  validate,
}: UseFormProps<T>) {
  const [values, setValues] = useState(initialValue);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (name: keyof T, value: string) =>
    setValues((prev) => ({ ...prev, [name]: value }));

  const handleBlur = (name: keyof T) =>
    setTouched((prev) => ({ ...prev, [name]: true }));

  const getInputProps = (name: keyof T) => ({
    value: values[name],
    onChange: (e: ChangeEvent<HTMLInputElement>) =>
      handleChange(name, e.target.value),
    onBlur: () => handleBlur(name),
  });

  useEffect(() => {
    setErrors(validate(values));
  }, [values, validate]);

  return { values, errors, touched, getInputProps };
}
