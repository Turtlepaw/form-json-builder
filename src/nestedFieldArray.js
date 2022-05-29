import { Button, CloseButton, FormLabel, Box, Radio, RadioGroup, Stack, Text, Tooltip } from "@chakra-ui/react";
import React from "react";
import { useFieldArray } from "react-hook-form";
import { IconContext } from "react-icons";
import { IoInformationCircle } from "react-icons/io5";
import Collapsible from "./Collapsible";

export default ({ nestIndex, control, register }) => {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `forms[${nestIndex}].modal.components`
  });
  const [textInputStyle, setTextInputStyle] = React.useState('1')

  return (
    <div>
      {fields.map((item, k) => {
        return (
          <Box key={item.id}>
            <Collapsible name={`Text Input ${k + 1}${fields[k].components?.[0].label && fields[k].components[0].label.match(/\S/) ? ` – ${fields[k].components[0].label}` : ''}`} deleteButton={fields.length > 1 ? <CloseButton onClick={() => remove(k)} /> : null} style={{ marginLeft: 20 }}>

              <FormLabel htmlFor={`forms[${nestIndex}].modal.components[${k}].components[0].label`}>Label</FormLabel>
              <input
                {...register(`forms[${nestIndex}].modal.components[${k}].components[0].label`)}
                id={`forms[${nestIndex}].modal.components[${k}].components[0].label`}
                defaultValue={item.label}
                style={{ marginRight: "25px" }}
              />

              <FormLabel htmlFor={`forms[${nestIndex}].modal.components[${k}].components[0].style`} display='flex' alignItems='center'>
                <Text>Style</Text>
                <Tooltip hasArrow label={
                  <Box>
                    <img src='https://cdn.discordapp.com/attachments/944646735643410482/975084229467729980/single_or_multiline_input.png' />
                  </Box>
                } placement='top' shouldWrapChildren bg="white" borderRadius={6} padding={0} marginLeft={1} >
                  <IconContext.Provider value={{ color: '#b9bbbe', size: '20px' }}><Box><IoInformationCircle /></Box></IconContext.Provider>
                </Tooltip>
              </FormLabel>

              <RadioGroup onChange={setTextInputStyle} value={textInputStyle} id={`forms.${nestIndex}.modal.components.${k}.components.0.style`}>
                <Stack direction="row">
                  <Radio
                    name={`forms.${nestIndex}.modal.components.${k}.components.0.style`}
                    {...register(`forms[${nestIndex}].modal.components[${k}].components[0].style`)}
                    value="1"
                    colorScheme='blurple'
                  >
                    <Text>Singleline</Text>
                  </Radio>
                  <Radio
                    name={`forms.${nestIndex}.modal.components.${k}.components.0.style`}
                    {...register(`forms[${nestIndex}].modal.components[${k}].components[0].style`)}
                    value="2"
                    colorScheme='blurple'
                  >
                    <Text>Multiline</Text>
                  </Radio>
                </Stack>
              </RadioGroup>

            </Collapsible>
            {k + 1 === fields.length || k + 1 === 0 ? null : <hr />}
          </Box>

        );
      })}
      <Button variant="primary" disabled={fields.length >= 5 ? true : false} onClick={() => append()}>Add Text Input</Button>
    </div>
  );
};
