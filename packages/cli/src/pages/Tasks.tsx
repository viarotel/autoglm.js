import { Box } from 'ink'
import EventLog from '@/components/EventLog'
import TaskStatus from '@/components/TaskStatus'
import { useAgentContext } from '@/context/AgentContext'

export default function TaskList() {
  const context = useAgentContext()
  const { isRunning, currentTask } = context
  return (
    <Box flexDirection="column">
      <TaskStatus isRunning={isRunning} currentTask={currentTask} />
      <EventLog enableKeyboard={true} />
    </Box>
  )
}
