/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react';
import { Control, FieldValues, FormState, useForm, UseFormGetValues, UseFormRegister, UseFormReset, UseFormSetValue, UseFormWatch } from "react-hook-form";
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
import { ButtonBuilder, FormAndMessageBuilder } from "../util/types";
import { useModal } from '../components/SettingsModal';
import { createName } from '../util/form';
import { ComponentType } from '../pages';
import { useScreenWidth } from '../util/width';

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

export interface EditorProps<T extends FieldValues> {
  control: Control<T>;
  register: UseFormRegister<T>;
  formState: FormState<T>;
  watch: UseFormWatch<T>;
  setValue: UseFormSetValue<T>;
  getValues: UseFormGetValues<T>;
  displayForm: number;
  setDisplayForm: React.Dispatch<React.SetStateAction<number>>;
  messageType: string;
  setMessageType: React.Dispatch<React.SetStateAction<string>>;
  componentType: [ComponentType, React.Dispatch<React.SetStateAction<ComponentType>>];
  reset: UseFormReset<T>;
  displaySection: boolean;
}

export function Editor({
  messageType,
  setMessageType,
  displayForm,
  setDisplayForm,
  watch,
  getValues,
  setValue,
  formState,
  control,
  register,
  reset,
  displaySection,
  componentType
}: EditorProps<FormAndMessageBuilder>) {
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
    getValues("message.embeds").forEach((embed, i) => {
      //@ts-expect-error hex to decimal
      if (embed?.color != null && embed?.color != "" && typeof embed?.color == "string") setValue(`message.embeds.${i}.color`, parseInt(embed.color.replace("#", ""), 16));
    });

    getValues("forms").forEach((form, i) => {
      if (componentType[0] == ComponentType.Button) setValue(`forms.${i}.button.style`, Number(form.button.style));
      //@ts-expect-error
      else if (componentType[0] == ComponentType.SelectMenu) Object.entries(getValues(`forms.${i}.select_menu_option`)).forEach(([k, v]) => {
        //@ts-expect-error
        if (v == "") setValue(`forms.${i}.select_menu_option.${k}`, null);
      })
      form.modal.components.forEach((actionRow, rowIndex) => {
        actionRow.components.forEach((e, index) => {
          console.log(e)
          Object.entries(e).map(([k, v]) => {
            console.log(k, v, index)
            if (v === null) return { key: k, value: v };
            //@ts-expect-error
            if (v == '') e[k] = null;
            //@ts-expect-error
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
      Message.embeds.forEach((embed, i) => {
        Object.entries(embed).forEach(([k, v]) => {
          if (typeof v == "string") {
            //@ts-expect-error
            if (v == null || v === "") setValue(`message.embeds.${i}.${k}`, null);
          } else if (typeof v == "object") {
            Object.entries(v).forEach(([k2, v2], i2) => {
              //@ts-expect-error
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
      const json = JSON.parse(e.target.result) as FormAndMessageBuilder;

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

      // Validator for the number of forms
      // 🔗 https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-modal
      if (json.forms.length > 5) {
        json.forms.length = 5;
      }

      // Add the json.forms array to the form hook
      setValue("forms", json.forms);
      const isEmbed = json.message?.embeds != null && json?.message?.embeds?.length >= 1;
      const isMessage = json.message?.content != null
      // Set the type of the message
      if (isEmbed && isMessage) setMessageType(MessageType.ContentAndEmbed);
      else if (isMessage) setMessageType(MessageType.Content);
      else if (isEmbed) setMessageType(MessageType.Embed);
      // Check the number of button components and menu components
      // incase of a button modal and a select menu modal
      let buttons = 0;
      let menus = 0;
      json.forms.forEach(form => {
        if (form.select_menu_option != null) menus++;
        if (form.button != null) buttons++;
      });

      if (buttons < menus) {
        componentType[1](ComponentType.SelectMenu);
        json.forms.forEach((form, i) => {
          if (form.select_menu_option == null) {
            setValue(`forms.${i}.select_menu_option`, {
              label: "Select Menu Option",
              description: ""
            });
          }

          if (form.button != null) setValue(`forms.${i}.button`, null as any);
        });
      } else {
        componentType[1](ComponentType.Button);
        json.forms.forEach((form, i) => {
          if (form.button == null) setValue(`forms.${i}.button`, {
            style: 1,
            label: "Open Form"
          });

          if (form.select_menu_option != null) setValue(`forms.${i}.select_menu_option`, null as any);
        });
      }

      // Add the json.message object to the form hook
      setValue("message", json.message);

      // Send a toast the the user notifying that the form has
      // been uploaded
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

  const isSmallScreen = !useScreenWidth(500);

  return (
    <VStack align='flex-start' overflowY='scroll' p='16px' height='calc(100vh - 48px);' display={displaySection ? 'flex' : 'none'}>
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
        {...{ Defaults, getValues, componentType, formState, messageType, register, setMessageType, setValue }}
      />
      <FormBuilder
        {...{ componentType: componentType[0], control, register, defaultValues, getValues, setValue, formState, watch, displayForm, setDisplayForm }}
      />
      <VStack width='100%' align='flex-start'>
        <Heading size='sm' marginBottom='5px'>Form Configuration File</Heading>
        <Box>
          This is the configuration file you'll need to give to the <UserMention isFormsBot>Forms</UserMention> bot to create your form. The <UserMention isFormsBot>Forms</UserMention> bot needs to be in your server.
        </Box>
        <JSONViewer {...{ downloadForm, animationsEnabled: !SettingsModal.settings.LimitAnimations, getValues }}>{JSON.stringify(watch(), null, 2)}</JSONViewer>
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
      {!isSmallScreen && <Footer />}
    </VStack>
  )
}
