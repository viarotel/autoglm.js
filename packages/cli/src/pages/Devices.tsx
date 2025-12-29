import type { ScrollListRef } from 'ink-scroll-list'
import { Box, Text, useInput } from 'ink'
import { ScrollList } from 'ink-scroll-list'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useAgentContext } from '@/context/AgentContext'
import { useDeviceInfo } from '@/hooks/useAutoGLM'
import { useUserInputStore } from '@/store/userInputStore'

interface DeviceItemProps {
  device: any
  isSelected: boolean
  isCurrentDevice: boolean
}

function DeviceItem({ device, isSelected, isCurrentDevice }: DeviceItemProps) {
  const statusColor = device.status === 'device' ? 'green' : device.status === 'unauthorized' ? 'yellow' : 'red'
  const statusText = device.status === 'device' ? 'ONLINE' : device.status.toUpperCase()

  return (
    <Box flexDirection="column" marginBottom={1}>
      <Box flexDirection="row">
        <Box width={4}>
          <Text color={isSelected ? 'cyan' : 'gray'}>
            {isSelected ? '> ' : '  '}
          </Text>
        </Box>
        <Box width={50}>
          <Text color={isSelected ? 'cyan' : 'white'} bold={isSelected}>
            {device.model || device.deviceId}
          </Text>
          {isCurrentDevice && (
            <Text color="green" bold>
              {' '}
              (Current)
            </Text>
          )}
        </Box>
        <Box width={12}>
          <Text color={statusColor}>
            {statusText}
          </Text>
        </Box>
      </Box>
      {isSelected && (
        <Box flexDirection="column" marginLeft={6}>
          <Box flexDirection="row">
            <Box width={15}>
              <Text color="gray">Device ID:</Text>
            </Box>
            <Box>
              <Text color="white">{device.deviceId}</Text>
            </Box>
          </Box>
          <Box flexDirection="row">
            <Box width={15}>
              <Text color="gray">Connection:</Text>
            </Box>
            <Box>
              <Text color="white">{device.connectionType.toUpperCase()}</Text>
            </Box>
          </Box>
          {device.brand && (
            <Box flexDirection="row">
              <Box width={15}>
                <Text color="gray">Brand:</Text>
              </Box>
              <Box>
                <Text color="white">{device.brand}</Text>
              </Box>
            </Box>
          )}
          {device.androidVersion && (
            <Box flexDirection="row">
              <Box width={15}>
                <Text color="gray">Android:</Text>
              </Box>
              <Box>
                <Text color="white">
                  {device.androidVersion}
                  {' '}
                  (API
                  {' '}
                  {device.apiLevel}
                  )
                </Text>
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}

export default function Devices() {
  const { updateConfig, getConfig } = useAgentContext()
  const { devices, isRefreshing, refresh } = useDeviceInfo()
  const listRef = useRef<ScrollListRef>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const { isCommand } = useUserInputStore()

  const currentConfig = getConfig()
  const currentDeviceId = currentConfig.deviceId

  const sortedDevices = useMemo(() => {
    return [...devices].sort((a, b) => {
      return a.deviceId.localeCompare(b.deviceId)
    })
  }, [devices, currentDeviceId])

  const selectDevice = useCallback((index: number) => {
    const device = sortedDevices[index]
    if (device && device.deviceId !== currentDeviceId) {
      updateConfig({ deviceId: device.deviceId })
    }
  }, [sortedDevices, currentDeviceId, updateConfig])

  useInput((_input, key) => {
    if (key.upArrow) {
      const newIndex = listRef.current?.selectPrevious() ?? 0
      setSelectedIndex(newIndex)
    }
    if (key.downArrow) {
      const newIndex = listRef.current?.selectNext() ?? 0
      setSelectedIndex(newIndex)
    }
    if (key.return) {
      selectDevice(selectedIndex)
    }
    if (key.ctrl && _input === 'r') {
      refresh()
    }
  }, { isActive: !isCommand })

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      <Box marginBottom={1}>
        <Text color="blue" bold>
          Connected Devices
        </Text>
      </Box>

      {sortedDevices.length === 0
        ? (
            <Box flexDirection="column">
              <Box marginBottom={1}>
                <Text color="yellow">No devices connected</Text>
              </Box>
              <Box marginBottom={1}>
                <Text color="gray">Press Ctrl+R to refresh device list</Text>
              </Box>
            </Box>
          )
        : (
            <Box flexDirection="column">
              <Box flexDirection="row" marginBottom={1}>
                <Box width={4} />
                <Box width={50}>
                  <Text color="gray" bold>
                    Device
                  </Text>
                </Box>
                <Box width={12}>
                  <Text color="gray" bold>
                    Status
                  </Text>
                </Box>
              </Box>

              <ScrollList
                ref={listRef}
                selectedIndex={selectedIndex}
                onSelectionChange={setSelectedIndex}
              >
                {sortedDevices.map((device, index) => (
                  <DeviceItem
                    key={device.deviceId}
                    device={device}
                    isSelected={index === selectedIndex}
                    isCurrentDevice={device.deviceId === currentDeviceId}
                  />
                ))}
              </ScrollList>

              <Box marginTop={1}>
                <Text color="gray">
                  Use ↑↓ to navigate, Enter to select device, Ctrl+R to refresh
                </Text>
              </Box>
            </Box>
          )}

      {isRefreshing && (
        <Box marginTop={1}>
          <Text color="cyan">Refreshing devices...</Text>
        </Box>
      )}
    </Box>
  )
}
