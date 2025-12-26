import type { AutoGLM, DeviceInfo } from 'autoglm.js'
import { Box, Text } from 'ink'
import { useEffect, useState } from 'react'
import SystemStatus from './SystemStatus'

export default function Info({ autoGLMAgent }: { autoGLMAgent: AutoGLM }) {
  const [version, setVersion] = useState<string>('Loading...')
  const [device, setDevice] = useState<DeviceInfo[]>([])

  useEffect(() => {
    autoGLMAgent.adb.getVersion()
      .then((info) => {
        const { version, success } = info
        setVersion(success ? `v${version || 'Not Installed'}` : 'Not Installed')
      })
    autoGLMAgent.adb.getConnectedDevices().then((devices) => {
      setDevice(devices)
    })
  }, [autoGLMAgent])

  return (
    <Box justifyContent="space-between">
      <Box gap={2}>
        {device.length === 1 && (
          <Box gap={2}>
            <Box>
              <Text color="gray">DEVICE:</Text>
              <Text color="white" bold>
                {' '}
                {device[0].model}
              </Text>
            </Box>
            <Box>
              <Text color="gray">TYPE:</Text>
              <Text color="white" bold>
                {' '}
                {device[0].connectionType.toLocaleUpperCase()}
              </Text>
            </Box>
            <Box>
              <Text color="gray">deviceID:</Text>
              <Text color="white" bold>
                {' '}
                {device[0].deviceId}
              </Text>
            </Box>
          </Box>
        )}

        <Box>
          <Text color="gray">ADB:</Text>
          <Text color="white" bold>
            {' '}
            {version}
          </Text>
        </Box>
      </Box>

      <SystemStatus autoGLMAgent={autoGLMAgent} />
    </Box>
  )
}
