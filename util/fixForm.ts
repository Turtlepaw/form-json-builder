import { FieldValues, UseFormGetValues, UseFormResetField, UseFormSetValue } from "react-hook-form";
import { FormAndMessageBuilder, ToastStyles } from "./types";
import { ComponentType } from "../pages";
import { CreateToastFnReturn } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";

interface FixFormOptions<T extends FieldValues> {
    getValues: UseFormGetValues<T>;
    setValue: UseFormSetValue<T>;
    resetField: UseFormResetField<T>;
    componentType: [ComponentType, Dispatch<SetStateAction<ComponentType>>];
    toast: CreateToastFnReturn;
    formData?: FormAndMessageBuilder;
}

export function fixForm(toast = true, {
    getValues,
    componentType,
    setValue,
    resetField,
    toast: ToastState,
    formData
}: FixFormOptions<FormAndMessageBuilder>) {
    const data = formData ?? getValues();

    data.forms.forEach((form, i) => {
        if(!data.application_command) {
            if (componentType[0] == ComponentType.Button) {
                setValue(`forms.${i}.button.style`, Number(form.button.style));
                resetField(`forms.${i}.select_menu_option`);
                //@ts-expect-error
                resetField(`select_menu_placeholder`);
            }
            //@ts-expect-error
            else if (componentType[0] == ComponentType.SelectMenu) Object.entries(data.forms[i].select_menu_option).forEach(([k, v]) => {
                //@ts-expect-error
                if (v == "") resetField(`forms.${i}.select_menu_option.${k}`);
            })
        }
        form.modal.components.forEach((actionRow, rowIndex) => {
            actionRow.components.forEach((e, index) => {
                console.log(e);

                // Filter out properties with value null
                //@ts-expect-error
                e = Object.fromEntries(Object.entries(e).filter(([k, v]) => v !== null));

                Object.entries(e).forEach(([k, v]) => {
                    console.log(k, v, index);
                    //@ts-expect-error
                    if (v == '') delete e[k];
                    //@ts-expect-error
                    else if (typeof v != "boolean" && !isNaN(Number(v))) e[k] = Number(v);
                });

                console.log("modal data: ", e);
                setValue(`forms.${i}.modal.components.${rowIndex}.components.${index}`, e);
            });
        });
    });

    const Message = data.message;
    if(Message) {
        

        if (Message?.embeds != null && Message.embeds.length > 0) {
            console.log("fixing...")
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