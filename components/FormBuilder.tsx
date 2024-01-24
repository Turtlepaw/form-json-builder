import { Box, Button, CloseButton, FormLabel, HStack, Link, Select, Stack, Text, Tooltip, VStack } from "@chakra-ui/react";
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
  //@ts-expect-error
  fixMessage

}: FormBuilderProperties<FormAndMessageBuilder>) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "forms",
    rules: { minLength: 1 }
  });

  const [webhookUrlFocused, webhookUrlSetFocused] = useState(false);
  const [serverSubmissionMessage, __setServerSubmissionMessage] = useState(['default'])
  const [dmSubmissionMessage, __setdmSubmissionMessage] = useState(['default'])
  const isSmallScreen = !useScreenWidth(1070);
  const colorMode = useColorMode().colorMode

  function _setServerSubmissionMessage(value: string, index: number) {
    const array = serverSubmissionMessage.slice();
    array[index] = value;
    __setServerSubmissionMessage(array)
    console.log('__setServerSubmissionMessage', serverSubmissionMessage)
  }

  function _setdmSubmissionMessage(value: string, index: number) {
    const array = dmSubmissionMessage.slice();
    array[index] = value;
    __setdmSubmissionMessage(array)
    console.log('__setdmSubmissionMessage', dmSubmissionMessage)
  }

  function setServerSubmissionMessage(value: String, index: number) {
    _setServerSubmissionMessage(value, index)
    console.log('_setServerSubmissionMessage')

    switch(value) {
      case 'default': {
        resetField(`forms.${index}.guild_submit_message`);
        if(dmSubmissionMessage[index] === 'same_as_server') {
          resetField(`forms.${index}.submit_message`);
          _setdmSubmissionMessage('default', index);
          console.log('_setdmSubmissionMessage')
        }
        break;
      } case 'custom': {
        if(serverSubmissionMessage[index] === 'same_as_dm') {
          setValue(`forms.${index}.dm_submit_message`, getValues(`forms.${index}.submit_message`));
          resetField(`forms.${index}.submit_message`);
        }
        break;
      }
      case 'same_as_dm': {
        setValue(`forms.${index}.submit_message`, watch(`forms.${index}.dm_submit_message`));
        resetField(`forms.${index}.dm_submit_message`)
        resetField(`forms.${index}.guild_submit_message`)
        break;
      } 
    }
  }

  function setdmSubmissionMessage(value: String, index) {
    _setdmSubmissionMessage(value, index)
    switch(value) {
      case 'default': {
        resetField(`forms.${index}.dm_submit_message`);
        if(serverSubmissionMessage[index] === 'same_as_dm') {
          resetField(`forms.${index}.submit_message`);
          _setServerSubmissionMessage('default', index);
          console.log('_setServerSubmissionMessage')
        }
        break;
      } case 'custom': {
        if(dmSubmissionMessage[index] === 'same_as_server') {
          setValue(`forms.${index}.guild_submit_message`, getValues(`forms.${index}.submit_message`));
          resetField(`forms.${index}.submit_message`);
        }
        break;
      }
      case 'same_as_server': {
        setValue(`forms.${index}.submit_message`, watch(`forms.${index}.guild_submit_message`));
        resetField(`forms.${index}.guild_submit_message`)
        resetField(`forms.${index}.dm_submit_message`)
        break;
      } 
    }
  }

  function fixButton(index: number) {
    setTimeout(() => {
      //@ts-expect-error
      if (typeof watch(`forms.${index}.button.style`) === 'string') setValue(`forms.${index}.button.style`, parseInt(watch(`forms.${index}.button.style`)))
    }, 1)
  }

  function fixServerSubmissionMessage(index: number) {
    const { content } = getValues(`forms.${index}.guild_submit_message`)

    //if(!content) setTimeout(() => resetField(`forms.${index}.guild_submit_message`), 1); 
    if(!content) resetField(`forms.${index}.guild_submit_message`);
  }

  function fixdmSubmissionMessage(index: number) {
    const { content } = getValues(`forms.${index}.dm_submit_message`)

    //if(!content) setTimeout(() => resetField(`forms.${index}.dm_submit_message`), 1); 
    if(!content) resetField(`forms.${index}.dm_submit_message`);
  }

  function fixSubmissionMessage(index: number) {
    const { content } = getValues(`forms.${index}.submit_message`)

    //if(!content) setTimeout(() => resetField(`forms.${index}.submit_message`), 1); 
    if(!content) resetField(`forms.${index}.submit_message`);
  }

  return (
    <Box width='100%' pb={2}>
      <FormLabel display='flex' alignItems='flex-end' pb={2}><Text>Forms</Text><Counter count={getValues('forms')?.length} max={getValues('application_command') ? 1 : ((getValues('message') && getValues('forms.0.select_menu_option')) ? 25 : 5)} /></FormLabel>
      <ul>
        {fields.map((item, index) => {
          return (

            <Collapsible name={`Form ${index + 1}${getValues('forms')[index]?.modal.title && getValues('forms')[index]?.modal.title.match(/\S/) ? ` – ${getValues('forms')[index]?.modal.title}` : ''}`} variant='large' deleteButton={getValues('forms').length > 1 ? <CloseButton onClick={() => {
              remove(index)
              let newServerSubmissionMessage = serverSubmissionMessage;
              newServerSubmissionMessage.splice(index, 1);
              __setServerSubmissionMessage(newServerSubmissionMessage)

              let newdmSubmissionMessage = dmSubmissionMessage;
              newdmSubmissionMessage.splice(index, 1);
              __setdmSubmissionMessage(newdmSubmissionMessage)
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
                  {...register(`forms.${index}.webhook_url`, { required: true, pattern: /^https:\/\/((canary|ptb).)?discord(app)?.com\/api(\/v\d+)?\/webhooks\/\d{5,30}\/.+$/, onChange: () => fixMessage() })}
                  id={`forms[${index}].webhook_url`}
                  onFocus={() => webhookUrlSetFocused(true)}
                  onBlur={() => webhookUrlSetFocused(false)}
                  type={webhookUrlFocused ? 'text' : 'password'}
                  placeholder='https://discord.com/api/webhooks/ ...'
                  style={{ marginBottom: '8px' }}
                />
                <ErrorMessage error={errors.forms?.[index]?.webhook_url} />
                <HStack marginBottom='8px' alignItems='flex-start'>
                  {
                    watch('forms.0.select_menu_option') && <>
                      <Box width='100%'>
                        <FormLabel htmlFor={`forms[${index}].select_menu_option.label`} display='flex' alignItems='flex-end'>
                          <Text _after={{ content: '" *"', color: (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') }}>Select Menu Option Label</Text>
                          <Counter count={getValues('forms')[index].select_menu_option?.label?.length} max={100} />
                        </FormLabel>
                        <input
                          {...register(`forms.${index}.select_menu_option.label`, { required: true, maxLength: 100, onChange: () => fixMessage() })}
                          id={`forms[${index}].select_menu_option.label`}
                          placeholder='Form'
                        />
                        <ErrorMessage error={errors.forms?.[index]?.select_menu_option?.label} />
                      </Box>
                      <Box width='100%'>
                        <FormLabel htmlFor={`forms[${index}].select_menu_option.description`} display='flex' alignItems='flex-end'>
                          <Text>Select Menu Option Description</Text>
                          <Counter count={getValues('forms')[index].select_menu_option?.description?.length} max={100}></Counter>
                        </FormLabel>
                        <input
                          {...register(`forms.${index}.select_menu_option.description`, { maxLength: 100, onChange: () => fixMessage() })}
                          id={`forms[${index}].select_menu_option.description`}
                        />
                        <ErrorMessage error={errors.forms?.[index]?.select_menu_option?.description} />
                      </Box>
                    </>
                  }

                  {
                    watch('forms.0.button') && <>
                      <Box width={isSmallScreen ? '100%' : '50%'}>
                        <FormLabel htmlFor={`forms[${index}].button.label`} display='flex' alignItems='flex-end'><Text _after={{ content: '" *"', color: (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') }}>Button Label</Text>
                          <Counter count={getValues('forms')[index].button?.label?.length} max={80}></Counter>
                        </FormLabel>
                        <input
                          {...register(`forms.${index}.button.label`, { required: true, maxLength: 80, onChange: () => fixMessage() })}
                          id={`forms[${index}].button.label`}
                          placeholder='Open Form'
                        />
                        <ErrorMessage error={errors.forms?.[index]?.button?.label} />
                      </Box>
                      <Box>
                        <FormLabel htmlFor={`forms[${index}].button.style`}><Text _after={{ content: '" *"', color: (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') }}>Button Colour</Text></FormLabel>
                        <HStack>
                          <Button height='36px' width='36px' minWidth={'unset'} padding={0} _hover={{ background: 'blurple' }} background={'blurple'} onClick={() => setValue(`forms.${index}.button.style`, 1)}>{watch(`forms.${index}.button.style`) === 1 && <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="white" d="M21.7 5.3a1 1 0 0 1 0 1.4l-12 12a1 1 0 0 1-1.4 0l-6-6a1 1 0 1 1 1.4-1.4L9 16.58l11.3-11.3a1 1 0 0 1 1.4 0Z"></path></svg>}</Button>
                          <Button height='36px' width='36px' minWidth={'unset'} padding={0} _hover={{ background: 'grey.light' }} background={'grey.light'} onClick={() => setValue(`forms.${index}.button.style`, 2)}>{watch(`forms.${index}.button.style`) === 2 && <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="white" d="M21.7 5.3a1 1 0 0 1 0 1.4l-12 12a1 1 0 0 1-1.4 0l-6-6a1 1 0 1 1 1.4-1.4L9 16.58l11.3-11.3a1 1 0 0 1 1.4 0Z"></path></svg>}</Button>
                          <Button height='36px' width='36px' minWidth={'unset'} padding={0} _hover={{ background: 'green' }} background={'green'} onClick={() => setValue(`forms.${index}.button.style`, 3)}>{watch(`forms.${index}.button.style`) === 3 && <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="white" d="M21.7 5.3a1 1 0 0 1 0 1.4l-12 12a1 1 0 0 1-1.4 0l-6-6a1 1 0 1 1 1.4-1.4L9 16.58l11.3-11.3a1 1 0 0 1 1.4 0Z"></path></svg>}</Button>
                          <Button height='36px' width='36px' minWidth={'unset'} padding={0} _hover={{ background: 'red' }} background={'red'} onClick={() => setValue(`forms.${index}.button.style`, 4)}>{watch(`forms.${index}.button.style`) === 4 && <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="white" d="M21.7 5.3a1 1 0 0 1 0 1.4l-12 12a1 1 0 0 1-1.4 0l-6-6a1 1 0 1 1 1.4-1.4L9 16.58l11.3-11.3a1 1 0 0 1 1.4 0Z"></path></svg>}</Button>
                        </HStack>
                      </Box>
                    </>
                  }
                </HStack>

                <FormLabel htmlFor={`forms[${index}].modal.title`} display='flex' alignItems='flex-end'>
                  <Text _after={{ content: '" *"', color: (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') }}>Title</Text>
                  <Counter count={getValues('forms')[index]?.modal.title?.length} max={45} />
                </FormLabel>
                <input
                  {...register(`forms.${index}.modal.title`, { required: true, maxLength: 45, onChange: () => fixMessage() })}
                  id={`forms[${index}].modal.title`}
                  style={{ marginBottom: '8px' }}
                />
                <ErrorMessage error={errors.forms?.[index]?.modal?.title} />
              </Collapsible >
              <hr />
              <Collapsible name="Text Inputs">
                <TextInputBuilder id={`forms.${index}.modal.components`} nestIndex={index} {...{ control, register, formState, watch, setValue, resetField, fixMessage }} />
              </Collapsible>
              <hr />
              <Collapsible name="Submission & Conformation Messages">
                <VStack align={'flex-start'}>
                <HStack>
                  <IconContext.Provider value={{ color: '#b9bbbe', size: '20px' }}><Box><IoInformationCircle /></Box></IconContext.Provider>
                  <Text>This section is still in developement and currently only supports the message content</Text>
                </HStack>
                <HStack><Text>Use variables to add the response content to your message:</Text><Link color='#00b0f4' href="https://gist.github.com/Antouto/8ab83d83482af7c516f0b2b42eaee940#variables" isExternal>Show Variables</Link></HStack>
                  <HStack justifyContent='space-between' width='100%'>
                    <FormLabel whiteSpace='nowrap' m={0}>Server Submission Message</FormLabel>
                    <Select
                      height='24px!important'
                      maxWidth='155px'
                      borderWidth='2px'
                      borderColor='transparent'
                      borderRadius='4px'
                      bg={colorMode === 'dark' ? 'grey.extradark' : 'grey.extralight'}
                      _focus={{ borderWidth: '2px', borderColor: 'blurple' }}
                      _hover={{ borderColor: 'transparent' }}
                      onChange={(event) => setServerSubmissionMessage(event.target.value, index)}
                      value={serverSubmissionMessage[index]}
                    >
                      <option value="default">Default</option>
                      <option value="custom">Custom</option>
                      {dmSubmissionMessage[index] === 'custom' && <option value="same_as_dm">Same as DM</option>}
                    </Select>
                  </HStack>
                  {serverSubmissionMessage[index] === 'custom' && dmSubmissionMessage[index] !== 'same_as_server' && <Box width='100%'>
                    <FormLabel htmlFor={`forms[${index}].guild_submit_message.content`} display='flex' alignItems='flex-end'><Text>Content</Text>
                      <Counter count={getValues('forms')[index].guild_submit_message?.content?.length} max={2000}></Counter>
                    </FormLabel>
                    <input
                      {...register(`forms.${index}.guild_submit_message.content`, { maxLength: 2000, onChange: () => fixServerSubmissionMessage(index) })}
                      id={`forms.${index}.guild_submit_message.content`}
                    />
                    <ErrorMessage error={errors.forms?.[index]?.guild_submit_message?.content} />
                  </Box>}
                  {serverSubmissionMessage[index] === 'custom' && dmSubmissionMessage[index] === 'same_as_server' && <Box width='100%'>
                    <FormLabel htmlFor={`forms[${index}].submit_message.content`} display='flex' alignItems='flex-end'><Text>Content</Text>
                      <Counter count={getValues('forms')[index].submit_message?.content?.length} max={2000}></Counter>
                    </FormLabel>
                    <input
                      {...register(`forms.${index}.submit_message.content`, { maxLength: 2000, onChange: () => fixSubmissionMessage(index) })}
                      id={`forms.${index}.submit_message.content`}
                    />
                    <ErrorMessage error={errors.forms?.[index]?.guild_submit_message?.content} />
                  </Box>}
                  <HStack justifyContent='space-between'  width='100%'>
                    <FormLabel whiteSpace='nowrap' m={0}>DM Conformation Message</FormLabel>
                    <Select
                      height='24px!important'
                      maxWidth='155px'
                      borderWidth='2px'
                      borderColor='transparent'
                      borderRadius='4px'
                      bg={colorMode === 'dark' ? 'grey.extradark' : 'grey.extralight'}
                      _focus={{ borderWidth: '2px', borderColor: 'blurple' }}
                      _hover={{ borderColor: 'transparent' }}
                      onChange={(event) => setdmSubmissionMessage(event.target.value, index)}
                      value={dmSubmissionMessage[index]}
                    >
                      <option value="default">Default</option>
                      <option value="custom">Custom</option>
                      {serverSubmissionMessage[index] === 'custom' && <option value="same_as_server">Same as Server</option>}
                    </Select>
                  </HStack>
                  {dmSubmissionMessage[index] === 'custom' && serverSubmissionMessage[index] !== 'same_as_dm' && <Box width='100%'>
                    <FormLabel htmlFor={`forms[${index}].dm_submit_message.content`} display='flex' alignItems='flex-end'><Text>Content</Text>
                      <Counter count={getValues('forms')[index].dm_submit_message?.content?.length} max={2000}></Counter>
                    </FormLabel>
                    <input
                      {...register(`forms.${index}.dm_submit_message.content`, { maxLength: 2000, onChange: () => fixdmSubmissionMessage(index) })}
                      id={`forms.${index}.dmSubmissionMessage.content`}
                    />
                    <ErrorMessage error={errors.forms?.[index]?.dm_submit_message?.content} />
                  </Box>}
                  {dmSubmissionMessage[index] === 'custom' && serverSubmissionMessage[index] === 'same_as_dm' && <Box width='100%'>
                    <FormLabel htmlFor={`forms[${index}].submit_message.content`} display='flex' alignItems='flex-end'><Text>Content</Text>
                      <Counter count={getValues('forms')[index].submit_message?.content?.length} max={2000}></Counter>
                    </FormLabel>
                    <input
                      {...register(`forms.${index}.submit_message.content`, { maxLength: 2000, onChange: () => fixSubmissionMessage(index) })}
                      id={`forms.${index}.dmSubmissionMessage.content`}
                    />
                    <ErrorMessage error={errors.forms?.[index]?.submit_message?.content} />
                  </Box>}
                </VStack>
              </Collapsible>
            </Collapsible >
          );
        })}
      </ul >

      <section>
        <Button
          variant='primary'
          isDisabled={(getValues('message') && getValues('forms.0.select_menu_option') && getValues('forms').length >= 25) || (getValues('message') && getValues('forms.0.button') && getValues('forms').length >= 5) || getValues('application_command') && getValues('forms').length >= 1}
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
            serverSubmissionMessage.push('default')
            dmSubmissionMessage.push('default')
            fixMessage()
          }}
        >
          Add Form
        </Button>
        {getValues('forms')?.length > 5 || getValues('application_command') && getValues('forms').length > 1 && <ErrorMessage>You have too many forms</ErrorMessage>}
      </section>
    </Box >
  );
}
