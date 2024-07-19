export type ErrorData = {
  message: string;
  errors?: FieldError[];
};

export type FieldError = {
  field: string;
  message: string;
};