"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import {
  personalInfoSchema,
  backgroundSchema,
  readinessSchema,
} from "@/schemas/applicationSchema";
import { z } from "zod";

// Derive types directly from Zod schemas — single source of truth
type PersonalInfoData = z.infer<typeof personalInfoSchema>;
type BackgroundData = z.infer<typeof backgroundSchema>;
type ReadinessData = z.infer<typeof readinessSchema>;

// All fields optional and undefined-safe (compatible with Zod inferred types)
export type FormData = Partial<
  PersonalInfoData & BackgroundData & ReadinessData
>;

type FormState = {
  currentStep: number;
  formData: FormData;
};

type FormAction =
  | { type: "SET_STEP"; payload: number }
  | { type: "UPDATE_DATA"; payload: FormData }
  | { type: "RESET_FORM" };

type FormContextValue = {
  currentStep: number;
  formData: FormData;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  updateFormData: (data: FormData) => void;
};

const initialState: FormState = {
  currentStep: 0,
  formData: {},
};

const FormContext = createContext<FormContextValue | undefined>(undefined);

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, currentStep: action.payload };
    case "UPDATE_DATA":
      // Return new object — never mutate in place (ECC Immutability rule)
      return { ...state, formData: { ...state.formData, ...action.payload } };
    case "RESET_FORM":
      return initialState;
    default:
      return state;
  }
}

export function FormProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(formReducer, initialState);

  // Restore from sessionStorage on mount
  useEffect(() => {
    const saved = sessionStorage.getItem("npu_nextgen_form");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as FormState;
        dispatch({ type: "UPDATE_DATA", payload: parsed.formData });
        dispatch({ type: "SET_STEP", payload: parsed.currentStep });
      } catch (e) {
        console.error("Failed to load form state", e);
      }
    }
  }, []);

  // Persist to sessionStorage on every state change
  useEffect(() => {
    sessionStorage.setItem("npu_nextgen_form", JSON.stringify(state));
  }, [state]);

  const nextStep = () =>
    dispatch({ type: "SET_STEP", payload: state.currentStep + 1 });
  const prevStep = () =>
    dispatch({ type: "SET_STEP", payload: state.currentStep - 1 });
  const goToStep = (step: number) =>
    dispatch({ type: "SET_STEP", payload: step });
  const updateFormData = (data: FormData) =>
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

export function useFormContext(): FormContextValue {
  const context = useContext(FormContext);
  if (!context)
    throw new Error("useFormContext must be used within FormProvider");
  return context;
}
