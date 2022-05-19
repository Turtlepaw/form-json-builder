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
import { FaQuestionCircle } from 'react-icons/fa';
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
                    channel_id: '976298080506904596',
                    message: {
                      content: 'test'
                    }
                  },
                  forms: [
                    {
                      webhook_url: '',
                      title: '',
                      text_inputs: [
                        { label: '', type: 1 },
                        { label: '', type: 1 },
                        { label: '', type: 1 },
                        { label: '', type: 1 },
                        { label: '', type: 1 }
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
                              <Box>
                              <FormLabel htmlFor={`location.channel_id`} >Channel ID</FormLabel>
                              <Field
                                name={`location.channel_id`}
                                placeholder="976298080506904596"
                                type="text"
                                as={Input}
                                id={`location.channel_id`}
                                variant="filled"
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
                              <Box>
                              <FormLabel htmlFor={`location.message.content`} >Message Content</FormLabel>
                              <Field
                                name={`location.message.content`}
                                placeholder="976298080506904596"
                                type="text"
                                as={Input}
                                id={`location.message.content`}
                                variant="filled"
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
                                    name={`Form ${index + 1}`}
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
                                          <FaQuestionCircle />
                                        </Tooltip>
                                      </FormLabel>
                                      <Link href='https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks'>Webhook Guide</Link>
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
                                      <FormLabel htmlFor={`forms.${index}.title`} >Title</FormLabel>
                                      <Field
                                        name={`forms.${index}.title`}
                                        placeholder="My awesome form"
                                        type="text"
                                        as={Input}
                                        id={`forms.${index}.title`}
                                        variant="filled"
                                        validate={(value) => {
                                          let error;

                                          if (value.length >= 45 || value.length <= 0) {
                                            error = "The title must be between 1 and 45 characters.";
                                          }

                                          return error;
                                        }}
                                      />
                                      <ErrorMessage
                                        name={`forms.${index}.title`}
                                        component="div"
                                        className="field-error"
                                      />
                                    </Box>
                                    <FormControl>
                                      <FieldArray name='text_inputs' render={({ insert, remove: removeTextInput, push: pushTextInput }) => (
                                        <VStack align='flex-start'>
                                          {values.forms[index].text_inputs.length > 0 &&
                                            values.forms[index].text_inputs.map((text_input, iindex) => (
                                              <Collapsible name={`Text Input ${iindex + 1}`} key={iindex} deleteButton={<CloseButton onClick={() => removeTextInput(iindex)} />}>

                                                <div className="col">

                                                  <FormLabel htmlFor={`forms.${index}.text_inputs.${iindex}.label`} >Label</FormLabel>
                                                  <Field
                                                    name={`forms.${index}.text_inputs.${iindex}.label`}
                                                    placeholder="My first text input"
                                                    type="text"
                                                    as={Input}
                                                    id={`forms.${index}.text_inputs.${iindex}.label`}
                                                    variant="filled"
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
                                                  <FormLabel htmlFor={`forms.${index}.text_inputs.${iindex}.type`} display='flex' alignItems='center'>
                                                    <Text marginRight='5px'>Type</Text>
                                                    <Tooltip hasArrow label='Short only allows 1 line of text to be entered versus paragraph allows more then 1 line of text to be entered.' placement='top' shouldWrapChildren bg="blurple">
                                                      <FaQuestionCircle />
                                                    </Tooltip>
                                                  </FormLabel>
                                                  <RadioGroup>
                                                    <Stack direction="row">
                                                      <Field
                                                        name={`forms.${index}.text_inputs.${iindex}.type`}
                                                        type="radio"
                                                        as={Radio}
                                                        id={`forms.${index}.text_inputs.${iindex}.type`}
                                                        variant="filled"
                                                        value="1"
                                                        className='radioText'
                                                      >
                                                        <Text>Short</Text>
                                                      </Field>
                                                      <Field
                                                        name={`forms.${index}.text_inputs.${iindex}.type`}
                                                        type="radio"
                                                        as={Radio}
                                                        id={`forms.${index}.text_inputs.${iindex}.type`}
                                                        variant="filled"
                                                        value="2"
                                                        className='radioText'
                                                      >
                                                        <Text className='radioText'>Paragraph</Text>
                                                      </Field>
                                                    </Stack>
                                                  </RadioGroup>
                                                  <ErrorMessage
                                                    name={`forms.${index}.text_inputs.${iindex}.type`}
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
