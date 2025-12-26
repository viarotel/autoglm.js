import type { ScrollViewRef } from 'ink-scroll-view'
import { Box, Text, useInput, useStdout } from 'ink'
import { ScrollView } from 'ink-scroll-view'
import { useEffect, useRef } from 'react'

interface Event {
  type: string
  data: any
  time: string
}

interface EventLogProps {
  events: Event[]
}

function EmptyState() {
  return (
    <Box flexDirection="column" alignItems="center" justifyContent="center" height={20}>
      <Box marginBottom={1}>
        <Text color="cyan" bold>Welcome to AutoGLM</Text>
      </Box>
      <Box marginBottom={1}>
        <Text color="white">Enter your task below to get started</Text>
      </Box>
      <Box marginBottom={1}>
        <Text color="gray" dimColor>Example: "Create a simple todo app"</Text>
      </Box>
      <Box>
        <Text color="gray" dimColor>Press Enter to submit your task</Text>
      </Box>
    </Box>
  )
}

function EventList({ events }: { events: Event[] }) {
  const scrollRef = useRef<ScrollViewRef>(null)
  const { stdout } = useStdout()

  useEffect(() => {
    const handleResize = () => scrollRef.current?.remeasure()
    stdout?.on('resize', handleResize)
    return () => {
      stdout?.off('resize', handleResize)
    }
  }, [stdout])

  useInput((input, key) => {
    if (!scrollRef.current)
      return
    if (key.upArrow) {
      scrollRef.current.scrollBy(-1)
    }
    if (key.downArrow) {
      scrollRef.current.scrollBy(1)
    }
    if (key.pageUp) {
      const height = scrollRef.current.getViewportHeight() || 1
      scrollRef.current.scrollBy(-height)
    }
    if (key.pageDown) {
      const height = scrollRef.current.getViewportHeight() || 1
      scrollRef.current.scrollBy(height)
    }
  })

  const getEventColor = (type: string) => {
    switch (type) {
      case 'start':
        return 'cyan'
      case 'thinking':
        return 'yellow'
      case 'action':
        return 'blue'
      case 'task_complete':
        return 'green'
      case 'error':
        return 'red'
      default:
        return 'white'
    }
  }

  const getEventLabel = (type: string) => {
    switch (type) {
      case 'start':
        return 'START'
      case 'thinking':
        return 'THINKING'
      case 'action':
        return 'ACTION'
      case 'task_complete':
        return 'COMPLETE'
      case 'error':
        return 'ERROR'
      default:
        return type.toUpperCase()
    }
  }

  const formatEventData = (event: Event) => {
    const data = event.data?.message || event.data
    if (typeof data === 'string') {
      return data
    }
    if (data?.thought) {
      return data.thought
    }
    if (data?.action) {
      return data.action
    }
    if (data?.result) {
      return data.result
    }
    return JSON.stringify(data)
  }

  useEffect(() => {
    if (events.length > 0 && events[events.length - 1].type === 'task_complete') {
      scrollRef.current?.scrollToBottom()
    }
  }, [events])

  return (
    <Box marginBottom={1} flexDirection="column">
      <Box marginBottom={1} justifyContent="space-between">
        <Text color="gray" bold>ACTIVITY:</Text>
        <Text color="gray" dimColor>↑↓ Scroll | PgUp/PgDn Page</Text>
      </Box>
      <Box
        height={20}
        width="100%"
      >
        <ScrollView ref={scrollRef}>
          {events.map((event, index) => (
            <Box key={index} justifyContent="space-between" width="100%" marginBottom={1} alignItems="flex-start">
              <Box flexDirection="row">
                <Box width={13}>
                  <Text color={getEventColor(event.type)} bold>
                    {`[${getEventLabel(event.type)}]`}
                  </Text>
                </Box>
                <Box>
                  <Text color="white">
                    {formatEventData(event).trim()}
                  </Text>
                </Box>
              </Box>
              <Box width={16} justifyContent="flex-end">
                <Text color="gray" dimColor>
                  {event.time}
                </Text>
              </Box>
            </Box>
          ))}
        </ScrollView>
      </Box>

    </Box>
  )
}

export default function EventLog({ events }: EventLogProps) {
  if (events.length === 0) {
    return <EmptyState />
  }

  return <EventList events={events} />
}
