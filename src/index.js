import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import theme from './theme';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ColorModeScript initialColorMode='dark' />
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
    <script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "6e15893ce0324ef48dc62495b1ee746f"}'></script>
  </React.StrictMode>
);