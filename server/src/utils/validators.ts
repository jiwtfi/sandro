import { isEmail, isLength, isURL } from 'validator';
import { AddEntryRequestExampleParams, AddEntryRequestTermParams, Definition, Example } from '../types';
import { PaginationParams } from '../types/pagination';
import { ValidationError, ValidationErrorParams } from '../errors/ValidationError';

type Validator<T = any> = (value: unknown, ...args: any[]) => T;

const sanitizeText = (text: string) => text.trim();

const isString = (str: unknown): str is string => (
  typeof str === 'string' || str instanceof String
);

const isNumber = (num: unknown): num is number => (
  typeof num === 'number' || num instanceof Number
);

const isObject = (obj: unknown): obj is Record<string, unknown> => (
  !!obj && typeof obj === 'object' && !Array.isArray(obj)
);


export const validateText: Validator<string> = (text, { field, message }: ValidationErrorParams) => {
  if (!isString(text)) throw new ValidationError([{ field, message }]);
  return sanitizeText(text);
};

export const validateId: Validator<string> = (text, errorParams?: ValidationErrorParams) => {
  const errParams = errorParams ?? { field: 'id', message: 'The ID is invalid' };
  return validateText(text, errParams);
}

export const validateEmail: Validator<string> = (text) => {
  const errorParams = { field: 'email', message: 'The email address is invalid' };
  if (!isString(text)) throw new ValidationError([errorParams]);
  const email = sanitizeText(text);
  if (!isEmail(email)) throw new ValidationError([errorParams]);
  return email;
};


export const validateUsername: Validator<string> = (text) => {
  const errorParams = { field: 'username', message: 'The username is invalid' };
  const usernameRegEx = /^[a-zA-Z0-9_]+$/;
  if (!isString(text)) throw new ValidationError([errorParams]);
  const username = sanitizeText(text);
  if (!isLength(username, { min: 3, max: 20 }) || !usernameRegEx.test(username)) throw new ValidationError([errorParams]);
  return username;
};

export const validateBio: Validator<string> = (text) => {
  const errorParams = { field: 'bio', message: 'The bio is invalid' };
  if (!isString(text)) throw new ValidationError([errorParams]);
  const bio = sanitizeText(text);
  if (!isLength(bio, { min: 0, max: 360 })) throw new ValidationError([errorParams]);
  return bio;
};

export const validateCollectionTitle: Validator<string> = (text) => {
  const errorParams = { field: 'title', message: 'The title is invalid' };
  if (!isString(text)) throw new ValidationError([errorParams]);
  const title = sanitizeText(text);
  if (!isLength(title, { min: 1, max: 60 })) throw new ValidationError([errorParams]);
  return title;
};

export const validateCollectionDescription: Validator<string> = (text) => {
  const errorParams = { field: 'description', message: 'The description is invalid' };
  if (!isString(text)) throw new ValidationError([errorParams]);
  const title = sanitizeText(text);
  if (!isLength(title, { min: 1, max: 360 })) throw new ValidationError([errorParams]);
  return title;
};

export const validateLang: Validator<string> = (text, errorParams: ValidationErrorParams) => {
  if (!isString(text)) throw new ValidationError([errorParams]);
  const lang = sanitizeText(text);
  if (!isLength(lang, { min: 1, max: 20 })) throw new ValidationError([errorParams]);
  return lang;
};

export const validateUrl: Validator<string> = (text, errorParams?: ValidationErrorParams) => {
  const errParams = errorParams ?? { field: 'url', message: 'The URL is invalid' };
  if (!isString(text)) throw new ValidationError([errParams]);
  const url = sanitizeText(text);
  if (!isURL(text)) throw new ValidationError([errParams]);
  return url;
};

export const validateAudioUrl: Validator<string> = (text, errorParams?: ValidationErrorParams) => {
  const errParams = errorParams ?? { field: 'audioUrl', message: 'The audio URL is invalid' };
  return validateUrl(text, errParams);
};

export const validateTerm: Validator<AddEntryRequestTermParams> = (params) => {
  const textErrorParams = { field: 'term.text', message: 'The term text is invalid' };
  const langErrorParams = { field: 'term.lang', message: 'The term language is invalid' };
  const audioUrlErrorParams = { field: 'term.audioUrl', message: 'The term audio URL is invalid' };

  const errors: ValidationErrorParams[] = [];
  const term: Partial<AddEntryRequestTermParams> = {};

  if (!isObject(params)) errors.push({ field: 'term', message: 'The term is invalid' });
  else {
    if (!isString(params.text)) errors.push(textErrorParams);
    else {
      term.text = sanitizeText(params.text);
      if (!isLength(term.text, { min: 1, max: 120 })) errors.push(textErrorParams);
    }

    try {
      term.lang = validateLang(params.lang, langErrorParams);
    } catch (err) {
      catchValidationError(err, errors);
    }

    if (params.audioUrl) {
      try {
        term.audioUrl = validateAudioUrl(params.lang, audioUrlErrorParams);
      } catch (err) {
        catchValidationError(err, errors);
      }
    }
  }
  if (errors.length > 0) throw new ValidationError(errors);
  return term as AddEntryRequestTermParams;
};

export const validateDefinition: Validator<Definition> = (params) => {
  const textErrorParams = { field: 'definition.text', message: 'The definition text is invalid' };
  const langErrorParams = { field: 'definition.lang', message: 'The definition language is invalid' };

  const errors: ValidationErrorParams[] = [];
  const definition: Partial<Definition> = {};

  if (!isObject(params)) errors.push({ field: 'definition', message: 'The definition is invalid' });

  else {
    if (!isString(params.text)) errors.push(textErrorParams);
    else {
      definition.text = sanitizeText(params.text);
      if (!isLength(definition.text, { min: 1, max: 240 })) errors.push(textErrorParams);
    }

    try {
      definition.lang = validateLang(params.lang, langErrorParams);
    } catch (err) {
      catchValidationError(err, errors);
    }

  }

  if (errors.length > 0) throw new ValidationError(errors);
  return definition as Definition;
};

export const validateExamples: Validator<AddEntryRequestExampleParams[]> = (params) => {
  const getExampleErrorParams = (i: number) => ({ field: `examples[${i}]`, message: 'The example is invalid' });
  const getTextErrorParams = (i: number) => ({ field: `examples[${i}].text`, message: 'The example text is invalid' });
  const getLangErrorParams = (i: number) => ({ field: `examples[${i}].lang`, message: 'The example language is invalid' });
  const getOccurrencesErrorParams = (i: number) => ({ field: `examples[${i}].occurrences`, message: 'The example occurrences are invalid' });
  const getOccurrenceErrorParams = (i: number, j: number) => ({ field: `examples[${i}].occurrences[${j}]`, message: 'The example occurrence is invalid' });
  const getAudioUrlErrorParams = (i: number) => ({ field: `examples[${i}].audioUrl`, message: 'The example audio URL is invalid' });

  const errors: ValidationErrorParams[] = [];
  const examples: AddEntryRequestExampleParams[] = [];

  if (!Array.isArray(params)) errors.push({ field: 'examples', message: 'The examples are invalid' });
  else {
    for (let i = 0; i < params.length; i++) {
      const example: Partial<Example> = {};

      if (!isObject(params[i])) errors.push(getExampleErrorParams(i));
      else {
        if (!isString(params[i].text)) errors.push(getTextErrorParams(i));
        else {
          example.text = sanitizeText(params[i].text);
          if (!isLength(example.text, { min: 1, max: 240 })) errors.push(getTextErrorParams(i));
        }

        try {
          example.lang = validateLang(params[i].lang, getLangErrorParams(i));
        } catch (err) {
          catchValidationError(err, errors);
        }

        if (!Array.isArray(params[i].occurrences)) errors.push(getOccurrencesErrorParams(i));
        example.occurrences = [];
        for (let j = 0; j < params[i].occurrences.length; j++) {
          if (!isObject(params[i].occurrences[j])) errors.push(getOccurrenceErrorParams(i, j));
          else {
            const start = isNumber(params[i].occurrences[j].start) ? params[i].occurrences[j].start : parseInt(params[i].occurrences[j].start as string);
            const end = isNumber(params[i].occurrences[j].end) ? params[i].occurrences[j].end : parseInt(params[i].occurrences[j].end as string);
            const textLength = (example.text as string).length;
            if (Number.isNaN(start) || start < 0 || start > textLength || Number.isNaN(end) || end < 0 || end > textLength) errors.push(getOccurrenceErrorParams(i, j));
            example.occurrences.push({ start, end } as Example['occurrences'][number]);
          }
        }

        if (params[i].audioUrl) {
          try {
            example.audioUrl = validateAudioUrl(params[i].audioUrl, getAudioUrlErrorParams(i));
          } catch (err) {
            catchValidationError(err, errors);
          }
        }
      }

      examples.push(example as Example);
    }
  }

  if (errors.length > 0) throw new ValidationError(errors);
  return examples;

};

export const validatePriority: Validator<number> = (num) => {
  const errorParams = { field: 'priority', message: 'The priority is invalid' };
  const priority = isNumber(num) ? num : parseInt(num as string);
  if (Number.isNaN(priority) || priority < 1 || priority > 5) throw new ValidationError([errorParams]);
  return priority;
};


export const validatePaginationParams: Validator<PaginationParams> = (params) => {
  const errors: ValidationErrorParams[] = [];
  const pagination: PaginationParams = {};

  if (!isObject(params)) errors.push({ field: 'pagination', message: 'The pagination parameters are invalid' });
  else {
    if (params.offset) {
      pagination.offset = isNumber(params.offset) ? params.offset : parseInt(params.offset as string);
      if (Number.isNaN(pagination.offset) || pagination.offset < 0) errors.push({ field: 'pagination.offset', message: 'The pagination offset is invalid' });
    }

    if (params.limit) {
      pagination.limit = isNumber(params.limit) ? params.limit : parseInt(params.limit as string);
      if (Number.isNaN(pagination.limit) || pagination.limit <= 0 || pagination.limit > 5000) errors.push({ field: 'pagination.limit', message: 'The pagination limit is invalid' });
    }
  }

  if (errors.length > 0) throw new ValidationError(errors);
  return pagination;
};

export const catchValidationError = (error: unknown, errors: ValidationErrorParams[]) => {
  (error as ValidationError).errors.forEach(error => errors.push(error));
};