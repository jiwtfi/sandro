import { describe, it } from 'node:test';
import assert from 'node:assert';
import { api } from '../../../setup';
import { login } from '../../../test-helpers';
import { initialCollections, initialUsers } from '../../../data/initialData';
import { entryService } from '../../../../services';

const getPath = (collectionId: string) => `/collections/${collectionId}/entries`;

describe('listEntries', () => {
  // it('returns the list of entries in the collection specified with the ID', async () => {
  //   await Promise.all(initialUsers.map(async ({ email, password }, i) => {
  //     const { id: userId, token } = await login(email, password);
  //     await Promise.all(initialCollections[i].map(async collection => {
  //       const { body } = await api.get(getPath(collection.id)).set('Authorization', `Bearer ${token}`).send().expect(200);
  //       const { data: entries, pagination } = body;

  //       // pagination

  //     }));

  //     assert.strictEqual(body.length, initialCollections[i].length);
  //     initialCollections[i].forEach(collection => {
  //       const foundCollection = body.find((element: any) => element.id === collection.id);
  //       assert.strictEqual(foundCollection.createdBy, userId);
  //       assert.strictEqual(foundCollection.title, collection.title);
  //       assert.strictEqual(foundCollection.description, collection.description);
  //       assert.strictEqual(foundCollection.private, collection.private);
  //     });
  //   }));
  // });

  // it('fails to return a list of collections with an unauthenticated request', async () => {
  //   await api.get(path).send().expect(401);
  // });
});