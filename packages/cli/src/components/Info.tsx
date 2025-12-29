import { Box, Text } from 'ink'
import { useDeviceInfo } from '@/hooks/useAutoGLM'
import SystemStatus from './SystemStatus'

export default function Info() {
  const { version, hasDevices, currentDevice } = useDeviceInfo()

  return (
    <Box justifyContent="space-between">
      <Box gap={2}>
        {hasDevices && currentDevice && (
          <Box gap={2}>
            <Box>
              <Text color="gray">DEVICE:</Text>
              <Text color="white" bold>
                {' '}
                {currentDevice.model}
              </Text>
            </Box>
            <Box>
              <Text color="gray">TYPE:</Text>
              <Text color="white" bold>
                {' '}
                {currentDevice.connectionType.toLocaleUpperCase()}
              </Text>
            </Box>
            <Box>
              <Text color="gray">deviceID:</Text>
              <Text color="white" bold>
                {' '}
                {currentDevice.deviceId}
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

      <SystemStatus />
    </Box>
  )
}
