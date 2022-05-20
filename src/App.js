import React, { useState } from 'react';
import { Formik, Field, useFormikContext, FieldArray, ErrorMessage } from 'formik';
import {
  ChakraProvider,
  Box,
  VStack,
  Code,
  Grid,
  Input,
  Radio,
  Text,
  Checkbox,
  extendTheme,
  Button,
  Heading,
  HStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  CloseButton,
  useTheme,
  Tooltip,
  RadioGroup,
  Stack
} from '@chakra-ui/react';
import { Rest, sendForm } from "./Discord";
import './App.css';
import { IconContext } from "react-icons";
import { IoInformationCircle } from 'react-icons/io5';
import theme from './theme';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import Collapsible from './Collapsible';
import { Link } from './Link';

function App() {
  const [json, setJson] = useState('{}')

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
            <Heading size='md'>Forms JSON Builder</Heading>
            <ColorModeSwitcher />
          </HStack>

          <VStack spacing={8} width='calc(100vw - 24px)'>
            <Box width='100%'>
              <Formik
                initialValues={{
                  location: {
                    channel_id: '',
                    message: {
                      content: ''
                    }
                  },
                  forms: [
                    {
                      webhook_url: '',
                      modal: {
                        title: '',
                        components: [
                          {
                            components: [{
                              label: '',
                              style: 1
                            }]
                          },
                          {
                            components: [{
                              label: '',
                              style: 1
                            }]
                          },
                          {
                            components: [{
                              label: '',
                              style: 1
                            }]
                          },
                          {
                            components: [{
                              label: '',
                              style: 1
                            }]
                          },
                          {
                            components: [{
                              label: '',
                              style: 1
                            }]
                          }
                        ]
                      }
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
                      <FormControl>
                        <FieldArray name='forms'>
                          {({ remove, push }) => (
                            <VStack align='flex-start'>
                              <Box width='100%'>
                                <FormLabel htmlFor={`location.channel_id`} >Channel ID</FormLabel>
                                <Field
                                  name={`location.channel_id`}
                                  placeholder="976298080506904596"
                                  type="text"
                                  as={Input}
                                  id={`location.channel_id`}
                                  validate={(value) => {
                                    let error;

                                    if (isNaN(Number(value)) || value.length > 18 || value.length <= 0) {
                                      error = "Invalid channel ID";
                                    }

                                    return error;
                                  }}
                                />
                                <ErrorMessage
                                  name={`location.channel_id`}
                                  component="div"
                                  className="field-error"
                                />
                              </Box>
                              <Box width='100%'>
                                <FormLabel htmlFor={`location.message.content`} >Message Content</FormLabel>
                                <Field
                                  name={`location.message.content`}
                                  placeholder="976298080506904596"
                                  type="text"
                                  as={Input}
                                  id={`location.message.content`}

                                  validate={(value) => {
                                    let error;

                                    if (value.length > 2000 || value.length <= 0) {
                                      error = "Message Content must be less than 2000 characters";
                                    }

                                    return error;
                                  }}
                                />
                                <ErrorMessage
                                  name={`location.message.content`}
                                  component="div"
                                  className="field-error"
                                />
                              </Box>
                              {values.forms.length > 0 &&
                                values.forms.map((form, index) => (
                                  <Collapsible
                                    name={`Form ${index + 1} ${values.forms[index].modal.title.match(/\w/) ? `– ${values.forms[index].modal.title}` : ''}`}
                                    deleteButton={<CloseButton onClick={() => remove(index)} />}
                                    key={index}
                                  >
                                    <Box>
                                      <FormLabel htmlFor={`forms.${index}.webhook_url`} display='flex' alignItems='center'>
                                        <Text marginRight='5px'>Webhook URL</Text>
                                        <Tooltip hasArrow label={
                                          <div>
                                            The Discord webhook URL to post submissions. Keep this secret!
                                          </div>
                                        } placement='top' shouldWrapChildren bg="blurple">
                                          <IconContext.Provider value={{ color: '#b9bbbe', size: '20px' }}><Box><IoInformationCircle /></Box></IconContext.Provider>
                                        </Tooltip>
                                      </FormLabel>
                                      <Link href='https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks'>Webhook Guide</Link>
                                      <Field
                                        name={`forms.${index}.webhook_url`}
                                        placeholder="https://discord.com/api/webhooks/channel/yourwebhook"
                                        type="text"
                                        as={Input}
                                        id={`forms.${index}.webhook_url`}

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
                                      <FormLabel htmlFor={`forms.${index}.modal.title`}>Title</FormLabel>
                                      <Field
                                        name={`forms.${index}.modal.title`}
                                        placeholder="My awesome form"
                                        type="text"
                                        as={Input}
                                        id={`forms.${index}.modal.title`}

                                        validate={(value) => {
                                          let error;

                                          if (value.length >= 45 || value.length <= 0) {
                                            error = "The title must be between 1 and 45 characters.";
                                          }

                                          return error;
                                        }}
                                      />
                                      <ErrorMessage
                                        name={`forms.${index}.modal.title`}
                                        component="div"
                                        className="field-error"
                                      />
                                    </Box>
                                    <FormControl>
                                      <FieldArray name='text_inputs' render={({ insert, remove: removeTextInput, push: pushTextInput }) => (
                                        <VStack align='flex-start'>
                                          {values.forms[index].modal.components.length > 0 &&
                                            values.forms[index].modal.components.map((text_input, iindex) => (
                                              <Collapsible name={`Text Input ${iindex + 1}`} key={iindex} deleteButton={<CloseButton onClick={() => removeTextInput(iindex)} />}>

                                                <div className="col">

                                                  <FormLabel htmlFor={`forms.${index}.modal.components.${iindex}.components.0.label`}>Label</FormLabel>
                                                  <Field
                                                    name={`forms.${index}.modal.components.${iindex}.components.0.label`}
                                                    placeholder="My first text input"
                                                    type="text"
                                                    as={Input}
                                                    id={`forms.${index}.modal.components.${iindex}.components.0.label`}

                                                    validate={(value) => {
                                                      let error;

                                                      if (value.length >= 45 || value.length <= 0) {
                                                        error = "The label must be between 1 and 45 characters.";
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
                                                  <FormLabel htmlFor={`forms.${index}.modal.components.${iindex}.components.0.style`} display='flex' alignItems='center'>
                                                    <Text marginRight='5px'>Style</Text>
                                                    <Tooltip hasArrow label='Short only allows 1 line of text to be entered versus paragraph allows more then 1 line of text to be entered.' placement='top' shouldWrapChildren bg="blurple">
                                                      <IconContext.Provider value={{ color: '#b9bbbe', size: '20px' }}><Box><IoInformationCircle /></Box></IconContext.Provider>
                                                    </Tooltip>
                                                  </FormLabel>
                                                  <RadioGroup>
                                                    <Stack direction="row">
                                                      <Field
                                                        name={`forms.${index}.modal.components.${iindex}.components.0.style`}
                                                        type="radio"
                                                        as={Radio}
                                                        id={`forms.${index}.modal.components.${iindex}.components.0.style`}

                                                        value="1"
                                                        className='radioText'
                                                      >
                                                        <Text>Short</Text>
                                                      </Field>
                                                      <Field
                                                        name={`forms.${index}.modal.components.${iindex}.components.0.style`}
                                                        type="radio"
                                                        as={Radio}
                                                        id={`forms.${index}.modal.components.${iindex}.components.0.style`}

                                                        value="2"
                                                        className='radioText'
                                                      >
                                                        <Text className='radioText'>Paragraph</Text>
                                                      </Field>
                                                    </Stack>
                                                  </RadioGroup>
                                                  <ErrorMessage
                                                    name={`forms.${index}.modal.components.${iindex}.components.0.style`}
                                                    component="div"
                                                    className="field-error"
                                                  />
                                                </div>
                                              </Collapsible>
                                            ))}
                                          <Button
                                            variant='primary'
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
                                variant='primary'
                                onClick={() => push({
                                  webhook_url: '',
                                  title: '',
                                  modal: {
                                    components: [
                                      {
                                        components: [{
                                          label: '',
                                          style: 1
                                        }]
                                      },
                                      {
                                        components: [{
                                          label: '',
                                          style: 1
                                        }]
                                      },
                                      {
                                        components: [{
                                          label: '',
                                          style: 1
                                        }]
                                      },
                                      {
                                        components: [{
                                          label: '',
                                          style: 1
                                        }]
                                      },
                                      {
                                        components: [{
                                          label: '',
                                          style: 1
                                        }]
                                      }
                                    ]
                                  }
                                })}
                              >

                                Add Form
                              </Button>
                              <Button
                                variant='primary'
                                onClick={async () => {
                                  const res = await sendForm(json)
                                  alert(res);
                                }}
                              >
                                Post
                              </Button>
                            </VStack>
                          )}
                        </FieldArray>
                      </FormControl>
                    </VStack>
                    <AutoSubmit />
                  </form>
                )}
              </Formik>
            </Box>
            <VStack width='100%' align='flex-start'>
              <Heading size='sm' marginBottom='5px'>JSON Data</Heading>
              <pre><Code variant='solid' colorScheme='blackAlpha' width='calc(100vw - 24px)'>{json}</Code></pre>
              {/* <HStack>
                <Button>Copy JSON</Button>
                <Button>Download JSON</Button>
              </HStack> */}
            </VStack>
          </VStack>
        </Grid>
      </Box>
      <div className="text-sm pt-5 text-center pb-10">
        <p className="font-medium">©️ 2022 Forms Discord Bot</p>
        <p className="text-muted">
          Not affiliated with Discord, Inc.
          <br />
          Discord is a registered trademark of Discord, Inc.
        </p>
      </div>
    </ChakraProvider>
  );
}

export default App;
