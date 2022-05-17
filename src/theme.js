import { extendTheme } from "@chakra-ui/react"
import { mode } from '@chakra-ui/theme-tools';

const theme = extendTheme({
  colors: {
    'blurple': '#5865F2',
    'grey': '#4f545c',
    'grey.500': '#36393f',
    'grey.900': '#292b2f'
  },
  styles: {
    global: (props) => ({
      body: {
        bg: mode('grey.500', 'white')(props),
        color: mode('white', 'black')(props),
      },
    })
  },
  components: {
    Button: {
      baseStyle: {
        color: 'white'
      },
      variants: {
        'primary': {
          bg: 'blurple'
        },
        'secondary': {
          bg: 'grey'
        }
      },
      defaultProps: {
        variant: 'secondary',
      }
    }
  }
})

export default theme