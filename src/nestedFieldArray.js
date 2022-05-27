import { Button, CloseButton, FormLabel } from "@chakra-ui/react";
import React from "react";
import { useFieldArray } from "react-hook-form";
import Collapsible from "./Collapsible";

export default ({ nestIndex, control, register }) => {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `forms[${nestIndex}].modal.components`
  });

  return (
    <div>
      {fields.map((item, k) => {
        return (
          <Collapsible name={`Text Input ${k+1}`} deleteButton={<CloseButton onClick={() => remove(k)} />} key={item.id} style={{ marginLeft: 20 }}>

            <FormLabel htmlFor={`forms[${nestIndex}].modal.components[${k}].components[0].label`}>Label</FormLabel>
            <input
              {...register(`forms[${nestIndex}].modal.components[${k}].components[0].label`)}
              id={`forms[${nestIndex}].modal.components[${k}].components[0].label`}
              defaultValue={item.label}
              style={{ marginRight: "25px" }}
            />

            <FormLabel htmlFor={`forms[${nestIndex}].modal.components[${k}].components[0].style`}>Style</FormLabel>
            <input
              {...register(`forms[${nestIndex}].modal.components[${k}].components[0].style`)}
              id={`forms[${nestIndex}].modal.components[${k}].components[0].style`}
              defaultValue={item.style}
            />
          </Collapsible>
        );
      })}

      <Button
        variant="primary"
        onClick={() =>
          append({
            label: "hi",
            style: "1"
          })
        }
      >
        Add Text Input
      </Button>
    </div>
  );
};
