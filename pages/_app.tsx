import React from 'react'
import '../styles/App.css';
import '../util/framer-motion.d';
import type { AppProps } from 'next/app';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import theme from "../components/theme";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode='dark' />
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
