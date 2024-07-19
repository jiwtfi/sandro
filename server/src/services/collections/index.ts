import { FirebaseError } from 'firebase-admin';
import { Collection, NewCollectionParams, UpdateCollectionParams, WithId } from '../../types';
import { collectionCollectionRef, userCollectionRef } from '../../fbAdmin';
import { CollectionNotFoundError } from '../../errors';

export const collectionService = {
  retrieve: async (id: string): Promise<WithId<Collection> | null> => {
    const docRef = collectionCollectionRef.doc(id);
    const data = await docRef.get().then(doc => doc.data());
    if (!data) return null;
    return { id, ...data };
  },
  create: async (params: NewCollectionParams, options?: { id?: string; }): Promise<WithId<Collection>> => {
    const { createdBy: userId, title, description } = params;
    const createdBy = userCollectionRef.doc(userId);
    const newCollectionParams = {
      createdBy, title, description, private: params.private,
    };

    const docRef = options?.id ? collectionCollectionRef.doc(options.id) : await collectionCollectionRef.add(newCollectionParams);
    if (options?.id) await docRef.set(newCollectionParams);
    const { id, data } = await docRef.get().then(doc => ({ id: doc.id, data: doc.data() }));
    if (!data) throw new Error();

    return { id, ...data };
  },
  update: async (id: string, params: UpdateCollectionParams): Promise<WithId<Collection>> => {
    const docRef = collectionCollectionRef.doc(id);
    try {
      const { title, description } = params;

      await docRef.update({
        ...(title ? { title } : {}),
        ...(description ? { description } : {}),
        ...(params.private ? { private: params.private } : {})
      });
      const data = await docRef.get().then(doc => doc.data());
      if (!data) throw new Error();
      return { id, ...data };
    } catch (err) {
      if ((err as FirebaseError).message.includes('NOT_FOUND')) throw new CollectionNotFoundError();
      throw err;
    }
  },
  delete: async (id: string) => {
    const docRef = collectionCollectionRef.doc(id);
    // ToDo: delete entries
    await docRef.delete();
    return;
  },
  list: async (params: { userId: string; }) => {
    const userRef = userCollectionRef.doc(params.userId);
    const collections = await collectionCollectionRef.where('createdBy', '==', userRef).get().then(({ docs }) => docs.sort((a, b) => (
      b.updateTime.seconds - a.updateTime.seconds
    )).map(doc => ({ id: doc.id, ...doc.data() })));
    // )).map(doc => {
    //   console.log(doc.data().title);
    //   console.log(doc.updateTime.toDate());
    //   return { id: doc.id, ...doc.data() };
    // }));
    return collections;
  },
  count: async (): Promise<number> => {
    // ToDo: filter by user
    const { count } = await collectionCollectionRef.count().get().then(snapshot => snapshot.data());
    return count;
  }
};

export * from './entries';