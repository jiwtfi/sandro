import { describe, it } from 'node:test';
import assert from 'node:assert';
import { api } from '../../setup';
import { initialCollections, initialUsers } from '../../data/initialData';
import { login } from '../../test-helpers';
import { testCollections } from '../../data/collections';
import { UpdateCollectionRequestBody } from '../../../types';

const getPath = (id: string) => `/collections/${id}`;

const params: UpdateCollectionRequestBody = {
  title: testCollections[0].title,
  description: testCollections[0].description
};

describe('updateCollection', () => {
  it('updates the collection', async () => {
    const { email, password } = initialUsers[0];
    const { id: userId, token } = await login(email, password);
    const collection = initialCollections[0][0];

    const { body } = await api.patch(getPath(collection.id)).set('Authorization', `Bearer ${token}`).send(params).expect(200);

    assert.strictEqual(body.createdBy, userId);
    assert.strictEqual(body.title, params.title);
    assert.strictEqual(body.description, params.description);
    assert.strictEqual(body.private, collection.private);

    // more cases
    // isPrivate
  });

  // invalid data

  it('fails to updates the collection with an unauthenticated request', async () => {
    const collection = initialCollections[0][0];
    await api.patch(getPath(collection.id)).send(params).expect(401);
  });

  it('fails to updates the collection to which the authenticated user has no permission', async () => {
    const user = initialUsers[1];
    const collection = initialCollections[0][0];
    const { token } = await login(user.email, user.password);
    await api.patch(getPath(collection.id)).set('Authorization', `Bearer ${token}`).send(params).expect(403);
  });

  it('results in a 404 error when the specified collection ID does not exist', async () => {
    const user = initialUsers[1];
    const collection = initialCollections[0][0];
    const { token } = await login(user.email, user.password);
    await api.patch(getPath('nonexistentid')).set('Authorization', `Bearer ${token}`).send(params).expect(404);
  });

});