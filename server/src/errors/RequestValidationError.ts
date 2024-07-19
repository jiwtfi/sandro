import { BadRequestError } from './BadRequestError';
import { ValidationErrorParams } from './ValidationError';


export class RequestValidationError extends BadRequestError {
  errors: ValidationErrorParams[];

  constructor(errors: ValidationErrorParams[]) {
    super('The request contains invalid values');
    this.errors = errors;
  }

  serializeError = () => ({ message: this.message, errors: this.errors });
}