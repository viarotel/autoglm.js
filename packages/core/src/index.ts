import type { AgentConfigType } from './config'
import { emit, emitter, EventType } from '@/utils/events'
import { ADBAutoInstaller } from './adb/installer'
import { ADBKeyboard } from './adb/keyboard'
import { PhoneAgent } from './agent'
import { checkModelApi, checkSystemRequirements } from './check'
import { setAgentConfig } from './config'

export class AutoGLM {
  private phoneAgent: PhoneAgent

  private constructor(config: AgentConfigType) {
    setAgentConfig(config)
    this.phoneAgent = new PhoneAgent()
  }

  public checkSystemRequirements() {
    return checkSystemRequirements()
  }

  public checkModelApi() {
    return checkModelApi()
  }

  public run(task: string) {
    emit(EventType.START, task)
    return this.phoneAgent.run(task)
  }

  public on(type: EventType | '*', handler: (data: any) => void) {
    emitter.on(type, handler)
    return this
  }

  public off(type: EventType | '*', handler: (data: any) => void) {
    emitter.off(type, handler)
    return this
  }

  public async installADB() {
    const installer = new ADBAutoInstaller()
    await installer.install()
  }

  public async installADBKeyboard() {
    const keyboard = new ADBKeyboard()
    await keyboard.installKeyboard()
  }
}
