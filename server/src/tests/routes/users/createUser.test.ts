import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { api } from '../../setup';
import { testUsers, testUserWithInvalidUsername, testUserWithUsernameInUse } from '../../data/users';
import { userService } from '../../../services';
import { User } from '../../../types';
import { initialUserCount } from '../../data/initialData';
import { auth } from '../../../fbAdmin';

const path = '/users';

describe('createUser', () => {
  it('creates a new user', async () => {
    const responses = await Promise.all(testUsers.map(async ({ password, ...user }) => {
      const { user: { uid } } = await createUserWithEmailAndPassword(getAuth(), user.email, password);
      return api.post(path).send({ id: uid, ...user }).expect(201);
    }));

    const count = await userService.count();
    assert.strictEqual(count, initialUserCount + testUsers.length);

    await Promise.all(testUsers.map(async (testUser, i) => {
      const userId = responses[i].body.id as string;
      const userRecord = await auth.getUser(userId);
      const user = await userService.retrieve(userId) as User;
      assert.strictEqual(userRecord.email, testUser.email);
      assert.strictEqual(user.email, testUser.email);
      assert.strictEqual(user.username, testUser.username);
      if (testUser.bio) assert.strictEqual(user.bio, testUser.bio);
      if (testUser.imageUrl) assert.strictEqual(user.imageUrl, testUser.imageUrl);
    }));
  });

  it('fails to create a new user with a user ID that does not exist', async () => {
    const { password, ...user } = testUsers[0];
    await api.post(path).send({ ...user, id: 'nonexistentid' }).expect(400);
    const count = await userService.count();
    assert.strictEqual(count, initialUserCount);
  });


  it('fails to create a new user with a username that is already in use', async () => {
    const { password, ...user } = testUserWithUsernameInUse;
    const { user: { uid } } = await createUserWithEmailAndPassword(getAuth(), user.email, password);
    await api.post(path).send({ id: uid, ...user }).expect(400);
    const count = await userService.count();
    assert.strictEqual(count, initialUserCount);
  });

  it('fails to create a new user with an invalid username', async () => {
    const { password, ...user } = testUserWithInvalidUsername;
    const { user: { uid } } = await createUserWithEmailAndPassword(getAuth(), user.email, password);
    await api.post(path).send({ id: uid, ...user }).expect(400);
    const count = await userService.count();
    assert.strictEqual(count, initialUserCount);
  });
});