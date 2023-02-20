import '../styles/App.css';
import "../styles/Json.css";
import '../util/framer-motion.d';
import { Button, ChakraProvider, Heading, Link, ListItem, ModalBody, ModalCloseButton, Text, UnorderedList, useColorModeValue, useDisclosure, VStack } from '@chakra-ui/react';
import theme from "../components/theme";
import { SettingsManagerBuilder } from '../util/settings';
import { AppProps } from 'next/app';
import { resolveBoolean } from '../components/Toggle';
import { LinkStyle } from '../util/styles';
import { useEffect, useState } from 'react';
import { Modal, ModalContent, ModalFooter } from '../components/Modal';

export function ColorModeCSS() {
  return (
    <style>
      {`::-webkit-scrollbar {
          height: 16px;
          width: 16px;
        }

        ::-webkit-scrollbar-corner {
          background - color: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background-color: ${useColorModeValue("#c1c3c7", "rgb(32, 34, 37)")};
          border: 4px solid transparent;
          border-radius: 8px;
          min-height: 40px;
          background-clip: padding-box;
        }

        ::-webkit-scrollbar-track {
          background-color: ${useColorModeValue( "#f2f2f2", "rgb(46, 51, 56)")};
          border: 4px solid transparent;
          border-radius: 8px;
          margin-bottom: 8px;
          background-clip: padding-box;
        }

        .hljs-attr, .hljs-number {
          color: ${useColorModeValue("#005cc5", "#79c0ff")};
        }
        
        .hljs-string {
          color: ${useColorModeValue("#032f62", "#a5d6ff")};
        }
        
        .hljs-literal {
          color: ${useColorModeValue("#d73a49",  "#ff7b72")};
        }
  `}
    </style>
  )
}

export default function App({ Component, pageProps }: AppProps) {
  const SettingsManager = new SettingsManagerBuilder();
  const [hasSeenRelease, setReleaseSeen] = useState(false);
  const [initialLoad, loaded] = useState(false);
  const ValueName = "HAS_SEEN_218_RELEASE";
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
      <ColorModeCSS />
      {/* <SettingsManagerProvider value={SettingsManager}> */}
      <Component {...pageProps} />
      <Modal {...{ isOpen, onClose }}>
        <ModalContent>
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
              <Text color={useColorModeValue("#898c95", "#b9bbbe")}>February 18 2023</Text>
            </VStack>
            <VStack pt={5}>
              <UnorderedList>
                <ListItem py={1}>Support for smaller screens (e.g. phones) has been optimized</ListItem>
                <ListItem py={1}>Added syntax highlighting to the JSON Preview</ListItem>
                <ListItem py={1}>We fixed an annoying bug that would copy questions from the last question to the 1st</ListItem>
                <ListItem py={1}>Light mode has been fixed, including a fixed scrollbar and fixed modals!</ListItem>
              </UnorderedList>
            </VStack>
          </ModalBody>

          <ModalFooter>
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
    </ChakraProvider >
  );
}