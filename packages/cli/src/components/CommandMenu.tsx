import type { ScrollListRef } from 'ink-scroll-list'
import { Box, Text, useInput } from 'ink'
import { ScrollList } from 'ink-scroll-list'
import { useMemo, useRef, useState } from 'react'

const COMMANDS = {
  help: 'Show help',
  exit: 'Exit the program',
} as const

interface CommandMenuProps {
  query: string
  onCommandSelect: (command: string) => void
}

export function CommandMenu({ query, onCommandSelect }: CommandMenuProps) {
  const listRef = useRef<ScrollListRef>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const filteredCommands = useMemo(() => {
    const searchTerm = query.slice(1).toLowerCase()
    return Object.entries(COMMANDS).filter(([command]) =>
      command.toLowerCase().includes(searchTerm),
    )
  }, [query])

  useInput((input, key) => {
    if (key.upArrow) {
      const newIndex = listRef.current?.selectPrevious() ?? 0
      setSelectedIndex(newIndex)
    }
    if (key.downArrow) {
      const newIndex = listRef.current?.selectNext() ?? 0
      setSelectedIndex(newIndex)
    }
    if (key.return) {
      const selectedCommand = filteredCommands[selectedIndex]?.[0]
      if (selectedCommand) {
        onCommandSelect(selectedCommand)
      }
    }
  })

  return (
    <Box height={10}>
      <ScrollList
        ref={listRef}
        selectedIndex={selectedIndex}
        onSelectionChange={setSelectedIndex}
      >
        {filteredCommands.map(([command, description], i) => (
          <Box key={command} flexDirection="row">
            <Box width={20}>
              <Text color={i === selectedIndex ? 'cyan' : 'gray'}>
                {i === selectedIndex ? '> ' : '  '}
                {`/${command}`}
              </Text>
            </Box>
            <Box flexGrow={1}>
              <Text color={i === selectedIndex ? 'cyan' : 'gray'}>
                {description}
              </Text>
            </Box>
          </Box>
        ))}
      </ScrollList>
    </Box>
  )
}
