export interface ComponentTheme<T> {
    baseStyle: T;
    variants: {
        [key: string]: T;
    };
    defaultProps: {
        variant: string;
    }
}