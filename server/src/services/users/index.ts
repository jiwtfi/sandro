import { FirebaseError } from 'firebase-admin';
import { NewUserParams, UpdateUserParams, User, WithId } from '../../types';
import { userCollectionRef } from '../../fbAdmin';
import { UserNotFoundError } from '../../errors/UserNotFoundError';

export const userService = {
  retrieve: async (id: string): Promise<WithId<User> | null> => {
    const docRef = userCollectionRef.doc(id);
    const data = await docRef.get().then(doc => doc.data());
    if (!data) return null;
    return { id, ...data };
  },
  create: async (id: string, params: NewUserParams): Promise<WithId<User>> => {
    const { email, username, bio, imageUrl } = params;
    const docRef = userCollectionRef.doc(id);
    // Assumes that the document with the same ID does not exist
    await docRef.set({ email, username, bio, imageUrl });
    const data = await docRef.get().then(doc => doc.data());
    if (!data) throw new Error();
    return { id, ...data };
  },
  update: async (id: string, params: UpdateUserParams): Promise<WithId<User>> => {
    const docRef = userCollectionRef.doc(id);
    try {
      const { email, username, bio, imageUrl } = params;

      await docRef.update({
        ...(email ? { email } : {}),
        ...(username ? { username } : {}),
        ...(bio ? { bio } : {}),
        ...(imageUrl ? { imageUrl } : {}),
      });
      const data = await docRef.get().then(doc => doc.data());
      if (!data) throw new Error();
      return { id, ...data };
    } catch (err) {
      if ((err as FirebaseError).message.includes('NOT_FOUND')) throw new UserNotFoundError();
      throw err;
    }
  },
  delete: async (id: string) => {
    const docRef = userCollectionRef.doc(id);
    await docRef.delete();
  },
  list: async () => {
    // ToDo: filter
  },
  count: async (): Promise<number> => {
    // ToDo: filter
    const { count } = await userCollectionRef.count().get().then(snapshot => snapshot.data());
    return count;
  },
  findByUsername: async (username: string): Promise<WithId<User> | null> => {
    const docs = await userCollectionRef.where('username', '==', username).get().then(({ docs }) => docs);
    if (docs.length !== 1) return null;
    const id = docs[0].id;
    const data = docs[0].data();
    return { id, ...data };
  }
};