import '../styles/App.css';
import "../styles/Json.css";
import '../util/framer-motion.d';
import { Button, ChakraProvider, Heading, ListItem, ModalBody, ModalCloseButton, Text, UnorderedList, useColorMode, useDisclosure, VStack, ColorModeScript } from '@chakra-ui/react';
import theme from "../components/theme";
import { AppProps } from 'next/app';
import { resolveBoolean } from '../components/Toggle';
import React, { useEffect, useState } from 'react';
import { Modal, ModalContent, ModalFooter } from '../components/Modal';
import ColorModeCSS from '../styles/ColorModeCSS';



export default function App({ Component, pageProps }: AppProps) {
  const [hasSeenRelease, setReleaseSeen] = useState(false);
  const { colorMode } = useColorMode();
  const [initialLoad, loaded] = useState(false);
  const ValueName = "HAS_SEEN_221_RELEASE";
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
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>
        <ColorModeCSS />
        <Component {...pageProps} />
        <Modal {...{ isOpen, onClose }}>
          <ModalContent>
            <ModalCloseButton />
            <ModalBody paddingY={6}>
              <VStack textAlign="center">
                <Heading size="md" fontWeight="medium">What&apos;s New</Heading>
                <Text color={colorMode == "light" ? "#898c95" : "#b9bbbe"}>February 21 2023</Text>
              </VStack>
              <VStack pt={5}>
                <UnorderedList>
                  <ListItem py={1}>Added support for select menus</ListItem>
                  <ListItem py={1}>Added syntax highlighting to the JSON Preview</ListItem>
                  <ListItem py={1}>Support for smaller screens (e.g. phones) has been optimized</ListItem>
                </UnorderedList>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button
                variant="success"
                onClick={() => {
                  onClose();
                }}
                width={24}
              >
                Got It
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </ChakraProvider >
    </>
  );
}
