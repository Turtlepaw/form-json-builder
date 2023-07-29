import { Box, FormLabel, HStack, Radio, RadioGroup, Stack, Text, VStack, Tooltip, Select, useColorMode, SelectField } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useState } from "react";
import { FieldValues, Control, UseFormRegister, FormState, UseFormWatch, UseFormSetValue, UseFormGetValues, useFieldArray } from "react-hook-form";
import { ComponentType } from "../pages";
import { Embed, FormAndMessageBuilder, SelectMenuBuilder } from "../util/types";
import Collapsible from "./Collapsible";
import ErrorMessage from "./ErrorMessage";
import EmbedBuilder from "./EmbedBuilder";

export const MessageType = {
    Content: "content",
    Embed: "embed",
    ContentAndEmbed: "both"
};

export interface Defaults {
    Message: string;
    Embed: Embed;
}

export interface MessageBuilderProperties<T extends FieldValues> {
    register: UseFormRegister<T>;
    setValue: UseFormSetValue<T>;
    getValues: UseFormGetValues<T>;
    formState: FormState<T>;
    setMessageType: React.Dispatch<React.SetStateAction<string>>;
    messageType: string;
    Defaults: Defaults;
    componentType: [string, Dispatch<SetStateAction<ComponentType>>];
}

export default function useMessageBuilder({
    register,
    formState: { errors },
    setValue,
    getValues,
    //@ts-expect-error
    resetField,
    setMessageType,
    messageType,
    Defaults,
    //@ts-expect-error
    control,
    componentType: [componentType, setComponentType]
}: MessageBuilderProperties<FormAndMessageBuilder>) {
    const colorMode = useColorMode().colorMode
    const [openFormType, _setOpenFormType] = useState('message')

    //@ts-expect-error
    const setOpenFormType = type => {
        switch(type) {
            //@ts-expect-error
            case 'message':  resetField('application_command'); setValue('message', {
                "content": "Fill out the form below"
                //@ts-expect-error
            }); setValue('forms[0].button', {
                label: 'Open Form',
                style: 1
              }); break;
            //@ts-expect-error
            case 'application_command': setValue('forms[0].button', null); setValue('message', null); break;
        }
        _setOpenFormType(type)
    }

    const HandleComponentInteraction = (value: string) => {
        setComponentType(value as ComponentType);
        if (value == ComponentType.Button) {
            // @ts-expect-error
            setValue(`select_menu_placeholder`, null as any);
            getValues("forms").forEach((form, i) => {
                setValue(`forms.${i}.select_menu_option`, null as any);
                setValue(`forms.${i}.button`, {
                    label: "",
                    style: 1
                });
            });
        } else if (value == ComponentType.SelectMenu) {
            getValues("forms").forEach((form, i) => {
                setValue(`forms.${i}.button`, null as any);
                setValue(`forms.${i}.select_menu_option`, {
                    label: form.modal.title,
                    description: ""
                });
            });
        }
    }

    return (
        <>
            <HStack >
                <FormLabel whiteSpace='nowrap' m={0}>Open form using</FormLabel>
                <Select
                    height='24px!important'
                    borderWidth='2px'
                    borderColor='transparent'
                    borderRadius='4px'
                    bg={colorMode === 'dark' ? 'grey.extradark' : 'grey.extralight'}
                    _focus={{ borderWidth: '2px', borderColor: 'blurple' }}
                    _hover={{ borderColor: 'transparent' }}
                    onChange={event => setOpenFormType(event.target.value)}
                >
                    <option value="message">Message Components</option>
                    <option value="application_command">Slash Command</option>
                </Select>
            </HStack>
            <Collapsible variant='large' name={openFormType === 'message' ? 'Message' : 'Slash Command'}>
            {openFormType === 'message' &&
                <VStack align='flex-start' width='100%' marginBottom="8px">
                    <FormLabel htmlFor="message.content">Message</FormLabel>
                    <textarea style={{ height: '99px' }} {...register('message.content', { required: true })} id='message.content' />
                    <EmbedBuilder {...{ control, register, errors, setValue, getValues }}/>
                    <HStack>
                        <Box width='100%'>
                            <FormLabel htmlFor="componentType">Component Type</FormLabel>
                            <RadioGroup onChange={HandleComponentInteraction} value={componentType} id="componentType" height='36px'>
                                <HStack>
                                    <Radio
                                        name={ComponentType.Button}
                                        value={ComponentType.Button}
                                        colorScheme='blurple'
                                    >
                                        <Text>Button</Text>
                                    </Radio>
                                    <Radio
                                        name={ComponentType.SelectMenu}
                                        value={ComponentType.SelectMenu}
                                        colorScheme='blurple'
                                    >
                                        <Text>Select Menu</Text>
                                    </Radio>
                                </HStack>
                            </RadioGroup>
                        </Box>
                        {componentType === 'SelectMenu' && <Box width='100%'>
                            <FormLabel htmlFor="select_menu_placeholder">Select Menu Placeholder</FormLabel>
                            {/* @ts-expect-error */}
                            <input {...register('select_menu_placeholder', { required: false })} maxLength='100' placeholder="Select a form" id='select_menu_placeholder' />
                        </Box>}
                    </HStack>
                </VStack>
            }
            
            {openFormType === 'application_command' && <>
                {/* @ts-expect-error */}
                <FormLabel htmlFor={'application_command.name'} display='flex' alignItems='flex-end'><Text _after={{ content: '" *"', color: (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') }}>Name</Text><span style={{ display: 'inline', marginLeft: '7px', fontSize: '13px', color: getValues('application_command')?.name?.length > 32 ? (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') : (colorMode === 'dark' ? '#dcddde' : '#2e3338'), fontFamily: 'Whitney Bold Italic' }}>{getValues('application_command')?.name?.length || 0}/32</span></FormLabel>
                <input {...register('application_command.name', { required: true, pattern: /^[-_\p{L}\p{N}\p{sc=Deva}\p{sc=Thai}]{1,32}$/u, maxLength: 32 }) } id='application_command.name' />
                <ErrorMessage>{(errors?.application_command?.name?.type === 'required' && 'The name is required') || (errors?.application_command?.name?.type === 'pattern' && 'Invalid Name') || (errors?.application_command?.name?.type === 'maxLength' && 'The name is too long')}</ErrorMessage>
                {/* @ts-expect-error */}
                <FormLabel htmlFor={'application_command.description'} display='flex' alignItems='flex-end'><Text>Description</Text><span style={{ display: 'inline', marginLeft: '7px', fontSize: '13px', color: getValues('application_command')?.description?.length > 100 ? (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') : (colorMode === 'dark' ? '#dcddde' : '#2e3338'), fontFamily: 'Whitney Bold Italic' }}>{getValues('application_command')?.description?.length || 0}/100</span></FormLabel>
                <input {...register('application_command.description', { required: true, maxLength: 100 }) } id='application_command.description' />
                <ErrorMessage>{(errors?.application_command?.description?.type === 'required' && 'The description is required') || (errors?.application_command?.description?.type === 'maxLength' && 'The description is too long')}</ErrorMessage>
                </>
            }</Collapsible>
            </>
    );
}
