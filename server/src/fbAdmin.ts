import { getAuth } from 'firebase-admin/auth';
import { getFirestore, DocumentData, QueryDocumentSnapshot, DocumentReference } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { Collection, Entry, User } from './types';

export const auth = getAuth();
export const db = getFirestore();
export const bucket = getStorage().bucket();

const getConverter = <T extends DocumentData>() => ({
  toFirestore: (data: T) => data,
  fromFirestore: (doc: QueryDocumentSnapshot) => doc.data() as T
});

export const getCollectionRef = <T extends DocumentData>(collectionPath: string) => db.collection(collectionPath).withConverter(getConverter<T>());
export const userCollectionRef = getCollectionRef<User>('users');
export const collectionCollectionRef = getCollectionRef<Collection>('collections');
export const getEntryCollectionRef = (collectionId: string) => getCollectionRef<Entry>(`collections/${collectionId}/entries`);

export const serializeDocRef = (doc: DocumentReference) => doc.id;