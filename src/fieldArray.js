import { Box, Button, CloseButton, FormLabel, Text, Tooltip } from "@chakra-ui/react";
import { Link } from "./Link";
import React from "react";
import { useFieldArray } from "react-hook-form";
import { IconContext } from "react-icons";
import { IoInformationCircle } from "react-icons/io5";
import Collapsible from "./Collapsible";
import NestedArray from "./nestedFieldArray";

let renderCount = 0;

export default function Fields({ control, register, setValue, getValues }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "forms"
  });

  renderCount++;

  return (
    <>
      <ul>
        {fields.map((item, index) => {
          return (
            <Collapsible name={`Form ${index + 1}`} deleteButton={<CloseButton onClick={() => remove(index)} />} key={item.id}>

              <FormLabel for={`forms[${index}].webhook_url`} display='flex' alignItems='center'>
                <Text marginRight='5px'>Webhook URL</Text>
                <Tooltip hasArrow label={
                  <Box>
                    The Discord webhook URL to post submissions. Keep this secret!
                  </Box>
                } placement='top' shouldWrapChildren bg="blurple">
                  <IconContext.Provider value={{ color: '#b9bbbe', size: '20px' }}><Box><IoInformationCircle/></Box></IconContext.Provider>
                </Tooltip>
              </FormLabel>
              <Link href='https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks'>Webhook Guide</Link>
              <input
                {...register(`forms[${index}].webhook_url`)}
                id={`forms[${index}].webhook_url`}
                defaultValue={item.name}
              />

              <NestedArray nestIndex={index} {...{ control, register }} />
            </Collapsible>
          );
        })}
      </ul>

      <section>
        <Button
          variant='primary'
          onClick={() => {
            append({ webhook_url: "append" });
          }}
        >
          Add Form
        </Button>
      </section>

      <span className="counter">Render Count: {renderCount}</span>
    </>
  );
}
