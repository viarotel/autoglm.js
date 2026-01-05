import type { ScrollViewRef } from 'ink-scroll-view'
import { EventType } from 'autoglm.js'
import { Box, Text, useInput, useStdout } from 'ink'
import { ScrollView } from 'ink-scroll-view'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useEventLog } from '@/hooks/useEventLog'
import { useUserInputStore } from '@/store/userInputStore'

export function EventList() {
  const { t } = useTranslation()
  const scrollRef = useRef<ScrollViewRef>(null)
  const { stdout } = useStdout()
  const { events } = useEventLog()
  const { isCommand } = useUserInputStore()

  enum ScrollState {
    AUTO_SCROLL,
    USER_SCROLLED,
  }

  const [scrollState, setScrollState] = useState<ScrollState>(ScrollState.AUTO_SCROLL)

  const mergedEvents = useMemo(() => {
    const result: typeof events = []
    for (const event of events) {
      const preIndex = result.length - 1
      const previousEvent = result[preIndex]
      if (event.type === EventType.THINKING_STREAM && result.length > 0 && previousEvent.type === EventType.THINKING_STREAM) {
        result[preIndex] = {
          ...result[preIndex],
          data: result[preIndex].data + event.data,
        }
      }
      else {
        result.push(event)
      }
    }
    return result
  }, [events])

  // Handle terminal resize to remeasure scroll dimensions
  useEffect(() => {
    const handleResize = () => scrollRef.current?.remeasure()
    stdout?.on('resize', handleResize)
    return () => {
      stdout?.off('resize', handleResize)
    }
  }, [stdout])

  const checkAndUpdateScrollState = useCallback(() => {
    if (!scrollRef.current)
      return scrollState === ScrollState.AUTO_SCROLL

    const atBottom = scrollRef.current.getScrollOffset() >= scrollRef.current.getBottomOffset() - 1

    if (atBottom && scrollState === ScrollState.USER_SCROLLED) {
      setScrollState(ScrollState.AUTO_SCROLL)
    }

    return atBottom
  }, [scrollState])

  useInput((_input, key) => {
    if (!scrollRef.current)
      return

    // Scroll up - switch to user scrolled state
    if (key.upArrow) {
      scrollRef.current.scrollBy(-1)
      const atBottom = checkAndUpdateScrollState()
      if (!atBottom) {
        setScrollState(ScrollState.USER_SCROLLED)
      }
      return
    }

    // Scroll down - check if we should return to auto scroll
    if (key.downArrow) {
      scrollRef.current.scrollBy(1)
      checkAndUpdateScrollState()
      return
    }

    // Page up - switch to user scrolled state
    if (key.pageUp) {
      const height = scrollRef.current.getViewportHeight() || 1
      scrollRef.current.scrollBy(-height)
      const atBottom = checkAndUpdateScrollState()
      if (!atBottom) {
        setScrollState(ScrollState.USER_SCROLLED)
      }
      return
    }

    // Page down - check if we should return to auto scroll
    if (key.pageDown) {
      const height = scrollRef.current.getViewportHeight() || 1
      scrollRef.current.scrollBy(height)
      checkAndUpdateScrollState()
    }
  }, { isActive: !isCommand })

  // Auto-scroll on new events (only when in auto scroll state)
  useEffect(() => {
    if (mergedEvents.length === 0)
      return

    const lastEvent = mergedEvents[mergedEvents.length - 1]

    // Re-measure the last item if it's a thinking event (streaming content)
    if (lastEvent.type === EventType.THINKING_STREAM) {
      scrollRef.current?.remeasureItem(mergedEvents.length - 1)
    }

    // Always scroll to bottom on task completion or error
    if ([EventType.TASK_COMPLETE, EventType.ERROR, EventType.ABORTED].includes(lastEvent.type)) {
      scrollRef.current?.scrollToBottom()
    }

    // Otherwise, only auto-scroll if we're in auto scroll state
    else if (scrollState === ScrollState.AUTO_SCROLL) {
      scrollRef.current?.scrollToBottom()
    }
  }, [mergedEvents])

  return (
    <Box marginBottom={1} flexDirection="column">
      <Box marginBottom={1} justifyContent="space-between">
        <Text color="gray" bold>{t('eventLog.activity')}</Text>
        <Text color="gray" dimColor>{t('eventLog.scrollHint')}</Text>
      </Box>
      <Box
        height={20}
        width="100%"
      >
        <ScrollView ref={scrollRef}>
          {mergedEvents.map((event, index) => (
            <Box key={index} justifyContent="space-between" width="100%" marginBottom={1} alignItems="flex-start">
              <Box flexDirection="row">
                <Box width={13}>
                  <Text color={event.color} bold>
                    {`[${event.label}]`}
                  </Text>
                </Box>
                <Box>
                  <Text color="white">
                    {event.data.trim()}
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
