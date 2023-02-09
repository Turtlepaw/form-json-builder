import { Switch } from "@chakra-ui/react";
import { autorun } from "mobx";
import { useEffect, useState } from "react";

export enum Switches {
    FixFormButton = "fix_form_button"
}


export function Toggle({ switchName, itemName }: { switchName: Switches; itemName: string; }) {
    const [item, _item] = useState(false);
    useEffect(() => {
        _item(Boolean(localStorage.getItem(switchName) ?? false))
    }, [switchName]);

    useEffect(() => {
        localStorage.setItem(switchName, JSON.stringify(!item))
        console.log("switch", item)
    }, [switchName, item]);

    //autorun(useSwitch, { delay: 5 })

    return (
        <Switch defaultChecked={item} onChange={() => _item(!item)}>{itemName} ({JSON.stringify(item)})</Switch>
    )
}
