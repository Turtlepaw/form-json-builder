import React, { useCallback, useEffect, useState } from 'react';
import { useForm, useWatch } from "react-hook-form";
import { Grid } from '@chakra-ui/react';
import Preview from '../components/Preview';
import _DefaultValues from '../DefaultValues.json';
import _ClearedValues from '../ClearedValues.json';
import { Meta } from '../components/Meta';
import { FormAndMessageBuilder, FormBuilder, FormMessageBuilder } from "../util/types";
import { Navigation } from '../components/Navigation';
import { useModal } from '../components/SettingsModal';
import { Editor } from '../components/Editor';
import { useScreenWidth } from '../util/width';
import { fixForm } from '../util/fixForm';
import { debounce } from 'lodash';

const DefaultValues = _DefaultValues as FormAndMessageBuilder;
const defaultValues = DefaultValues as FormAndMessageBuilder;

export enum ComponentType {
  SelectMenu = "SelectMenu",
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
    resetField,
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

  // Get access to the form values using watch
  const formData = watch();

  // Define the fixForm function
  const fixFormFunction = () => {
    fixForm(false, {
      componentType: [componentType, setComponentType],
      getValues,
      resetField,
      setValue,
      toast: undefined as any,
    });
  };

  const formWatch = useWatch({
    control,
    exact: true
  });

  useEffect(() => {
    console.log("value changed");
    fixForm(false, {
      componentType: [componentType, setComponentType],
      getValues,
      resetField,
      setValue,
      formData,
      toast: null as any
    })
  }, [formWatch]);

  return (
    <>
      <Meta>Home</Meta>
      <Navigation displaySection={displaySection} setDisplaySection={setDisplaySection} modalHandler={SettingsModal.modalHandler} />
      <Grid gridTemplateColumns={isNotSmallScreen ? '1fr 1fr' : '1fr'}>
        <Editor resetField={resetField} messageType={messageType} setMessageType={setMessageType} displayForm={displayForm} setDisplayForm={setDisplayForm} watch={watch} getValues={getValues} setValue={setValue} formState={formState} control={control} register={register} reset={reset} displaySection={isNotSmallScreen || displaySection !== 2} componentType={[componentType, setComponentType]} />
        {/* @ts-expect-error */}
        <Preview componentType={componentType} type={messageType} message={watch('message')} forms={watch('forms')} select_menu_placeholder={watch('select_menu_placeholder')} application_command={watch('application_command')} displayForm={displayForm} setDisplayForm={setDisplayForm} displaySection={isNotSmallScreen || displaySection !== 1} />
      </Grid>
    </>
  );
}
