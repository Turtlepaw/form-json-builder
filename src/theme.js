import { extendTheme } from "@chakra-ui/react"
import { mode } from '@chakra-ui/theme-tools';

const colours =  {
  'blurple': '#5865F2',
  'red': '#ED4245',
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
        height: '36px',
        width: '100%',
        padding: '0px 9px',
        border: `2px solid transparent`,
        transition: '0.2s',
        outline: 'none',
        borderRadius: 3,
        _focus: { border: `2px solid ${blurple}` }
      },
      hr: { borderColor: '#ffffff0f' }
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
        },
        destructive: {
          bg: 'red'
        }
      },
      defaultProps: {
        variant: 'secondary',
      }
    },
    Input: { defaultProps: { variant: 'normal' } },
    FormLabel: { baseStyle: { marginBottom: '0px' } }
  }
});

export default theme