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

          // assert.strictEqual(body.term.text, entry.term.text);
          // assert.strictEqual(body.term.lang, entry.term.lang);
          // if (entry.term.audioUrl) assert.strictEqual(body.term.audioUrl, entry.term.audioUrl);
          // assert.strictEqual(body.definition.text, entry.definition.text);
          // assert.strictEqual(body.definition.lang, entry.definition.lang);
          // if (entry.examples) {
          //   entry.examples.forEach((example, k) => {
          //     assert.strictEqual(body.examples[k].text, example.text);
          //     assert.strictEqual(body.examples[k].lang, example.lang);
          //     example.occurrences.forEach(({ start, end }, l) => {
          //       assert.strictEqual(body.examples[k].occurrences[l].start, start);
          //       assert.strictEqual(body.examples[k].occurrences[l].end, end);
          //     });
          //     if (example.audioUrl) assert.strictEqual(body.examples[k].audioUrl, example.audioUrl);
          //     if (example.imageUrls) assert.strictEqual(body.examples[k].imageUrls, example.imageUrls);
          //     if (example.notes) assert.strictEqual(body.examples[k].notes, example.notes);
          //   });
          //   if (entry.imageUrls) assert.strictEqual(body.imageUrls, entry.imageUrls);
          //   if (entry.priority) assert.strictEqual(body.priority, entry.priority);
          // }
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
