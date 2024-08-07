import { FirebaseError } from 'firebase-admin';
import { CollectionReference } from 'firebase-admin/firestore';
import { EntryNotFoundError } from '../../../errors';
import { db, getCollectionRef, getEntryCollectionRef } from '../../../fbAdmin';
import { Entry, ListEntriesParams, NewEntryParams, UpdateEntryParams, WithId } from '../../../types';

const batchUpdateIndices = async (
  entryCollectionRef: CollectionReference<Entry>,
  diff: number,
  start: number,
  end?: number,
) => db.runTransaction(async transaction => {
  let queryRef = entryCollectionRef.where(
    'index', '>=', start
  )
  if (end) queryRef = queryRef.where(
    'index', '<', end
  );
  const querySnapshot = await transaction.get(queryRef);
  querySnapshot.docs.forEach(doc => {
    transaction.update(doc.ref, { index: doc.data().index + diff });
  });
});

const getEntryCount = (entryCollectionRef: CollectionReference<Entry>) => (
  entryCollectionRef.count().get().then(snapshot => snapshot.data().count)
);

export const getEntryId = (collectionId: string) => {
  const docRef = getEntryCollectionRef(collectionId).doc();
  return docRef.id;
};

export const entryService = {
  retrieve: async (collectionId: string, entryId: string): Promise<WithId<Entry> | null> => {
    const docRef = getEntryCollectionRef(collectionId).doc(entryId);
    const data = await docRef.get().then(doc => doc.data());
    if (!data) return null;
    return { id: entryId, ...data };
  },
  create: async (collectionId: string, entryId: string, params: NewEntryParams): Promise<WithId<Entry>> => {
    const { term, definition, examples, priority } = params;
    const entryCollectionRef = getEntryCollectionRef(collectionId);
    const index = await getEntryCount(entryCollectionRef);
    const docRef = entryCollectionRef.doc(entryId);
    await docRef.set({
      term, definition, examples, priority, index
    });
    const { id, data } = await docRef.get().then(doc => ({ id: doc.id, data: doc.data() }));
    if (!data) throw new Error();
    return { id, ...data };
  },
  update: async (collectionId: string, entryId: string, params: UpdateEntryParams): Promise<WithId<Entry>> => {
    const { term, definition, examples, priority, index } = params;

    try {
      const entryCollectionRef = getEntryCollectionRef(collectionId);
      const docRef = entryCollectionRef.doc(entryId);

      if (index) {
        const data = await docRef.get().then(doc => doc.data());
        if (!data) throw new Error();
        const originalIndex = data.index;

        if (index > originalIndex) await batchUpdateIndices(entryCollectionRef, -1, originalIndex + 1, index + 1);
        else if (index < originalIndex) await batchUpdateIndices(entryCollectionRef, 1, index, originalIndex);
      }

      await docRef.update({
        ...(term ? { term } : {}),
        ...(definition ? { definition } : {}),
        ...(examples ? { examples } : {}),
        ...(priority ? { priority } : {}),
        ...(index ? { index } : {}),
      });

      const updatedData = await docRef.get().then(doc => doc.data());
      if (!updatedData) throw new Error();
      return { id: entryId, ...updatedData };
    } catch (err) {
      if ((err as FirebaseError).message.includes('NOT_FOUND')) throw new EntryNotFoundError();
      throw err;
    }
  },
  delete: async (collectionId: string, entryId: string) => {
    const entryCollectionRef = getEntryCollectionRef(collectionId);
    const docRef = entryCollectionRef.doc(entryId);
    const data = await docRef.get().then(doc => doc.data());
    if (!data) throw new Error();
    const { index } = data;

    await docRef.delete();
    await batchUpdateIndices(entryCollectionRef, -1, index + 1);
  },
  // deleteAll: async (collectionId: string) => {
  //   const entryCollectionRef = getEntryCollectionRef(collectionId);
  //   await entryCollectionRef.

  // },
  list: async (collectionId: string, params: ListEntriesParams) => {
    // ToDo: filter, sort
    const entryCollectionRef = getEntryCollectionRef(collectionId);
    const { offset, limit } = params;
    let queryRef: FirebaseFirestore.Query<Entry> = entryCollectionRef;

    if (offset) queryRef = queryRef.where('index', '>=', offset);
    if (limit) queryRef = queryRef.where('index', '<', (offset ?? 0) + limit);

    const data = await queryRef.get().then(({ docs }) => docs.map(doc => ({ id: doc.id, ...doc.data() })));
    return data;
  },
  count: async (collectionId: string) => {
    const entryCollectionRef = getEntryCollectionRef(collectionId);
    const count = await getEntryCount(entryCollectionRef);
    return count;
  },
  batchCreate: async (collectionId: string, entries: WithId<NewEntryParams>[]) => {
    const entryCollectionRef = getEntryCollectionRef(collectionId);
    const count = await getEntryCount(entryCollectionRef);

    const batch = db.batch();
    entries.forEach((entry, i) => {
      const { term, definition, examples, priority } = entry;
      batch.set(entryCollectionRef.doc(entry.id), {
        term, definition, examples, priority,
        index: count + i
      });
    });
    await batch.commit();
  },
  batchUpdate: async (collectionId: string, entries: WithId<UpdateEntryParams>[]) => {
    const entryCollectionRef = getEntryCollectionRef(collectionId);

    let indicesToBeReplaced = entries.map(({ index }) => index).filter(index => index !== undefined) as number[];
    indicesToBeReplaced = indicesToBeReplaced.sort((a, b) => a - b);
    let originalIndices: number[] = [];

    await db.runTransaction(async transaction => {
      await Promise.all(entries.map(async entry => {
        const { id, term, definition, examples, priority, index } = entry;

        const docRef = entryCollectionRef.doc(id);
        const data = await transaction.get(docRef).then(doc => doc.data());
        if (!data) throw new Error();
        originalIndices.push(data.index);

        transaction.update(docRef, {
          ...(term ? { term } : {}),
          ...(definition ? { definition } : {}),
          ...(examples ? { examples } : {}),
          ...(priority ? { priority } : {}),
          ...(index ? { index } : {}),
        });
      }));

      originalIndices = originalIndices.sort((a, b) => a - b);

      await Promise.all(indicesToBeReplaced.map(async index => {
        if (originalIndices.includes(index)) {
          originalIndices = originalIndices.filter(i => i !== index);
        } else {
          const queryRef = entryCollectionRef.where('index', '==', index);
          const docRef = await transaction.get(queryRef).then(({ docs }) => docs[0].ref);
          transaction.update(docRef, { index });
          originalIndices = originalIndices.slice(1);
        }
      }));
    });
  }
};