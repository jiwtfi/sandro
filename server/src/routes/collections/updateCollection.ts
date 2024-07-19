import { Request, Router } from 'express';
import { collectionService } from '../../services';
import { UpdateCollectionRequestBody } from '../../types';
import { CollectionNotFoundError, ForbiddenError, RequestValidationError, UnauthorizedError, ValidationErrorParams } from '../../errors';
import { catchValidationError, validateCollectionDescription, validateCollectionTitle } from '../../utils';
import { serializeCollection } from '../../utils/serializer';

const router = Router();

const validate = (body: Request['body']): UpdateCollectionRequestBody => {
  const errors: ValidationErrorParams[] = [];
  const params: UpdateCollectionRequestBody = {};

  // private

  if (body.title) {
    try {
      params.title = validateCollectionTitle(body.title);
    } catch (err) {
      catchValidationError(err, errors);
    }
  }

  if (body.description) {
    try {
      params.description = validateCollectionDescription(body.description);
    } catch (err) {
      catchValidationError(err, errors);
    }
  }

  if (errors.length > 0) throw new RequestValidationError(errors);
  return params as UpdateCollectionRequestBody;
};

router.patch('/:collectionId', async (req, res) => {
  const { collectionId } = req.params;
  const { user } = req;
  if (!user) throw new UnauthorizedError();

  const collection = await collectionService.retrieve(collectionId);
  if (!collection) throw new CollectionNotFoundError();
  if (user.id !== collection.createdBy.id) throw new ForbiddenError();

  // Validation
  const params = validate(req.body);

  if (Object.keys(params).length === 0) return res.json(serializeCollection(collection));

  const updatedCollection = await collectionService.update(collectionId, params);
  return res.json(serializeCollection(updatedCollection));
});

export { router as updateCollectionRouter };