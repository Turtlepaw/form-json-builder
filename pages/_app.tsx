import '../styles/App.css';
import '../util/framer-motion.d';
import { ChakraProvider, ColorModeScript, useColorMode } from '@chakra-ui/react';
import theme from "../components/theme";
import { SettingsManagerProvider, SettingsManagerBuilder, SettingsManager } from '../util/settings';
import { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  const SettingsManager = new SettingsManagerBuilder();
  const { colorMode } = useColorMode();

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
      {/* </SettingsManagerProvider> */}
    </ChakraProvider>
  );
}