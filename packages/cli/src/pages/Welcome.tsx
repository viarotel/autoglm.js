import { Box, Text } from 'ink'

export default function Welcome() {
  return (
    <Box flexDirection="column" alignItems="center" justifyContent="center" height={20}>
      <Box marginBottom={1}>
        <Text color="cyan" bold>Welcome to AutoGLM.js</Text>
      </Box>
      <Box marginBottom={1}>
        <Text color="white">Enter your task below to get started</Text>
      </Box>
      <Box marginBottom={1}>
        <Text color="gray" dimColor>Example: "Open the browser"</Text>
      </Box>
      <Box>
        <Text color="gray" dimColor>Press Enter to submit your task</Text>
      </Box>
    </Box>
  )
}
