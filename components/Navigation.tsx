import { Box, Button, color, Tooltip, useColorMode } from "@chakra-ui/react";
import Image from "next/image";
import NextLink from "next/link";
import { useScreenWidth } from "../util/width";
import { ColorModeSwitcher } from "./ColorModeSwitcher";

export interface NavigationProps {
    modalHandler: () => void;
    displaySection?: number;
    setDisplaySection?: any;
}

export function Navigation({ modalHandler, displaySection, setDisplaySection }: NavigationProps) {
    const isSmallScreen = !useScreenWidth(500);
    const colorMode = useColorMode().colorMode;

    return (
        <header>
            <Box display='flex' alignItems='center'>
                <Tooltip label="Home" placement="bottom-end" hasArrow arrowSize={6}>
                    <NextLink href="/">
                        <Image
                            src="/forms.svg"
                            alt="Forms Logo"
                            width={28}
                            height={28}
                            style={{
                                clipPath: 'circle(50%)'
                            }}
                        />
                    </NextLink>
                </Tooltip>
                {(isSmallScreen && displaySection) && <Box bg={colorMode === 'dark' ? '#2b2d31' : '#e0e1e5'} height='28px' ml={isSmallScreen ? 4 : 5} px={'2px'} borderRadius={15}>
                    <Button onClick={() => setDisplaySection(1)} variant='navigationDisplayMode' color={displaySection === 1 ? 'white' : (colorMode === 'dark' ? 'white' : '#82858f')} bg={displaySection === 1 ? (colorMode === 'dark' ? 'grey.light': 'grey.lighter') : 'transparent'}>Editor</Button>
                    <Button onClick={() => setDisplaySection(2)} variant='navigationDisplayMode' color={displaySection === 2 ? 'white' : (colorMode === 'dark' ? 'white' : '#82858f')} bg={displaySection === 2 ? (colorMode === 'dark' ? 'grey.light': 'grey.lighter') : 'transparent'}>Preview</Button>
                </Box>}
                <nav>
                    <a href="https://discord.gg/cajZ7Mvzbp" target="_blank" rel="noopener noreferrer">{isSmallScreen ? 'Help' : 'Support Server'}</a>
                    {!isSmallScreen && <a href="https://discord.com/login?redirect_to=%2Foauth2%2Fauthorize%3Fclient_id%3D942858850850205717%26permissions%3D3072%26scope%3Dapplications.commands%2520bot" target="_blank" rel="noopener noreferrer">Invite Bot</a>}
                    {!isSmallScreen && <a href="https://gist.github.com/Antouto/8ab83d83482af7c516f0b2b42eaee940" target="_blank" rel="noopener noreferrer">Documentation</a>}
                    <NextLink href="/templates">Templates</NextLink>
                    {/* <Link cursor="pointer" onClick={modalHandler}>Settings</Link> */}
                </nav>
            </Box>
            <ColorModeSwitcher height='0px' />
        </header >
    )
}
