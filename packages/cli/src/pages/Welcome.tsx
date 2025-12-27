import { Box, Text } from 'ink'

export default function Welcome() {
  return (
    <Box
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      marginBottom={3}
      marginTop={1}
    >
      <Box marginBottom={2}>
        <Text color="cyan" bold>Welcome to AutoGLM.js</Text>
      </Box>
      <Box marginBottom={2}>
        <Text color="white" bold>Enter your task below to get started</Text>
      </Box>
      <Box marginBottom={1}>
        <Text color="gray" dimColor>💡 Example: "Open the browser"</Text>
      </Box>
      <Box marginBottom={1}>
        <Text color="cyan" dimColor>⏎ Press Enter to submit your task</Text>
      </Box>
      <Box>
        <Text color="green" dimColor>🔍 Type / to see available commands</Text>
      </Box>
    </Box>
  )
}
