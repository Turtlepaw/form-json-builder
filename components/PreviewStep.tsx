import { HStack, Box, Text, useColorMode } from "@chakra-ui/react";

export function PreviewStep({ number, title, children }: any) {
  const colorMode = useColorMode().colorMode

  return (
    <HStack display='flex' spacing={2} align='start'>
      <Box bg={colorMode === 'dark' ? '#2f3136' : '#f2f3f5'} height='36px' minWidth='36px' borderRadius='50%' display='flex' alignItems='center' justifyContent='center' mt={1}>
        <Text fontFamily='Whitney Bold' fontSize='18px'>{number.toString()}</Text>
      </Box>
      <Box p={3} pt={2} borderRadius='8px' bg={colorMode === 'dark' ? '#2f3136' : '#f2f3f5'} width='100%'>
        <Text pb={2}>{title}</Text>
        {children}
      </Box>
    </HStack>
  )
}