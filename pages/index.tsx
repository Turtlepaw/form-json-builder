import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { Grid, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';
import Preview from '../components/Preview';
import _DefaultValues from '../DefaultValues.json';
import _ClearedValues from '../ClearedValues.json';
import { Meta } from '../components/Meta';
import { FormAndMessageBuilder } from "../util/types";
import { Navigation } from '../components/Navigation';
import { useModal } from '../components/SettingsModal';
import { Editor } from '../components/Editor';
import { useScreenWidth } from '../util/width';

const DefaultValues = _DefaultValues as FormAndMessageBuilder;

const defaultValues = DefaultValues as FormAndMessageBuilder;

export default function App() {
  const {
    control,
    register,
    watch,
    getValues,
    reset,
    setValue,
    formState,
    formState: { errors }
  } = useForm<FormAndMessageBuilder>({
    mode: 'onChange',
    defaultValues
  });

  const [displayForm, setDisplayForm] = useState(0);
  const [messageType, setMessageType] = useState("content");

  const SettingsModal = useModal();
  const isSmallScreen = !useScreenWidth(500);


  if(isSmallScreen) {
    return (
      <>
        <Meta>Home</Meta>
        <Navigation {...SettingsModal} />
        <Tabs>
          <TabList>
            <Tab>Editor</Tab>
            <Tab>Preview</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
            <Editor messageType={messageType} setMessageType={setMessageType} displayForm={displayForm} setDisplayForm={setDisplayForm} watch={watch} getValues={getValues} setValue={setValue} formState={formState} control={control} register={register} reset={reset} />
            </TabPanel>
            <TabPanel>
            <Preview type={messageType} message={watch('message')} forms={watch('forms')} displayForm={displayForm} setDisplayForm={setDisplayForm} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </>
    );
  } else {
    return (
      <>
        <Meta>Home</Meta>
        <Navigation {...SettingsModal} />
        <Grid gridTemplateColumns='1fr 1fr'>
          <Editor messageType={messageType} setMessageType={setMessageType} displayForm={displayForm} setDisplayForm={setDisplayForm} watch={watch} getValues={getValues} setValue={setValue} formState={formState} control={control} register={register} reset={reset} />
          <Preview type={messageType} message={watch('message')} forms={watch('forms')} displayForm={displayForm} setDisplayForm={setDisplayForm} />
        </Grid>
      </>
    );
  }

}
