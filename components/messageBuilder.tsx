import { Box, FormLabel, HStack, Radio, RadioGroup, Stack, Text, VStack } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";
import { FieldValues, Control, UseFormRegister, FormState, UseFormWatch, UseFormSetValue, UseFormGetValues } from "react-hook-form";
import { ComponentType } from "../pages";
import { EmbedBuilder, FormAndMessageBuilder, SelectMenuBuilder } from "../util/types";
import Collapsible from "./Collapsible";
import ErrorMessage from "./ErrorMessage";

export const MessageType = {
    Content: "content",
    Embed: "embed",
    ContentAndEmbed: "both"
};

export interface Defaults {
    Message: string;
    Embed: EmbedBuilder;
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
    setMessageType,
    messageType,
    Defaults,
    componentType: [componentType, setComponentType]
}: MessageBuilderProperties<FormAndMessageBuilder>) {
    const Embed = () => (
        <>
            <FormLabel pb={2}>Embed</FormLabel>
            <Collapsible name="Embed">
                {/* Embed Title */}
                <FormLabel htmlFor="message.embeds.0.title">Embed Title</FormLabel>
                <textarea {...register('message.embeds.0.title', { minLength: 1, maxLength: 256 })} id='message.embeds.0.title' />
                <ErrorMessage fieldName='embed title' fieldType='The' field={errors?.message?.embeds?.[0]?.title}></ErrorMessage>
                {/* Embed Description */}
                <FormLabel htmlFor="message.embeds.0.description">Embed Description</FormLabel>
                <textarea style={{ height: '99px' }} {...register('message.embeds.0.description', { minLength: 1, maxLength: 4096 })} id='message.embeds.0.description' />
                <ErrorMessage fieldName='embed description' fieldType='The' field={errors?.message?.embeds?.[0]?.description}></ErrorMessage>
                {/* Embed Color */}
                <FormLabel htmlFor="message.embeds.0.color">Embed Color</FormLabel>
                <input
                    {...register('message.embeds.0.color')}
                    //@ts-expect-error
                    onChange={(event) => setValue("message.embeds.0.color", event.target.valueAsNumber || null)}
                    type="number"
                    id='message.embeds.0.color' />
                <ErrorMessage fieldName='embed color' fieldType='The' field={errors?.message?.embeds?.[0]?.color}></ErrorMessage>
                {/* Embed Author */}
                <Collapsible name="Embed Author" style={{ marginLeft: 20 }}>
                    {/* Embed Author Name */}
                    <FormLabel htmlFor="message.embeds.0.author.name">Author Name</FormLabel>
                    <textarea {...register('message.embeds.0.author.name', { minLength: 1, maxLength: 256 })} id='message.embeds.0.author.name' />
                    <ErrorMessage fieldName='embed author name' fieldType='The' field={errors?.message?.embeds?.[0]?.author?.name}></ErrorMessage>
                    {/* Embed Author Icon URL */}
                    <FormLabel htmlFor="message.embeds.0.author.icon_url">Author Image URL</FormLabel>
                    <input {...register('message.embeds.0.author.icon_url', { minLength: 1 })} id='message.embeds.0.author.icon_url' />
                    <ErrorMessage fieldName='embed author image' fieldType='The' field={errors?.message?.embeds?.[0]?.author?.icon_url}></ErrorMessage>
                    {/* Embed Author URL */}
                    <FormLabel htmlFor="message.embeds.0.author.url">Author URL</FormLabel>
                    <input {...register('message.embeds.0.author.url', { minLength: 1 })} id='message.embeds.0.author.url' />
                    <ErrorMessage fieldName='embed author url' fieldType='The' field={errors?.message?.embeds?.[0]?.author?.url}></ErrorMessage >
                </Collapsible >
                {/* Embed Footer */}
                < Collapsible name="Embed Footer" style={{ marginLeft: 20 }}>
                    {/* Embed Footer Text */}
                    < FormLabel htmlFor="message.embeds.0.footer.text" > Footer Text</FormLabel >
                    <textarea {...register('message.embeds.0.footer.text', { minLength: 1, maxLength: 2048 })} id='message.embeds.0.color' />
                    <ErrorMessage fieldName='embed footer text' fieldType='The' field={errors?.message?.embeds?.[0]?.footer?.text}></ErrorMessage >
                    {/* Embed Footer Icon URL */}
                    < FormLabel htmlFor="message.embeds.0.footer.icon_url" > Footer Image URL</FormLabel >
                    <input {...register('message.embeds.0.footer.icon_url', { minLength: 1 })} id='message.embeds.0.footer.icon_url' />
                    <ErrorMessage fieldName='embed footer url' fieldType='The' field={errors?.message?.embeds?.[0]?.footer?.icon_url}></ErrorMessage >
                </Collapsible >
            </Collapsible >
        </>
    );

    const MessageContent = () => (
        <>
            <FormLabel htmlFor="message.content">Message</FormLabel>
            <textarea style={{ height: '99px' }} {...register('message.content', { required: true })} id='message.content' />
        </>
    );

    const HandleInteraction = (value: string) => {
        setMessageType(value);
        if (value === MessageType.Content) {
            setValue("message.embeds", []);
            setValue("message.content", Defaults.Message);
        } else if (value === MessageType.Embed) {
            setValue("message.content", null);
            setValue("message.embeds", [Defaults.Embed]);
        } else if (value === MessageType.ContentAndEmbed) {
            setValue("message.embeds", [Defaults.Embed]);
            setValue("message.content", Defaults.Message);
        }
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
            <FormLabel pb={2}>Message and Options</FormLabel>
            <Collapsible variant='large' name="Form Options">
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
            </Collapsible>
            <Collapsible variant='large' name="Message">
                <Box width='100%' marginBottom="8px">
                    <FormLabel htmlFor="messageType">Message Type</FormLabel>
                    <RadioGroup onChange={HandleInteraction} value={messageType} id="messageType">
                        <Stack direction="row">
                            <Radio
                                name={MessageType.Content}
                                value={MessageType.Content}
                                colorScheme='blurple'
                            >
                                <Text>Message</Text>
                            </Radio>
                            <Radio
                                name={MessageType.Embed}
                                value={MessageType.Embed}
                                colorScheme='blurple'
                            >
                                <Text>Embed</Text>
                            </Radio>
                            <Radio
                                name={MessageType.ContentAndEmbed}
                                value={MessageType.ContentAndEmbed}
                                colorScheme='blurple'
                            >
                                <Text>Both</Text>
                            </Radio>
                        </Stack>
                    </RadioGroup>

                    <Box pt={1}>
                        {messageType === "content" ? (
                            <>
                                {MessageContent()}
                            </>
                        ) : (messageType === "embed" ? <>{Embed()}</> : (
                            <>
                                {MessageContent()}
                                {Embed()}
                            </>
                        ))}
                    </Box>
                </Box>
            </Collapsible></>
    );
}