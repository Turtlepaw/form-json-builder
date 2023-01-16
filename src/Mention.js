import { Box } from "@chakra-ui/react";
import React from "react";

/**
 * 
 * @param {import("@chakra-ui/react").CSSObject} hover
 * @returns 
 */
export function Mention({ children, hover }) {
    return (
        <Box display="inline" bgColor="#3e4372" padding="2px 4px 2px 4px" borderRadius={4} _hover={{
            bgColor: "#5865f2",
            ...hover
        }} cursor="pointer">
            {children}
        </Box>
    )
}

export function SlashCommand({ children }) {
    return (
        <Mention>
            /{children}
        </Mention>
    )
};

export function UserMention({ children }) {
    return (
        <Mention hover={{ textDecoration: "underline" }}>
            @{children}
        </Mention>
    );
}