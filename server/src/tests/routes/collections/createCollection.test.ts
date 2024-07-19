import { describe, it } from 'node:test';
import assert from 'node:assert';
import { api } from '../../setup';
import { login } from '../../test-helpers';
import { initialCollectionsCount, initialUsers } from '../../data/initialData';
import { testCollections, testCollectionWithEmptyTitle } from '../../data/collections';
import { collectionService } from '../../../services';
import { CreateCollectionResponseBody } from '../../../types';

const path = '/collections';

describe('createCollection', () => {
  it('creates a new collection', async () => {
    const { email, password } = initialUsers[0];
    const { id: userId, token } = await login(email, password);

    const responses = await Promise.all(testCollections.map((collection) => (
      api.post(path).set('Authorization', `Bearer ${token}`).send(collection).expect(201)
    )));

    const count = await collectionService.count();
    assert.strictEqual(count, initialCollectionsCount + testCollections.length);

    testCollections.forEach((testCollection, i) => {
      const collection = responses[i].body as CreateCollectionResponseBody;
      assert.strictEqual(collection.title, testCollection.title);
      assert.strictEqual(collection.createdBy, userId);
      if (testCollection.description) assert.strictEqual(collection.description, testCollection.description);
      if (testCollection.private) assert.strictEqual(collection.private, testCollection.private);
    });
  });

  it('fails to create a new collection with an empty title', async () => {
    const { email, password } = initialUsers[0];
    const { token } = await login(email, password);

    await api.post(path).set('Authorization', `Bearer ${token}`).send(testCollectionWithEmptyTitle).expect(400);

    const count = await collectionService.count();
    assert.strictEqual(count, initialCollectionsCount);
  });

  it('fails to create a new collection with an unauthenticated request', async () => {
    await api.post(path).send(testCollections[0]).expect(401);

    const count = await collectionService.count();
    assert.strictEqual(count, initialCollectionsCount);
  });
});