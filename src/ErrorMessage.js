import React from 'react'
import { Text } from '@chakra-ui/react'

function ErrorMessage({ children }) {

  return (
    <Text color='#ff7a6b'>{children}</Text>
  )
}

export default ErrorMessage