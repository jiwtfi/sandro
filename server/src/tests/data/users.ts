import { initialUsers } from './initialData';

export const testUsers = [
  {
    email: 'test0@test.com',
    password: 'testPassword0',
    username: 'test_user_0',
    bio: 'I am a test user.'
  },
  {
    email: 'test1@test.com',
    password: 'testPassword1',
    username: 'test_user_1',
    imageUrl: 'https://sandro-20240214.web.app/favicon.svg',
  },
];

export const testUserWithUsernameInUse = {
  email: 'test00@test.com',
  password: 'testPassword0',
  username: initialUsers[0].username
};

export const testUserWithInvalidUsername = {
  email: 'test00@test.com',
  password: 'testPassword0',
  username: 't'
};