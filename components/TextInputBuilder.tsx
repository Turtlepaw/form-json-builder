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
  useColorMode
} from "@chakra-ui/react";
import React from "react";
import {
  Controller,
  useFieldArray,
  Control,
  UseFormRegister,
  FieldValues,
  FormState,
  UseFormWatch,
  UseFormSetValue
} from "react-hook-form";
import { IconContext } from "react-icons";
import { IoInformationCircle } from "react-icons/io5";
import { FormAndMessageBuilder, ModalComponentBuilder } from "../util/types";
import { useScreenWidth } from "../util/width";
import Collapsible from "./Collapsible";

export interface TextInputBuilderProperties<T extends FieldValues> {
  nestIndex: number;
  control: Control<T>;
  register: UseFormRegister<T>;
  formState: FormState<T>;
  watch: UseFormWatch<T>;
  setValue: UseFormSetValue<T>;
  id?: string;
}


export default function TextInputBuilder({
  nestIndex,
  control,
  register,
  formState: { errors },
  watch,
  setValue,
  id
}: TextInputBuilderProperties<FormAndMessageBuilder>) {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `forms.${nestIndex}.modal.components`
  });
  const [textInputStyle, setTextInputStyle] = React.useState(['1', '1', '1', '1', '1'])
  const isSmallScreen = !useScreenWidth(500);
  const colorMode = useColorMode().colorMode

  return (
    <div id={id}>
      {fields.map((item, k) => {
        let textInput = watch(`forms.${nestIndex}.modal.components.${k}.components.0`) as ModalComponentBuilder;
        //@ts-expect-error
        let minimumLength = parseInt(watch(`forms.${nestIndex}.modal.components.${k}.components[0].min_length`));
        //@ts-expect-error
        let maximumLength = parseInt(watch(`forms.${nestIndex}.modal.components.${k}.components[0].max_length`));
        return (
          <Box key={item.id}>
            <Collapsible name={`Text Input ${k + 1}${textInput?.label && textInput?.label.match(/\S/) ? ` – ${textInput?.label}` : ''}`} deleteButton={fields.length > 1 ? <CloseButton onClick={() => remove(k)} /> : null} style={{ marginLeft: 20 }}>
              <FormLabel htmlFor={`forms[${nestIndex}].modal.components[${k}].components[0].label`} display='flex' alignItems='flex-end'><Text _after={{ content: '" *"', color: (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') }}>Label</Text><span style={{ display: 'inline', marginLeft: '7px', fontSize: '13px', color: (textInput?.label?.length > 45 || textInput?.label?.length < 1) ? (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') : (colorMode === 'dark' ? '#dcddde' : '#2e3338'), fontFamily: 'Whitney Bold Italic' }}>{textInput?.label?.length || 0}/45</span></FormLabel>
              <input
                {...register(`forms.${nestIndex}.modal.components.${k}.components.0.label`, { required: true, maxLength: 45 })}
                id={`forms.${nestIndex}.modal.components.${k}.components.0.label`}
                defaultValue={textInput.label}
                style={{ marginRight: "25px", marginBottom: '8px' }}
              />

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
                        onChange={(e) => field.onChange(e.target.checked)}
                        colorScheme='blurple'
                        isChecked={field.value === false ? false : true}
                      />
                    )}
                  />
                </Box>
              </Stack>

              <FormLabel htmlFor={`forms[${nestIndex}].modal.components[${k}].components[0].placeholder`} display='flex' alignItems='flex-end'><Text>Placeholder</Text><span style={{ display: 'inline', marginLeft: '7px', fontSize: '13px', color: (textInput?.placeholder?.length > 100) ? (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') : (colorMode === 'dark' ? '#dcddde' : '#2e3338'), fontFamily: 'Whitney Bold Italic' }}>{textInput?.placeholder?.length || 0}/100</span></FormLabel>
              <input
                {...register(`forms.${nestIndex}.modal.components.${k}.components.0.placeholder`, { maxLength: 100 })}
                id={`forms.${nestIndex}.modal.components.${k}.components.0.placeholder`}
                defaultValue={textInput.placeholder}
                style={{ marginRight: "25px", marginBottom: '8px' }}
              />

              <FormLabel htmlFor={`forms[${nestIndex}].modal.components[${k}].components[0].value`} display='flex' alignItems='flex-end'><Text>Preset Value</Text><span style={{ display: 'inline', marginLeft: '7px', fontSize: '13px', color: (textInput?.value?.length !== 0 && (Number.isNaN(minimumLength) || Number.isNaN(maximumLength) || minimumLength < 0 || minimumLength > 1024 || maximumLength < 1 || maximumLength > 1024 || textInput?.value?.length < minimumLength || textInput?.value?.length > maximumLength)) ? (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') : (colorMode === 'dark' ? '#dcddde' : '#2e3338'), fontFamily: 'Whitney Bold Italic' }}>{(!(minimumLength < 0 || maximumLength < 0) && (isNaN(minimumLength) || isNaN(maximumLength) || (minimumLength <= maximumLength && minimumLength >= 0 && minimumLength <= 1024 && maximumLength >= 1 && maximumLength <= 1024))) ? `Must be betweeen ${isNaN(minimumLength) ? 1 : (minimumLength < 1024 ? minimumLength : 1024)} and ${maximumLength <= 1024 ? maximumLength : 1024}` : 'Invalid minimum/maximum characters, fix these first'}</span></FormLabel>
              <Box
                as={textInputStyle[k] === '1' ? 'input' : 'textarea'}
                {...register(`forms.${nestIndex}.modal.components.${k}.components.0.value`, { minLength: minimumLength, maxLength: maximumLength })}
                id={`forms[${nestIndex}].modal.components[${k}].components[0].value`}
                defaultValue={textInput.value}
                style={{ marginRight: "25px", marginBottom: '8px' }}
              />
              <HStack marginBottom='8px' alignItems='flex-start'>
                <Box width='100%'>
                  <FormLabel display='flex' alignItems='flex-end'><Text>Minimum Characters</Text><span style={{ display: 'inline', marginLeft: '7px', fontSize: '13px', color: (minimumLength > maximumLength || minimumLength < 0 || minimumLength > 1024) ? (colorMode === 'dark' ? (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') : '#d92f2f') : (colorMode === 'dark' ? '#dcddde' : '#2e3338'), fontFamily: 'Whitney Bold Italic' }}>Must be betweeen 1 and {maximumLength > 1024 ? 1024 : (maximumLength < 1 ? 0 : maximumLength || 1024)}</span></FormLabel>
                  <input
                    {...register(`forms.${nestIndex}.modal.components.${k}.components.0.min_length`, { min: 0, max: 1024 })}
                    id={`forms[${nestIndex}].modal.components[${k}].components[0].min_length`}
                    defaultValue={textInput.min_length}
                    //@ts-expect-error
                    onChange={(event) => setValue(`forms.${nestIndex}.modal.components.${k}.components.0.min_length`, event.target.valueAsNumber || null)}
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
                </Box>
              </HStack>

              {/* <Controller
                control={control}
                name={`forms.${nestIndex}.modal.components.${k}.components.0.min`}
                render={({ field }) => (
                  <RangeSlider aria-label={['min', 'max']} min={1} max={1024} defaultValue={[1, 1024]} onChange={(val) => {
                    // field.onChange(e.target.checked);
                    setSliderValue(val)
                  }} margin='50px 30px 25px 30px' width='600px' maxWidth="86%" colorScheme='blurple'>
                    <RangeSliderTrack>
                      <RangeSliderFilledTrack />
                    </RangeSliderTrack>

                    <RangeSliderThumb index={0} />
                    <RangeSliderThumb index={1} />
                    <RangeSliderMark value={1} {...labelStyles} >1</RangeSliderMark>
                    <RangeSliderMark value={250} {...labelStyles} >250</RangeSliderMark>
                    <RangeSliderMark value={500} {...labelStyles} >500</RangeSliderMark>
                    <RangeSliderMark value={750} {...labelStyles} >750</RangeSliderMark>
                    <RangeSliderMark value={1024} {...labelStyles} >1024</RangeSliderMark>
                    <RangeSliderMark
                      value={sliderValue[0]}
                      textAlign='center'
                      bg='blurple'
                      color='white'
                      mt='-10'
                      ml='-8'
                      minWidth={sliderValue[0] > 955 ? '85px' : '0px'}
                      borderRadius='3px'
                      p='0px 6px'
                    >
                      Min: {sliderValue[0]}
                    </RangeSliderMark>
                    <RangeSliderMark
                      value={sliderValue[1]}
                      textAlign='center'
                      bg='blurple'
                      color='white'
                      mt='-10'
                      ml='-8'
                      minWidth={sliderValue[0] === sliderValue[1] ? '101px' : (sliderValue[1] > 947 ? '85px' : '0px')}
                      borderRadius='3px'
                      p='0px 6px'
                    >
                      {sliderValue[0] === sliderValue[1] ? `Exactly: ${sliderValue[1]}` : `Max: ${sliderValue[1]}`}
                    </RangeSliderMark>
                  </RangeSlider>
                )}
              /> */}



            </Collapsible>
            {/* {k + 1 === fields.length || k + 1 === 0 ? null : <hr />} */}
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
            placeholder: '',
            min_length: 0,
            max_length: 1024,
            value: '',
            required: true
          }
        ]
      })}>Add Text Input</Button>
    </div>
  );
};
