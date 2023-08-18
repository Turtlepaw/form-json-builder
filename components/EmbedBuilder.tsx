import { FormLabel, Tooltip, Text, Box, Button, CloseButton } from "@chakra-ui/react";
import { useFieldArray } from "react-hook-form";
import Collapsible from "./Collapsible";
import { IoInformationCircle } from "react-icons/io5";
import { IconContext } from "react-icons";
import { useEffect } from "react";

//@ts-expect-error
export default function EmbedBuilder({ control, register, errors, setValue, getValues, resetField }) {
  const { fields, remove: _remove, append } = useFieldArray({
      control,
      name: 'message.embeds'
  });

  function remove(index: number) {
    _remove(index)
    if(!getValues('message.embeds')?.length) {
      resetField('message.embeds')
    }
  }

  return <>
      <FormLabel pb={2}>Embed</FormLabel>

      {fields.map((item, index) => <Collapsible key={item.id} name={`Embed ${index + 1}${getValues('message.embeds')[index]?.title && getValues('message.embeds')[index]?.title.match(/\S/) ? ` – ${getValues('message.embeds')[index]?.title}` : ''}`} deleteButton={<CloseButton onClick={() => remove(index)} />} style={{ padding: 0 }}>
          {/* Embed Title */}
          <FormLabel htmlFor={`message.embeds.${index}.title`}>Embed Title</FormLabel>
          <textarea {...register(`message.embeds.${index}.title`, { minLength: 1, maxLength: 256 })} id={`message.embeds.${index}.title`} />
          {/* Embed Description */}
          <FormLabel htmlFor={`message.embeds.${index}.description`}>Embed Description</FormLabel>
          <textarea style={{ height: '99px' }} {...register(`message.embeds.${index}.description`, { minLength: 1, maxLength: 4096 })} id={`message.embeds.${index}.description`} />
          {/* Embed Color */}
          <FormLabel htmlFor={`message.embeds.${index}.color`} display='flex' alignItems='center'>
              <Text mr={1} >Embed Color</Text>
              <Tooltip hasArrow label={'The color has to be in the "decimal" color format.'} placement='right' shouldWrapChildren bg="#181414">
                  <IconContext.Provider value={{ color: '#b9bbbe', size: '20px' }}><Box><IoInformationCircle /></Box></IconContext.Provider>
              </Tooltip>
          </FormLabel>

          
          <input
              {...register(`message.embeds.${index}.color`)}
              //@ts- expect-error
              onChange={(event) => setValue(`message.embeds.${index}.color`, event.target.valueAsNumber)}
              type="number"
              id={`message.embeds.${index}.color`} />
          {/* Embed Author */}
          <Collapsible name="Embed Author" style={{ marginLeft: 20 }}>
              {/* Embed Author Name */}
              <FormLabel htmlFor={`message.embeds.${index}.author.name`}>Author Name</FormLabel>
              <textarea {...register(`message.embeds.${index}.author.name`, { minLength: 1, maxLength: 256 })} id={`message.embeds.${index}.author.name`} />
              {/* Embed Author Icon URL */}
              <FormLabel htmlFor={`message.embeds.${index}.author.icon_url`}>Author Image URL</FormLabel>
              <input {...register(`message.embeds.${index}.author.icon_url`, { minLength: 1 })} id={`message.embeds.${index}.author.icon_url`} />
              {/* Embed Author URL */}
              <FormLabel htmlFor={`message.embeds.${index}.author.url`}>Author URL</FormLabel>
              <input {...register(`message.embeds.${index}.author.url`, { minLength: 1 })} id={`message.embeds.${index}.author.url`} />
          </Collapsible >
          {/* Embed Footer */}
          < Collapsible name="Embed Footer" style={{ marginLeft: 20 }}>
              {/* Embed Footer Text */}
              < FormLabel htmlFor={`message.embeds.${index}.footer.text`} > Footer Text</FormLabel >
              <textarea {...register(`message.embeds.${index}.footer.text`, { minLength: 1, maxLength: 2048 })} id={`message.embeds.${index}.color`} />
              {/* Embed Footer Icon URL */}
              < FormLabel htmlFor={`message.embeds.${index}.footer.icon_url`} > Footer Image URL</FormLabel >
              <input {...register(`message.embeds.${index}.footer.icon_url`, { minLength: 1 })} id={`message.embeds.${index}.footer.icon_url`} />
          </Collapsible >

      </Collapsible >)}
      <Button
          variant='primary'
          isDisabled={getValues('message.embeds')?.length >= 10}
          onClick={() =>
            append({
              title: '',
              description: '',
              color: 5793266,
              author: {
                name: '',
                url: '',
                icon_url: ''
              },
              footer: {
                text: '',
                icon_url: ''
              }
            })
          }
        >
          Add Embed
        </Button>
  </>
};