import { describe, it } from 'node:test';
import assert from 'node:assert';
import { api } from '../../setup';
import { initialCollections, initialUsers } from '../../data/initialData';
import { login } from '../../test-helpers';
import { collectionService } from '../../../services';

const getPath = (id: string) => `/collections/${id}`;

describe('deleteCollection', () => {
  it('deletes the collection specified with the ID', async () => {
    await Promise.all(initialUsers.map(async ({ email, password }, i) => {
      const { token } = await login(email, password);

      await Promise.all(initialCollections[i].map(collection => (
        api.delete(getPath(collection.id)).set('Authorization', `Bearer ${token}`).send().expect(204)
      )));
    }));

    const count = await collectionService.count();
    assert.strictEqual(count, 0);
  });

  it('fails to delete the collection with an unauthenticated request', async () => {
    const collection = initialCollections[0][0];
    await api.delete(getPath(collection.id)).send().expect(401);
  });

  it('fails to delete the collection to which the authenticated user has no permission', async () => {
    const user = initialUsers[1];
    const collection = initialCollections[0][0];
    const { token } = await login(user.email, user.password);
    await api.delete(getPath(collection.id)).set('Authorization', `Bearer ${token}`).send().expect(403);
  });

  it('results in a 404 error when the specified collection ID does not exist', async () => {
    const user = initialUsers[1];
    const { token } = await login(user.email, user.password);
    await api.delete(getPath('nonexistentid')).set('Authorization', `Bearer ${token}`).send().expect(404);
  });
});