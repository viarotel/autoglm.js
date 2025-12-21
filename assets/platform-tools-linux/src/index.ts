import path from 'node:path'
import { extractZip } from '@autoglm.js/shared'

export async function installADB(installPath: string) {
  const adbZipPath = path.join('./../', 'platform-tools-latest-linux.zip')
  await extractZip(adbZipPath, installPath)
}
