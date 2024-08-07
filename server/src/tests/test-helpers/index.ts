import assert from 'node:assert';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getApp } from 'firebase/app';
import { auth, bucket, collectionCollectionRef, db, getEntryCollectionRef, userCollectionRef } from '../../fbAdmin';
import { initialUsers, initialCollections } from '../data/initialData';
import { collectionService, entryService, userService } from '../../services';
import { examplesResolver, termResolver } from '../../utils';
import { AddEntryRequestExampleParams, AddEntryRequestTermParams, Definition, Entry, Example, Term, UpdateEntryRequestBody } from '../../types';

export const listAllUserIds = () => auth.listUsers().then(({ users }) => users.map(({ uid }) => uid));
export const listAllUsers = () => userCollectionRef.get().then(({ docs }) => docs.map(doc => ({
  id: doc.id, ...doc.data()
})));

export const deleteAllUsers = async () => {
  const userIds = await listAllUserIds();
  await auth.deleteUsers(userIds);

  const batch = db.batch();
  userIds.forEach(userId => batch.delete(userCollectionRef.doc(userId)));
  await batch.commit();
};

export const deleteAllCollections = async () => {
  const collectionDocs = await collectionCollectionRef.get().then(({ docs }) => docs);
  const batch = db.batch();
  await Promise.all(collectionDocs.map(async doc => {
    const entriesRef = getEntryCollectionRef(doc.id);
    const entryDocs = await entriesRef.get().then(({ docs }) => docs);
    entryDocs.forEach(entryDoc => batch.delete(entryDoc.ref));
    batch.delete(doc.ref);
  }));
  await batch.commit();
};

export const clearStorage = async () => {
  await bucket.deleteFiles({ prefix: 'audio', delimiter: '/', force: true });
};

export const loadInitialData = async () => {
  const fbApp = getApp();
  const auth = getAuth(fbApp);
  await Promise.all(initialUsers.map(async (user, i) => {
    const { password, ...userParams } = user;
    const { user: { uid } } = await createUserWithEmailAndPassword(auth, user.email, password);
    await userService.create(uid, userParams);

    await Promise.all(initialCollections[i].map(async collection => {
      const { id: collectionId, entries, ...collectionParams } = collection;
      await collectionService.create({ ...collectionParams, createdBy: uid }, { id: collectionId });
      const entriesParams = await Promise.all(entries.map(async entry => {
        const id = entry.id;
        return {
          id,
          term: await termResolver(collectionId, id, entry.term),
          definition: entry.definition,
          examples: await examplesResolver(collectionId, id, entry.examples ?? []),
          priority: entry.priority ?? 3
        };
      }));
      await entryService.batchCreate(collectionId, entriesParams);
    }));
  }));
};

export const login = async (email: string, password: string) => {
  const auth = getAuth();
  await signInWithEmailAndPassword(auth, email, password);
  return new Promise<{ id: string; token: string; }>((resolve, reject) => {
    auth.onAuthStateChanged(async authUser => {
      if (!authUser) return reject();
      const token = await authUser.getIdToken();
      return resolve({ id: authUser.uid, token });
    });
    setTimeout(reject, 10000);
  });
};

const assertTermsEqual = (actual: Term, expected: AddEntryRequestTermParams) => {
  assert.strictEqual(actual.text, expected.text);
  assert.strictEqual(actual.lang, expected.lang);
  if (expected.audioUrl) assert.strictEqual(actual.audioUrl, expected.audioUrl);
};

const assertDefinitionsEqual = (actual: Definition, expected: Definition) => {
  assert.strictEqual(actual.text, expected.text);
  assert.strictEqual(actual.lang, expected.lang);
};

const assertExamplesEqual = (actual: Example, expected: AddEntryRequestExampleParams) => {
  assert.strictEqual(actual.text, expected.text);
  assert.strictEqual(actual.lang, expected.lang);
  expected.occurrences.forEach(({ start, end }, i) => {
    assert.strictEqual(actual.occurrences[i].start, start);
    assert.strictEqual(actual.occurrences[i].end, end);
  });

  if (expected.audioUrl) assert.strictEqual(actual.audioUrl, expected.audioUrl);
};

export const assertEntriesEqual = (actual: Entry, params: UpdateEntryRequestBody, original?: Entry) => {
  if (params.term) assertTermsEqual(actual.term, params.term);
  else if (original) assertTermsEqual(actual.term, original.term);

  if (params.definition) assertDefinitionsEqual(actual.definition, params.definition);
  else if (original) assertDefinitionsEqual(actual.definition, original.definition);

  if (params.examples) params.examples.forEach((example, i) => assertExamplesEqual(actual.examples[i], example));
  else if (original) original.examples.forEach((example, i) => assertExamplesEqual(actual.examples[i], example));

  if (params.priority) assert.strictEqual(actual.priority, params.priority);
  else if (original) assert.strictEqual(actual.priority, original.priority);
};
