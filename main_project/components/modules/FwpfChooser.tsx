"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragOverEvent,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { FwpfModule, modules } from "@/data/modules";
import { BallotPaper } from "@/components/ballot/BallotPaper";
import { ModuleList } from "@/components/modules/ModuleList";
import { ModuleCard } from "@/components/modules/ModuleCard";
import { ModuleInfoModal } from "@/components/modules/ModuleInfoModal";
import { SummaryPanel } from "@/components/ballot/SummaryPanel";
import { useWorkflowStatus } from "@/components/workflow/WorkflowStatusContext";

function findModule(moduleId: string) {
  return modules.find((module) => module.id === moduleId);
}

type FwpfChooserProps = {
  desiredSws: number;
  desiredModuleCount: number;
  minimumPrioritySlots: number;
  slotIds: string[];
  neverIds: string[];
  setSlotIds: Dispatch<SetStateAction<string[]>>;
  setNeverIds: Dispatch<SetStateAction<string[]>>;
  showSummary?: boolean;
  dndId?: string;
};

export function FwpfChooser({
  desiredSws,
  desiredModuleCount,
  minimumPrioritySlots,
  slotIds,
  neverIds,
  setSlotIds,
  setNeverIds,
  showSummary = true,
  dndId = "fwpf-module-dnd",
}: FwpfChooserProps) {
  const [activeModuleId, setActiveModuleId] = useState<string | undefined>();
  const [infoModuleId, setInfoModuleId] = useState<string | undefined>();
  const { setPrioritizationComplete, setPrioritiesSaved } = useWorkflowStatus();
  const dragSnapshot = useRef<{ slotIds: string[]; neverIds: string[] } | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const selectedIds = useMemo(
    () => new Set([...slotIds, ...neverIds]),
    [neverIds, slotIds],
  );

  const availableModules = modules.filter((module) => !selectedIds.has(module.id));

  const displayedSlotCount = Math.max(minimumPrioritySlots, slotIds.length);
  const slotModules = Array.from({ length: displayedSlotCount }, (_, index) =>
    slotIds[index] ? findModule(slotIds[index]) : undefined,
  );
  const neverModules = neverIds
    .map((moduleId) => findModule(moduleId))
    .filter((module): module is FwpfModule => Boolean(module));
  const activeModule = activeModuleId ? findModule(activeModuleId) : undefined;
  const infoModule = infoModuleId ? findModule(infoModuleId) : undefined;

  useEffect(() => {
    const isComplete = minimumPrioritySlots > 0 && slotIds.length >= minimumPrioritySlots;
    setPrioritizationComplete(isComplete);
    setPrioritiesSaved(false);
  }, [minimumPrioritySlots, setPrioritizationComplete, setPrioritiesSaved, slotIds]);

  function removeModule(moduleId: string) {
    setActiveModuleId(undefined);
    setSlotIds((current) => current.filter((id) => id !== moduleId));
    setNeverIds((current) => current.filter((id) => id !== moduleId));
  }

  function dropToSlot(slotIndex: number, moduleId: string) {
    setActiveModuleId(undefined);
    setNeverIds((current) => current.filter((id) => id !== moduleId));
    setSlotIds((current) => {
      const next = current.filter((id) => id !== moduleId);
      const targetIndex = Math.min(slotIndex, next.length);
      next.splice(targetIndex, 0, moduleId);
      return next;
    });
  }

  function dropToAppend(moduleId: string) {
    dropToSlot(slotIds.length, moduleId);
  }

  function dropToNever(moduleId: string) {
    setActiveModuleId(undefined);
    setSlotIds((current) => current.filter((id) => id !== moduleId));
    setNeverIds((current) =>
      current.includes(moduleId) ? current : [...current, moduleId],
    );
  }

  function restoreDragSnapshot() {
    if (!dragSnapshot.current) {
      return;
    }

    setSlotIds(dragSnapshot.current.slotIds);
    setNeverIds(dragSnapshot.current.neverIds);
    dragSnapshot.current = null;
  }

  function finishDrag() {
    setActiveModuleId(undefined);
    dragSnapshot.current = null;
  }

  function insertIntoBallot(activeId: string, overId: string) {
    setNeverIds((current) => current.filter((id) => id !== activeId));
    setSlotIds((current) => {
      const currentIndex = current.indexOf(activeId);
      const overIndex = current.indexOf(overId);

      if (currentIndex >= 0 && overIndex >= 0) {
        return currentIndex === overIndex
          ? current
          : arrayMove(current, currentIndex, overIndex);
      }

      const next = current.filter((id) => id !== activeId);
      let targetIndex = next.length;

      if (overId.startsWith("empty-slot-")) {
        targetIndex = Number(overId.replace("empty-slot-", ""));
      } else if (overId !== "append-slot") {
        const nextOverIndex = next.indexOf(overId);
        targetIndex = nextOverIndex >= 0 ? nextOverIndex : next.length;
      }

      next.splice(Math.min(targetIndex, next.length), 0, activeId);
      return next;
    });
  }

  function handleDragStart(event: DragStartEvent) {
    const activeId = String(event.active.id);
    dragSnapshot.current = { slotIds, neverIds };
    setActiveModuleId(activeId);
  }

  function handleDragOver(event: DragOverEvent) {
    const overId = event.over?.id ? String(event.over.id) : undefined;
    const activeId = String(event.active.id);

    if (!overId || overId === "available" || overId === "never") {
      return;
    }

    if (
      overId === "append-slot" ||
      overId.startsWith("empty-slot-") ||
      slotIds.includes(overId)
    ) {
      insertIntoBallot(activeId, overId);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const overId = event.over?.id ? String(event.over.id) : undefined;
    const activeId = String(event.active.id);

    if (!overId) {
      restoreDragSnapshot();
      setActiveModuleId(undefined);
      return;
    }

    if (overId === "available") {
      removeModule(activeId);
      finishDrag();
      return;
    }

    if (overId === "never") {
      dropToNever(activeId);
      finishDrag();
      return;
    }

    if (
      overId === "append-slot" ||
      overId.startsWith("empty-slot-") ||
      slotIds.includes(overId)
    ) {
      insertIntoBallot(activeId, overId);
    }

    finishDrag();
  }

  return (
    <DndContext
      id={dndId}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={() => {
        restoreDragSnapshot();
        setActiveModuleId(undefined);
      }}
    >
      <section
        id="faecher-waehlen"
        className="grid scroll-mt-6 items-start gap-6 xl:grid-cols-[minmax(360px,0.95fr)_minmax(520px,1.35fr)]"
      >
        <ModuleList
          modules={availableModules}
          activeModuleId={activeModuleId}
          onAddToBallot={dropToAppend}
          onMoveToNever={dropToNever}
          onOpenInfo={setInfoModuleId}
        />
        <BallotPaper
          slots={slotModules}
          sortableIds={slotIds}
          neverModules={neverModules}
          minimumSlotCount={minimumPrioritySlots}
          desiredSws={desiredSws}
          desiredModuleCount={desiredModuleCount}
          showAppendDropZone={slotIds.length >= displayedSlotCount}
          activeModuleId={activeModuleId}
          onReturnModule={removeModule}
          onMoveToNever={dropToNever}
          onOpenInfo={setInfoModuleId}
        />
      </section>
      {showSummary ? (
        <section id="stimmzettel-pruefen" className="scroll-mt-6">
          <SummaryPanel
            selectedModules={slotModules}
            neverModules={neverModules}
            desiredSws={desiredSws}
            desiredModuleCount={desiredModuleCount}
            expectedPriorities={minimumPrioritySlots}
          />
        </section>
      ) : null}
      <DragOverlay>
        {activeModule ? (
          <div className="w-[min(520px,calc(100vw-2rem))] rotate-1">
            <ModuleCard module={activeModule} compact draggable />
          </div>
        ) : null}
      </DragOverlay>
      <ModuleInfoModal module={infoModule} onClose={() => setInfoModuleId(undefined)} />
    </DndContext>
  );
}
