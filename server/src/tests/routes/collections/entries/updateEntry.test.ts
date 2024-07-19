import { describe, it } from 'node:test';
import assert from 'node:assert';
import { api } from '../../../setup';
import { login } from '../../../test-helpers';
import { initialCollections, initialUsers } from '../../../data/initialData';
import { entryService } from '../../../../services';
import { UpdateEntryRequestBody } from '../../../../types';

const getPath = (collectionId: string, entryId: string) => `/collections/${collectionId}/entries/${entryId}`;

const params: UpdateEntryRequestBody = {
  term: {
    text: '',
    lang: ''
  },
  examples: []
};

describe('updateEntry', () => {
  // it('updates the entry', async () => {
  //   await Promise.all(initialUsers.map(async ({ email, password }, i) => {
  //     if (i >= initialCollections.length || initialCollections[i].length === 0) return;
  //     const { token } = await login(email, password);

  //     await Promise.all(initialCollections[i].map(async collection => {
  //       await Promise.all(collection.entries.map(({ id: entryId }) => (
  //         api.patch(getPath(collection.id, entryId)).set('Authorization', `Bearer ${token}`).send().expect(200)
  //       )));
  //       const count = await entryService.count(collection.id);
  //       assert.strictEqual(count, 0);
  //     }));
  //   }));
  // });

  // it('fails to update the entry with an unauthenticated request', async () => {
  //   const collection = initialCollections[0][0];
  //   const entry = collection.entries[0];
  //   await api.patch(getPath(collection.id, entry.id)).send().expect(401);
  // });

  // it('fails to update the entry to which the authenticated user has no permission', async () => {
  //   const user = initialUsers[1];
  //   const collection = initialCollections[0][0];
  //   const entry = collection.entries[0];
  //   const { token } = await login(user.email, user.password);
  //   await api.patch(getPath(collection.id, entry.id)).set('Authorization', `Bearer ${token}`).send().expect(403);
  // });

  // it('results in a 404 error when the specified collection ID does not exist', async () => {
  //   const user = initialUsers[0];
  //   const entry = initialCollections[0][0].entries[0];
  //   const { token } = await login(user.email, user.password);
  //   await api.patch(getPath('nonexistentid', entry.id)).set('Authorization', `Bearer ${token}`).send().expect(404);
  // });

  // it('results in a 404 error when the specified entry ID does not exist', async () => {
  //   const user = initialUsers[0];
  //   const collection = initialCollections[0][0];
  //   const { token } = await login(user.email, user.password);
  //   await api.patch(getPath(collection.id, 'nonexistentid')).set('Authorization', `Bearer ${token}`).send().expect(404);
  // });
});