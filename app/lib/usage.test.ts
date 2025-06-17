import { describe, it, expect } from 'vitest';
import { formatUsage } from './usage';

describe('formatUsage', () => {
  it('calculates percentage', () => {
    expect(formatUsage(25, 50)).toBe('50%');
  });

  it('caps at 100%', () => {
    expect(formatUsage(120, 100)).toBe('100%');
  });
});
