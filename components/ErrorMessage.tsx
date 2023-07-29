/* eslint eqeqeq: 0 */
import React from 'react'
import { HStack, Text, TextProps, useColorMode } from '@chakra-ui/react'
import { AiFillExclamationCircle } from 'react-icons/ai';

export interface ErrorMessageProperties extends TextProps {
  error?: {
    type?: string;
  };
  children?: React.ReactNode;
}

export default function ErrorMessage({ children, error }: ErrorMessageProperties) {
  if (error) {
    const message = (() => {
      switch(error?.type) {
        case 'required': return 'Required'
        case 'maxLength': return 'Too long'
        case 'minLength': return 'Too short'
        default: return 'Invalid'
      }
    })()
    children = (<>{error?.type && message}</>);
  }
  const colorMode = useColorMode().colorMode;
  return (
    <HStack>
      {children ? <AiFillExclamationCircle color={colorMode === 'dark' ? '#ff7a6b' : '#d92f2f'} /> : null}
      <Text color={colorMode === 'dark' ? '#ff7a6b' : '#d92f2f'}>
        {children}
      </Text>
    </HStack>
  )
};
