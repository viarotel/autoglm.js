import type { AgentContextValue } from '@/config/types'
import { create } from 'zustand'
import { executeCommand } from '@/commands/commands'
import { isCommandQuery } from '@/utils/constants'

interface UserInputState {
  query: string
  isCommand: boolean
  setQuery: (query: string) => void
  handleSubmit: (value: string, context: AgentContextValue, navigate: (path: string) => void) => void
  handleCommandSelect: (command: string, context: AgentContextValue) => void
}

export const useUserInputStore = create<UserInputState>((set) => {
  return {
    query: '',
    isCommand: false,

    setQuery: (query) => {
      set({ query, isCommand: isCommandQuery(query) })
    },

    handleSubmit: (value, context, navigate) => {
      if (isCommandQuery(value)) {
        return
      }

      set({ query: '' })
      context.run(value)
      navigate('/tasks')
    },

    handleCommandSelect: (command, context) => {
      set({ query: '' })
      executeCommand(command, context)
    },
  }
})
