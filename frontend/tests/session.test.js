import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getSessionUser } from '../lib/session.js';

test('returns null when session is null', () => {
  assert.equal(getSessionUser(null), null);
});

test('returns user when present', () => {
  const user = { name: 'A', email: 'a@example.com' };
  assert.deepEqual(getSessionUser({ user }), user);
});
