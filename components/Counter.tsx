import { Box } from "@chakra-ui/react"
import { useColorMode } from "@chakra-ui/react"

interface CounterProperties {
  count?: number
  max: number
}

export default function Counter({ count, max }:CounterProperties) {
  count = count || 0
  const colorMode = useColorMode().colorMode
  return <Box ml='7px' fontSize='13px' color={count > max ? (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') : (colorMode === 'dark' ? '#dcddde' : '#2e3338')}>{count}/{max}</Box>
}