import { describe, it, expect, vi } from 'vitest'
import * as cp from 'child_process'
import { startContainer, stopContainer, isContainerRunning } from './container'

vi.mock('child_process', () => ({ exec: vi.fn((_cmd, cb) => cb?.(null, '') ) }))

const execMock = cp.exec as unknown as ReturnType<typeof vi.fn>

describe('container', () => {
  it('starts hello server', async () => {
    await startContainer({ image: 'hello-server', name: 'hello-server', port: 4000 })
    expect(execMock).toHaveBeenCalledWith(
      expect.stringContaining('docker build -t hello-server'),
      expect.any(Function)
    )
    expect(execMock).toHaveBeenCalledWith(
      expect.stringContaining('docker run -d --name hello-server'),
      expect.any(Function)
    )
  })

  it('stops hello server', async () => {
    await stopContainer('hello-server')
    expect(execMock).toHaveBeenCalledWith(
      'docker rm -f hello-server',
      expect.any(Function)
    )
  })

  it('checks running status', async () => {
    execMock.mockImplementationOnce((_cmd, cb) => cb(null, '123'))
    const running = await isContainerRunning('hello-server')
    expect(execMock).toHaveBeenCalledWith(
      expect.stringContaining('docker ps -q -f name=hello-server'),
      expect.any(Function)
    )
    expect(running).toBe(true)
  })
})
