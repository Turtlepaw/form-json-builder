import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Heading, ModalFooter, Button, useDisclosure, Box, ButtonProps, Text, HStack, VStack } from "@chakra-ui/react";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import { Switches, useToggle } from "./Toggle";

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface SettingElement {
    toJSON: () => {
        setItem: Dispatch<SetStateAction<boolean>>;
        getItem: boolean;
    };
    currentState: boolean;
    setState: Dispatch<SetStateAction<boolean>>;
    element: JSX.Element;
}

export interface ModalElements {
    Appearance: SettingElement[];
}

export interface ModalProperties {
    isOpen: boolean;
    onClose: () => void;
    elements: ModalElements;
}

export function useElements() {
    const ShowFixButton = useToggle(Switches.FixFormButton, "Show Fix Form Button");
    const LimitAnimations = useToggle(Switches.LimitAnimations, "Limit Animations")
    const elements: ModalElements = {
        Appearance: [ShowFixButton, LimitAnimations]
    }

    return {
        settings: {
            ShowFixButton: ShowFixButton.currentState,
            LimitAnimations: LimitAnimations.currentState
        },
        elements
    }
}

export function useModalSpawner() {
    const { isOpen, onClose, onOpen } = useDisclosure();
    return {
        modalData: { isOpen, onClose },
        buttonHandler: onOpen
    }
}

export function useModal() {
    const Elements = useElements();
    const Spawner = useModalSpawner();
    return {
        settings: Elements.settings,
        modal: <SettingsModal {...{ ...Spawner.modalData, elements: Elements.elements }} />,
        button: (props: Omit<ButtonProps, "onClick">) => <Button {...props} onClick={Spawner.buttonHandler} />,
        modalHandler: Spawner.buttonHandler
    }
}

export function SettingsModal({ isOpen, onClose, elements }: ModalProperties) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent backgroundColor="#36393f">
                {/* <ModalHeader _after={{
                    borderBottom: "none"
                }} paddingBottom="3.5">
                    Configuration
                </ModalHeader> */}
                <HStack pl={5} pt={4}>
                    <Image
                        src="/forms.svg"
                        alt="Forms Logo"
                        width={28}
                        height={28}
                        style={{
                            clipPath: 'circle(50%)'
                        }}
                    />
                    <Heading size="md" pl={2} fontWeight="medium">Settings</Heading>
                </HStack>
                <ModalCloseButton />
                <ModalBody paddingY={6}>
                    {Object.entries(elements).map(([k, v]) => (
                        <Box paddingBottom={5} key={k.toLowerCase()}>
                            <Heading size="sm" fontWeight="medium" paddingBottom={2}>{k}</Heading>
                            <VStack alignItems="left">
                                {v.map((e: SettingElement) => e.element)}
                            </VStack>
                        </Box>
                    ))}
                </ModalBody>

                <ModalFooter backgroundColor="#2f3136" borderBottomRadius={5}>
                    <Button variant="primary" mr={-2} onClick={onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}