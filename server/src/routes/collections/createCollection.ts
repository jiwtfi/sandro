import { Request, Router } from 'express';
import { collectionService } from '../../services';
import { CreateCollectionRequestBody, NewCollectionParams } from '../../types';
import { RequestValidationError, UnauthorizedError, ValidationErrorParams } from '../../errors';
import { serializeCollection } from '../../utils/serializer';
import { catchValidationError, validateCollectionDescription, validateCollectionTitle } from '../../utils';

const router = Router();

const validate = (body: Request['body']): CreateCollectionRequestBody => {
  const errors: ValidationErrorParams[] = [];
  const params: Partial<NewCollectionParams> = {};

  try {
    params.title = validateCollectionTitle(body.title);
  } catch (err) {
    catchValidationError(err, errors);
  }

  try {
    params.description = body.description ? validateCollectionDescription(body.description) : '';
  } catch (err) {
    catchValidationError(err, errors);
  }

  // isPrivate
  params.private = body.private

  if (errors.length > 0) throw new RequestValidationError(errors);
  return params as CreateCollectionRequestBody;
};

router.post('/', async (req, res) => {
  const { user } = req;
  if (!user) throw new UnauthorizedError();

  // Validation
  const { title, ...params } = validate(req.body);
  const description = params.description ?? '';
  const isPrivate = params.private ?? false;

  const collection = await collectionService.create({
    createdBy: user.id, title, description,
    private: isPrivate
  });

  return res.status(201).json(serializeCollection(collection));
});

export { router as createCollectionRouter };