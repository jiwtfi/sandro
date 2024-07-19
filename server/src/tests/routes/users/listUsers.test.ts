import { describe, it } from 'node:test';
import assert from 'node:assert';
import { api } from '../../setup';
import { listAllUsers } from '../../test-helpers';

const path = '/users';

describe('listUsers', () => {
  it('returns the user with the specified ID', async () => {
    const users = await listAllUsers();
    await Promise.all(users.map(async user => {
      const { body } = await api.get(path).query({ username: user.username }).send().expect(200);
      assert.strictEqual(body.length, 1);
      assert.strictEqual(body[0].id, user.id);
      assert.strictEqual(body[0].username, user.username);
      assert.strictEqual(body[0].bio, user.bio);
      assert.strictEqual(body[0].imageUrl, user.imageUrl);
    }));
  });

  it('returns an empty list when the specified user ID does not exist', async () => {
    const { body } = await api.get(path).query({ username: 'nonexistentid' }).send().expect(200);
    assert.strictEqual(body.length, 0);
  })
});