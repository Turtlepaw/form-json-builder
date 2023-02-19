export interface ComponentTheme<T> {
    baseStyle?: Partial<T>;
    variants?: {
        [key: string]: Partial<T>;
    };
    defaultProps?: Partial<T>;
}