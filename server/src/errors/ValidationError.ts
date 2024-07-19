export interface ValidationErrorParams {
  field: string;
  message: string;
}

export class ValidationError extends Error {
  errors: ValidationErrorParams[];

  constructor(params: ValidationErrorParams[]) {
    super();
    this.errors = params;
  }
}