"use client";

import { useCallback, useState, type ReactNode } from "react";
import { BallotBox } from "@/components/ballot/BallotBox";
import { FwpfWorkflow } from "@/components/workflow/FwpfWorkflow";
import { Header } from "@/components/layout/Header";
import { ImmersiveModeToggle } from "@/components/immersive/ImmersiveModeToggle";
import {
  ImmersivePollingStation,
} from "@/components/immersive/ImmersivePollingStation";
import { ImmersiveStationPaper } from "@/components/immersive/ImmersiveStationPaper";
import type { ImmersiveStationContent } from "@/components/immersive/scene/types";
import { WorkflowStatusContext } from "@/components/workflow/WorkflowStatusContext";
import { WorkflowProgressBar } from "@/components/workflow/WorkflowProgressBar";
import { ElectionCountdown } from "@/components/workflow/ElectionCountdown";

type FwpfPageShellProps = {
  children: ReactNode;
};

export function FwpfPageShell({ children }: FwpfPageShellProps) {
  const [isImmersiveMode, setImmersiveMode] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isWahlrahmenSet, setWahlrahmenSet] = useState(false);
  const [isPrioritizationComplete, setPrioritizationComplete] = useState(false);
  const [arePrioritiesSaved, setPrioritiesSaved] = useState(false);
  const [desiredSws, setDesiredSws] = useState(0);
  const [desiredModuleCount, setDesiredModuleCount] = useState(0);
  const [slotIds, setSlotIds] = useState<string[]>([]);
  const [neverIds, setNeverIds] = useState<string[]>([]);
  const [activeImmersiveStation, setActiveImmersiveStation] =
    useState<ImmersiveStationContent | null>(null);
  const [immersiveResetSignal, setImmersiveResetSignal] = useState(0);
  const [immersiveSubmitAnimationSignal, setImmersiveSubmitAnimationSignal] = useState(0);
  const minimumPrioritySlots = desiredModuleCount * 3;

  function updateWahlrahmenStatus(value: boolean) {
    setWahlrahmenSet(value);
    setPrioritiesSaved(false);
    setIsSubmitted(false);
  }

  const applyWahlrahmen = useCallback(
    ({ sws, moduleCount }: { sws: number; moduleCount: number }) => {
      setDesiredSws(sws);
      setDesiredModuleCount(moduleCount);
      updateWahlrahmenStatus(sws > 0 && moduleCount > 0);
    },
    [],
  );

  const handleImmersiveStationSelect = useCallback(
    (station: ImmersiveStationContent) => {
      setActiveImmersiveStation(station);
    },
    [],
  );

  const closeImmersivePaper = useCallback(() => {
    setActiveImmersiveStation(null);
    setImmersiveResetSignal((current) => current + 1);
  }, []);

  const submitImmersiveBallot = useCallback(() => {
    setImmersiveSubmitAnimationSignal((current) => current + 1);
    setIsSubmitted(true);
  }, []);

  return (
    <WorkflowStatusContext.Provider
      value={{
        isWahlrahmenSet,
        isPrioritizationComplete,
        arePrioritiesSaved,
        isSubmitted,
        setWahlrahmenSet: updateWahlrahmenStatus,
        setPrioritizationComplete,
        setPrioritiesSaved,
      }}
    >
      <Header isSubmitted={isSubmitted} />
      <ImmersiveModeToggle
        enabled={isImmersiveMode}
        onChange={(enabled) => {
          setImmersiveMode(enabled);
          setActiveImmersiveStation(null);
        }}
      />
      {children}
      <FwpfWorkflow
        desiredSws={desiredSws}
        desiredModuleCount={desiredModuleCount}
        minimumPrioritySlots={minimumPrioritySlots}
        slotIds={slotIds}
        neverIds={neverIds}
        setSlotIds={setSlotIds}
        setNeverIds={setNeverIds}
        onApplyWahlrahmen={applyWahlrahmen}
      />
      <section id="abgabe" className="scroll-mt-6">
        <BallotBox
          isSubmitted={isSubmitted}
          onSubmitBallot={() => setIsSubmitted(true)}
          onWithdrawBallot={() => setIsSubmitted(false)}
          onSavePriorities={() => setPrioritiesSaved(true)}
        />
      </section>

      {isImmersiveMode ? (
        <div className="fixed inset-0 z-50 bg-ink">
          <ImmersivePollingStation
            fullScreen
            onStationSelect={handleImmersiveStationSelect}
            resetSignal={immersiveResetSignal}
            submitAnimationSignal={immersiveSubmitAnimationSignal}
            hideStationHint={Boolean(activeImmersiveStation)}
          />
          {!activeImmersiveStation ? (
            <>
              <div className="absolute right-5 top-4 z-30 flex items-start gap-3">
                <ImmersiveModeToggle
                  enabled={isImmersiveMode}
                  onChange={(enabled) => {
                    setImmersiveMode(enabled);
                    setActiveImmersiveStation(null);
                  }}
                  variant="floating"
                />
                <ElectionCountdown variant="hud" />
              </div>
              <div className="absolute left-5 top-5 z-30">
                <WorkflowProgressBar variant="hud" />
              </div>
            </>
          ) : null}
          {activeImmersiveStation ? (
            <ImmersiveStationPaper
              station={activeImmersiveStation}
              desiredSws={desiredSws}
              desiredModuleCount={desiredModuleCount}
              minimumPrioritySlots={minimumPrioritySlots}
              slotIds={slotIds}
              neverIds={neverIds}
              setSlotIds={setSlotIds}
              setNeverIds={setNeverIds}
              isSubmitted={isSubmitted}
              onApplyWahlrahmen={applyWahlrahmen}
              onSavePriorities={() => setPrioritiesSaved(true)}
              onSubmitBallot={submitImmersiveBallot}
              onWithdrawBallot={() => setIsSubmitted(false)}
              onClose={closeImmersivePaper}
            />
          ) : null}
        </div>
      ) : null}
    </WorkflowStatusContext.Provider>
  );
}
