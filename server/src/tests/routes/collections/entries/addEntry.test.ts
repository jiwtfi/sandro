import { describe, it } from 'node:test';
import assert from 'node:assert';
import { api } from '../../../setup';
import { assertEntriesEqual, login } from '../../../test-helpers';
import { initialCollections, initialUsers } from '../../../data/initialData';
import { testEntries, testEntryWithEmptyDefinitionText, testEntryWithEmptyExampleText, testEntryWithEmptyTermLanguage, testEntryWithEmptyTermText, testEntryWithInvalidPriority } from '../../../data/entries';
import { entryService } from '../../../../services';

const getPath = (collectionId: string) => `/collections/${collectionId}/entries`;

describe('addEntry', () => {
  it('adds a new entry to the collection specified with the ID', async () => {
    await Promise.all(initialUsers.map(async ({ email, password }, i) => {
      if (i >= testEntries.length || testEntries[i].length === 0) return;
      const { token } = await login(email, password);
      await Promise.all(initialCollections[i].map(async (collection, j) => {
        if (j >= testEntries[i].length) return;
        await Promise.all(testEntries[i][j].map(async entry => {
          const { body } = await api.post(getPath(collection.id)).set('Authorization', `Bearer ${token}`).send(entry).expect(201);
          assertEntriesEqual(body, entry);
        }));

        const count = await entryService.count(collection.id);
        assert.strictEqual(count, collection.entries.length + testEntries[i][j].length);
      }));
    }));
  });

  it('fails to add a new entry when the parameters are invalid', async () => {
    const { email, password } = initialUsers[0];
    const { token } = await login(email, password);
    const { id: collectionId } = initialCollections[0][0];

    await Promise.all([
      testEntryWithEmptyTermText,
      testEntryWithEmptyTermLanguage,
      testEntryWithEmptyDefinitionText,
      testEntryWithEmptyExampleText,
      testEntryWithInvalidPriority
    ].map(entry => (
      api.post(getPath(collectionId)).set('Authorization', `Bearer ${token}`).send(entry).expect(400)
    )));
  });

  it('fails to add a new entry when the request is unauthenticated', async () => {
    const { id: collectionId } = initialCollections[0][0];
    const entry = testEntries[0][0][0];
    await api.post(getPath(collectionId)).send(entry).expect(401);
  });

  it('fails to add a new entry to a collection to which the authenticated user has no permission', async () => {
    const { email, password } = initialUsers[1];
    const { token } = await login(email, password);
    const { id: collectionId } = initialCollections[0][0];
    const entry = testEntries[0][0][0];
    await api.post(getPath(collectionId)).set('Authorization', `Bearer ${token}`).send(entry).expect(403);
  });
});
