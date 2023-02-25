import { ButtonProps } from "@chakra-ui/react";
import { ComponentTheme } from "./types";

export const Button: ComponentTheme<ButtonProps> = {
    baseStyle: {
        color: 'white',
        fontFamily: 'Whitney Bold',
        fontWeight: '500',
        padding: '16px 2px',
        borderRadius: '3px',
        _focus: { boxShadow: 'none' },
    },
    variants: {
        primary: {
            bg: 'blurple',
            _disabled: { _hover: { bg: 'blurple!important' } },
            _hover: { bg: '#4752c4' }
        },
        secondary: {
            bg: 'grey.light',
            _disabled: { _hover: { bg: 'grey.light!important' } },
            _hover: { bg: '#686d73' }
        },
        success: {
            bg: 'green',
            _disabled: { _hover: { bg: 'green!important' }},
            _hover: { bg: '#215b32' }
        },
        danger: {
            bg: 'red',
            _disabled: { _hover: { bg: 'red!important' }},
            _hover: { bg: '#a12d2f' }
        },
        link: {
            bg: 'transparent',
            color: 'white',
            _hover: { textDecoration: 'underline' }
        },
        navigationDisplayMode: { height: '20px', marginY: '4px', fontSize: 'sm', paddingInline: '6px',  paddingBlock: 0, borderRadius: 10 }
    },
    defaultProps: {
        variant: 'secondary',
    }
};