import { vi, describe, it, expect } from 'vitest'
import { getSubscription } from './subscription'

describe('getSubscription', () => {
  it('returns plan and usage', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ plan: 'Pro', usage: 42 })
    })) as any)
    const data = await getSubscription()
    expect(data).toEqual({ plan: 'Pro', usage: 42 })
  })

  it('throws on failure', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: false })) as any)
    await expect(getSubscription()).rejects.toThrow()
  })
})
