import { Request, Router } from 'express';
import { collectionService, entryService, getEntryId } from '../../../services';
import { AddEntryRequestBody, BatchAddEntriesRequestBody, NewEntryParams, WithId } from '../../../types';
import { BadRequestError, CollectionNotFoundError, ForbiddenError, RequestValidationError, UnauthorizedError, ValidationError, ValidationErrorParams } from '../../../errors';
import {
  examplesResolver,
  termResolver,
  validateDefinition,
  validateExamples,
  validatePriority,
  validateTerm,
  catchValidationError
} from '../../../utils';
import { ContentTooLargeError } from '../../../errors/ContentTooLargeError';

const router = Router();

const validate = (body: Request['body']): BatchAddEntriesRequestBody => {
  const errors: ValidationErrorParams[] = [];
  const params: BatchAddEntriesRequestBody = [];

  if (!Array.isArray(body)) throw new BadRequestError();
  if (body.length > 200) throw new ContentTooLargeError();

  body.forEach(obj => {
    const entry: Partial<BatchAddEntriesRequestBody[number]> = {};

    try {
      entry.term = validateTerm(obj.term);
    } catch (err) {
      catchValidationError(err, errors);
    }

    try {
      entry.definition = validateDefinition(obj.definition);
    } catch (err) {
      catchValidationError(err, errors);
    }

    if (obj.examples) {
      try {
        entry.examples = validateExamples(obj.examples);
      } catch (err) {
        catchValidationError(err, errors);
      }
    }

    if (obj.priority) {
      try {
        entry.priority = validatePriority(obj.priority);
      } catch (err) {
        catchValidationError(err, errors);
      }
    }

    if (errors.length > 0) throw new RequestValidationError(errors);
    params.push(entry as BatchAddEntriesRequestBody[number]);
  });

  return params;
};

router.post('/:collectionId/entries/batch', async (req: Request<{ collectionId: string; }, object, AddEntryRequestBody[]>, res) => {
  const { collectionId } = req.params;
  const { user } = req;
  if (!user) throw new UnauthorizedError();

  const collection = await collectionService.retrieve(collectionId);
  if (!collection) throw new CollectionNotFoundError();
  if (user.id !== collection.createdBy.id) throw new ForbiddenError();

  // Validation
  const params = validate(req.body);

  const entriesParams = await Promise.all(params.map<Promise<WithId<NewEntryParams>>>(async ({
    term, definition, examples, priority
  }) => {
    const id = getEntryId(collectionId);
    return {
      id,
      term: await termResolver(collectionId, id, term),
      definition,
      examples: await examplesResolver(collectionId, id, examples ?? []),
      priority: priority ?? 3
    };
  }));

  await entryService.batchCreate(collectionId, entriesParams);

  return res.sendStatus(201);
});

export { router as batchAddEntriesRouter };