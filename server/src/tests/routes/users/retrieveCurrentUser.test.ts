import { describe, it } from 'node:test';
import assert from 'node:assert';
import { api } from '../../setup';
import { initialUsers } from '../../data/initialData';
import { login } from '../../test-helpers';

const path = '/users/me';

describe('retrieveCurrentUser', () => {
  it('returns the user associated with the token', async () => {
    const { password, ...user } = initialUsers[0];
    const { id, token } = await login(user.email, password);
    const { body } = await api.get(path).set('Authorization', `Bearer ${token}`).send().expect(200);
    assert.strictEqual(body.id, id);
    assert.strictEqual(body.email, user.email);
    assert.strictEqual(body.username, user.username);
    assert.strictEqual(body.bio, user.bio);
    assert.strictEqual(body.imageUrl, user.imageUrl);
  });

  it('fails to return a user with an unauthenticated request', async () => {
    await api.get(path).send().expect(401);
  });
});