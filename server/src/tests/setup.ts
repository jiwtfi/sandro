import { readFileSync } from 'fs';
import { beforeEach } from 'node:test';
import * as admin from 'firebase-admin/app';
import { initializeApp } from 'firebase/app';
import supertest from 'supertest';

const firebaseConfig = {
  apiKey: 'AIzaSyApRmeWP8VPYCbry7yvo1NYacm5FOapeoU',
  authDomain: 'sandro-20240214-test.firebaseapp.com',
  projectId: 'sandro-20240214-test',
  storageBucket: 'sandro-20240214-test.appspot.com',
  messagingSenderId: '205282059996',
  appId: '1:205282059996:web:f0280be711dc741caf7619'
};

if (!process.env.GOOGLE_CREDENTIALS_TEST) {
  process.env.GOOGLE_CREDENTIALS_TEST = readFileSync('sandro-20240214-test-firebase-adminsdk-21li5-55df27fa3b.json', 'utf-8');
}

const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS_TEST);

initializeApp(firebaseConfig);

admin.initializeApp({
  credential: admin.cert(credentials),
  storageBucket: firebaseConfig.storageBucket
});

import { app } from '../app';
import { clearStorage, deleteAllCollections, deleteAllUsers, loadInitialData } from './test-helpers';
export const api = supertest(app);

beforeEach(async () => {
  console.log('BEFORE EACH');
  await deleteAllUsers();
  await deleteAllCollections();
  await clearStorage();
  await loadInitialData();
});