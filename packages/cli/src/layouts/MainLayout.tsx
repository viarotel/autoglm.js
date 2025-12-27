import type { ReactNode } from 'react'
import { Box } from 'ink'
import Banner from '@/components/Banner'
import Info from '@/components/Info'
import { UserInput } from '@/components/UserInput'

interface MainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <Box marginRight={2} marginLeft={2} flexDirection="column">
      <Banner />

      {children}

      <UserInput />
      <Info />
    </Box>
  )
}
