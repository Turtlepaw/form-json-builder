import { useColorMode } from "@chakra-ui/react";

export default function ColorModeCSS() {
  const { colorMode } = useColorMode();
  return <style>
    {`::-webkit-scrollbar {
      height: 16px;
      width: 16px;
    }

    ::-webkit-scrollbar-corner {
      background - color: transparent;
    }

    ::-webkit-scrollbar-thumb {
      background-color: ${colorMode === "dark" ? "rgb(32, 34, 37)" : "#c1c3c7"};
      border: 4px solid transparent;
      border-radius: 8px;
      min-height: 40px;
      background-clip: padding-box;
    }

    ::-webkit-scrollbar-track {
      background-color: ${colorMode === "dark" ? "rgb(46, 51, 56)" : "#f2f2f2"};
      border: 4px solid transparent;
      border-radius: 8px;
      margin-bottom: 8px;
      background-clip: padding-box;
    }

    .hljs-attr, .hljs-number {
      color: ${colorMode === "dark" ? "#79c0ff" : "#005cc5"};
    }
    
    .hljs-string {
      color: ${colorMode === "dark" ? "#a5d6ff" : "#032f62"};
    }
    
    .hljs-literal {
      color: ${colorMode === "dark" ? "#ff7b72" : "#d73a49"};
    }`}
  </style>
}