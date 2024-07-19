import { FieldError } from '../types/errors';

export const extractFieldError = (fieldErrors: FieldError[], fieldName: string) => (
  fieldErrors.find(({ field }) => field === fieldName)?.message
);