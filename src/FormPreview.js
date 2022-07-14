import { Box, Button, CloseButton, Text, useColorMode } from '@chakra-ui/react';
import React, { useState } from 'react';
import { HiChevronRight, HiChevronLeft } from 'react-icons/hi'

function FormPreview({ forms, displayForm, setDisplayForm }) {

    const { colorMode } = useColorMode();

    if (displayForm < 0) displayForm = 0;

    return (
        <Box overflowY='scroll' maxHeight='92.3vh'>
            <Box display='flex' alignItems='center' justifyContent='space-between' m='8px'>
                <Button disabled={displayForm < 1} onClick={() => setDisplayForm(displayForm - 1)}><HiChevronLeft /></Button>
                Form {displayForm + 1} Preview
                <Button disabled={displayForm > forms.length - 2} onClick={() => setDisplayForm(displayForm + 1)}><HiChevronRight /></Button>

            </Box>
            <Box display='flex' justifyContent='center'>
                <Box border={`1px solid ${colorMode === 'dark' ? '#e3e5e8' : '#292b2f'}`} borderRadius='3px' width='440px' height='fit-content' maxHeight='720px' overflowY='scroll'>
                    <Box display='flex' height='fit-content' justifyContent='space-between' alignItems='center' p='16px'>
                        <Box display='flex' alignItems='center' height='24px'>
                            <img src="https://cdn.discordapp.com/attachments/944646735643410482/946845836879462420/forms.png" alt="Forms Logo" width="24px" height='24px' style={{ clipPath: 'circle(50%)', marginRight: '8px' }} />
                            <Text fontSize='24px' color={colorMode === 'dark' ? '#060607' : 'white'}>{forms[displayForm].modal.title}</Text>
                        </Box>
                        <Box display='flex' p='4px' cursor='pointer'>
                            <svg width="24" height="24" viewBox="0 0 24 24"><path fill="#b9bbbe" d="M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z"></path></svg>
                        </Box>
                    </Box>
                    <Box>
                        {forms[displayForm].modal.components.map(actionRow => (
                            <Box key={Math.random()} m='0 1em 1em'>
                                <Text textTransform='uppercase' fontFamily='Helvetica Neue' fontWeight='black' fontSize='12px' mb='8px' color={colorMode === 'dark' ? '#4f5660' : '#b9bbbe'}>
                                    {actionRow.components[0].label}
                                    {actionRow.components[0].required && <span style={{ color: '#ed4245', paddingLeft: '4px' }}>*</span>}
                                </Text>
                                <Box as={actionRow.components[0].style === '1' ? 'input' : 'textarea'} bg={colorMode === 'dark' ? '#e3e5e8' : '#202225'} fontSize='16px' resize='none' border='0px' _focus={{ border: '0px' }} placeholder={actionRow.components[0].placeholder} defaultValue={actionRow.components[0].value} />
                            </Box>
                        ))}
                    </Box>
                    <Box bg={colorMode === 'dark' ? '#f2f3f5' : '#2f3136'} p='16px' display='flex' justifyContent='flex-end' alignItems='center'>
                        <Button variant='link' color={colorMode === 'dark' ? '#747f8d' : 'white'} border='0px' _focus={{ border: '0px' }} >Cancel</Button>
                        <Button variant='primary' border='0px' _focus={{ border: '0px' }}>Submit</Button>
                    </Box>
                </Box>
            </Box>
            <Text mt={5}>Forms Demo</Text>
            <img src='https://cdn.discordapp.com/attachments/944646735643410482/953299030669152256/forms_demo.png' />
        </Box>
    );
}

export default FormPreview;