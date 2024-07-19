import { Request, Router } from 'express';
import { FirebaseError } from 'firebase-admin';
import { auth } from '../../fbAdmin';
import { userService } from '../../services';
import { CreateUserRequestBody, NewUserParams, WithId } from '../../types';
import { BadRequestError, RequestValidationError, ValidationErrorParams } from '../../errors';
import { validateBio, validateEmail, validateImageUrl, validateUsername, validateId, catchValidationError } from '../../utils';

const router = Router();

const validate = (body: Request['body']): CreateUserRequestBody => {
  const errors: ValidationErrorParams[] = [];
  const params: Partial<CreateUserRequestBody> = {};

  try {
    params.id = validateId(body.id);
  } catch (err) {
    catchValidationError(err, errors);
  }

  try {
    params.email = validateEmail(body.email);
  } catch (err) {
    catchValidationError(err, errors);
  }

  try {
    params.username = validateUsername(body.username);
  } catch (err) {
    catchValidationError(err, errors);
  }

  if (body.bio) {
    try {
      params.bio = validateBio(body.bio);
    } catch (err) {
      catchValidationError(err, errors);
    }
  }

  if (body.imageUrl) {
    try {
      params.imageUrl = validateImageUrl(body.imageUrl);
    } catch (err) {
      catchValidationError(err, errors);
    }
  }

  if (errors.length > 0) throw new RequestValidationError(errors);
  return params as CreateUserRequestBody;
};

router.post('/', async (req, res) => {
  // Validation
  const { id, email, username, ...params } = validate(req.body);
  const bio = params.bio ?? '';
  const imageUrl = params.imageUrl ?? null;

  try {
    // Ensure that the user is registered in the auth system
    const authUser = await auth.getUser(id);
    if (email !== authUser.email) throw new BadRequestError('The email addresses do not match');

    // Ensures that the username is not in use
    const foundUserWithUsername = await userService.findByUsername(username);
    if (foundUserWithUsername) throw new RequestValidationError([{ field: 'username', message: 'The username is already in use' }]);

    const user = await userService.create(id, {
      email, username, bio, imageUrl
    });

    return res.status(201).json(user);

  } catch (err) {
    const { code } = err as FirebaseError;
    if (code === 'auth/user-not-found') {
      throw new BadRequestError(`The user with ID ${id} does not exist`);
    }
    throw err;
  }
});

export { router as createUserRouter };