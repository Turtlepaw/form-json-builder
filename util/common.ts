export function isEmpty(value: any) {
    if (value == null) return true;
    else if (typeof value == "string" && (value == "" || value == " ")) return true;
    else return false;
}

export function isId(value: string) {
    value = value.replaceAll(" ", "");
    if (value == null) return false;
    else if (isNaN(Number(value))) return false;
    else if (value.length < 18 || value.length >= 20) return false;
    else return true;
}