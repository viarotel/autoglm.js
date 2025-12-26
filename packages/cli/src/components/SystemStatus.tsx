import type { AutoGLM } from 'autoglm.js'
import { Box, Text } from 'ink'
import { useEffect, useState } from 'react'

interface CheckResult {
  system: boolean | null
  api: boolean | null
}

export default function SystemStatus({ autoGLMAgent }: { autoGLMAgent: AutoGLM }) {
  const [checks, setChecks] = useState<CheckResult>({
    system: null,
    api: null,
  })

  useEffect(() => {
    const runChecks = async () => {
      try {
        const [systemCheck, apiCheck] = await Promise.all([
          autoGLMAgent.checkSystemRequirements(),
          autoGLMAgent.checkModelApi(),
        ])
        setChecks({
          system: systemCheck.success,
          api: apiCheck.success,
        })
      }
      catch {
        setChecks({
          system: false,
          api: false,
        })
      }
    }

    runChecks()
  }, [autoGLMAgent])

  const getStatusColor = (status: boolean | null) => {
    if (status === null)
      return 'yellow'
    return status ? 'green' : 'red'
  }

  const getStatusText = (status: boolean | null) => {
    if (status === null)
      return 'Checking...'
    return status ? 'OK' : 'Failed'
  }

  return (
    <Box marginBottom={1} gap={4}>
      <Box gap={1}>
        <Text color="gray">SYSTEM:</Text>
        <Text color={getStatusColor(checks.system)} bold>
          {getStatusText(checks.system)}
        </Text>
      </Box>
      <Box gap={1}>
        <Text color="gray">API:</Text>
        <Text color={getStatusColor(checks.api)} bold>
          {getStatusText(checks.api)}
        </Text>
      </Box>
    </Box>
  )
}
