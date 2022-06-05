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
import JSONViewer from './JSONViewer';
import ErrorMessage from './ErrorMessage';

const defaultValues = {
  location: {
    channel_id: '',
    message: {
      content: ''
    }
  },
  forms: [
    {
      webhook_url: '',
      button: {
        label: '',
        style: '1'
      },
      modal: {
        title: '',
        components: [
          {
            type: 1,
            components: [
              {
                label: '',
                style: '1'
              }
            ]
          }
        ]
      }
    }
  ]
};


function App() {

  const {
    control,
    register,
    watch,
    handleSubmit,
    getValues,
    reset,
    setValue,
    formState,
    formState: { errors }
  } = useForm({
    mode: 'onChange',
    defaultValues
  });



  const onSubmit = (data) => console.log("data", data);

  return (
    <ChakraProvider theme={theme}>
      <header>
        <Box display='flex' alignItems='center'>
          <img src="https://cdn.discordapp.com/attachments/944646735643410482/946845836879462420/forms.png" alt="Forms Logo" width="28px" style={{ clipPath: 'circle(50%)' }} />
          <nav>
            <a href="https://discord.gg/ebE2pbA4dT" target="_blank" rel="noopener noreferrer">Support Server</a>
            <a href="https://discord.com/login?redirect_to=%2Foauth2%2Fauthorize%3Fclient_id%3D942858850850205717%26permissions%3D3072%26scope%3Dapplications.commands%2520bot" target="_blank" rel="noopener noreferrer">Invite Bot</a>
            <a href="https://gist.github.com/Antouto/8ab83d83482af7c516f0b2b42eaee940" target="_blank" rel="noopener noreferrer">Documentation</a>
          </nav>
        </Box>
        <ColorModeSwitcher height='0px' _focus={{ boxShadow: 'unset' }} />
      </header>
      <Box>
        <Grid p={3}>
          <VStack spacing={3} width='calc(100vw - 24px)' alignItems='flex-start'>
            <Button onClick={() => reset(defaultValues)}>Clear All</Button>
            <Box width='100%'>
              <form onSubmit={handleSubmit(onSubmit)}>

                <HStack marginBottom='8px' alignItems='flex-start'>
                  <Box width='100%'>
                    <FormLabel htmlFor="location.channel_id" _after={{ content: '" *"', color: '#ff7a6b' }}>Channel ID</FormLabel>
                    <input {...register('location.channel_id', { required: true, pattern: /^\d{7,30}$/ })} type='number' id='location.channel_id' placeholder='943471614580903956' />
                    <ErrorMessage>{(errors.location?.channel_id.type === 'required' && 'The Channel ID is required') || (errors.location?.channel_id.type === 'pattern' && 'Invalid Channel ID')}</ErrorMessage>
                  </Box>
                  <Box width='100%'>
                    <FormLabel htmlFor="location.channel_id">Message</FormLabel>
                    <input {...register('location.message.content')} id='location.message.content' />
                  </Box>
                </HStack>



                <FieldArray
                  {...{ control, register, defaultValues, getValues, setValue, formState, watch }}
                />

              </form>
            </Box>
            <VStack width='100%' align='flex-start'>
              <Heading size='sm' marginBottom='5px'>JSON Data</Heading>
              <JSONViewer>{JSON.stringify(watch(), null, 2)}</JSONViewer>
              <HStack>
              <Button
                variant='success'
                disabled={!formState.isValid}
                onClick={() => {
                  const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
                    JSON.stringify(watch(), null, 2)
                  )}`;
                  const link = document.createElement("a");
                  link.href = jsonString;
                  link.download = 'form.json';
                  link.click();
                }}
              >
                Download JSON
              </Button>
              {!formState.isValid && <ErrorMessage>Fill out all fields correctly before downloading the JSON file.</ErrorMessage>}
              </HStack>
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
