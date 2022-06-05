import { Box, Button, CloseButton, FormLabel, HStack, Select, Text, Tooltip } from "@chakra-ui/react";
import { Link } from "./Link";
import React from "react";
import { useFieldArray } from "react-hook-form";
import { IconContext } from "react-icons";
import { IoInformationCircle } from "react-icons/io5";
import Collapsible from "./Collapsible";
import NestedArray from "./nestedFieldArray";
import ErrorMessage from "./ErrorMessage";

export default function Fields({ control, register, setValue, getValues, errors }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "forms"
  });

  const [webhookUrlFocused, webhookUrlSetFocused] = React.useState(false)

  return (
    <>
      <ul>
        {fields.map((item, index) => {
          return (
            <Collapsible name={`Form ${index + 1}${getValues('forms')[index].modal.title && getValues('forms')[index].modal.title.match(/\S/) ? ` – ${getValues('forms')[index].modal.title}` : ''}`} variant='large' deleteButton={getValues('forms').length > 1 ? <CloseButton onClick={() => remove(index)} /> : null} key={item.id}>

              <FormLabel htmlFor={`forms[${index}].webhook_url`} display='flex' alignItems='center'>
                <Text marginRight='5px' _after={{ content: '" *"', color: '#ed4245' }}>Webhook URL</Text>
                <Tooltip hasArrow label={
                  <Box>
                    The Discord webhook URL to post submissions. Keep this secret!
                  </Box>
                } placement='right' shouldWrapChildren bg="#18191c" borderRadius={6} padding='4px 2px 4px 12px'>
                  <IconContext.Provider value={{ color: '#b9bbbe', size: '20px' }}><Box><IoInformationCircle /></Box></IconContext.Provider>
                </Tooltip>
              </FormLabel>
              <Link href='https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks'>Webhook Guide</Link>
              <input
                {...register(`forms[${index}].webhook_url`, { required: true, pattern: /^https:\/\/((canary|ptb).)?discord.com\/api\/webhooks\/\d{7,30}\/.+$/ })}
                id={`forms[${index}].webhook_url`}
                onFocus={() => webhookUrlSetFocused(true)}
                onBlur={() => webhookUrlSetFocused(false)}
                type={webhookUrlFocused ? 'text' : 'password'}
                placeholder='https://discord.com/api/webhooks/ ...'
              />
              <ErrorMessage>{(errors.forms?.[index].webhook_url?.type === 'required' && 'The Webhook URL is required') || (errors.forms?.[index].webhook_url?.type === 'pattern' && 'Invalid Webhook URL')}</ErrorMessage>
              <HStack marginBottom='8px' alignItems='flex-start'>
                <Box width='100%'>
                  <FormLabel htmlFor={`forms[${index}].button.label`} display='flex' alignItems='flex-end'><Text _after={{ content: '" *"', color: '#ed4245' }}>Button Label</Text><span style={{ display: 'inline', marginLeft: '7px', fontSize: '13px', color: getValues('forms')[index].button.label.length > 80 ? '#ed4245' : '#dcddde', fontFamily: 'Whitney Bold Italic' }}>{getValues('forms')[index].button.label.length}/80</span></FormLabel>
                  <input
                    {...register(`forms[${index}].button.label`, { required: true, maxLength: 80 })}
                    id={`forms[${index}].button.label`}
                    placeholder='Open Form'
                  />
                <ErrorMessage>{(errors.forms?.[index].button?.label?.type === 'required' && 'The Button Label is required') || (errors.forms?.[index].button?.label?.type === 'maxLength' && 'The Button Label is too long')}</ErrorMessage>
                </Box>
                <Box width='100%'>
                  <FormLabel htmlFor={`forms[${index}].button.style`}>Button Style</FormLabel>
                  <Select {...register(`forms[${index}].button.style`)} id={`forms[${index}].button.style`} variant='unstyled'>
                    <option value="1">Blurple | Primary (CTA)</option>
                    <option value="2">Grey | Secondary</option>
                    <option value="3">Green | Primary (Success)</option>
                    <option value="4">Red | Danger/Destructive</option>
                  </Select>
                </Box>
              </HStack>

              <FormLabel htmlFor={`forms[${index}].modal.title`}>Title</FormLabel>
              <input
                {...register(`forms[${index}].modal.title`)}
                id={`forms[${index}].modal.title`}
              />

              <FormLabel marginTop='8px' htmlFor={`forms[${index}].modal.components`} >Text Inputs</FormLabel>
              <NestedArray id={`forms[${index}].modal.components`} nestIndex={index} {...{ control, register }} />
            </Collapsible>
          );
        })}
      </ul>

      <section>
        <Button
          variant='primary'
          disabled={getValues('forms').length >= 5 ? true : false}
          onClick={() => append({
            webhook_url: "",
            modal: {
              components: [
                {
                  type: 1,
                  components: [
                    {
                      label: "",
                      style: "1"
                    }
                  ]
                }
              ]
            }
          })}
        >
          Add Form
        </Button>
      </section>
    </>
  );
}
