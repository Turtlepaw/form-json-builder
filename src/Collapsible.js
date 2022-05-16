import React from 'react'
import { Button, Collapse, Box, useDisclosure } from '@chakra-ui/react'

function Collapsible({ children }) {
  const { isOpen, onToggle } = useDisclosure()

  return (
    <Box>
      <Button onClick={onToggle} margin={0} borderBottomRadius={isOpen ? 0 : 'var(--chakra-radii-md)'} width='100%'>Click Me</Button>
      <Collapse in={isOpen} animateOpacity margin={0}>
        <Box
          p='40px'
          color='white'
          mt='4'
          bg='teal.500'
          rounded='md'
          shadow='md'
          margin={0}
          borderTopRadius={isOpen ? 0 : 'var(--chakra-radii-md)'}
        >
         {children}
        </Box>
      </Collapse>
    </Box>
  )
}

export default Collapsible