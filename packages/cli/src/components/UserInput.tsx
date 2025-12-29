import { Box } from 'ink'
import TextInput from 'ink-text-input'
import { useNavigate } from 'react-router'
import { useAgentContext } from '@/context/AgentContext'
import { useUserInputStore } from '@/store/userInputStore'

export function UserInput() {
  const navigate = useNavigate()
  const context = useAgentContext()

  const {
    query,
    setQuery,
    handleSubmit,
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
    </>
  )
}
