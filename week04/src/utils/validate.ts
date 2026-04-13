import { ZodType } from "zod";
import type { FieldError } from "../types/form";

export function validateForm<T extends Record<string, unknown>>(
  schema: ZodType<T>,
  formData: T,
) {
  return schema.safeParse(formData);
}

export function getFieldErrors<T extends Record<string, unknown>>(
  schema: ZodType<T>,
  formData: T,
): FieldError<T> {
  const result = schema.safeParse(formData);

  if (result.success) {
    return {};
  }

  const flattened = result.error.flatten().fieldErrors;
  const errors: FieldError<T> = {};

  for (const key in flattened) {
    const value = flattened[key];
    if (value?.[0]) {
      errors[key as keyof T] = value[0];
    }
  }

  return errors;
}

export function getSingleFieldError<T extends Record<string, unknown>>(
  schema: ZodType<T>,
  formData: T,
  field: keyof T,
) {
  const errors = getFieldErrors(schema, formData);
  return errors[field] || "";
}
