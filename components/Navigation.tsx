import { Box, Button, Tooltip } from "@chakra-ui/react";
import Image from "next/image";
import NextLink from "next/link";
import { useScreenWidth } from "../util/width";
import { ColorModeSwitcher } from "./ColorModeSwitcher";

export interface NavigationProps {
    modalHandler: () => void;
    displaySection: number;
    setDisplaySection: any;
}

export function Navigation({ modalHandler, displaySection, setDisplaySection }: NavigationProps) {
    const isSmallScreen = !useScreenWidth(500);

    return (
        <header>
            <Box display='flex' alignItems='center'>
                <Tooltip label="Home" placement="right" hasArrow arrowSize={6}>
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
                {(isSmallScreen && setDisplaySection !== 0) && <Box bg='#302c34' p='3px' ml={isSmallScreen ? 4 : 5} borderRadius={7.5}>
                    <Button onClick={() => setDisplaySection(1)} height='2px' pl={2} pr={2} borderRadius={5} bg={displaySection === 1 ? '#4f545c' : 'transparent'}>Editor</Button>
                    <Button onClick={() => setDisplaySection(2)} height='2px' pl={2} pr={2} borderRadius={5} bg={displaySection === 2 ? '#4f545c' : 'transparent'}>Preview</Button>
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
