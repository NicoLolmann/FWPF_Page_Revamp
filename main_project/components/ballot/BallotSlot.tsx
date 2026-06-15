"use client";

import { useDroppable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FwpfModule } from "@/data/modules";
import { ModuleCard } from "@/components/modules/ModuleCard";
import { StatusBadge } from "@/components/ui/StatusBadge";

type BallotSlotProps = {
  index: number;
  module?: FwpfModule;
  activeModuleId?: string;
  onReturnModule: (moduleId: string) => void;
  onMoveToNever: (moduleId: string) => void;
  onOpenInfo: (moduleId: string) => void;
};

type FilledBallotSlotProps = BallotSlotProps & {
  module: FwpfModule;
};

function EmptyBallotSlot({ index }: { index: number }) {
  const { isOver, setNodeRef } = useDroppable({
    id: `empty-slot-${index - 1}`,
    data: { type: "ballot-slot", index: index - 1 },
  });

  return (
    <div ref={setNodeRef} className="grid grid-cols-[3.25rem_1fr] gap-3">
      <div className="grid h-full min-h-20 place-items-center border-4 border-ink bg-ink font-pixel text-lg font-black text-white">
        {index}
      </div>
      <div
        className={`grid min-h-20 place-items-center border-4 border-dashed border-ink p-3 text-center font-pixel text-xs font-black uppercase transition-colors ${
          isOver ? "bg-mint" : "bg-paper"
        }`}
      >
        Modul hier ablegen
      </div>
    </div>
  );
}

function FilledBallotSlot({
  index,
  module,
  activeModuleId,
  onReturnModule,
  onMoveToNever,
  onOpenInfo,
}: FilledBallotSlotProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: module.id,
    data: { type: "ballot-item", index: index - 1 },
  });

  return (
    <div
      ref={setNodeRef}
      className="grid grid-cols-[3.25rem_1fr] gap-3"
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 20 : "auto",
      }}
    >
      <div className="grid h-full min-h-20 place-items-center border-4 border-ink bg-ink font-pixel text-lg font-black text-white">
        {index}
      </div>
      <div className="relative touch-none" {...attributes} {...listeners}>
        {index === 1 ? (
          <div className="absolute -right-2 -top-3 z-10 rotate-3">
            <StatusBadge tone="danger">sehr gerne</StatusBadge>
          </div>
        ) : null}
        <ModuleCard
          module={module}
          compact
          draggable
          isDragging={isDragging || activeModuleId === module.id}
          onReturnToList={onReturnModule}
          onMoveToNever={onMoveToNever}
          onOpenInfo={onOpenInfo}
        />
      </div>
    </div>
  );
}

export function BallotSlot(props: BallotSlotProps) {
  if (!props.module) {
    return <EmptyBallotSlot index={props.index} />;
  }

  return <FilledBallotSlot {...props} module={props.module} />;
}
