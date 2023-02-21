import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { Grid, Tabs, TabList, Tab, TabPanels, TabPanel, Text } from '@chakra-ui/react';
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

export enum ComponentType {
  SelectMenu = "SELECT_MENU",
  Button = "Button"
}

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
  const [displaySection, setDisplaySection] = useState(1);
  const [componentType, setComponentType] = useState(ComponentType.Button);
  const SettingsModal = useModal();
  const isNotSmallScreen = useScreenWidth(500);

  return (
    <>
      <Meta>Home</Meta>
      <Navigation displaySection={displaySection} setDisplaySection={setDisplaySection} {...SettingsModal} />
      <Grid gridTemplateColumns={isNotSmallScreen ? '1fr 1fr' : '1fr'}>
        <Editor messageType={messageType} setMessageType={setMessageType} displayForm={displayForm} setDisplayForm={setDisplayForm} watch={watch} getValues={getValues} setValue={setValue} formState={formState} control={control} register={register} reset={reset} displaySection={isNotSmallScreen || displaySection !== 2} componentType={[componentType, setComponentType]} />
        <Preview type={messageType} message={watch('message')} forms={watch('forms')} displayForm={displayForm} setDisplayForm={setDisplayForm} displaySection={isNotSmallScreen || displaySection !== 1} />
      </Grid>
    </>
  );
}
