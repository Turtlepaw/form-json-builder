import React from 'react';
import { useColorMode, useColorModeValue, IconButton, IconButtonProps } from '@chakra-ui/react';
import { FaMoon, FaSun } from 'react-icons/fa';
import { Omit } from './SettingsModal';

export const ColorModeSwitcher = (props: Omit<IconButtonProps, "aria-label">) => {
  const { toggleColorMode } = useColorMode();
  const text = useColorModeValue('dark', 'light');
  const SwitchIcon = useColorModeValue(FaMoon, FaSun);
  const colorMode = useColorMode().colorMode

  return (
      <IconButton
        size="md"
        minWidth='unset'
        borderRadius='md'
        bg='transparent'
        _hover={{ bg: colorMode === 'dark' ? '#ffffff0f' : '#0000000f' }}
        aria-label={`Switch to ${text} mode`}
        color="#bcbcbc"
        onClick={toggleColorMode}
        icon={<SwitchIcon color='#bcbcbc' />}
        {...props}
      />
  );
};
