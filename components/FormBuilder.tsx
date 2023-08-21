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
  UseFormGetValues,
  UseFormResetField
} from "react-hook-form";
import { IconContext } from "react-icons";
import { IoInformationCircle } from "react-icons/io5";
import Collapsible from "./Collapsible";
import TextInputBuilder from "./TextInputBuilder";
import ErrorMessage from "./ErrorMessage";
import { FormAndMessageBuilder } from "../util/types";
import { useScreenWidth } from "../util/width";
import { useColorMode } from "@chakra-ui/react";
import Counter from "./Counter";

export interface FormBuilderProperties<T extends FieldValues> {
  control: Control<T>;
  register: UseFormRegister<T>;
  formState: FormState<T>;
  watch: UseFormWatch<T>;
  setValue: UseFormSetValue<T>;
  getValues: UseFormGetValues<T>;
  resetField: UseFormResetField<T>;
  displayForm: number;
  setDisplayForm: React.Dispatch<React.SetStateAction<number>>;
}

export default function FormBuilder({
  control,
  register,
  setValue,
  getValues,
  resetField,
  formState,
  formState: { errors },
  watch,
  displayForm,
  setDisplayForm,
  
}: FormBuilderProperties<FormAndMessageBuilder>) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "forms",
    rules: { minLength: 1 }
  });

  const [webhookUrlFocused, webhookUrlSetFocused] = React.useState(false);
  const isSmallScreen = !useScreenWidth(500);
  const colorMode = useColorMode().colorMode

  function fixButton(index: number) {
    setTimeout(()=> {
      //@ts-expect-error
      if(typeof watch(`forms.${index}.button.style`) === 'string') setValue(`forms.${index}.button.style`, parseInt(watch(`forms.${index}.button.style`)))
    },1)
  }

  return (
    <Box width='100%' pb={2}>
      <FormLabel display='flex' alignItems='flex-end' pb={2}><Text>Forms</Text><Counter count={getValues('forms')?.length} max={getValues('application_command') ? 1 : ((getValues('message') && getValues('forms.0.select_menu_option')) ? 25 : 5)}/></FormLabel>
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
                <ErrorMessage error={errors.forms?.[index]?.webhook_url}/>
                <Stack direction={isSmallScreen ? "column" : "row"} marginBottom='8px' alignItems='flex-start'>
                  {
                    watch('forms.0.select_menu_option') && <>
                      <Box width='100%'>
                        <FormLabel htmlFor={`forms[${index}].select_menu_option.label`} display='flex' alignItems='flex-end'>
                          <Text _after={{ content: '" *"', color: (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') }}>Select Menu Option Label</Text>
                          <Counter count={getValues('forms')[index].select_menu_option?.label?.length} max={100} />
                        </FormLabel>
                        <input
                          {...register(`forms.${index}.select_menu_option.label`, { required: true, maxLength: 100 })}
                          id={`forms[${index}].select_menu_option.label`}
                          placeholder='Form'
                        />
                        <ErrorMessage error={errors.forms?.[index]?.select_menu_option?.label}/>
                      </Box>
                      <Box width='100%'>
                        <FormLabel htmlFor={`forms[${index}].select_menu_option.description`} display='flex' alignItems='flex-end'>
                          <Text>Select Menu Option Description</Text>
                          <Counter count={getValues('forms')[index].select_menu_option?.description?.length} max={100}></Counter>
                        </FormLabel>
                        <input
                          {...register(`forms.${index}.select_menu_option.description`, { maxLength: 100 })}
                          id={`forms[${index}].select_menu_option.description`}
                        />
                        <ErrorMessage error={errors.forms?.[index]?.select_menu_option?.description}/>
                      </Box>
                    </>
                  }
                  
                  {
                    watch('forms.0.button') && <>
                      <Box width='100%'>
                        <FormLabel htmlFor={`forms[${index}].button.label`} display='flex' alignItems='flex-end'><Text _after={{ content: '" *"', color: (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') }}>Button Label</Text>
                          <Counter count={getValues('forms')[index].button?.label?.length} max={80}></Counter>
                        </FormLabel>
                        <input
                          {...register(`forms.${index}.button.label`, { required: true, maxLength: 80 })}
                          id={`forms[${index}].button.label`}
                          placeholder='Open Form'
                        />
                        <ErrorMessage error={errors.forms?.[index]?.button?.label}/>
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
                          //@ts-expect-error
                          onInput={fixButton(index)}
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

                <FormLabel htmlFor={`forms[${index}].modal.title`} display='flex' alignItems='flex-end'>
                  <Text _after={{ content: '" *"', color: (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') }}>Title</Text>
                  <Counter count={getValues('forms')[index]?.modal.title?.length} max={45} />
                </FormLabel>
                <input
                  {...register(`forms.${index}.modal.title`, { required: true, maxLength: 45 })}
                  id={`forms[${index}].modal.title`}
                  style={{ marginBottom: '8px' }}
                />
                <ErrorMessage error={errors.forms?.[index]?.modal?.title}/>
              </Collapsible >
              <hr/>
              <Collapsible name="Text Inputs">
                <TextInputBuilder id={`forms.${index}.modal.components`} nestIndex={index} {...{ control, register, formState, watch, setValue, resetField }} />
              </Collapsible>
            </Collapsible >
          );
        })}
      </ul >

      <section>
        <Button
          variant='primary'
          isDisabled={(getValues('message') && getValues('forms.0.select_menu_option') && getValues('forms').length >= 25) || (getValues('message') && getValues('forms.0.button') && getValues('forms').length >= 5) || getValues('application_command') && getValues('forms').length >= 1 }
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
                        max_length: 1024
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
        {getValues('forms')?.length > 5 || getValues('application_command') && getValues('forms').length > 1 && <ErrorMessage>You have too many forms</ErrorMessage>}
      </section>
    </Box >
  );
}
