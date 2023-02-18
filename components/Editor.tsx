/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import FormBuilder from "../components/FormBuilder";
import {
  Box,
  VStack,
  Button,
  Heading,
  useToast,
  HStack,
  Input,
  cssVar,
  Spinner
} from '@chakra-ui/react';
import JSONViewer, { DOWNLOAD_SPINNER_TIME } from '../components/JSONViewer';
import ErrorMessage from '../components/ErrorMessage';
import MessageBuilder, { MessageType } from '../components/messageBuilder';
import { SlashCommand, UserMention } from '../components/Mention';
import _DefaultValues from '../DefaultValues.json';
import _ClearedValues from '../ClearedValues.json';
import { Footer } from '../components/Footer';
import { FormAndMessageBuilder } from "../util/types";
import { useModal } from '../components/SettingsModal';
import { createName } from '../util/form';

const DefaultValues = _DefaultValues as FormAndMessageBuilder;
const ClearedValues = _ClearedValues as FormAndMessageBuilder;

const Defaults = {
  Embed: {
    color: 5793266,
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

const defaultValues = DefaultValues as FormAndMessageBuilder;


// @ts-expect-error
export function Editor({ messageType, setMessageType, displayForm, setDisplayForm, watch, getValues, setValue, formState, control, register, reset }) {
  const toast = useToast();

  enum ToastStyles {
    Success = "success",
    Info = "info",
    Warning = "wraning",
    Error = "error",
    Loading = "loading"
  }

  function postToast({ title, description, style }: {
    title: string;
    description?: string;
    style: ToastStyles;
  }) {
    return toast({
      title,
      description,
      status: style as unknown as undefined,
      containerStyle: {
        backgroundColor: "#5865f2",
        borderRadius: "0.3rem"
      },
      position: "bottom",
      duration: 3000,
      isClosable: true,
    });
  }

  const fixForm = (toast = true) => {
    //@ts-expect-error
    getValues("forms").forEach((form, i) => {
      setValue(`forms.${i}.button.style`, Number(form.button.style));
      //@ts-expect-error
      form.modal.components.forEach((actionRow, rowIndex) => {
        //@ts-expect-error
        actionRow.components.forEach((e, index) => {
          console.log(e)
          Object.entries(e).map(([k, v]) => {
            console.log(k, v, index)
            if (v === null) return { key: k, value: v };
            if (v == '') e[k] = null;
            else if (typeof v != "boolean" && !isNaN(Number(v))) e[k] = Number(v);
            return { key: k, value: v };
          });
          setValue(`forms.${i}.modal.components.${rowIndex}.components.${index}`, e);
        })
      })
    });

    const Message = getValues("message");

    if (Message?.embeds != null && Message.embeds.length > 0) {
      console.log("fixing...")
      //@ts-expect-error
      Message.embeds.forEach((embed, i) => {
        Object.entries(embed).forEach(([k, v]) => {
          if (typeof v == "string") {
            if (v == null || v === "") setValue(`message.embeds.${i}.${k}`, null);
          } else if (typeof v == "object") {
            //@ts-expect-error
            Object.entries(v).forEach(([k2, v2], i2) => {
              if (v2 == null || v2 === "") setValue(`message.embeds.${i}.${k}.${k2}`, null);
            })
          }
        })
      });
    }

    if (
      Message?.embeds == null && (Message.content === "" || Message.content == null)
    ) {
      setValue("message", {
        content: null,
        embeds: []
      });
    }

    if (toast) postToast({
      title: 'Form Fixed',
      style: ToastStyles.Success
    });
  }


  const [fileInput, setFileInput] = useState<HTMLInputElement>();

  const ReadFile = (targetFile: React.ChangeEvent<HTMLInputElement>) => {
    function CannotRead() {
      return postToast({
        style: ToastStyles.Error,
        title: "Cannot read form"
      });
    }

    if (targetFile.target.files == null) return CannotRead();

    const file = targetFile.target.files[0];
    console.log(file, targetFile.target.files)
    const fileType = file.type;
    function makeError() {
      return postToast({
        title: "Invalid JSON File",
        style: ToastStyles.Error
      });
    }

    if (fileType !== 'application/json') {
      makeError();
      //@ts-expect-error
      targetFile.target.value = null
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      if (typeof e.target?.result != "string") return CannotRead();
      const json = JSON.parse(e.target.result);

      // Log for debugging purposes
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
      postToast({
        title: 'Form Uploaded',
        style: ToastStyles.Success
      });
    };

    reader.readAsText(file);
    return;
  }

  const downloadForm = () => {
    fixForm(false);
    setTimeout(() => {
      console.log("downloading...")
      const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
        JSON.stringify(watch(), null, 2)
      )}`;
      const link = document.createElement("a");
      link.href = jsonString;
      link.download = createName({ getValues }) + ".json";
      link.click();
    }, 500)
  }

  const [loading, setLoading] = useState(false);
  const handleLoad = () => {
    //if (SettingsModal.settings.LimitAnimations == true) return;
    setLoading(true);
    setTimeout(() => setLoading(false), DOWNLOAD_SPINNER_TIME);
  }

  const SettingsModal = useModal();

  return (
    <VStack alignItems='flex-start' overflowY='scroll' p='16px' height='calc(100vh - 48px);'>
      <HStack>
        <Button onClick={() => {
          if (fileInput == null) {
            console.log("FILE_INPUT_NULLISH");
            return postToast({
              title: "Something didn't go right.",
              style: ToastStyles.Error
            });
          } else fileInput.click()
        }} variant="primary">Upload JSON</Button>
        <Input id="json" type="file" accept=".json" display="none" onChange={ReadFile} ref={(input) => {
          if (input == null) {
            console.log("SETTING_FILE_INPUT_NULLISH");
            return;
          } else setFileInput(input);
        }} />
        <Button variant="secondary" onClick={() => reset(ClearedValues)}>Clear All</Button>
      </HStack>
      {SettingsModal.modal}
      <MessageBuilder
        {...{ Defaults, formState, messageType, register, setMessageType, setValue }}
      />
      <FormBuilder
        {...{ control, register, defaultValues, getValues, setValue, formState, watch, displayForm, setDisplayForm }}
      />
      <VStack width='100%' align='flex-start'>
        <Heading size='sm' marginBottom='5px'>Form Configuration File</Heading>
        <Box>
          This is the configuration file you'll need to give to the <UserMention isFormsBot>Forms</UserMention> bot to create your form. The <UserMention isFormsBot>Forms</UserMention> bot needs to be in your server.
        </Box>
        <JSONViewer {...{ downloadForm, animations: !SettingsModal.settings.LimitAnimations, getValues }}>{JSON.stringify(watch(), null, 2)}</JSONViewer>
        <VStack alignItems='flex-start'>
          <HStack alignItems='flex-start'>
            <Button
              variant='success'
              isDisabled={!formState.isValid}
              onClick={() => {
                handleLoad();
                downloadForm();
              }}
              width={225}
            // bgColor={loading ? "#215b32" : undefined}
            >
              {!loading && "Download Configuration File"}
              {(loading && SettingsModal.settings.LimitAnimations == false) && <Spinner size="sm" />}
              {(loading && SettingsModal.settings.LimitAnimations == true) && "Downloading..."}
            </Button>
            {SettingsModal.settings.ShowFixButton && <Button onClick={() => fixForm()}>Fix Form</Button>}
          </HStack>
          {!formState.isValid && <ErrorMessage>Fill out the fields correctly before downloading the configuration file.</ErrorMessage>}
        </VStack>
        <Box>
          Upload the configuration file using the <SlashCommand>form create</SlashCommand> command on the <UserMention isFormsBot>Forms</UserMention> bot.
        </Box>
      </VStack>
      <Footer />
    </VStack>
  )
}