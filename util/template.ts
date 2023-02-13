export interface Replacer {
    set: (forms: any[], newData: string) => unknown;
    label: string;
    description?: string;
    satisfied: (form: any[]) => boolean;
    get?: (forms: any[]) => string;
    helpLink?: string;
    max: string;
    formIndex: number;
}