import { FieldValues, UseFormGetValues, UseFormResetField, UseFormSetValue } from "react-hook-form";
import { FormAndMessageBuilder, ToastStyles } from "./types";
import { CreateToastFnReturn } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";
import { OpenFormType } from "../pages";

interface FixFormOptions<T extends FieldValues> {
    getValues: UseFormGetValues<T>;
    setValue: UseFormSetValue<T>;
    resetField: UseFormResetField<T>;
    toast: CreateToastFnReturn;
    formData?: FormAndMessageBuilder;
}

export function fixForm(toast = true, {
    getValues,
    setValue,
    resetField,
    toast: ToastState,
    formData
}: FixFormOptions<FormAndMessageBuilder>) {
    const data = formData ?? getValues();

    data.forms.forEach((form, i) => {

        form.modal.components.forEach((actionRow, rowIndex) => {
            actionRow.components.forEach((e, index) => {

                // Filter out properties with value null
                //@ts-expect-error
                e = Object.fromEntries(Object.entries(e).filter(([k, v]) => v !== null));

                Object.entries(e).forEach(([k, v]) => {
                    //@ts-expect-error
                    if (v == '') delete e[k];
                    //@ts-expect-error
                    else if (typeof v != "boolean" && !isNaN(Number(v))) e[k] = Number(v);
                });

                setValue(`forms.${i}.modal.components.${rowIndex}.components.${index}`, e);
            });
        });
    });

    const Message = data.message;
    if(Message) {
        

        if (Message?.embeds != null && Message.embeds.length > 0) {
            Message.embeds.forEach((embed, i) => {
                Object.entries(embed).forEach(([k, v]) => {
                    if (typeof v == "string") {
                        //@ts-expect-error
                        if (v == null || v === "") resetField(`message.embeds.${i}.${k}`);
                    } else if (typeof v == "object") {
                        Object.entries(v).forEach(([k2, v2], i2) => {
                            //@ts-expect-error
                            if (v2 == null || v2 === "") resetField(`message.embeds.${i}.${k}.${k2}`);
                        })
                    }
                })
            });
        }
    
        if (
            Message?.embeds == null && (Message.content === "" || Message.content == null)
        ) {
            //@ts-expect-error
            setValue("message", null);
        }
    }

  

    if (toast) ToastState({
        title: 'Form Fixed',
        status: ToastStyles.Success,
        containerStyle: {
            backgroundColor: "#5865f2",
            borderRadius: "0.3rem"
        },
        position: "bottom",
        duration: 3000,
        isClosable: true,
    });
}