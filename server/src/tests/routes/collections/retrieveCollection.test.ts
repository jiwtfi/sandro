import { describe, it } from 'node:test';
import assert from 'node:assert';
import { api } from '../../setup';
import { initialCollections, initialUsers } from '../../data/initialData';
import { login } from '../../test-helpers';

const getPath = (id: string) => `/collections/${id}`;

describe('retrieveCollection', () => {
  it('returns the public collection specified with the ID', async () => {
    const publicCollections = [
      initialCollections[0][0],
      initialCollections[0][2],
      initialCollections[1][0],
    ];

    await Promise.all(publicCollections.map(async collection => {
      const { body } = await api.get(getPath(collection.id)).send().expect(200);
      assert.strictEqual(body.id, collection.id);
      assert.strictEqual(body.title, collection.title);
      assert.strictEqual(body.description, collection.description);
      assert.strictEqual(body.private, collection.private);
    }));
  });

  it('returns the private collection with an authenticated request', async () => {
    const user = initialUsers[0];
    const collection = initialCollections[0][1];
    const { id: userId, token } = await login(user.email, user.password);

    const { body } = await api.get(getPath(collection.id)).set('Authorization', `Bearer ${token}`).send().expect(200);
    assert.strictEqual(body.id, collection.id);
    assert.strictEqual(body.createdBy, userId);
    assert.strictEqual(body.title, collection.title);
    assert.strictEqual(body.description, collection.description);
    assert.strictEqual(body.private, collection.private);
  });

  it('fails to return the private collection with an unauthenticated request', async () => {
    const collection = initialCollections[0][1];
    await api.get(getPath(collection.id)).send().expect(401);
  });

  it('fails to return the private collection to which the authenticated user has no access', async () => {
    const user = initialUsers[1];
    const collection = initialCollections[0][1]
    const { token } = await login(user.email, user.password);
    await api.get(getPath(collection.id)).set('Authorization', `Bearer ${token}`).send().expect(403);
  });

  it('fails to return a collection when the specified collection ID does not exist', async () => {
    await api.get(getPath('nonexistentid')).send().expect(404);
  });
});
