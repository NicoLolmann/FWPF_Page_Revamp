"use client";

import { FwpfModule } from "@/data/modules";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { BallotSlot } from "@/components/ballot/BallotSlot";
import { DraggableModuleCard } from "@/components/modules/DraggableModuleCard";

type BallotPaperProps = {
  slots: Array<FwpfModule | undefined>;
  sortableIds: string[];
  neverModules: FwpfModule[];
  minimumSlotCount: number;
  desiredSws: number;
  desiredModuleCount: number;
  showAppendDropZone: boolean;
  activeModuleId?: string;
  onReturnModule: (moduleId: string) => void;
  onMoveToNever: (moduleId: string) => void;
  onOpenInfo: (moduleId: string) => void;
};

export function BallotPaper({
  slots,
  sortableIds,
  neverModules,
  minimumSlotCount,
  desiredSws,
  desiredModuleCount,
  showAppendDropZone,
  activeModuleId,
  onReturnModule,
  onMoveToNever,
  onOpenInfo,
}: BallotPaperProps) {
  const selectedCount = slots.filter(Boolean).length;
  const { isOver: isAppendOver, setNodeRef: setAppendRef } = useDroppable({
    id: "append-slot",
    data: { type: "ballot-append" },
  });
  const { isOver: isNeverOver, setNodeRef: setNeverRef } = useDroppable({
    id: "never",
    data: { type: "never" },
  });

  return (
    <section className="pixel-panel bg-ballot p-5">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b-4 border-ink pb-4">
        <div>
          <p className="font-pixel text-sm font-black uppercase text-ink/70">
            Mein Stimmzettel
          </p>
          <h2 className="mt-2 font-pixel text-2xl font-black">Prioritäten festlegen</h2>
        </div>
        <div className="border-4 border-ink bg-amber px-3 py-2 font-pixel text-xs font-black uppercase shadow-pixel-sm">
          {selectedCount}/{minimumSlotCount} Mindestauswahl
        </div>
      </div>

      <div className="mt-4 border-4 border-ink bg-paper p-4">
        <p className="font-pixel text-sm font-black uppercase">Prioritätsregel</p>
        <p className="mt-2 text-sm leading-6">
          Ziehe Module aus der linken Liste hierher. Als Orientierung sollten
          mindestens 3 Module pro gewünschtem Modul priorisiert werden. Bei{" "}
          {desiredSws} SWS sind das {desiredModuleCount} gewünschte Module und
          mindestens {minimumSlotCount} Prioritäten. Platz 1 ist die höchste
          Priorität.
        </p>
      </div>

      <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
        <div className="mt-5 grid gap-3">
          {slots.map((module, index) => {
            const slot = index + 1;
            return (
              <BallotSlot
                key={module?.id ?? `empty-${slot}`}
                index={slot}
                module={module}
                activeModuleId={activeModuleId}
                onReturnModule={onReturnModule}
                onMoveToNever={onMoveToNever}
                onOpenInfo={onOpenInfo}
              />
            );
          })}
        </div>
      </SortableContext>

      {showAppendDropZone ? (
        <div
          ref={setAppendRef}
          className={`mt-3 border-4 border-dashed border-ink p-4 text-center font-pixel text-xs font-black uppercase shadow-pixel-sm transition-colors ${
            isAppendOver ? "bg-mint" : "bg-paper"
          }`}
        >
          Weiteren Prioritätsplatz hier hinzufügen
        </div>
      ) : null}

      <div
        ref={setNeverRef}
        className={`mt-6 border-4 border-ink p-4 shadow-pixel-sm transition-colors ${
          isNeverOver ? "bg-amber" : "bg-coral"
        }`}
      >
        <h3 className="font-pixel text-sm font-black uppercase">Auf keinen Fall</h3>
        <p className="mt-2 text-sm leading-6">
          Module hier ablegen, wenn sie nicht besucht werden sollen.
        </p>
        <div className="mt-3 grid gap-3">
          {neverModules.map((module) => (
            <DraggableModuleCard
              key={module.id}
              module={module}
              compact
              origin="never"
              isActive={activeModuleId === module.id}
              onReturnToList={onReturnModule}
              onOpenInfo={onOpenInfo}
            />
          ))}
          {neverModules.length === 0 ? (
            <div className="border-4 border-dashed border-ink bg-white/70 p-4 text-center font-pixel text-xs font-black uppercase">
              Keine Ausschlüsse gesetzt
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
