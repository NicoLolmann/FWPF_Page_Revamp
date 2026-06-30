"use client";

import { FwpfModule, categoryLabels, getModuleDetails } from "@/data/modules";
import { StatusBadge } from "@/components/ui/StatusBadge";

type ModuleInfoModalProps = {
  module?: FwpfModule;
  onClose: () => void;
};

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1 border-b-2 border-ink/15 py-3 md:grid-cols-[12rem_1fr]">
      <dt className="font-pixel text-xs font-black uppercase text-ink/70">{label}</dt>
      <dd className="text-[17px] leading-7">{children}</dd>
    </div>
  );
}

export function ModuleInfoModal({ module, onClose }: ModuleInfoModalProps) {
  if (!module) {
    return null;
  }

  const details = getModuleDetails(module);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-ink/45 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="module-info-title"
      onMouseDown={onClose}
    >
      <section
        className="pixel-panel max-h-[88vh] w-full max-w-5xl overflow-auto bg-white p-5 md:p-6"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex flex-wrap items-start justify-between gap-4 border-b-4 border-ink pb-4">
          <div>
            <p className="font-pixel text-xs font-black uppercase text-ink/70">
              Modulinfo
            </p>
            <h2 id="module-info-title" className="mt-2 text-2xl font-black leading-8">
              {module.title}
            </h2>
            <p className="mt-2 text-[17px] leading-7">{details.language}</p>
          </div>
          <button
            className="border-3 border-ink bg-paper px-3 py-2 font-pixel text-xs font-black uppercase shadow-[3px_3px_0_#171717] transition-transform hover:-translate-y-0.5 hover:bg-white active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_#171717]"
            type="button"
            onClick={onClose}
          >
            schließen
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <StatusBadge tone="info">{categoryLabels[module.category]}</StatusBadge>
          <StatusBadge tone="neutral">{module.sws} SWS</StatusBadge>
          {module.tags.map((tag) => (
            <StatusBadge key={tag} tone={tag === "Block" ? "warning" : "neutral"}>
              {tag}
            </StatusBadge>
          ))}
        </div>

        <dl className="mt-5">
          <DetailRow label="Semesterwochenstunden">{module.sws}</DetailRow>
          <DetailRow label="Vorkenntnisse">{details.prerequisites}</DetailRow>
          <DetailRow label="Veranstaltungstyp">{details.courseType}</DetailRow>
          <DetailRow label="Semesterturnus">{details.semester}</DetailRow>
          <DetailRow label="Arbeitsaufwand">
            <ul className="list-disc pl-5">
              {details.workload.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </DetailRow>
          <DetailRow label="Beitrag zu den Zielen des Studiengangs">
            {details.studyGoalContribution}
          </DetailRow>
          <DetailRow label="Lernziel">{details.learningGoals}</DetailRow>
          <DetailRow label="Schlüsselqualifikationen">
            {details.keyQualifications}
          </DetailRow>
          <DetailRow label="Lehrinhalte">
            <ul className="list-disc pl-5">
              {details.contents.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </DetailRow>
          <DetailRow label="Literatur">
            <ul className="grid gap-2">
              {details.literature.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </DetailRow>
          <DetailRow label="Leistungsnachweis">{details.assessment}</DetailRow>
          <DetailRow label="Hilfsmittel">{details.aids}</DetailRow>
          <DetailRow label="Modulverantwortliche/r">{details.responsible}</DetailRow>
        </dl>
      </section>
    </div>
  );
}
