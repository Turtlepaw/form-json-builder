import { UseFormGetValues } from "react-hook-form";
import { FormAndMessageBuilder } from "./types";

const MAX_WIDTH = 20;
const UNTITLED_NAME = "form";

export function createName({ getValues }: { getValues: UseFormGetValues<FormAndMessageBuilder>; }) {
    const Name = getValues("forms")[0].modal.title;
    if (Name == "") return UNTITLED_NAME;
    const ShortName = Name.length >= MAX_WIDTH ? Name.slice(0, MAX_WIDTH) : Name;
    const NameWithUnderscore = ShortName.split(" ").map(e => e.toLowerCase()).join("_");
    return NameWithUnderscore;
}