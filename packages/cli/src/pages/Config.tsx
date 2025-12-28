import { join } from 'node:path'
import { AUTOGLM_FILEPATH } from 'autoglm.js'
import { Box, Text } from 'ink'
import { useAgentContext } from '@/context/AgentContext'

interface ConfigSectionProps {
  title: string
  children: React.ReactNode
}

function ConfigSection({ title, children }: ConfigSectionProps) {
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Box marginBottom={1}>
        <Text color="blue" bold>
          {title}
        </Text>
      </Box>
      {children}
    </Box>
  )
}

interface ConfigItemProps {
  label: string
  value: string | number | undefined
  color?: string
  important?: boolean
}

function ConfigItem({ label, value, color = 'white', important = false }: ConfigItemProps) {
  return (
    <Box marginBottom={1}>
      <Box width={20}>
        <Text color={important ? 'yellow' : 'cyan'} bold={important}>
          {label}
        </Text>
      </Box>
      <Box flexGrow={1}>
        <Text color={color} bold={important}>
          {value ?? 'N/A'}
        </Text>
      </Box>
    </Box>
  )
}

export default function Config() {
  const { config } = useAgentContext()

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      <ConfigSection title="API Settings">
        <ConfigItem label="Base URL" value={config.baseUrl} important={true} />
        <ConfigItem
          label="API Key"
          value={config.apiKey ? `${config.apiKey.slice(0, 8)}*****${config.apiKey.slice(-8)}` : 'Not Set'}
          important={true}
        />
        <ConfigItem label="Model" value={config.model} important={true} />
      </ConfigSection>

      <ConfigSection title="Generation Parameters">
        <ConfigItem label="Max Tokens" value={config.maxTokens} />
        <ConfigItem label="Temperature" value={config.temperature} />
        <ConfigItem label="Top P" value={config.topP} />
        <ConfigItem label="Frequency Penalty" value={config.frequencyPenalty} />
      </ConfigSection>

      <ConfigSection title="System Settings">
        <ConfigItem label="Device ID" value={config.deviceId} />
        <ConfigItem label="Max Steps" value={config.maxSteps} />
        <ConfigItem label="Language" value={config.lang} />
      </ConfigSection>

      {config.systemPrompt && (
        <ConfigSection title="System Prompt">
          <Box>
            <Text color="white">
              {config.systemPrompt.length > 80
                ? `${config.systemPrompt.slice(0, 80)}...`
                : config.systemPrompt}
            </Text>
          </Box>
        </ConfigSection>
      )}

      <Box marginBottom={1}>
        <Text color="white" bold>Configuration Tip: </Text>
        <Text color="gray" dimColor>
          Create a config file at
          {' '}
          {join(AUTOGLM_FILEPATH, 'config.json')}
        </Text>
      </Box>
    </Box>
  )
}
