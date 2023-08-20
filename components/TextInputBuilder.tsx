import {
  Button,
  CloseButton,
  FormLabel,
  Box,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Tooltip,
  Switch,
  HStack,
  Image,
  VStack,
  useColorMode,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderThumb,
  RangeSliderFilledTrack
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import {
  Controller,
  useFieldArray,
  Control,
  UseFormRegister,
  FieldValues,
  FormState,
  UseFormWatch,
  UseFormSetValue,
  UseFormResetField
} from "react-hook-form";
import { IconContext } from "react-icons";
import { IoInformationCircle } from "react-icons/io5";
import { FormAndMessageBuilder, ModalComponentBuilder } from "../util/types";
import { useScreenWidth } from "../util/width";
import Collapsible from "./Collapsible";
import ErrorMessage from "./ErrorMessage";
import Counter from "./Counter";
import { getValue } from "@testing-library/user-event/dist/utils";

export interface TextInputBuilderProperties<T extends FieldValues> {
  nestIndex: number;
  control: Control<T>;
  register: UseFormRegister<T>;
  formState: FormState<T>;
  watch: UseFormWatch<T>;
  setValue: UseFormSetValue<T>;
  resetField: UseFormResetField<T>;
  id?: string;
}


export default function TextInputBuilder({
  nestIndex,
  control,
  register,
  formState: { errors },
  watch,
  setValue,
  resetField,
  id
}: TextInputBuilderProperties<FormAndMessageBuilder>) {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `forms.${nestIndex}.modal.components`
  });
  const [textInputStyle, setTextInputStyle] = React.useState(['1', '1', '1', '1', '1'])
  const isSmallScreen = !useScreenWidth(500);
  const colorMode = useColorMode().colorMode

  function fixTextInput(k: number) {
    setTimeout(() => {
      if (!watch(`forms.${nestIndex}.modal.components.${k}.components.0.placeholder`)) resetField(`forms.${nestIndex}.modal.components.${k}.components.0.placeholder`)
      if (!watch(`forms.${nestIndex}.modal.components.${k}.components.0.value`)) resetField(`forms.${nestIndex}.modal.components.${k}.components.0.value`)
    }, 1);
  }

  useEffect(() => fixTextInput(0), [])

  return (
    <VStack align='flex-start' pl={3} pt={1} id={id}>
      {fields.map((item, k) => {
        let textInput = watch(`forms.${nestIndex}.modal.components.${k}.components.0`) as ModalComponentBuilder;
        //@ts-expect-error
        let minimumLength = parseInt(watch(`forms.${nestIndex}.modal.components.${k}.components[0].min_length`));
        //@ts-expect-error
        let maximumLength = parseInt(watch(`forms.${nestIndex}.modal.components.${k}.components[0].max_length`));
        return (
          <Box key={item.id} width='100%'>
            <Collapsible name={`Text Input ${k + 1}${textInput?.label && textInput?.label.match(/\S/) ? ` – ${textInput?.label}` : ''}`} deleteButton={fields.length > 1 ? <CloseButton onClick={() => remove(k)} /> : null} style={{ padding: 0 }}>
              <FormLabel htmlFor={`forms[${nestIndex}].modal.components[${k}].components[0].label`} display='flex' alignItems='flex-end'><Text _after={{ content: '" *"', color: (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') }}>Label</Text><span style={{ display: 'inline', marginLeft: '7px', fontSize: '13px', color: textInput?.label?.length > 45 ? (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') : (colorMode === 'dark' ? '#dcddde' : '#2e3338'), fontFamily: 'Whitney Bold Italic' }}>{textInput?.label?.length || 0}/45</span></FormLabel>
              <input
                {...register(`forms.${nestIndex}.modal.components.${k}.components.0.label`, { required: true, maxLength: 45 })}
                id={`forms.${nestIndex}.modal.components.${k}.components.0.label`}
                defaultValue={textInput.label}
                style={{ marginRight: "25px", marginBottom: '8px' }}
              />
              <ErrorMessage error={errors?.forms?.[nestIndex]?.modal?.components?.[k]?.components?.[0]?.label}/>

              <Stack direction={isSmallScreen ? "column" : "row"} marginBottom='8px' alignItems='flex-start'>
                <Box width='100%'>
                  <FormLabel htmlFor={`forms[${nestIndex}].modal.components[${k}].components[0].style`} display='flex' alignItems='center'>
                    <Text>Style</Text>
                    <Tooltip hasArrow label={
                      <Box>
                        <Image src='https://cdn.discordapp.com/attachments/944646735643410482/975084229467729980/single_or_multiline_input.png' alt="Single or multiline input example" />
                      </Box>
                    } placement='top' shouldWrapChildren bg="white" borderRadius={6} padding={0} marginLeft={1} >
                      <IconContext.Provider value={{ color: '#b9bbbe', size: '20px' }}><Box><IoInformationCircle /></Box></IconContext.Provider>
                    </Tooltip>
                  </FormLabel>
                  <RadioGroup onChange={(value) => {
                    let newTextInputStyle = textInputStyle
                    newTextInputStyle[k] = value
                    setTextInputStyle(newTextInputStyle)
                  }} value={textInputStyle[k]} id={`forms.${nestIndex}.modal.components.${k}.components.0.style`}>
                    <Stack direction={isSmallScreen ? "column" : "row"}>
                      <Radio
                        //name={`forms.${nestIndex}.modal.components.${k}.components.0.style`}
                        {...register(`forms.${nestIndex}.modal.components.${k}.components.0.style`)}
                        value="1"
                        colorScheme='blurple'
                      >
                        <Text>Singleline</Text>
                      </Radio>
                      <Radio
                        //name={`forms.${nestIndex}.modal.components.${k}.components.0.style`}
                        {...register(`forms.${nestIndex}.modal.components.${k}.components.0.style`)}
                        value="2"
                        colorScheme='blurple'
                      >
                        <Text>Multiline</Text>
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </Box>
                <Box width='100%'>
                  <FormLabel>Required</FormLabel>
                  <Controller
                    control={control}
                    name={`forms.${nestIndex}.modal.components.${k}.components.0.required`}
                    render={({ field }) => (
                      <Switch
                        onChange={event => field.onChange(event)}
                        colorScheme='blurple'
                        isChecked={field.value === false ? false : true}
                      />
                    )}
                  />
                </Box>
              </Stack>

              <FormLabel htmlFor={`forms[${nestIndex}].modal.components[${k}].components[0].placeholder`} display='flex' alignItems='flex-end'><Text>Placeholder</Text>
              <Counter count={textInput?.placeholder?.length || 0} max={100}/>  
              </FormLabel>
              <input
                {...register(`forms.${nestIndex}.modal.components.${k}.components.0.placeholder`, { maxLength: 100 })}
                id={`forms.${nestIndex}.modal.components.${k}.components.0.placeholder`}
                onInput={() => fixTextInput(k)}
                style={{ marginRight: "25px", marginBottom: '8px' }}
              />

              <FormLabel htmlFor={`forms[${nestIndex}].modal.components[${k}].components[0].value`} display='flex' alignItems='flex-end'>
                <Text>Preset Value</Text>
                <span
                  style={{
                    display: 'inline',
                    marginLeft: '7px',
                    fontSize: '13px',
                    //@ts-expect-error
                    color: (textInput?.value?.length !== 0 && (textInput?.value?.length < (Number.isNaN(minimumLength) ? 1 : minimumLength) || textInput?.value?.length > maximumLength)) ? (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') : (colorMode === 'dark' ? '#dcddde' : '#2e3338'),
                    fontFamily: 'Whitney Bold Italic' }}
                >
                  {`Must be betweeen ${(Number.isNaN(minimumLength) ? 1 : minimumLength)} and ${maximumLength}`}
                </span>
                </FormLabel>
              <Box
                as={textInputStyle[k] === '1' ? 'input' : 'textarea'}
                {...register(`forms.${nestIndex}.modal.components.${k}.components.0.value`, { minLength: minimumLength, maxLength: maximumLength })}
                id={`forms[${nestIndex}].modal.components[${k}].components[0].value`}
                onInput={() => fixTextInput(k)}
                style={{ marginRight: "25px", marginBottom: '8px' }}
              />
              <HStack marginBottom='8px' alignItems='flex-start'>
                {/* <Box width='100%'>
                  <FormLabel display='flex' alignItems='flex-end'><Text>Minimum Characters</Text><span style={{ display: 'inline', marginLeft: '7px', fontSize: '13px', color: (minimumLength > maximumLength || minimumLength < 0 || minimumLength > 1024) ? (colorMode === 'dark' ? (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') : '#d92f2f') : (colorMode === 'dark' ? '#dcddde' : '#2e3338'), fontFamily: 'Whitney Bold Italic' }}>Must be betweeen 1 and {maximumLength > 1024 ? 1024 : (maximumLength < 1 ? 0 : maximumLength || 1024)}</span></FormLabel>
                  <input
                    {...register(`forms.${nestIndex}.modal.components.${k}.components.0.min_length`, { min: 0, max: 1024 })}
                    id={`forms[${nestIndex}].modal.components[${k}].components[0].min_length`}
                    defaultValue={textInput.min_length}
                    //@ts-expect-error
                    onChange={(event) => event.target.valueAsNumber ? setValue(`forms.${nestIndex}.modal.components.${k}.components.0.min_length`, event.target.valueAsNumber) : resetField(`forms.${nestIndex}.modal.components.${k}.components.0.min_length`)}
                    type='number'
                    style={{ marginRight: "25px" }}
                  />
                </Box>
                <Box width='100%'>
                  <FormLabel display='flex' alignItems='flex-end'><Text>Maximum Characters</Text><span style={{ display: 'inline', marginLeft: '7px', fontSize: '13px', color: (maximumLength > 1024 || maximumLength < minimumLength || maximumLength < 1) ? (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') : (colorMode === 'dark' ? '#dcddde' : '#2e3338'), fontFamily: 'Whitney Bold Italic' }}>Must be betweeen {minimumLength > 1024 ? 1024 : (minimumLength < 0 ? 1 : minimumLength || 1)} and 1024</span></FormLabel>
                  <input
                    {...register(`forms.${nestIndex}.modal.components.${k}.components.0.max_length`, { min: 1, max: 1024 })}
                    id={`forms.${nestIndex}.modal.components.${k}.components.0.max_length`}
                    defaultValue={textInput.max_length}
                    //@ts-expect-error
                    onChange={(event) => setValue(`forms.${nestIndex}.modal.components.${k}.components.0.max_length`, event.target.valueAsNumber || null)}
                    type='number'
                    style={{ marginRight: "25px" }}
                  />
                </Box> */}
                <VStack width='100%' alignItems='flex-start' gap={8}>
                  <FormLabel>Minimum to Maximum Character Range</FormLabel>
                  <RangeSlider
                  
                  width='99%' ml='.5%' defaultValue={[1, 1024]} min={1} max={1024} onChange={(value) => {
                    //@ts-expect-error
                    setValue(`forms.${nestIndex}.modal.components.${k}.components.0.min_length`, value[0])
                    if(value[0] === 1) resetField(`forms.${nestIndex}.modal.components.${k}.components.0.min_length`)
                    //@ts-expect-error
                    value[1] ? setValue(`forms.${nestIndex}.modal.components.${k}.components.0.max_length`, value[1]) : setValue(`forms.${nestIndex}.modal.components.${k}.components.0.max_length`, 1)
                    fixTextInput(k)
                  }}>
                    <RangeSliderTrack height='8px'>
                      <RangeSliderFilledTrack bg='blurple'/>
                    </RangeSliderTrack>
                    <RangeSliderThumb {...register(`forms.${nestIndex}.modal.components.${k}.components.0.min_length`, { min: 1, max: 1024 })} border='1px solid lightgrey' borderRadius='3px' height='25px' width='10px' index={0}><Text mb={14}>{watch(`forms.${nestIndex}.modal.components.${k}.components.0.min_length`) || '1'}</Text></RangeSliderThumb>
                    <RangeSliderThumb border='1px solid lightgrey' borderRadius='3px' height='25px' width='10px' index={1}><Text mb={14}>{watch(`forms.${nestIndex}.modal.components.${k}.components.0.max_length`)}</Text></RangeSliderThumb>
                  </RangeSlider>
                </VStack>

              </HStack>
            </Collapsible>
          </Box>

        );
      })}
      <Button variant="primary" isDisabled={fields.length >= 5} onClick={() => append({
        type: 1,
        components: [
          {
            type: 4,
            label: '',
            style: 1,
            min_length: 0,
            max_length: 1024,
            required: true
          }
        ]
      })}>Add Text Input</Button>
    </VStack>
  );
};
