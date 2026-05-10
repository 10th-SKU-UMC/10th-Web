export type FieldError<T> = Partial<Record<keyof T, string>>;
export type Touched<T> = Partial<Record<keyof T, boolean>>;
