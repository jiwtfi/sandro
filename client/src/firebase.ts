import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { connectAuthEmulator, getAuth, User as FirebaseAuthUser } from 'firebase/auth';
import { connectStorageEmulator, getStorage } from 'firebase/storage';
import { setUser } from './reducers/authSlice';
import { store } from './store';
import { setIsAppLoading } from './reducers/uiSlice';

const firebaseConfig = {
  apiKey: 'AIzaSyAiQPjPVX3fPemfg5h0yuebTDceaZ85yEI',
  authDomain: 'sandro-20240214.firebaseapp.com',
  projectId: 'sandro-20240214',
  storageBucket: 'sandro-20240214.appspot.com',
  messagingSenderId: '976140615089',
  appId: '1:976140615089:web:93ddbd4ab66c706b62d190',
  measurementId: 'G-7CMQM730RY'
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

const setToken = async (user: FirebaseAuthUser) => {
  const token = await user.getIdToken();
  store.dispatch(setUser({ id: user.uid, token }));
};

auth.onAuthStateChanged(async user => {
  if (user) {
    await setToken(user);
    setInterval(() => {
      setToken(user);
    }, 45 * 60 * 1000);

  } else {
    store.dispatch(setUser(null));
  }
  store.dispatch(setIsAppLoading(false));
});

if (process.env.NODE_ENV !== 'production') {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectStorageEmulator(storage, 'http://localhost', 4000);
}