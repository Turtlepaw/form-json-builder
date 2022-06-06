import { Box, CloseButton, Text } from '@chakra-ui/react';
import React from 'react';

function FormPreview({ forms }) {
    return (
        <Box border='1px solid #292b2f' borderRadius='3px' height='fit-content' p='16px'>
            <Box display='flex' height='fit-content' justifyContent='space-between' alignItems='center' pb='16px'>
                <Box display='flex' alignItems='center' height='24px'>
                    <img src="https://cdn.discordapp.com/attachments/944646735643410482/946845836879462420/forms.png" alt="Forms Logo" width="24px" height='24px' style={{ clipPath: 'circle(50%)', marginRight: '8px' }} />
                    <Text fontSize='24px'>{forms[0].modal.title}</Text>
                </Box>
                <Box display='flex' p='4px' cursor='pointer'>
                    <svg width="24" height="24" viewBox="0 0 24 24"><path fill="#b9bbbe" d="M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z"></path></svg>
                </Box>
            </Box>
            <Box>
                {forms[0].modal.components.map(actionRow => (
                    <Text textTransform='uppercase' mb='16px' fontFamily='Helvetica Neue' fontWeight='500' fontSize='12px' color='#b9bbbe'>
                        {actionRow.components[0].label}
                        {actionRow.components[0].required && <span style={{ color: '#ed4245', paddingLeft: '4px' }}>*</span>}
                        <Box as={actionRow.components[0].style === '1' ? 'input' : 'textarea'} resize='none' border='0px' _focus={{ border: '0px' }} placeholder={actionRow.components[0].placeholder} />
                    </Text>
                ))}
            </Box>
        </Box>
    );
}

export default FormPreview;