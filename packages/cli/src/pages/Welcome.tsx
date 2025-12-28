import { Box, Text } from 'ink'

export default function Welcome() {
  return (
    <Box flexDirection="column" alignItems="center" marginBottom={4} marginTop={2}>

      {/* Main Action */}
      <Box marginBottom={3} flexDirection="column" alignItems="center">
        <Box marginBottom={1}>
          <Text color="white" bold>
            Enter your task below
          </Text>
        </Box>
        <Text color="gray" dimColor>
          Example: "Open browser and search for AI news"
        </Text>
      </Box>

      {/* Subtle Hints */}
      <Box flexDirection="column" alignItems="center" gap={1}>
        <Text color="gray" dimColor>
          Press
          {' '}
          <Text color="white">⏎ Enter</Text>
          {' '}
          to submit
        </Text>
        <Text color="gray" dimColor>
          Type
          {' '}
          <Text color="white">/</Text>
          {' '}
          for commands
        </Text>
      </Box>
    </Box>
  )
}
