import React from 'react'
import { Button, Collapse, Box, useDisclosure } from '@chakra-ui/react'

function Collapsible({ name, deleteButton, children }) {
  const { isOpen, onToggle } = useDisclosure()

  return (
    <Box width='100%'>
      <Button onClick={onToggle} margin={0} justifyContent='space-between' borderBottomRadius={isOpen ? 0 : 'var(--chakra-radii-md)'} width='100%' _focus='unset'>{name} {deleteButton}</Button>
      <Collapse in={isOpen} animateOpacity margin={0}>
        <Box
          p='40px'
          color='white'
          mt='4'
          bg='teal.500'
          rounded='md'
          shadow='md'
          margin='0'
          borderTopRadius='0'
        >
         {children}
        </Box>
      </Collapse>
    </Box>
  )
}

export default Collapsible