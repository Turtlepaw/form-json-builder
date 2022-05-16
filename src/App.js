import React, { useState } from 'react';
import { Formik, Field, useFormikContext, FieldArray, ErrorMessage } from 'formik';

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
  FormErrorMessage
} from '@chakra-ui/react';

import { ColorModeSwitcher } from './ColorModeSwitcher';
import Collapsible from './Collapsible';

function App() {
  const [json, setJson] = useState('{}')
  const handleChange = (event, property) => {
    let newJson = JSON.parse(json);
    if (event.target.value === '') {
      delete newJson[property];
    } else {
      newJson[property] = event.target.value
    }

    setJson(JSON.stringify(newJson))
  }

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
            <Heading size='md'>Hello!</Heading>
            <ColorModeSwitcher />
          </HStack>

          <VStack spacing={8} width='calc(100vw - 24px);'>
            <Box width='100%'>
              <Formik
                initialValues={{
                  webhook_url: "",
                  rememberMe: false,
                  forms: [
                    {
                      webhook_url: '',
                      title: '',
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
                      <FormControl isInvalid={!!errors.webhook_url && touched.webhook_url}>
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
                      </FormControl>
                      <FormControl>
                        <FieldArray name='forms'>
                          {({ insert, remove, push }) => (
                            <Box>
                              {values.forms.length > 0 &&
                                values.forms.map((form, index) => (
                                  <div className="row" key={index}>
                                    <div className="col">

                                        <FormLabel htmlFor={`forms.${index}.webhook_url`}>Webhook URL</FormLabel>
                                        <Field
                                          name={`forms.${index}.webhook_url`}
                                          placeholder="Jane Doe"
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

                                    </div>
                                    <div className="col">
                                      <FormLabel htmlFor={`forms.${index}.title`}>Title</FormLabel>
                                      <Field
                                        name={`forms.${index}.title`}
                                        placeholder="jane@acme.com"
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
                                    </div>
                                    <div className="col">
                                      <button
                                        type="button"
                                        className="secondary"
                                        onClick={() => remove(index)}
                                      >
                                        X
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              <Button
                                onClick={() => push({
                                  webhook_url: '',
                                  title: ''
                                })}
                              >
                                Add Form
                              </Button>
                            </Box>
                          )}
                        </FieldArray>
                      </FormControl>
                      <Field
                        as={Checkbox}
                        id="rememberMe"
                        name="rememberMe"
                        colorScheme="purple"
                      >
                        Remember me?
                      </Field>
                      <Button type="submit" colorScheme="purple" width="full">
                        Login
                      </Button>
                    </VStack>
                    <AutoSubmit />
                  </form>
                )}
              </Formik>
              <FormControl>
                <Heading size='sm' marginBottom='5px'>Webhook URL</Heading>
                <Input
                  id='webhook_url'
                  name='webhook_url'
                  type='webhook_url'
                  onChange={(event) => { handleChange(event, 'webhook_url') }}
                />
              </FormControl>
            </Box>
            <VStack width='100%' alignItems='flex-start'>
              <Heading size='sm' marginBottom='5px'>JSON Data</Heading>
              <Code variant='solid' width='100%'>{json}</Code>
              <HStack>
                <Button>Copy JSON</Button>
                <Button>Download JSON</Button>
              </HStack>
              <Collapsible><Text>Hello</Text></Collapsible>
            </VStack>
          </VStack>
        </Grid>
      </Box>
    </ChakraProvider>
  );
}

export default App;
