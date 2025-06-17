import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'

const run = promisify(exec)

export interface ContainerOptions {
  image: string
  name?: string
  port?: number
}

export async function startContainer({ image, name = image, port = 4000 }: ContainerOptions): Promise<void> {
  const buildDir = path.resolve(process.cwd(), '../containers', image)
  await run(`docker build -t ${image} ${buildDir}`)
  await run(`docker run -d --name ${name} -p ${port}:3000 ${image}`)
}

export async function stopContainer(name: string): Promise<void> {
  await run(`docker rm -f ${name}`)
}

export async function isContainerRunning(name: string): Promise<boolean> {
  try {
    const result: unknown = await run(`docker ps -q -f name=${name}`)
    const output = typeof result === 'string' ? result : (result as { stdout: string }).stdout
    return output.trim().length > 0
  } catch {
    return false
  }
}
