"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { ApplicationInput } from "@/schemas/applicationSchema";

type FormState = {
  currentStep: number;
  formData: Partial<
    ApplicationInput["personalInfo"] &
      ApplicationInput["background"] &
      ApplicationInput["readiness"] & {
        gender: string;
        digitalSkill: string;
        readyTime: string;
        firstNameThai: string;
        lastNameThai: string;
        education: string;
        targetGroup: string;
        experience: string;
      }
  >;
};

type FormAction =
  | { type: "SET_STEP"; payload: number }
  | { type: "UPDATE_DATA"; payload: any }
  | { type: "RESET_FORM" };

const initialState: FormState = {
  currentStep: 0,
  formData: {},
};

const FormContext = createContext<
  | {
      currentStep: number;
      formData: FormState["formData"];
      nextStep: () => void;
      prevStep: () => void;
      goToStep: (step: number) => void;
      updateFormData: (data: any) => void;
    }
  | undefined
>(undefined);

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, currentStep: action.payload };
    case "UPDATE_DATA":
      return { ...state, formData: { ...state.formData, ...action.payload } };
    case "RESET_FORM":
      return initialState;
    default:
      return state;
  }
}

export function FormProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(formReducer, initialState);

  useEffect(() => {
    const saved = sessionStorage.getItem("npu_nextgen_form");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        dispatch({ type: "UPDATE_DATA", payload: parsed.formData });
        dispatch({ type: "SET_STEP", payload: parsed.currentStep });
      } catch (e) {
        console.error("Failed to load form state", e);
      }
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("npu_nextgen_form", JSON.stringify(state));
  }, [state]);

  const nextStep = () =>
    dispatch({ type: "SET_STEP", payload: state.currentStep + 1 });
  const prevStep = () =>
    dispatch({ type: "SET_STEP", payload: state.currentStep - 1 });
  const goToStep = (step: number) =>
    dispatch({ type: "SET_STEP", payload: step });
  const updateFormData = (data: any) =>
    dispatch({ type: "UPDATE_DATA", payload: data });

  return (
    <FormContext.Provider
      value={{
        currentStep: state.currentStep,
        formData: state.formData,
        nextStep,
        prevStep,
        goToStep,
        updateFormData,
      }}
    >
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext() {
  const context = useContext(FormContext);
  if (!context)
    throw new Error("useFormContext must be used within FormProvider");
  return context;
}
