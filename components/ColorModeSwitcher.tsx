import React from 'react';
import { useColorMode, useColorModeValue, IconButton, IconButtonProps, color, Tooltip } from '@chakra-ui/react';
import { FaMoon, FaSun } from 'react-icons/fa';
import { Omit } from './SettingsModal';

export function ColorModeSwitcher ({placement, ...rest }:any ) {
  const { toggleColorMode } = useColorMode();
  const text = useColorModeValue('Dark', 'Light');
  const SwitchIcon = useColorModeValue(FaMoon, FaSun);
  const colorMode = useColorMode().colorMode

  return (
    <Tooltip label={`${text} Mode`} placement={placement} hasArrow arrowSize={6}>
      <IconButton
        size="md"
        minWidth='unset'
        borderRadius='md'
        height='32px'
        width='32px' 
        bg='transparent'
        _hover={{ bg: colorMode === 'dark' ? '#ffffff0f' : '#0000000f' }}
        aria-label={`Switch to ${text.toLowerCase()} mode`}
        onClick={toggleColorMode}
        icon={<SwitchIcon color={colorMode === 'dark' ? '#B8B9BF' : '#4E5058'} />}
        {...rest}
      />
    </Tooltip>
  );
};
