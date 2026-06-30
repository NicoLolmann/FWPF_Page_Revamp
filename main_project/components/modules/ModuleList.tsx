"use client";

import { useEffect, useMemo, useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { FwpfModule } from "@/data/modules";
import { DraggableModuleCard } from "@/components/modules/DraggableModuleCard";

type FilterKey = "alle" | "schwerpunkt" | "ausserhalb" | "block" | "status";

const filters: Array<{ key: FilterKey; label: string }> = [
  { key: "alle", label: "Alle" },
  { key: "schwerpunkt", label: "Schwerpunkt" },
  { key: "ausserhalb", label: "Außerhalb" },
  { key: "block", label: "Block" },
  { key: "status", label: "Status" },
];

type ModuleListProps = {
  modules: FwpfModule[];
  activeModuleId?: string;
  onAddToBallot: (moduleId: string) => void;
  onMoveToNever: (moduleId: string) => void;
  onOpenInfo: (moduleId: string) => void;
};

export function ModuleList({
  modules,
  activeModuleId,
  onAddToBallot,
  onMoveToNever,
  onOpenInfo,
}: ModuleListProps) {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterKey>("alle");
  const { isOver, setNodeRef } = useDroppable({ id: "available" });

  useEffect(() => {
    function handleFocusModule(event: Event) {
      const moduleId = (event as CustomEvent<{ moduleId?: string }>).detail?.moduleId;

      if (!moduleId) {
        return;
      }

      setQuery("");
      setActiveFilter("alle");

      window.setTimeout(() => {
        document.getElementById(`module-card-${moduleId}`)?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 50);
    }

    window.addEventListener("fwpf:focus-module", handleFocusModule);

    return () => {
      window.removeEventListener("fwpf:focus-module", handleFocusModule);
    };
  }, []);

  const filteredModules = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return modules.filter((module) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        module.title.toLowerCase().includes(normalizedQuery) ||
        module.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));

      const matchesFilter =
        activeFilter === "alle" ||
        (activeFilter === "schwerpunkt" && module.category === "schwerpunkt") ||
        (activeFilter === "ausserhalb" && module.category === "ausserhalb") ||
        (activeFilter === "block" && module.tags.includes("Block")) ||
        (activeFilter === "status" && Boolean(module.status));

      return matchesQuery && matchesFilter;
    });
  }, [activeFilter, modules, query]);

  return (
    <section
      ref={setNodeRef}
      className={`pixel-panel p-5 transition-colors ${isOver ? "bg-paper" : ""}`}
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-pixel text-sm font-black uppercase text-ink/70">
            Verfügbare Module
          </p>
          <h2 className="mt-2 font-pixel text-[1.65rem] font-black leading-8">Module wählen</h2>
        </div>
        <div className="border-4 border-ink bg-paper px-3 py-2 font-pixel text-xs font-black shadow-pixel-sm">
          {modules.length} Module verfügbar
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        <label className="sr-only" htmlFor="module-search">
          Module suchen
        </label>
        <input
          id="module-search"
          className="w-full border-4 border-ink bg-white px-4 py-3 text-[16px] shadow-pixel-sm outline-none focus:bg-paper"
          placeholder="Modul suchen..."
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              className={`border-3 border-ink px-3 py-2 font-pixel text-xs font-black shadow-[3px_3px_0_#171717] ${
                activeFilter === filter.key ? "bg-amber" : "bg-white"
              }`}
              key={filter.key}
              type="button"
              onClick={() => setActiveFilter(filter.key)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid max-h-[920px] gap-4 overflow-auto pr-2">
        {filteredModules.map((module) => (
          <DraggableModuleCard
            key={module.id}
            module={module}
            origin="available"
            isActive={activeModuleId === module.id}
            onAddToBallot={onAddToBallot}
            onMoveToNever={onMoveToNever}
            onOpenInfo={onOpenInfo}
          />
        ))}
        {modules.length === 0 ? (
          <div className="border-4 border-dashed border-ink bg-paper p-6 text-center font-pixel text-sm font-black uppercase">
            Alle Module sind eingeordnet
          </div>
        ) : null}
        {modules.length > 0 && filteredModules.length === 0 ? (
          <div className="border-4 border-dashed border-ink bg-paper p-6 text-center font-pixel text-sm font-black uppercase">
            Keine Treffer
          </div>
        ) : null}
      </div>
    </section>
  );
}
