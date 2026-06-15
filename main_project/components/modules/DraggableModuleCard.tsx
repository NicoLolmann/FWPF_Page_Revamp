"use client";

import { useDraggable } from "@dnd-kit/core";
import { FwpfModule } from "@/data/modules";
import { ModuleCard } from "@/components/modules/ModuleCard";

type DragOrigin = "available" | "ballot" | "never";

type DraggableModuleCardProps = {
  module: FwpfModule;
  compact?: boolean;
  origin: DragOrigin;
  isActive?: boolean;
  onAddToBallot?: (moduleId: string) => void;
  onMoveToNever?: (moduleId: string) => void;
  onReturnToList?: (moduleId: string) => void;
  onOpenInfo?: (moduleId: string) => void;
};

export function DraggableModuleCard({
  module,
  compact,
  origin,
  isActive = false,
  onAddToBallot,
  onMoveToNever,
  onReturnToList,
  onOpenInfo,
}: DraggableModuleCardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: module.id,
    data: { origin },
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="touch-none"
      style={{ opacity: isDragging || isActive ? 0.45 : 1 }}
    >
      <ModuleCard
        module={module}
        compact={compact}
        draggable
        isDragging={isDragging || isActive}
        onAddToBallot={onAddToBallot}
        onMoveToNever={onMoveToNever}
        onReturnToList={onReturnToList}
        onOpenInfo={onOpenInfo}
      />
    </div>
  );
}
