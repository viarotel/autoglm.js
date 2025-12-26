import type { AgentContextValue } from '@/config/types'
import process from 'node:process'

export interface CommandHandler {
  name: string
  description: string
  execute: (context: AgentContextValue) => Promise<void> | void
}

export const commands: CommandHandler[] = [
  {
    name: 'help',
    description: 'Show help information',
    execute: () => {
      console.log('Available commands:')
      commands.forEach((cmd) => {
        console.log(`  /${cmd.name.padEnd(10)} - ${cmd.description}`)
      })
    },
  },
  {
    name: 'exit',
    description: 'Exit the application',
    execute: () => {
      process.exit(0)
    },
  },
  {
    name: 'home',
    description: 'Navigate to home page',
    execute: (context) => {
      context.navigate('/')
    },
  },
  {
    name: 'tasks',
    description: 'Navigate to tasks page',
    execute: (context) => {
      context.navigate('/tasks')
    },
  },
]
