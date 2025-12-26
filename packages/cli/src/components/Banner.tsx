import { Box } from 'ink'
import BigText from 'ink-big-text'
import Gradient from 'ink-gradient'

export default function Banner() {
  return (
    <Box flexDirection="column" marginBottom={1} alignItems="center">
      <Gradient name="cristal">
        <BigText text="AutoGLM.js" />
      </Gradient>
    </Box>
  )
}
