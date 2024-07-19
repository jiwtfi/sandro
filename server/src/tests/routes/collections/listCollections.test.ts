import { describe, it } from 'node:test';
import assert from 'node:assert';
import { api } from '../../setup';
import { initialCollections, initialUsers } from '../../data/initialData';
import { login } from '../../test-helpers';

const path = '/collections';

describe('listCollections', () => {
  it('returns the list of collections associated with the authenticated user', async () => {
    await Promise.all(initialUsers.map(async ({ email, password }, i) => {
      const { id: userId, token } = await login(email, password);
      const { body } = await api.get(path).set('Authorization', `Bearer ${token}`).send().expect(200);
      assert.strictEqual(body.length, initialCollections[i].length);
      initialCollections[i].forEach(collection => {
        const foundCollection = body.find((element: any) => element.id === collection.id);
        assert.strictEqual(foundCollection.createdBy, userId);
        assert.strictEqual(foundCollection.title, collection.title);
        assert.strictEqual(foundCollection.description, collection.description);
        assert.strictEqual(foundCollection.private, collection.private);
      });
    }));
  });

  it('fails to return a list of collections with an unauthenticated request', async () => {
    await api.get(path).send().expect(401);
  });
});