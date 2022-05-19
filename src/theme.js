import { extendTheme } from "@chakra-ui/react"
import { mode } from '@chakra-ui/theme-tools';

const colours =  {
  'blurple': '#5865F2',
  'grey.extralight': '#ebedef',
  'grey.light': '#4f545c',
  'grey.dark': '#36393f',
  'grey.extradark': '#292b2f'
};

const { blurple } = colours;

const theme = extendTheme({
  colors: colours,
  styles: {
    global: (props) => ({
      body: {
        bg: mode('grey.dark', 'white')(props),
        color: mode('white', 'black')(props),
      },
      input: {
        bg: mode('grey.extradark', 'grey.extralight')(props),
        borderColor: blurple,
        _focus: { border: `2px solid ${blurple}` }
      }
    })
  },
  components: {
    Button: {
      baseStyle: {
        color: 'white'
      },
      variants: {
        primary: {
          bg: 'blurple'
        },
        secondary: {
          bg: 'grey.light'
        }
      },
      defaultProps: {
        variant: 'secondary',
      }
    },
    Input: { defaultProps: { variant: 'normal' } }
  }
});

export default theme