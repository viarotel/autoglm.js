import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import fs from 'fs-extra'
import { isLinux, isMacOS, isWindows } from 'std-env'
import { exec } from 'tinyexec'

export class ADBAutoInstaller {
  private installPath: string
  private shell: string

  constructor() {
    this.installPath = this.getDefaultInstallPath() || path.join(os.homedir(), '.adb')
    this.shell = this.getCurrentShell()!
  }

  getCurrentShell() {
    const shellPath = process.env.SHELL
    if (!shellPath) {
      return isMacOS ? 'zsh' : 'bash'
    }
    if (shellPath.includes('bash')) {
      return 'bash'
    }
    if (shellPath.includes('zsh')) {
      return 'zsh'
    }
  }

  getDefaultInstallPath() {
    if (isWindows) {
      return path.join(process.env.ProgramFiles || os.homedir(), 'adb')
    }
    if (isMacOS) {
      return path.join(os.homedir(), '.adb')
    }
    if (isLinux) {
      return path.join(os.homedir(), '.adb')
    }
  }

  async install() {
    await fs.ensureDir(this.installPath)
    const platformToolsPath = path.join(this.installPath, 'platform-tools')
    const adbPath = path.join(platformToolsPath, 'adb')
    // check if adb file exists
    if (await fs.pathExists(adbPath)) {
      return
    }
    if (isMacOS) {
      const { installADB } = await import('@autoglm.js/platform-tools-darwin')
      await installADB(this.installPath)
    }
    if (isLinux) {
      const { installADB } = await import('@autoglm.js/platform-tools-linux')
      await installADB(this.installPath)
    }
    if (isWindows) {
      const { installADB } = await import('@autoglm.js/platform-tools-windows')
      await installADB(this.installPath)
    }
    await this.setupEnvironmentVariables()
  }

  async setupEnvironmentVariables() {
    if (isMacOS || isLinux) {
      await this.setupUnixEnv()
    }
    else if (isWindows) {
      await this.setupWindowsEnv()
    }
  }

  async check() {
    try {
      await exec('adb', ['version'])
      return true
    }
    catch {
      return false
    }
  }

  private async setupUnixEnv() {
    let shellConfigPath = ''
    switch (this.shell) {
      case 'bash':
        shellConfigPath = path.join(os.homedir(), '.bashrc')
        break
      case 'zsh':
        shellConfigPath = path.join(os.homedir(), '.zshrc')
        break
      default:
        shellConfigPath = path.join(os.homedir(), '.profile')
        break
    }
    await fs.ensureFile(shellConfigPath)
    const platformToolsPath = path.join(this.installPath, 'platform-tools')
    const exportLine = `
# Add Android SDK platform-tools to PATH By AutoGLM
export PATH="$PATH:${platformToolsPath}"
`
    const content = await fs.readFile(shellConfigPath, 'utf8')
    if (!content.includes(platformToolsPath)) {
      await fs.appendFile(shellConfigPath, exportLine)
    }

    if (!process.env.PATH?.includes(platformToolsPath)) {
      process.env.PATH = `${process.env.PATH}:${platformToolsPath}`
    }
  }

  private async setupWindowsEnv() {
    const platformToolsPath = path.join(this.installPath, 'platform-tools')

    // 更新当前进程的PATH环境变量
    if (!process.env.PATH?.includes(platformToolsPath)) {
      process.env.PATH = `${process.env.PATH};${platformToolsPath}`
    }

    // 注意：修改Windows系统环境变量需要管理员权限，这里只修改当前进程的环境变量
    // 如果需要永久修改，可以考虑使用注册表或setx命令，但这需要管理员权限
  }
}
