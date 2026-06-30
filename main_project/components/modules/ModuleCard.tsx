import { FwpfModule, categoryLabels, languageLabels } from "@/data/modules";
import { StatusBadge } from "@/components/ui/StatusBadge";

type ModuleCardProps = {
  module: FwpfModule;
  compact?: boolean;
  draggable?: boolean;
  isDragging?: boolean;
  onAddToBallot?: (moduleId: string) => void;
  onMoveToNever?: (moduleId: string) => void;
  onReturnToList?: (moduleId: string) => void;
  onOpenInfo?: (moduleId: string) => void;
};

function statusTone(status: FwpfModule["status"]) {
  if (status === "never") return "danger";
  if (status === "wahlfach") return "info";
  if (status === "alreadyTaken") return "warning";
  return "neutral";
}

function languageClass(language: FwpfModule["language"]) {
  if (language === "en") return "bg-sky";
  if (language === "de-en") return "bg-amber";
  return "bg-paper";
}

function GermanPixelFlag() {
  return (
    <span className="grid h-5 w-8 overflow-hidden border-2 border-ink bg-white">
      <span className="bg-ink" />
      <span className="bg-[#dd1f2f]" />
      <span className="bg-[#ffd43b]" />
    </span>
  );
}

function EnglishPixelFlag() {
  return (
    <span className="relative h-5 w-8 overflow-hidden border-2 border-ink bg-white">
      <span className="absolute inset-x-0 top-0 h-[3px] bg-[#c81d25]" />
      <span className="absolute inset-x-0 top-[5px] h-[3px] bg-[#c81d25]" />
      <span className="absolute inset-x-0 top-[10px] h-[3px] bg-[#c81d25]" />
      <span className="absolute inset-x-0 top-[15px] h-[3px] bg-[#c81d25]" />
      <span className="absolute left-0 top-0 h-[11px] w-[14px] bg-[#1746a2]" />
      <span className="absolute left-[2px] top-[2px] h-[2px] w-[2px] bg-white" />
      <span className="absolute left-[7px] top-[2px] h-[2px] w-[2px] bg-white" />
      <span className="absolute left-[4px] top-[7px] h-[2px] w-[2px] bg-white" />
      <span className="absolute left-[10px] top-[7px] h-[2px] w-[2px] bg-white" />
    </span>
  );
}

function LanguageFlagBadge({ language }: { language: FwpfModule["language"] }) {
  const resolvedLanguage = language ?? "de";

  return (
    <span
      aria-label={`Sprache: ${languageLabels[resolvedLanguage]}`}
      className="flex shrink-0 items-center gap-1"
      title={`Sprache: ${languageLabels[resolvedLanguage]}`}
    >
      {resolvedLanguage === "de" ? <GermanPixelFlag /> : null}
      {resolvedLanguage === "en" ? <EnglishPixelFlag /> : null}
      {resolvedLanguage === "de-en" ? (
        <>
          <GermanPixelFlag />
          <EnglishPixelFlag />
        </>
      ) : null}
    </span>
  );
}

export function ModuleCard({
  module,
  compact = false,
  draggable = false,
  isDragging = false,
  onAddToBallot,
  onMoveToNever,
  onReturnToList,
  onOpenInfo,
}: ModuleCardProps) {
  const hasActions = onAddToBallot || onMoveToNever || onReturnToList;
  const stopDragActivation = (event: React.SyntheticEvent) => {
    event.stopPropagation();
  };

  return (
    <article
      id={`module-card-${module.id}`}
      className={`border-4 border-ink bg-white shadow-pixel-sm ${
        draggable ? "cursor-grab active:cursor-grabbing" : ""
      } ${
        isDragging ? "scale-[0.99] bg-paper opacity-70" : ""
      } ${
        compact ? "p-3" : "p-4"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className={`${compact ? "text-[15px]" : "text-[17px]"} font-black leading-6`}>
          {module.title}
        </h3>
        <div className="flex shrink-0 items-start gap-4">
          <span className="border-3 border-ink bg-paper px-2 py-1 font-pixel text-[13px] font-black">
            {module.sws} SWS
          </span>
          {onOpenInfo ? (
            <button
              aria-label={`Infos zu ${module.title} öffnen`}
              className="grid h-8 w-8 place-items-center border-3 border-ink bg-white font-pixel text-xs font-black shadow-[3px_3px_0_#171717] transition-transform hover:-translate-y-0.5 hover:bg-mint active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_#171717]"
              type="button"
              onPointerDown={stopDragActivation}
              onMouseDown={stopDragActivation}
              onClick={(event) => {
                event.stopPropagation();
                onOpenInfo(module.id);
              }}
            >
              i
            </button>
          ) : null}
        </div>
      </div>
      {!compact ? (
        <p className="mt-2 text-[15px] leading-6 text-ink/75">{categoryLabels[module.category]}</p>
      ) : null}
      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {module.tags.map((tag) => (
            <StatusBadge key={tag} tone={tag === "Block" ? "warning" : "neutral"}>
              {tag}
            </StatusBadge>
          ))}
          {module.status ? (
            <StatusBadge status={module.status} tone={statusTone(module.status)} />
          ) : null}
        </div>
        <LanguageFlagBadge language={module.language} />
      </div>
      {hasActions ? (
        <div className="mt-3 flex flex-wrap gap-2 border-t-2 border-ink pt-3">
          {onAddToBallot ? (
            <button
              className="border-3 border-ink bg-mint px-3 py-2 font-pixel text-[11px] font-black uppercase shadow-[3px_3px_0_#171717] transition-transform hover:-translate-y-0.5 hover:bg-white active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_#171717]"
              type="button"
              onPointerDown={stopDragActivation}
              onMouseDown={stopDragActivation}
              onClick={() => onAddToBallot(module.id)}
            >
              priorisieren
            </button>
          ) : null}
          {onMoveToNever ? (
            <button
              className="border-3 border-ink bg-coral px-3 py-2 font-pixel text-[11px] font-black uppercase shadow-[3px_3px_0_#171717] transition-transform hover:-translate-y-0.5 hover:bg-white active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_#171717]"
              type="button"
              onPointerDown={stopDragActivation}
              onMouseDown={stopDragActivation}
              onClick={() => onMoveToNever(module.id)}
            >
              ausschließen
            </button>
          ) : null}
          {onReturnToList ? (
            <button
              className="border-3 border-ink bg-paper px-3 py-2 font-pixel text-[11px] font-black uppercase shadow-[3px_3px_0_#171717] transition-transform hover:-translate-y-0.5 hover:bg-white active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_#171717]"
              type="button"
              onPointerDown={stopDragActivation}
              onMouseDown={stopDragActivation}
              onClick={() => onReturnToList(module.id)}
            >
              entfernen
            </button>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
