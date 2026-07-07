import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

export function loadLocalEnv(rootDir = process.cwd()) {
  for (const fileName of ['.env', '.env.local']) {
    const filePath = path.join(rootDir, fileName)
    if (!existsSync(filePath)) continue

    const contents = readFileSync(filePath, 'utf8')
    for (const line of contents.split(/\r?\n/)) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue

      const [key, ...rest] = trimmed.split('=')
      if (process.env[key]) continue
      process.env[key] = rest.join('=').replace(/^["']|["']$/g, '')
    }
  }
}
