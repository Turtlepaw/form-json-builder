/* eslint eqeqeq: 0 */
import React, { PropsWithChildren } from 'react'
import { HStack, Text, TextProps, useColorMode } from '@chakra-ui/react'
import { AiFillExclamationCircle } from 'react-icons/ai';

export interface ErrorMessageProperties extends TextProps {
  field?: {
    type: string;
  };
  fieldName?: string;
  fieldType?: string;
  children?: React.ReactNode;
}

export default function ErrorMessage(options: ErrorMessageProperties) {
  let { children, field, fieldName = "field", fieldType = "This" } = options;
  if (field != null) children = (<>
    {field?.type == "required" && `${fieldType} ${fieldName} is required`}
    {field?.type == "maxLength" && `${fieldType} ${fieldName} is too long`}
    {field?.type == "minLength" && `${fieldType} ${fieldName} is not long enough`}
  </>);
  const colorMode = useColorMode().colorMode;
  return (
    <HStack>
      {children ? <AiFillExclamationCircle color={colorMode === 'dark' ? '#ff7a6b' : '#d92f2f'} /> : null}
      <Text color={colorMode === 'dark' ? '#ff7a6b' : '#d92f2f'} {...options}>
        {children}
      </Text>
    </HStack>
  )
};
