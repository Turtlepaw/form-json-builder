import { cssVar, defineStyleConfig, TooltipProps } from "@chakra-ui/react";
import { ComponentTheme } from "./types";

const $bg = cssVar("tooltip-bg")
const $fg = cssVar("tooltip-fg")
const $arrowBg = cssVar("popper-arrow-bg")

export const Tooltip: ComponentTheme<TooltipProps> = {
    baseStyle: {
        backgroundColor: "#181414",
        [$arrowBg.variable]: "#181414",
        borderRadius: "5px",
        paddingX: "0.7rem",
        paddingY: "0.3rem",
    },
    defaultProps: {
        placement: "top",
        variant: "unstyled"
    }
};