import { test, expect } from 'vitest';
import { getSessionUser } from '../lib/session.js';

test('returns null when session is null', () => {
  expect(getSessionUser(null)).toBe(null);
});

test('returns user when present', () => {
  const user = { name: 'A', email: 'a@example.com' };
  expect(getSessionUser({ user })).toEqual(user);
});
