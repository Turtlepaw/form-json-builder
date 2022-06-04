import React from 'react'
import { Text } from '@chakra-ui/react'

function ErrorMessage({ children }) {

  return (
    <Text color='#ed4245'>{children}</Text>
  )
}

export default ErrorMessage