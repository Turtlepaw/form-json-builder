"use client";

import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import theme from "../components/theme";
import ColorModeCSS from "../styles/ColorModeCSS";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: PropsWithChildren) {
  return (
    <SessionProvider>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>
        <ColorModeCSS />
        {children}
      </ChakraProvider>
    </SessionProvider>
  );
}
