import { MemoryRouter } from 'react-router'
import { ErrorBoundary } from '@/components/ErrorBoundary'

import { loadCliConfig } from '@/config'
import { AgentProvider } from '@/context/AgentContext'
import AppRouter from '@/router'

const config = loadCliConfig()

function App() {
  return (
    <ErrorBoundary>
      <MemoryRouter>
        <AgentProvider config={config}>
          <AppRouter />
        </AgentProvider>
      </MemoryRouter>
    </ErrorBoundary>
  )
}

export default App
