"use client";

import type { Dispatch, SetStateAction } from "react";
import { FwpfChooser } from "@/components/modules/FwpfChooser";
import { SwsPanel } from "@/components/sws/SwsPanel";
import { useWorkflowStatus } from "@/components/workflow/WorkflowStatusContext";

type FwpfWorkflowProps = {
  desiredSws: number;
  desiredModuleCount: number;
  minimumPrioritySlots: number;
  slotIds: string[];
  neverIds: string[];
  setSlotIds: Dispatch<SetStateAction<string[]>>;
  setNeverIds: Dispatch<SetStateAction<string[]>>;
  onApplyWahlrahmen: (selection: { sws: number; moduleCount: number }) => void;
  showSummary?: boolean;
  dndId?: string;
};

export function FwpfWorkflow({
  desiredSws,
  desiredModuleCount,
  minimumPrioritySlots,
  slotIds,
  neverIds,
  setSlotIds,
  setNeverIds,
  onApplyWahlrahmen,
  showSummary = true,
  dndId,
}: FwpfWorkflowProps) {
  const { setWahlrahmenSet } = useWorkflowStatus();

  return (
    <>
      <section id="wahlrahmen" className="scroll-mt-6">
        <SwsPanel
          desiredSws={desiredSws}
          desiredModuleCount={desiredModuleCount}
          minimumPrioritySlots={minimumPrioritySlots}
          onApplyWahlrahmen={({ sws, moduleCount }) => {
            onApplyWahlrahmen({ sws, moduleCount });
            setWahlrahmenSet(sws > 0 && moduleCount > 0);
          }}
        />
      </section>
      <FwpfChooser
        desiredSws={desiredSws}
        desiredModuleCount={desiredModuleCount}
        minimumPrioritySlots={minimumPrioritySlots}
        slotIds={slotIds}
        neverIds={neverIds}
        setSlotIds={setSlotIds}
        setNeverIds={setNeverIds}
        showSummary={showSummary}
        dndId={dndId}
      />
    </>
  );
}
