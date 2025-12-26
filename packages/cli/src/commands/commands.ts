import type { CommandHandler } from './config'
import type { AgentContextValue } from '@/config/types'
import { commands } from './config'

export function registerCommand(handler: CommandHandler) {
  const existingIndex = commands.findIndex(cmd => cmd.name === handler.name)
  if (existingIndex !== -1) {
    commands[existingIndex] = handler
  }
  else {
    commands.push(handler)
  }
}

export function executeCommand(name: string, context: AgentContextValue): boolean {
  const command = commands.find(cmd => cmd.name === name)
  if (command) {
    command.execute(context)
    return true
  }
  console.log(`Unknown command: /${name}`)
  return false
}

export function getCommandNames(): string[] {
  return commands.map(cmd => cmd.name)
}

export function getAllCommands(): CommandHandler[] {
  return commands
}

export type { CommandHandler }
