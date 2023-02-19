import { UseDisclosureReturn, Modal as ChakraModal, ModalOverlay, ModalContent as ChakraModalContent, useColorMode, ModalFooter as ChakraModalFooter } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

export function Modal({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => unknown } & PropsWithChildren) {
    return (
        <ChakraModal {...{ isOpen, onClose }}>
            <ModalOverlay />
            {children}
        </ChakraModal>
    )
}

export function ModalContent({ children }: PropsWithChildren) {
    const { colorMode } = useColorMode();
    return (
        <ChakraModalContent backgroundColor={colorMode == "light" ? "#36393f" : "#ffffff"}>
            {children}
        </ChakraModalContent>
    )
}

export function ModalFooter({ children }: PropsWithChildren) {
    const { colorMode } = useColorMode();
    return (
        <ChakraModalFooter borderBottomRadius={5} backgroundColor={colorMode == "light" ? "#2f3136" : "#f3f4f5"}>
            {children}
        </ChakraModalFooter>
    )
}