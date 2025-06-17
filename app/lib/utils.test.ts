import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('px-1', false && 'hidden', 'text-sm')).toBe('px-1 text-sm')
  })
})
