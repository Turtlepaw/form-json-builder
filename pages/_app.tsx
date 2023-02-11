import '../styles/App.css';
import '../util/framer-motion.d';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import theme from "../components/theme";
import { SettingsManagerProvider, SettingsManagerBuilder, SettingsManager } from '../util/settings';
import { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  const SettingsManager = new SettingsManagerBuilder();

  return (
    <ChakraProvider theme={theme}>
      {/* <SettingsManagerProvider value={SettingsManager}> */}
      <ColorModeScript initialColorMode='dark' />
      <Component {...pageProps} />
      {/* </SettingsManagerProvider> */}
    </ChakraProvider>
  );
}