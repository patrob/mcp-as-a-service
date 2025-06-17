import { describe, it, expect, vi } from 'vitest'

vi.mock('next-auth/providers/github', () => ({
  default: (opts: any) => ({ id: 'github', ...opts })
}))
vi.mock('next-auth/providers/google', () => ({
  default: (opts: any) => ({ id: 'google', ...opts })
}))

describe('authOptions', () => {
  it('uses env credentials', async () => {
    process.env.GITHUB_CLIENT_ID = 'a'
    process.env.GITHUB_CLIENT_SECRET = 'b'
    process.env.GOOGLE_CLIENT_ID = 'c'
    process.env.GOOGLE_CLIENT_SECRET = 'd'
    process.env.NEXTAUTH_SECRET = 'secret'
    const mod = await import('./auth')
    const { authOptions } = mod
    expect(authOptions.providers).toEqual([
      { id: 'github', clientId: 'a', clientSecret: 'b' },
      { id: 'google', clientId: 'c', clientSecret: 'd' }
    ])
    expect(authOptions.secret).toBe('secret')
  })
})
