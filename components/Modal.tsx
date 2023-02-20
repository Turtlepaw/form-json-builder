import { UseDisclosureReturn, Modal as ChakraModal, ModalOverlay, ModalContent as ChakraModalContent, useColorModeValue, ModalFooter as ChakraModalFooter } from "@chakra-ui/react";
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
    return (
        <ChakraModalContent bg={useColorModeValue("white", "#36393f")}>
            {children}
        </ChakraModalContent>
    )
}

export function ModalFooter({ children }: PropsWithChildren) {
    return (
        <ChakraModalFooter borderBottomRadius={5} bg={useColorModeValue( "#f3f4f5", "#2f3136")}>
            {children}
        </ChakraModalFooter>
    )
}