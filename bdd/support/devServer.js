import { spawn } from 'node:child_process'

const PORT = 5173
export const BASE_URL = `http://localhost:${PORT}`

// Uses a real HTTP request (via 'localhost', letting Node pick whichever of
// 127.0.0.1/::1 it resolves to) rather than a raw socket to a hardcoded IPv4
// address — Vite's dev server on this machine binds to ::1, and a check pinned to
// 127.0.0.1 would never see it as up.
async function isServerUp() {
  try {
    const response = await fetch(BASE_URL, { signal: AbortSignal.timeout(1000) })
    return response.ok
  } catch {
    return false
  }
}

async function waitForServer(timeoutMs = 30000) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    if (await isServerUp()) return
    await new Promise((r) => setTimeout(r, 300))
  }
  throw new Error(`Dev server did not become ready on ${BASE_URL} within ${timeoutMs}ms`)
}

let spawnedProcess = null

// Reuses an already-running dev server (e.g. started by another test run) instead of
// spawning a duplicate — mirrors Playwright config's reuseExistingServer behavior.
export async function ensureDevServer() {
  if (await isServerUp()) return

  spawnedProcess = spawn('npm', ['run', 'dev'], {
    shell: true,
    stdio: 'ignore',
    detached: false,
  })
  await waitForServer()
}

export async function stopDevServerIfSpawned() {
  if (spawnedProcess) {
    spawnedProcess.kill()
    spawnedProcess = null
  }
}
