import { Box, Link, useColorMode } from "@chakra-ui/react";
import Image from "next/image";
import NextLink from "next/link";
import { ColorModeSwitcher } from "./ColorModeSwitcher";

export interface NavigationProps {
    modalHandler: () => void;
}

export function Navigation({ modalHandler }: NavigationProps) {
    const { colorMode } = useColorMode();
    return (
        <header>
            <Box display='flex' alignItems='center'>
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
                <nav>
                    <a href="https://discord.gg/cajZ7Mvzbp" target="_blank" rel="noopener noreferrer">Support Server</a>
                    <a href="https://discord.com/login?redirect_to=%2Foauth2%2Fauthorize%3Fclient_id%3D942858850850205717%26permissions%3D3072%26scope%3Dapplications.commands%2520bot" target="_blank" rel="noopener noreferrer">Invite Bot</a>
                    <a href="https://gist.github.com/Antouto/8ab83d83482af7c516f0b2b42eaee940" target="_blank" rel="noopener noreferrer">Documentation</a>
                    <NextLink href="/templates">Templates</NextLink>
                    <Link cursor="pointer" onClick={modalHandler}>Settings</Link>
                </nav>
            </Box>
            <ColorModeSwitcher height='0px' color={colorMode == "dark" ? "black" : "#b9bbbe"} />
        </header>
    )
}
