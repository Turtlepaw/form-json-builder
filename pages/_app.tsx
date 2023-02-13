import '../styles/App.css';
import '../util/framer-motion.d';
import { Box, Button, ChakraProvider, ColorModeScript, Divider, FormLabel, Heading, HStack, Input, Link, ListItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalOverlay, OrderedList, Spinner, Text, UnorderedList, useColorMode, useDisclosure, VStack } from '@chakra-ui/react';
import theme from "../components/theme";
import { SettingsManagerProvider, SettingsManagerBuilder, SettingsManager } from '../util/settings';
import { AppProps } from 'next/app';
import { resolveBoolean, Switches, useToggle } from '../components/Toggle';
import ErrorMessage from '../components/ErrorMessage';
import Image from 'next/image';
import { LinkStyle } from '../util/styles';
import { useEffect, useState } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  const SettingsManager = new SettingsManagerBuilder();
  const { colorMode } = useColorMode();
  const [hasSeenRelease, setReleaseSeen] = useState(false);
  const [initialLoad, loaded] = useState(false);
  const ValueName = "HAS_SEEN_213_RELEASE";
  const { isOpen, onClose, onOpen } = useDisclosure({ defaultIsOpen: false, onClose: () => setReleaseSeen(true) });
  useEffect(() => {
    const val = localStorage.getItem(ValueName);
    const resolvedVal = val == null ? false : resolveBoolean(val);
    if (val != null) setReleaseSeen(
      resolveBoolean(val)
    );
    if (resolvedVal == false) onOpen();
    loaded(true);
  }, [onOpen]);

  useEffect(() => {
    if (!initialLoad) return;
    localStorage.setItem(ValueName, JSON.stringify(hasSeenRelease));
  }, [hasSeenRelease, initialLoad]);

  console.log("a", hasSeenRelease)

  return (
    <ChakraProvider theme={theme}>
      <style>
        {`::-webkit-scrollbar {
          height: 16px;
          width: 16px;
        }

        ::-webkit-scrollbar-corner {
          background - color: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background-color: ${colorMode != "dark" ? "rgb(32, 34, 37)" : "#c1c3c7"};
          border: 4px solid transparent;
          border-radius: 8px;
          min-height: 40px;
          background-clip: padding-box;
        }

        ::-webkit-scrollbar-track {
          background-color: ${colorMode != "dark" ? "rgb(46, 51, 56)" : "#f2f2f2"};
          border: 4px solid transparent;
          border-radius: 8px;
          margin-bottom: 8px;
          background-clip: padding-box;
        }
  `}
      </style>
      {/* <SettingsManagerProvider value={SettingsManager}> */}
      <ColorModeScript initialColorMode='dark' />
      <Component {...pageProps} />
      <Modal {...{ isOpen, onClose }}>
        <ModalOverlay />
        <ModalContent backgroundColor="#36393f">
          {/* <HStack pl={5} pt={4}>
            <Image
              src="/forms.svg"
              alt="Forms Logo"
              width={28}
              height={28}
              style={{
                clipPath: 'circle(50%)'
              }}
            />
            <Heading size="md" pl={2} fontWeight="medium">Download Template</Heading>
          </HStack> */}
          <ModalCloseButton />
          <ModalBody paddingY={6}>
            <VStack textAlign="center">
              <Heading size="md" fontWeight="medium">What&apos;s New</Heading>
              <Text color="#b9bbbe">February 13 2023</Text>
            </VStack>
            <VStack pt={5}>
              <UnorderedList>
                <ListItem py={1}>We&apos;ve switched to <Link style={LinkStyle} href="https://nextjs.org/">Next.js</Link> and <Link style={LinkStyle} href="https://typescriptlang.org/">TypeScript</Link>, this will make the website more stable and faster</ListItem>
                <ListItem py={1}>Quick start your server with <Link style={LinkStyle} href="/templates">Form Templates</Link></ListItem>
                <ListItem py={1}>Added spinners on download buttons</ListItem>
                {/* <ListItem py={1}>Configure the form builder to your liking with the Options button</ListItem> */}
                <ListItem py={1}>Fixed up the light mode, use at your own risk!</ListItem>
              </UnorderedList>
            </VStack>
          </ModalBody>

          <ModalFooter backgroundColor="#2f3136" borderBottomRadius={5}>
            <Button
              variant="success"
              onClick={() => {
                onClose();
              }}
              //width="26"
              width={24}
            >
              Got It
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* </SettingsManagerProvider> */}
    </ChakraProvider>
  );
}