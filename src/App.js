import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import FieldArray from "./fieldArray";
import {
  Box,
  VStack,
  Grid,
  Text,
  Button,
  Heading,
  FormLabel,
  useToast,
  HStack,
  Input,
} from '@chakra-ui/react';
import './App.css';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Link } from './Link';
import JSONViewer from './JSONViewer';
import ErrorMessage from './ErrorMessage';
import FormPreview from './FormPreview';
import MessageBuilder, { MessageType } from './messageBuilder';
import { SlashCommand, UserMention } from './Mention';
import DefaultValues from './DefaultValues.json';
import ClearedValues from './ClearedValues.json';

const Defaults = {
  Embed: {
    color: '5793266',
    title: "Example Form",
    description: "Fill out the form below!",
    author: {
      name: "",
      url: "",
      icon_url: ""
    },
    footer: {
      text: "",
      icon_url: ""
    }
  },
  Message: 'Fill out the form below!'
};

const defaultValues = DefaultValues

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
    // eslint-disable-next-line no-unused-vars
    formState: { errors }
  } = useForm({
    mode: 'onChange',
    defaultValues
  });

  const onSubmit = (data) => console.log("data", data);
  const toast = useToast();
  const fixForm = () => {
    getValues("forms").forEach((form, i) => {
      setValue(`forms.[${i}].button.style`, Number(form.button.style));
      form.modal.components.forEach((actionRow) => {
        actionRow.components.forEach((e, index) => {
          console.log(e)
          Object.entries(e).map(([k, v]) => {
            console.log(k, v)
            if (v === null) return { key: k, value: v };
            // eslint-disable-next-line eqeqeq
            if (v == '') e[k] = null;
            else if (typeof v != "boolean" && !isNaN(Number(v))) e[k] = Number(v);
            return { key: k, value: v };
          });
          setValue(`forms.[${i}].modal.components[0].components[${index}]`, e);
        })
      })
    });
    return toast({
      title: 'Form Fixed',
      //description: "We've fixed some components in your form.",
      status: 'success',
      containerStyle: {
        backgroundColor: "#5865f2",
        borderRadius: "0.3rem"
      },
      position: "bottom",
      duration: 3000,
      isClosable: true,
    });
  }
  const [displayForm, setDisplayForm] = useState(0);
  const [messageType, setMessageType] = useState("content");
  const [fileInput, setFileInput] = useState(null);
  const ReadFile = (targetFile) => {
    const file = targetFile.target.files[0];
    console.log(file, targetFile.target.files)
    const fileType = file.type;
    function makeError() {
      return toast({
        title: "Invalid JSON File",
        status: "error",
        containerStyle: {
          backgroundColor: "#ed4245",
          borderRadius: "0.3rem",
          position: "bottom",
          duration: 3000,
          isClosable: true,
        },
      });
    }
    if (fileType !== 'application/json') {
      makeError();
      targetFile.target.value = null
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const json = JSON.parse(e.target.result);
      console.log(json)
      if (
        json?.forms == null ||
        !Array.isArray(json?.forms) ||
        json?.message == null ||
        typeof json?.message != "object"
      ) {
        return makeError();
      }
      setValue("forms", json.forms);
      const isEmbed = json.message?.embeds != null && json?.message?.embeds?.length >= 1;
      const isMessage = json.message?.content != null
      if (isEmbed && isMessage) setMessageType(MessageType.ContentAndEmbed);
      else if (isMessage) setMessageType(MessageType.Content);
      else if (isEmbed) setMessageType(MessageType.Embed);
      setValue("message", json.message);
      toast({
        title: 'Form Uploaded',
        //description: "We've fixed some components in your form.",
        status: 'success',
        containerStyle: {
          backgroundColor: "#5865f2",
          borderRadius: "0.3rem"
        },
        position: "bottom",
        duration: 3000,
        isClosable: true,
      });
    };

    reader.readAsText(file);
    return;
  }

  return (
    <>
      <Grid gridTemplateRows='48px 1fr'>
        <header>
          <Box display='flex' alignItems='center'>
            <img src="https://cdn.discordapp.com/attachments/944646735643410482/953304477102915624/unknown.png" alt="Forms Logo" width="28px" style={{ clipPath: 'circle(50%)' }} />
            <nav>
              <a href="https://discord.gg/cajZ7Mvzbp" target="_blank" rel="noopener noreferrer">Support Server</a>
              <a href="https://discord.com/login?redirect_to=%2Foauth2%2Fauthorize%3Fclient_id%3D942858850850205717%26permissions%3D3072%26scope%3Dapplications.commands%2520bot" target="_blank" rel="noopener noreferrer">Invite Bot</a>
              <a href="https://gist.github.com/Antouto/8ab83d83482af7c516f0b2b42eaee940" target="_blank" rel="noopener noreferrer">Documentation</a>
            </nav>
          </Box>
          <ColorModeSwitcher height='0px' _focus={{ boxShadow: 'unset' }} />
        </header>
        <Grid paddingBottom={0} gridTemplateColumns='1fr 1fr'>
          <VStack spacing={3} alignItems='flex-start' overflowY='scroll' p='16px' maxHeight='calc(100vh - 48px);'>
            <HStack>
              <Input
                id="json"
                type="file"
                accept=".json"
                style={{ display: 'none' }}
                onChange={ReadFile}
                ref={(input) => setFileInput(input)}
              />
              <FormLabel htmlFor="json" style={{ cursor: 'pointer' }}>
                <Button onClick={() => fileInput.click()} variant="primary">Upload JSON</Button>
              </FormLabel>
              <Button onClick={() => reset(clearValues)}>Clear All</Button>
            </HStack>
            <Box width='100%'>
              <form onSubmit={handleSubmit(onSubmit)}>
                <MessageBuilder
                  {...{ Defaults, errors, messageType, register, setMessageType, setValue }}
                />

                <FormLabel pb={2}>Forms</FormLabel>
                <FieldArray
                  {...{ control, register, defaultValues, getValues, setValue, formState, watch, displayForm, setDisplayForm }}
                />
              </form>
            </Box>
            <VStack width='100%' align='flex-start'>
              <Heading size='sm' marginBottom='5px'>Form Configuration File</Heading>
              <Text>
                This is the configuration file you'll need to give to the <UserMention>Forms</UserMention> bot to create your form. The <UserMention>Forms</UserMention> bot needs to be in your server.
              </Text>
              <JSONViewer>{JSON.stringify(watch(), null, 2)}</JSONViewer>
              <VStack alignItems='flex-start'>
                <HStack alignItems='flex-start'>
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
                    Download Configuration File
                  </Button>
                  <Button onClick={fixForm}>Fix Form</Button>
                </HStack>
                {!formState.isValid && <ErrorMessage>Fill out the fields correctly before downloading the configuration file.</ErrorMessage>}
              </VStack>
              <Text maxWidth={450}>
                Upload the configuration file using the <SlashCommand>form create</SlashCommand> command on the <UserMention>Forms</UserMention> bot.
              </Text>
            </VStack>
            <Box className="text-sm pt-5">
              <p className="font-medium">©️ 2023 Forms Discord Bot</p>
              <p className="text-muted">
                Made with <svg style={{ display: "inline-block", marginLeft: "1px", marginRight: "1px" }} width={15} height={15} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><path fill="#DD2E44" d="M35.885 11.833c0-5.45-4.418-9.868-9.867-9.868-3.308 0-6.227 1.633-8.018 4.129-1.791-2.496-4.71-4.129-8.017-4.129-5.45 0-9.868 4.417-9.868 9.868 0 .772.098 1.52.266 2.241C1.751 22.587 11.216 31.568 18 34.034c6.783-2.466 16.249-11.447 17.617-19.959.17-.721.268-1.469.268-2.242z" /></svg>
                {' '}from <UserMention text="#d0d3d8">Anthony</UserMention> and <UserMention text="#d0d3d8">Turtlepaw</UserMention>
                <br />
                This website is <Link href='https://github.com/Antouto/form-builder'>open-source</Link>
              </p>
            </Box>
          </VStack>
          <FormPreview type={messageType} message={watch('message')} forms={watch('forms')} displayForm={displayForm} setDisplayForm={setDisplayForm} />
        </Grid>
      </Grid>
    </>
  );
}

export default App;
