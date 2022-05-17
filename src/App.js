import React, { useState } from 'react';
import { Formik, Field, useFormikContext, FieldArray, ErrorMessage } from 'formik';
import "./App.css";
import {
  ChakraProvider,
  Box,
  VStack,
  Code,
  Grid,
  theme,
  Input,
  Text,
  Checkbox,
  Button,
  Heading,
  HStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  CloseButton,
  useTheme,
  useColorMode,
  ColorModeScript
} from '@chakra-ui/react';

import { ColorModeSwitcher } from './ColorModeSwitcher';
import Collapsible from './Collapsible';

function App() {
  const [json, setJson] = useState('{}')
  const { colorMode } = useColorMode();
  ColorModeScript({
    initialColorMode: "dark",
    type: "cookie"
  });

  const AutoSubmit = () => {
    // Grab values and submitForm from context
    const { values, submitForm } = useFormikContext();
    React.useEffect(() => {
      setJson(JSON.stringify(values, null, 2))
    }, [values, submitForm]);
    return null;
  };


  return (
    <ChakraProvider theme={theme}>
      <Box>
        <Grid p={3}>
          <HStack display='flex' justifyContent='space-between'>
            <Heading size='md'>Forms Builder</Heading>
            <ColorModeSwitcher />
          </HStack>

          <VStack spacing={8} width='calc(100vw - 24px);'>
            <Box width='100%'>
              <Formik
                initialValues={{
                  // webhook_url: "",
                  // rememberMe: false,
                  forms: [
                    {
                      webhook_url: '',
                      title: '',
                      text_inputs: [
                        {
                          label: '',
                          type: 1
                        }
                      ]
                    },
                  ],
                }}
                onSubmit={(values) => {
                  setJson(JSON.stringify(values, null, 2))
                }}
              >
                {({ handleSubmit, errors, touched, values }) => (
                  <form onSubmit={handleSubmit}>
                    <VStack spacing={4} align="flex-start">
                      {/* <FormControl isInvalid={!!errors.webhook_url && touched.webhook_url}>
                        <FormLabel htmlFor="webhook_url">Webhook URL</FormLabel>
                        <Field
                          as={Input}
                          id="webhook_url"
                          name="webhook_url"
                          type="webhook_url"
                          variant="filled"
                          validate={(value) => {
                            let error;

                            if (!value.match(/https:\/\/((canary|ptb)\.)?discord\.com\/api\/webhooks\/\d+\/.+/)) {
                              error = "Invalid Webhook URL";
                            }

                            return error;
                          }}
                        />
                        <FormErrorMessage>{errors.webhook_url}</FormErrorMessage>
                      </FormControl> */}
                      <FormControl>
                        <FieldArray name='forms'>
                          {({ remove, push }) => (
                            <VStack align='flex-start'>
                              {values.forms.length > 0 &&
                                values.forms.map((form, index) => (
                                  <Collapsible
                                    name={`Form ${index + 1}`}
                                    deleteButton={<CloseButton onClick={() => remove(index)}/>}
                                    key={index}
                                    >

                                    <Box>

                                      <FormLabel htmlFor={`forms.${index}.webhook_url`} className={`theme-${colorMode}`}>Webhook URL</FormLabel>
                                      <Field
                                        name={`forms.${index}.webhook_url`}
                                        placeholder="https://discord.com/api/webhooks/channel/yourwebhook"
                                        type="text"
                                        as={Input}
                                        id={`forms.${index}.webhook_url`}
                                        variant="filled"
                                        validate={(value) => {
                                          let error;

                                          if (!value.match(/https:\/\/((canary|ptb)\.)?discord\.com\/api\/webhooks\/\d+\/.+/)) {
                                            error = "Invalid Webhook URL";
                                          }

                                          return error;
                                        }}
                                      />
                                      <ErrorMessage
                                        name={`forms.${index}.webhook_url`}
                                        component="div"
                                        className="field-error"
                                      />

                                    </Box>
                                    <Box>
                                      <FormLabel htmlFor={`forms.${index}.title`} className={`theme-${colorMode}`}>Title</FormLabel>
                                      <Field
                                        name={`forms.${index}.title`}
                                        placeholder="My awesome form"
                                        type="text"
                                        as={Input}
                                        id={`forms.${index}.title`}
                                        variant="filled"
                                      />
                                      <ErrorMessage
                                        name={`forms.${index}.title`}
                                        component="div"
                                        className="field-error"
                                      />
                                    </Box>
                                    <FormControl>
                                      <FieldArray name='text_inputs' render=                                        {({ insert, remove: removeTextInput, push: pushTextInput }) => (
                                          <VStack align='flex-start'>
                                            {values.forms[index].text_inputs.length > 0 &&
                                              values.forms[index].text_inputs.map((text_input, iindex) => (
                                                <Collapsible name={`Text Input ${iindex + 1}`} key={iindex} deleteButton={<CloseButton onClick={() => removeTextInput(iindex)} />}>

                                                  <div className="col">

                                                    <FormLabel htmlFor={`forms.${index}.text_inputs.${iindex}.label`}  className={`theme-${colorMode}`}>Label</FormLabel>
                                                    <Field
                                                      name={`forms.${index}.text_inputs.${iindex}.label`}
                                                      placeholder="My first text input"
                                                      type="text"
                                                      as={Input}
                                                      id={`forms.${index}.text_inputs.${iindex}.label`}
                                                      variant="filled"
                                                      validate={(value) => {
                                                        let error;

                                                        if (!value.match(/https:\/\/((canary|ptb)\.)?discord\.com\/api\/webhooks\/\d+\/.+/)) {
                                                          error = "Invalid Webhook URL";
                                                        }

                                                        return error;
                                                      }}
                                                    />
                                                    <ErrorMessage
                                                      name={`forms.${index}.text_inputs.${iindex}.label`}
                                                      component="div"
                                                      className="field-error"
                                                    />

                                                  </div>
                                                  <div className="col">
                                                    <FormLabel htmlFor={`forms.${index}.text_inputs.${iindex}.type`} className={`theme-${colorMode}`}>Type</FormLabel>
                                                    <Field
                                                      name={`forms.${index}.text_inputs.${iindex}.type`}
                                                      placeholder="1"
                                                      type="text"
                                                      as={Input}
                                                      id={`forms.${index}.text_inputs.${iindex}.type`}
                                                      variant="filled"
                                                    />
                                                    <ErrorMessage
                                                      name={`forms.${index}.text_inputs.${iindex}.type`}
                                                      component="div"
                                                      className="field-error"
                                                    />
                                                  </div>
                                                </Collapsible>
                                              ))}
                                            <Button
                                              onClick={() => pushTextInput({
                                                label: '',
                                                style: 1
                                              })}
                                            >

                                              Add Text Input
                                            </Button>
                                          </VStack>
                                        )}>

                                      </FieldArray>
                                    </FormControl>
                                  </Collapsible>
                                ))}
                              <Button
                                onClick={() => push({
                                  webhook_url: '',
                                  title: '',
                                  text_inputs: [
                                    {
                                      label: '',
                                      type: 1
                                    }
                                  ]
                                })}
                              >

                                Add Form
                              </Button>
                            </VStack>
                          )}
                        </FieldArray>
                      </FormControl>
                      {/* <Field
                        as={Checkbox}
                        id="rememberMe"
                        name="rememberMe"
                        colorScheme="purple"
                      >
                        Remember me?
                      </Field>
                      <Button type="submit" colorScheme="purple" width="full">
                        Login
                      </Button> */}
                    </VStack>
                    <AutoSubmit />
                  </form>
                )}
              </Formik>
            </Box>
            <VStack width='100%' align='flex-start'>
              <Heading size='sm' marginBottom='5px'>JSON Data</Heading>
              <Code variant='solid' width='100%'>{json}</Code>
              {/* <HStack>
                <Button>Copy JSON</Button>
                <Button>Download JSON</Button>
              </HStack> */}
            </VStack>
          </VStack>
        </Grid>
      </Box>
    </ChakraProvider>
  );
}

export default App;
