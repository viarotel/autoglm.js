import { Box } from 'ink'
import TextInput from 'ink-text-input'
import { useNavigate } from 'react-router'
import { getAllCommands } from '@/commands/commands'
import { CommandMenu } from '@/components/CommandMenu'
import { useAgentContext } from '@/context/AgentContext'
import { useUserInputStore } from '@/store/userInputStore'

export function UserInput() {
  const navigate = useNavigate()
  const context = useAgentContext()

  const {
    query,
    setQuery,
    handleSubmit,
    handleCommandSelect,
    isCommand,
  } = useUserInputStore()

  return (
    <>
      <Box borderStyle="round">
        <TextInput
          value={query}
          onChange={setQuery}
          onSubmit={value => handleSubmit(value, context, navigate)}
          placeholder="  Please Input Your Task"
        />
      </Box>
      {isCommand && (
        <CommandMenu
          commands={getAllCommands()}
          query={query}
          onCommandSelect={command => handleCommandSelect(command, context)}
        />
      )}
    </>
  )
}
