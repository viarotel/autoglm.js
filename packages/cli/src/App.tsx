import process from 'node:process'
import { AutoGLM, EventType } from 'autoglm.js'
import { Box } from 'ink'
import TextInput from 'ink-text-input'
import { useEffect, useState } from 'react'
import Banner from './components/Banner'
import { CommandMenu } from './components/CommandMenu'
import EventLog from './components/EventLog'
import Info from './components/Info'
import TaskStatus from './components/TaskStatus'

const autoGLMAgent = new AutoGLM({
  maxSteps: 100,
  lang: 'cn',
  baseUrl: 'https://open.bigmodel.cn/api/paas/v4/',
  apiKey: '74fab98ebabd483a9fb88e311c14f61c.OIQrXM8thm8vSxo1',
  model: 'autoglm-phone',
})

function handleCommand(command: string) {
  switch (command) {
    case 'help':
      console.log('Help: Available commands: /help, /exit')
      break
    case 'exit':
      process.exit(0)
      break
    default:
      console.log(`Unknown command: /${command}`)
  }
}

export default function App() {
  const [query, setQuery] = useState('')
  const [events, setEvents] = useState<any[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [currentTask, setCurrentTask] = useState<string | null>(null)

  useEffect(() => {
    autoGLMAgent.on(EventType.START, (data) => {
      setCurrentTask(data.message || data)
      setIsRunning(true)
    })
    autoGLMAgent.on(EventType.THINKING, (data) => {
      setEvents(prev => [...prev, { type: 'thinking', data, time: data.time }])
    })
    autoGLMAgent.on(EventType.ACTION, (data) => {
      setEvents(prev => [...prev, { type: 'action', data, time: data.time }])
    })
    autoGLMAgent.on(EventType.TASK_COMPLETE, (data) => {
      setIsRunning(false)
      setEvents(prev => [...prev, { type: 'task_complete', data, time: data.time }])
    })
    autoGLMAgent.on(EventType.ERROR, (data) => {
      setIsRunning(false)
      setEvents(prev => [...prev, { type: 'error', data, time: data.time }])
    })
  }, [])

  const handleSubmit = async (value: string) => {
    setQuery('')
    if (value.startsWith('/')) {
      const command = value.slice(1)
      handleCommand(command)
    }
    else {
      await autoGLMAgent.run(value)
    }
  }

  const handleCommandSelect = (command: string) => {
    setQuery('')
    handleCommand(command)
  }

  return (
    <Box marginRight={2} marginLeft={2} flexDirection="column">
      <Banner />
      <TaskStatus isRunning={isRunning} currentTask={currentTask} />
      <EventLog events={events} />
      <Box borderStyle="round">
        <TextInput
          value={query}
          onChange={setQuery}
          onSubmit={handleSubmit}
          placeholder="  帮我订一张明天去南通的机票"
        />
      </Box>
      <Info autoGLMAgent={autoGLMAgent} />
      {query.startsWith('/') && (
        <CommandMenu query={query} onCommandSelect={handleCommandSelect} />
      )}
    </Box>
  )
}
