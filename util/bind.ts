import { ChangeEvent } from "react"

export const bindToInput = <T extends object, K extends keyof T>(setting: T, key: K) => {
    return {
        defaultChecked: setting[key],
        onChange: (value: ChangeEvent<HTMLInputElement>) => {
            //@ts-expect-error
            setting[key] = Boolean(value.target.value)
        },
    }
}