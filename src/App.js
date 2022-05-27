import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import FieldArray from "./fieldArray";
import {
  ChakraProvider,
  Box,
  VStack,
  Code,
  Grid,
  Input,
  Radio,
  Text,
  Checkbox,
  extendTheme,
  Button,
  Heading,
  HStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  CloseButton,
  useTheme,
  Tooltip,
  RadioGroup,
  Stack
} from '@chakra-ui/react';
import { Rest, sendForm } from "./Discord";
import './App.css';
import { IconContext } from "react-icons";
import { IoInformationCircle } from 'react-icons/io5';
import theme from './theme';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import Collapsible from './Collapsible';
import { Link } from './Link';

const defaultValues = {
  location: {
    channel_id: "123412341234",
    message: "Forms:"
  },
  forms: [
    {
      webhook_url: "useFieldArray1",
      modal: {
        components: [
          {
            type: 1,
            components: [
              {
                label: "hi",
                style: "1"
              }
            ]
          }
        ]
      }
    },
    {
      webhook_url: "useFieldArray2",
      modal: {
        components: [
          {
            type: 1,
            components: [
              {
                label: "hi",
                style: "1"
              }
            ]
          }
        ]
      }
    }
  ]
};


function App() {
  const [json, setJson] = useState('{}')

  const {
    control,
    register,
    watch,
    handleSubmit,
    getValues,
    errors,
    reset,
    setValue
  } = useForm({
    defaultValues
  });

  const onSubmit = (data) => console.log("data", data);

  return (
    <ChakraProvider theme={theme}>
      <header>
        <Box display='flex' alignItems='center'>
          <img src="https://cdn.discordapp.com/attachments/944646735643410482/946845836879462420/forms.png" alt="Forms Logo" width="24px" style={{ clipPath: 'circle(50%)' }} />
          <nav>
            <a href="https://discord.gg/ebE2pbA4dT" target="_blank" rel="noopener noreferrer">Support Server</a>
            <a href="https://discord.com/login?redirect_to=%2Foauth2%2Fauthorize%3Fclient_id%3D942858850850205717%26permissions%3D3072%26scope%3Dapplications.commands%2520bot" target="_blank" rel="noopener noreferrer">Invite Bot</a>
            <a href="https://gist.github.com/Antouto/8ab83d83482af7c516f0b2b42eaee940" target="_blank" rel="noopener noreferrer">Documentation</a>
          </nav>
        </Box>
        <ColorModeSwitcher height='0px' />
      </header>
      <Box>
        <Grid p={3}>
          <VStack spacing={8} width='calc(100vw - 24px)'>
            <Box width='100%'>
              <form onSubmit={handleSubmit(onSubmit)}>

                <FormLabel htmlFor="location.channel_id">Channel ID</FormLabel>
                <input {...register('location.channel_id')} id='location.channel_id' />

                <FormLabel htmlFor="location.channel_id">Message</FormLabel>
                <input {...register('location.message')} id='location.message' />

                <FieldArray
                  {...{ control, register, defaultValues, getValues, setValue, errors }}
                />

                <Button variant="destructive" onClick={() => reset(defaultValues)}>
                  Reset
                </Button>

              </form>
            </Box>
            <VStack width='100%' align='flex-start'>
              <Heading size='sm' marginBottom='5px'>JSON Data</Heading>
              <pre><Code variant='solid' colorScheme='blackAlpha' width='calc(100vw - 24px)'>{JSON.stringify(watch(), null, 2)}</Code></pre>
              {/* <HStack>
                <Button>Copy JSON</Button>
                <Button>Download JSON</Button>
              </HStack> */}
            </VStack>
          </VStack>
        </Grid>
      </Box>
      <Box className="text-sm pt-5 text-center pb-10">
        <p className="font-medium">©️ 2022 Forms Discord Bot</p>
        <p className="text-muted">
          Not affiliated with Discord, Inc.
          <br />
          Discord is a registered trademark of Discord, Inc.
        </p>
      </Box>
    </ChakraProvider>
  );
}

export default App;
