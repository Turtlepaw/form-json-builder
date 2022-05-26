import React from 'react'
import { Button, Collapse, Box, useDisclosure, useColorMode } from '@chakra-ui/react'

function Collapsible({ name, deleteButton, children}) {
  const { isOpen, onToggle } = useDisclosure();
  const { colorMode } = useColorMode();

  return (
    <Box
    width='100%'
    border={`1px solid ${colorMode === 'dark' ?  '#e3e5e8' : '#292b2f'}`}
    borderRadius='4px'
    boxShadow='rgb(0 0 0 / 16%) 0px 4px 4px'>
      <Button onClick={onToggle} margin={0} justifyContent='space-between' width='100%' _focus='unset' bg='transparent' color={colorMode === 'dark' ? 'black' : 'white'}> {name} {deleteButton}</Button>
      <Collapse in={isOpen} animateOpacity margin={0}>
        <Box
          p='40px'
          mt='4'
          rounded='md'
          shadow='md'
          margin='0'
        >
         {children}
        </Box>
      </Collapse>
    </Box>
  )
}

export default Collapsible