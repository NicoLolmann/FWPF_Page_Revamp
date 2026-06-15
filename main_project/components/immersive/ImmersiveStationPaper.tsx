"use client";

import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { BallotBox } from "@/components/ballot/BallotBox";
import { FwpfChooser } from "@/components/modules/FwpfChooser";
import { RulebookNotice, TimetableModal } from "@/components/rulebook/RulebookNotice";
import { SummaryPanel } from "@/components/ballot/SummaryPanel";
import { SwsPanel } from "@/components/sws/SwsPanel";
import { FwpfModule, modules } from "@/data/modules";
import type { ImmersiveStationContent } from "@/components/immersive/scene/types";

type ImmersiveStationPaperProps = {
  station: ImmersiveStationContent;
  desiredSws: number;
  desiredModuleCount: number;
  minimumPrioritySlots: number;
  slotIds: string[];
  neverIds: string[];
  setSlotIds: Dispatch<SetStateAction<string[]>>;
  setNeverIds: Dispatch<SetStateAction<string[]>>;
  isSubmitted: boolean;
  onApplyWahlrahmen: (selection: { sws: number; moduleCount: number }) => void;
  onSavePriorities: () => void;
  onSubmitBallot: () => void;
  onWithdrawBallot: () => void;
  onClose: () => void;
};

const stationTitles: Record<ImmersiveStationContent, string> = {
  rules: "Regeltisch",
  wahl: "Wahlkabine",
  timetable: "Modulstundenplan",
  review: "Prüftisch & Wahlurne",
};

const paperPositionClasses: Record<ImmersiveStationContent, string> = {
  rules: "inset-x-6 bottom-12 top-12 md:left-[8%] md:right-[40%]",
  wahl: "inset-x-6 bottom-12 top-12 md:inset-x-16",
  timetable: "inset-x-6 bottom-12 top-12 md:inset-x-16",
  review: "inset-x-6 bottom-12 top-12 md:left-[40%] md:right-[8%]",
};

function findModule(moduleId: string) {
  return modules.find((module) => module.id === moduleId);
}

export function ImmersiveStationPaper({
  station,
  desiredSws,
  desiredModuleCount,
  minimumPrioritySlots,
  slotIds,
  neverIds,
  setSlotIds,
  setNeverIds,
  isSubmitted,
  onApplyWahlrahmen,
  onSavePriorities,
  onSubmitBallot,
  onWithdrawBallot,
  onClose,
}: ImmersiveStationPaperProps) {
  const [isClosing, setIsClosing] = useState(false);
  const closeTimerRef = useRef<number | null>(null);
  const selectedModules = Array.from(
    { length: Math.max(minimumPrioritySlots, slotIds.length) },
    (_, index) => (slotIds[index] ? findModule(slotIds[index]) : undefined),
  );
  const neverModules = neverIds
    .map((moduleId) => findModule(moduleId))
    .filter((module): module is FwpfModule => Boolean(module));

  useEffect(() => {
    setIsClosing(false);

    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, [station]);

  function closeWithAnimation() {
    setIsClosing(true);
    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null;
      onClose();
    }, 190);
  }

  function jumpToModule(moduleId: string) {
    window.dispatchEvent(
      new CustomEvent("fwpf:focus-module", {
        detail: { moduleId },
      }),
    );
  }

  if (station === "timetable") {
    return <TimetableModal onClose={onClose} onJumpToModule={jumpToModule} />;
  }

  return (
    <div
      className={`absolute z-20 overflow-hidden border-4 border-ink bg-ballot shadow-pixel ${
        isClosing ? "immersive-paper-exit" : "immersive-paper-enter"
      } ${paperPositionClasses[station]}`}
    >
      <div className="flex items-center justify-between gap-4 border-b-4 border-ink bg-paper px-4 py-3">
        <div>
          <p className="font-pixel text-xs font-black uppercase text-ink/70">
            Aufgefalteter Stimmzettel
          </p>
          <h2 className="mt-1 font-pixel text-xl font-black">
            {stationTitles[station]}
          </h2>
        </div>
        <button
          className="pixel-button bg-white px-3 py-2 text-xs"
          type="button"
          onClick={closeWithAnimation}
        >
          Schließen
        </button>
      </div>

      <div className="h-[calc(100%-84px)] overflow-y-auto bg-[#f8f5ee] p-5">
        {station === "rules" ? <RulebookNotice /> : null}

        {station === "wahl" ? (
          <div className="grid gap-6">
            <section id="immersive-wahlrahmen">
              <SwsPanel
                desiredSws={desiredSws}
                desiredModuleCount={desiredModuleCount}
                minimumPrioritySlots={minimumPrioritySlots}
                onApplyWahlrahmen={onApplyWahlrahmen}
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
              showSummary={false}
              dndId="fwpf-immersive-module-dnd"
            />
          </div>
        ) : null}

        {station === "review" ? (
          <div className="grid gap-6">
            <SummaryPanel
              selectedModules={selectedModules}
              neverModules={neverModules}
              desiredSws={desiredSws}
              desiredModuleCount={desiredModuleCount}
              expectedPriorities={minimumPrioritySlots}
            />
            <BallotBox
              isSubmitted={isSubmitted}
              onSavePriorities={onSavePriorities}
              onSubmitBallot={onSubmitBallot}
              onWithdrawBallot={onWithdrawBallot}
              submitAnimationMode="none"
              showIllustration={false}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
