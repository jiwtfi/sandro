import { Request, Router } from 'express';
import { collectionService, entryService, getEntryId } from '../../../services';
import { AddEntryRequestBody, NewEntryParams, WithId } from '../../../types';
import { CollectionNotFoundError, ForbiddenError, RequestValidationError, UnauthorizedError, ValidationErrorParams } from '../../../errors';
import {
  examplesResolver,
  termResolver,
  validateDefinition,
  validateExamples,
  validateImageUrls,
  validatePriority,
  validateTerm,
  catchValidationError
} from '../../../utils';

const router = Router();

const validate = (body: Request['body']): AddEntryRequestBody => {
  const errors: ValidationErrorParams[] = [];
  const params: Partial<AddEntryRequestBody> = {};

  try {
    params.term = validateTerm(body.term);
  } catch (err) {
    catchValidationError(err, errors);
  }

  try {
    params.definition = validateDefinition(body.definition);
  } catch (err) {
    catchValidationError(err, errors);
  }

  if (body.examples) {
    try {
      params.examples = validateExamples(body.examples);
    } catch (err) {
      catchValidationError(err, errors);
    }
  }

  if (body.imageUrls) {
    try {
      params.imageUrls = validateImageUrls(body.imageUrls);
    } catch (err) {
      catchValidationError(err, errors);
    }
  }

  if (body.priority) {
    try {
      params.priority = validatePriority(body.priority);
    } catch (err) {
      catchValidationError(err, errors);
    }
  }

  if (errors.length > 0) throw new RequestValidationError(errors);
  return params as AddEntryRequestBody;

};

router.post('/:collectionId/entries', async (req: Request<{ collectionId: string; }, object, AddEntryRequestBody>, res) => {
  const { collectionId } = req.params;
  const { user } = req;
  if (!user) throw new UnauthorizedError();

  const collection = await collectionService.retrieve(collectionId);
  if (!collection) throw new CollectionNotFoundError();
  if (user.id !== collection.createdBy.id) throw new ForbiddenError();

  // Validation
  const { term, definition, ...params } = validate(req.body);
  const examples = params.examples ?? [];
  const imageUrls = params.imageUrls ?? [];
  const priority = params.priority ?? 3;

  const entryId = getEntryId(collectionId);

  const entryParams: NewEntryParams = {
    term: await termResolver(collectionId, entryId, term),
    definition,
    examples: await examplesResolver(collectionId, entryId, examples),
    imageUrls, priority
  };

  const entry = await entryService.create(collectionId, entryId, entryParams);

  return res.status(201).json(entry);
});

export { router as addEntryRouter };