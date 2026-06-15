"use client";

import { createContext, useContext } from "react";

type WorkflowStatusContextValue = {
  isWahlrahmenSet: boolean;
  isPrioritizationComplete: boolean;
  arePrioritiesSaved: boolean;
  isSubmitted: boolean;
  setWahlrahmenSet: (value: boolean) => void;
  setPrioritizationComplete: (value: boolean) => void;
  setPrioritiesSaved: (value: boolean) => void;
};

export const WorkflowStatusContext = createContext<WorkflowStatusContextValue | null>(
  null,
);

export function useWorkflowStatus() {
  const context = useContext(WorkflowStatusContext);

  if (!context) {
    throw new Error("useWorkflowStatus must be used within WorkflowStatusContext.Provider");
  }

  return context;
}
