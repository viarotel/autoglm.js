import type { BoxProps } from 'ink'
import { Box } from 'ink'

export default function Divider({
  width = 'auto',
  padding = 0,
  dividerChar = '─',
  dividerColor = 'gray',
  boxProps,
}: {
  width?: string | number
  padding?: number
  dividerChar?: string
  dividerColor?: string
  boxProps?: BoxProps
}) {
  return (
    <Box paddingLeft={padding} paddingRight={padding}>
      <Box
        width={width}
        // @ts-expect-error Ink type definition is incorrect
        borderStyle={{
          bottom: dividerChar,
        }}
        borderColor={dividerColor}
        flexGrow={1}
        borderBottom={true}
        borderTop={false}
        borderLeft={false}
        borderRight={false}
        {...boxProps}
      />
    </Box>
  )
}
