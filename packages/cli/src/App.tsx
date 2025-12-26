import { Box } from 'ink'
import TextInput from 'ink-text-input'
import { useState } from 'react'
import {
  MemoryRouter,
  Route,
  Routes,
  useNavigate,
} from 'react-router'
import { executeCommand, getAllCommands } from './commands/commands'
import Banner from './components/Banner'
import { CommandMenu } from './components/CommandMenu'
import { ErrorBoundary } from './components/ErrorBoundary'
import Info from './components/Info'
import { loadConfig } from './config'
import { AgentProvider, useAgentContext } from './context/AgentContext'
import TaskList from './pages/Tasks'
import Welcome from './pages/Welcome'

function AppContent() {
  const [query, setQuery] = useState('')
  const context = useAgentContext()
  const navigate = useNavigate()

  const handleSubmit = async (value: string) => {
    setQuery('')
    if (value.startsWith('/')) {
      const command = value.slice(1)
      executeCommand(command, context)
    }
    else {
      context.run(value)
      navigate('/tasks', { replace: true })
    }
  }

  const handleCommandSelect = (command: string) => {
    setQuery('')
    executeCommand(command, context)
  }

  return (
    <Box marginRight={2} marginLeft={2} flexDirection="column">
      <Banner />

      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/tasks" element={<TaskList />} />
      </Routes>

      <Box borderStyle="round">
        <TextInput
          value={query}
          onChange={setQuery}
          onSubmit={handleSubmit}
          placeholder="  Please input your task"
        />
      </Box>
      <Info />
      {query.startsWith('/') && (
        <CommandMenu commands={getAllCommands()} query={query} onCommandSelect={handleCommandSelect} />
      )}
    </Box>
  )
}

function AppWithRouter() {
  const navigate = useNavigate()

  let config
  try {
    config = loadConfig()
  }
  catch {
    config = {
      maxSteps: 100,
      lang: 'cn' as const,
      baseUrl: 'https://open.bigmodel.cn/api/paas/v4/',
      apiKey: '74fab98ebabd483a9fb88e311c14f61c.OIQrXM8thm8vSxo1',
      model: 'autoglm-phone',
    }
  }

  return (
    <AgentProvider config={config} navigate={navigate}>
      <AppContent />
    </AgentProvider>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <MemoryRouter>
        <AppWithRouter />
      </MemoryRouter>
    </ErrorBoundary>
  )
}

export default App
