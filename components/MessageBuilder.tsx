import { Box, FormLabel, HStack, Radio, RadioGroup, Stack, Text, VStack, Tooltip, Select, useColorMode, SelectField } from "@chakra-ui/react";
import { FieldValues, Control, UseFormRegister, FormState, UseFormWatch, UseFormSetValue, UseFormGetValues, useFieldArray } from "react-hook-form";
import { Embed, FormAndMessageBuilder, SelectMenuBuilder } from "../util/types";
import Collapsible from "./Collapsible";
import ErrorMessage from "./ErrorMessage";
import EmbedBuilder from "./EmbedBuilder";
import Counter from "./Counter";

export interface Defaults {
    Message: string;
    Embed: Embed;
}

export interface MessageBuilderProperties<T extends FieldValues> {
    register: UseFormRegister<T>;
    setValue: UseFormSetValue<T>;
    getValues: UseFormGetValues<T>;
    formState: FormState<T>;
    Defaults: Defaults;
    openFormType: string;
    setOpenFormType: React.Dispatch<React.SetStateAction<string>>;
}


export default function MessageBuilder({
    register,
    formState: { errors },
    setValue,
    getValues,
    //@ts-expect-error
    resetField,
    //@ts-expect-error
    control,
    openFormType,
    setOpenFormType
}: MessageBuilderProperties<FormAndMessageBuilder>) {
    const colorMode = useColorMode().colorMode
    
    function fixMessage() {
        const message = getValues('message'); if(!message) return;
        const { content, embeds } = message
        if(!content && !embeds?.length) setTimeout(() => resetField('message'), 1); 
        if(!content) resetField(`message.content`)
        if(embeds?.length) for (let i = 0; i < embeds.length; i++) {
            const { title, description, color, author, footer } = embeds[i]
            if(!title) resetField(`message.embeds.${i}.title`)
            if(!description) resetField(`message.embeds.${i}.description`)
            if(typeof color === 'string' && color.length) { setValue(`message.embeds.${i}.color`, parseInt(color)) }
            if (typeof color === 'string' && !color.length) { resetField(`message.embeds.${i}.color`) }
            if(!author?.name && !author?.icon_url && !author?.url) {
            resetField(`message.embeds.${i}.author`)
            } else {
            if(!author?.name) resetField(`message.embeds.${i}.author.name`)
            if(!author?.icon_url) resetField(`message.embeds.${i}.author.icon_url`)
            if(!author?.url) resetField(`message.embeds.${i}.author.url`)
            }
            if (!footer?.text && !footer?.icon_url) {
            resetField(`message.embeds.${i}.footer`)
            } else {
            if(!footer?.text) resetField(`message.embeds.${i}.footer.text`)
            if(!footer?.icon_url) resetField(`message.embeds.${i}.footer.icon_url`)
            }
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
                    onChange={(event) => setOpenFormType(event.target.value)}
                    value={openFormType}
                >
                    <option value="button">Buttons</option>
                    <option value="application_command">Slash Command</option>
                    <option value="select_menu">Select Menu</option>
                </Select>
            </HStack>
            <Collapsible variant='large' name={(openFormType === 'button' || openFormType === 'select_menu') ? 'Message' : 'Slash Command'}>
            {(openFormType === 'button' || openFormType === 'select_menu') &&
                <VStack align='flex-start' width='100%' marginBottom="8px">
                    <FormLabel htmlFor="message.content">Message</FormLabel>
                    <textarea style={{ height: '99px' }} {...register('message.content', { onChange: () => fixMessage() })} id='message.content' />
                    <EmbedBuilder {...{ control, register, errors, setValue, getValues, resetField, fixMessage }}/>
                    {openFormType === 'select_menu' && <Box width='100%'>
                        <FormLabel htmlFor="select_menu_placeholder">Select Menu Placeholder</FormLabel>
                        {/* @ts-expect-error */}
                        <input {...register('select_menu_placeholder', { required: false })} maxLength='100' placeholder="Select a form" id='select_menu_placeholder' />
                    </Box>}

                </VStack>
            }
            

            {openFormType === 'application_command' && <>
                <FormLabel htmlFor={'application_command.name'} display='flex' alignItems='flex-end'>
                    <Text _after={{ content: '" *"', color: (colorMode === 'dark' ? '#ff7a6b' : '#d92f2f') }}>Name</Text>
                    <Counter count={getValues('application_command')?.name?.length} max={32}/>
                </FormLabel>
                <input {...register('application_command.name', { required: true, pattern: /^[-_\p{Ll}\p{N}\p{sc=Deva}\p{sc=Thai}]{1,32}$/u, maxLength: 32 }) } id='application_command.name' />
                <ErrorMessage error={errors?.application_command?.name}/>
                <FormLabel htmlFor={'application_command.description'} display='flex' alignItems='flex-end'>
                    <Text>Description</Text>
                    <Counter count={getValues('application_command')?.description?.length} max={100}/>
                </FormLabel>
                <input {...register('application_command.description', { maxLength: 100 }) } id='application_command.description' />
                <ErrorMessage error={errors?.application_command?.description}/>
                </>
            }</Collapsible>
        </>
    );
}
