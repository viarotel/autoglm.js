import { MemoryRouter } from 'react-router'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { getAppConfig } from '@/config/appConfig'
import { AgentProvider } from '@/context/AgentContext'
import AppRouter from '@/router'

function App() {
  const config = getAppConfig()

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
