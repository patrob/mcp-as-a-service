import { describe, it, expect } from 'vitest'
import { builtinServers } from './servers'

describe('builtinServers', () => {
  it('includes GitHub server', () => {
    const server = builtinServers.find(s => s.id === 'github')
    expect(server).toEqual({
      id: 'github',
      name: 'GitHub MCP Server',
      type: 'github',
      status: 'running'
    })
  })
})
