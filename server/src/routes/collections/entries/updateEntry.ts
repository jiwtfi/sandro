import { Request, Router } from 'express';
import { collectionService, entryService } from '../../../services';
import { UpdateEntryParams, UpdateEntryRequestBody } from '../../../types';
import { CollectionNotFoundError, EntryNotFoundError, ForbiddenError, RequestValidationError, UnauthorizedError, ValidationErrorParams } from '../../../errors';
import {
  examplesResolver,
  termResolver,
  validateDefinition,
  validateExamples,
  validatePriority,
  validateTerm,
  catchValidationError
} from '../../../utils';

const router = Router();

const validate = (body: Request['body']): UpdateEntryRequestBody => {
  const errors: ValidationErrorParams[] = [];
  const params: UpdateEntryRequestBody = {};

  if (body.term) {
    try {
      params.term = validateTerm(body.term);
    } catch (err) {
      catchValidationError(err, errors);
    }
  }

  if (body.definition) {
    try {
      params.definition = validateDefinition(body.definition);
    } catch (err) {
      catchValidationError(err, errors);
    }
  }

  if (body.examples) {
    try {
      params.examples = validateExamples(body.examples);
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
  return params as UpdateEntryRequestBody;

};

router.patch('/:collectionId/entries/:entryId', async (req, res) => {
  const { collectionId, entryId } = req.params;
  const { user } = req;
  if (!user) throw new UnauthorizedError();

  const collection = await collectionService.retrieve(collectionId);
  if (!collection) throw new CollectionNotFoundError();
  if (user.id !== collection.createdBy.id) throw new ForbiddenError();

  const entry = await entryService.retrieve(collectionId, entryId);
  if (!entry) throw new EntryNotFoundError();

  // Validation
  const params = validate(req.body);

  const entryParams: UpdateEntryParams = {
    ...(params.term ? { term: await termResolver(collectionId, entryId, params.term) } : {}),
    ...(params.definition ? { definition: params.definition } : {}),
    ...(params.examples ? { examples: await examplesResolver(collectionId, entryId, params.examples) } : {}),
    ...(params.priority ? { priority: params.priority } : {}),
    ...(params.index ? { index: params.index } : {}),
  };

  if (Object.keys(entryParams).length === 0) return res.json(entry);

  const updatedEntry = await entryService.update(collectionId, entryId, entryParams);

  return res.json(updatedEntry);
});

export { router as updateEntryRouter };