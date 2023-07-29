import { Box, Button, CloseButton, FormLabel, HStack, Select, Stack, Text, Tooltip } from "@chakra-ui/react";
import React, { useState } from "react";
import {
  Control,
  FieldValues,
  FormState,
  useFieldArray,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
  UseFormGetValues
} from "react-hook-form";
import { IconContext } from "react-icons";
import { IoInformationCircle } from "react-icons/io5";
import Collapsible from "./Collapsible";
import TextInputBuilder from "./TextInputBuilder";
import ErrorMessage from "./ErrorMessage";
import { FormAndMessageBuilder } from "../util/types";
import { useScreenWidth } from "../util/width";
import { ComponentType } from "../pages";
import { useColorMode } from "@chakra-ui/react";

export interface FormBuilderProperties<T extends FieldValues> {
  control: Control<T>;
  register: UseFormRegister<T>;
  formState: FormState<T>;
  watch: UseFormWatch<T>;
  setValue: UseFormSetValue<T>;
  getValues: UseFormGetValues<T>;
  displayForm: number;
  setDisplayForm: React.Dispatch<React.SetStateAction<number>>;
  componentType: ComponentType;
}

export default function FormBuilder({
  control,
  register,
  setValue,
  getValues,
  formState,
  formState: { errors },
  watch,
  displayForm,
  setDisplayForm,
  componentType
}: FormBuilderProperties<FormAndMessageBuilder>) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "forms"
  });

  const [webhookUrlFocused, webhookUrlSetFocused] = React.useState(false);
  const isSmallScreen = !useScreenWidth(500);
  const colorMode = useColorMode().colorMode

  return (
    <Box width='100%' pb={2}>
      {/*@ts-expect-error*/}
      <FormLabel display='flex' alignItems='flex-end' pb={2}><Text>Forms</Text><span style={{ display: 'inline', marginLeft: '7px', fontSize: '13px', color: getValues('forms').length > 5 || getValues('application_command') && getValues('forms').length > 1 ? (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') : (colorMode === 'dark' ? '#dcddde' : '#2e3338'), fontFamily: 'Whitney Bold Italic' }}>{getValues('forms').length}/{getValues('application_command') ? 1 : 5}</span></FormLabel>
      <ul>
        {fields.map((item, index) => {
          return (
            <Collapsible name={`Form ${index + 1}${getValues('forms')[index]?.modal.title && getValues('forms')[index]?.modal.title.match(/\S/) ? ` – ${getValues('forms')[index]?.modal.title}` : ''}`} variant='large' deleteButton={getValues('forms').length > 1 ? <CloseButton onClick={() => {
              remove(index)
              setDisplayForm(displayForm - 1)
            }} /> : null} key={item.id}>
              <Collapsible name="General">
                <FormLabel htmlFor={`forms[${index}].webhook_url`} display='flex' alignItems='center'>
                  <Text marginRight='5px' _after={{ content: '" *"', color: (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') }}>Webhook URL</Text>
                  <Tooltip hasArrow label={
                    'The webhook url to post submissions to. Keep this secret! You can create the webhook in channel settings, integrations tab for the channel you want to post the submission to.'
                  } placement='right' shouldWrapChildren bg="#181414">
                    <IconContext.Provider value={{ color: '#b9bbbe', size: '20px' }}><Box><IoInformationCircle /></Box></IconContext.Provider>
                  </Tooltip>
                </FormLabel>
                <input
                  {...register(`forms.${index}.webhook_url`, { required: true, pattern: /^https:\/\/((canary|ptb).)?discord(app)?.com\/api(\/v\d+)?\/webhooks\/\d{5,30}\/.+$/ })}
                  id={`forms[${index}].webhook_url`}
                  onFocus={() => webhookUrlSetFocused(true)}
                  onBlur={() => webhookUrlSetFocused(false)}
                  type={webhookUrlFocused ? 'text' : 'password'}
                  placeholder='https://discord.com/api/webhooks/ ...'
                  style={{ marginBottom: '8px' }}
                />
                <ErrorMessage>{(errors.forms?.[index]?.webhook_url?.type === 'required' && 'The Webhook URL is required') || (errors.forms?.[index]?.webhook_url?.type === 'pattern' && 'Invalid Webhook URL')}</ErrorMessage>
                <Stack direction={isSmallScreen ? "column" : "row"} marginBottom='8px' alignItems='flex-start'>
                  {
                    //@ts-expect-error
                    componentType == ComponentType.SelectMenu && !getValues('application_command') && <>
                      <Box width='100%'>
                        <FormLabel htmlFor={`forms[${index}].select_menu_option.label`} display='flex' alignItems='flex-end'>
                          <Text _after={{ content: '" *"', color: (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') }}>Option Label</Text>
                          <span style={{
                            display: 'inline', marginLeft: '7px', fontSize: '13px',
                            //@ts-expect-error
                            color: getValues('forms')[index].select_menu_option?.label?.length > 100 ? '#ff7a6b' : '#dcddde', fontFamily: 'Whitney Bold Italic'
                          }}>{getValues('forms')[index].select_menu_option?.label?.length}/100</span></FormLabel>
                        <input
                          {...register(`forms.${index}.select_menu_option.label`, { required: true, maxLength: 100 })}
                          id={`forms[${index}].select_menu_option.label`}
                          placeholder='Form'
                        />
                        <ErrorMessage>{(errors.forms?.[index]?.button?.label?.type === 'required' && 'The Button Label is required') || (errors.forms?.[index]?.button?.label?.type === 'maxLength' && 'The Button Label is too long')}</ErrorMessage>
                      </Box>
                      <Box width='100%'>
                        <FormLabel htmlFor={`forms[${index}].select_menu_option.description`} display='flex' alignItems='flex-end'>
                          <Text>Option Description</Text>
                          <span style={{
                            display: 'inline', marginLeft: '7px', fontSize: '13px',
                            //@ts-expect-error
                            color: getValues('forms')[index].select_menu_option?.description?.length > 100 ? '#ff7a6b' : '#dcddde', fontFamily: 'Whitney Bold Italic'
                          }}>{getValues('forms')[index].select_menu_option?.description?.length}/100</span>
                        </FormLabel>
                        <input
                          {...register(`forms.${index}.select_menu_option.description`, { maxLength: 100 })}
                          id={`forms[${index}].select_menu_option.description`}
                        />
                      </Box>
                    </>
                  }
                  
                  {
                    //@ts-expect-error
                    componentType == ComponentType.Button && !getValues('application_command') && <>
                      <Box width='100%'>
                        <FormLabel htmlFor={`forms[${index}].button.label`} display='flex' alignItems='flex-end'><Text _after={{ content: '" *"', color: (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') }}>Button Label</Text><span style={{ display: 'inline', marginLeft: '7px', fontSize: '13px', color: getValues('forms')[index].button?.label?.length > 80 ? (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') : (colorMode === 'dark' ? '#dcddde' : '#2e3338'), fontFamily: 'Whitney Bold Italic' }}>{getValues('forms')[index].button?.label?.length}/80</span></FormLabel>
                        <input
                          {...register(`forms.${index}.button.label`, { required: true, maxLength: 80 })}
                          id={`forms[${index}].button.label`}
                          placeholder='Open Form'
                        />
                        <ErrorMessage>{(errors.forms?.[index]?.button?.label?.type === 'required' && 'The Button Label is required') || (errors.forms?.[index]?.button?.label?.type === 'maxLength' && 'The Button Label is too long')}</ErrorMessage>
                      </Box>
                      <Box width='100%'>
                        <FormLabel htmlFor={`forms[${index}].button.style`}>Button Color</FormLabel>
                        <Select
                          {...register(`forms.${index}.button.style`)}
                          id={`forms[${index}].button.style`}
                          borderWidth='2px'
                          borderColor='transparent'
                          borderRadius='4px'
                          bg={colorMode === 'dark' ? 'grey.extradark' : 'grey.extralight'}
                          _focus={{ borderWidth: '2px', borderColor: 'blurple' }}
                          _hover={{ borderColor: 'transparent' }}
                        >
                          <option value="1">Blurple</option>
                          <option value="2">Grey</option>
                          <option value="3">Green</option>
                          <option value="4">Red</option>
                        </Select>
                      </Box>
                    </>
                  }
                </Stack>

                <FormLabel htmlFor={`forms[${index}].modal.title`} display='flex' alignItems='flex-end'><Text _after={{ content: '" *"', color: (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') }}>Title</Text><span style={{ display: 'inline', marginLeft: '7px', fontSize: '13px', color: getValues('forms')[index].modal.title?.length > 45 ? (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') : (colorMode === 'dark' ? '#dcddde' : '#2e3338'), fontFamily: 'Whitney Bold Italic' }}>{getValues('forms')[index]?.modal.title?.length}/45</span></FormLabel>
                <input
                  {...register(`forms.${index}.modal.title`, { required: true, maxLength: 45 })}
                  id={`forms[${index}].modal.title`}
                  style={{ marginBottom: '8px' }}
                />
                <ErrorMessage>{(errors.forms?.[index]?.modal?.title?.type === 'required' && 'The Title is required') || (errors.forms?.[index]?.modal?.title?.type === 'maxLength' && 'The Title is too long')}</ErrorMessage>
              </Collapsible >
              <hr/>
              <Collapsible name="Text Inputs">
                <TextInputBuilder id={`forms.${index}.modal.components`} nestIndex={index} {...{ control, register, formState, watch, setValue }} />
              </Collapsible>
            </Collapsible >
          );
        })}
      </ul >

      <section>
        <Button
          variant='primary'
          //@ts-expect-error
          isDisabled={getValues('forms').length >= 5 || getValues('application_command') && getValues('forms').length >= 1 }
          onClick={() => {
            setDisplayForm(fields.length)
            append({
              webhook_url: '',
              button: {
                label: '',
                style: 1
              },
              modal: {
                title: '',
                components: [
                  {
                    type: 1,
                    components: [
                      {
                        type: 4,
                        label: '',
                        style: 1,
                        placeholder: '',
                        min_length: 0,
                        max_length: 1024,
                        value: '',
                        required: true
                      }
                    ]
                  }
                ]
              }
            })
          }}
        >
          Add Form
        </Button>
        {/*@ts-expect-error*/}
        {getValues('forms').length > 5 || getValues('application_command') && getValues('forms').length > 1 && <ErrorMessage>You have too many forms</ErrorMessage>}
      </section>
    </Box >
  );
}
