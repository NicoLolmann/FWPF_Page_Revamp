"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { modules } from "@/data/modules";
import { useWorkflowStatus } from "@/components/workflow/WorkflowStatusContext";

function PersonalHighlight({ children }: { children: ReactNode }) {
  return <span className="font-semibold text-ink">{children}</span>;
}

const ruleSections: Array<{
  paragraph: string;
  title: string;
  body: ReactNode;
}> = [
  {
    paragraph: "§ 1",
    title: "Geltungsbereich",
    body: (
      <>
        Diese Hinweise gelten für den Studiengang{" "}
        <PersonalHighlight>Bachelor Wirtschaftsinformatik</PersonalHighlight> nach{" "}
        <PersonalHighlight>Studienordnung ab 2009/10</PersonalHighlight>.
      </>
    ),
  },
  {
    paragraph: "§ 2",
    title: "Zulassung zur FWPF-Wahl",
    body: "FWPF können nur abgelegt werden, wenn alle Module des 1. Studienabschnitts bestanden sind.",
  },
  {
    paragraph: "§ 3",
    title: "Wahlzeitraum im Studium",
    body: "Die FWPF verteilen sich auf Semester 6 und 7. Der konkrete Besuch richtet sich nach Angebot und Stundenplan.",
  },
  {
    paragraph: "§ 4",
    title: "Umfang des Stimmzettels",
    body: "Im Studium sind insgesamt 16 SWS vorgesehen. Davon sollen mindestens 12 SWS aus Modulen im Schwerpunkt Wirtschaftsinformatik stammen.",
  },
  {
    paragraph: "§ 5",
    title: "Prioritätenregel",
    body: "Prioritäten werden aufsteigend ohne Lücken und doppelte Werte vergeben. Kleinere Zahlen bedeuten eine höhere Priorität.",
  },
  {
    paragraph: "§ 6",
    title: "Ausschluss von Modulen",
    body: "Module, die auf keinen Fall besucht werden sollen, werden gesondert markiert und nicht in die gewünschte Prioritätenfolge aufgenommen.",
  },
];

const moduleShortLabels: Record<string, string> = {
  unternehmensgruendung: "UntGr",
  "projektmanagement-trends": "ProjM",
  "operations-research": "OR",
  softwaretest: "SoftTest",
  "sap-hana": "HANA",
  "electronic-commerce": "EComm",
  "sql-nosql": "SQLNoSQL",
  crm: "CRM",
  simulation: "SimSoft",
  "location-based": "OrtApp",
  "technisches-marketing": "TechMark",
  "e-commerce-recht": "EComR",
  guiiv: "GUIIV",
  "technical-computing": "TechComp",
  visualisierung: "Vis",
  mikrocontroller: "MicroOS",
  "embedded-systems": "EmbSys",
  "web-security": "WebSec",
  cms: "CMS",
};

const timetableDays = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"] as const;
const timeSlots = ["08:00", "09:45", "11:30", "14:00", "15:45", "17:30"] as const;

const timetableEntries = [
  { moduleId: "sap-hana", day: "Montag", slot: "08:00", lecturer: "Meier", room: "HQ.405" },
  { moduleId: "sql-nosql", day: "Montag", slot: "09:45", lecturer: "Lang", room: "HQ.305" },
  { moduleId: "unternehmensgruendung", day: "Montag", slot: "11:30", lecturer: "Brockmann", room: "HQ.406" },
  { moduleId: "simulation", day: "Montag", slot: "14:00", lecturer: "Bergler", room: "HQ.205" },
  { moduleId: "web-security", day: "Montag", slot: "15:45", lecturer: "Schmidbauer", room: "SP.483" },
  { moduleId: "web-security", day: "Montag", slot: "17:30", lecturer: "Schmidbauer", room: "SP.483" },
  { moduleId: "electronic-commerce", day: "Dienstag", slot: "08:00", lecturer: "Kiesler", room: "HQ.405" },
  { moduleId: "crm", day: "Dienstag", slot: "09:45", lecturer: "Lang", room: "HQ.305" },
  { moduleId: "softwaretest", day: "Dienstag", slot: "11:30", lecturer: "Dorner", room: "HQ.305" },
  { moduleId: "visualisierung", day: "Dienstag", slot: "14:00", lecturer: "Zapf", room: "HQ.305" },
  { moduleId: "guiiv", day: "Dienstag", slot: "15:45", lecturer: "Platz", room: "HW.209" },
  { moduleId: "guiiv", day: "Dienstag", slot: "17:30", lecturer: "Platz", room: "HW.209" },
  { moduleId: "operations-research", day: "Mittwoch", slot: "08:00", lecturer: "Löhr", room: "SP.468" },
  { moduleId: "projektmanagement-trends", day: "Mittwoch", slot: "09:45", lecturer: "Axenie", room: "SP.468" },
  { moduleId: "technical-computing", day: "Mittwoch", slot: "11:30", lecturer: "Roscher", room: "HQ.406" },
  { moduleId: "location-based", day: "Mittwoch", slot: "14:00", lecturer: "Fuhr", room: "HQ.306" },
  { moduleId: "e-commerce-recht", day: "Mittwoch", slot: "15:45", lecturer: "Bremer", room: "HQ.405" },
  { moduleId: "e-commerce-recht", day: "Mittwoch", slot: "17:30", lecturer: "Bremer", room: "HQ.405" },
  { moduleId: "technisches-marketing", day: "Donnerstag", slot: "08:00", lecturer: "Hein", room: "HW.307" },
  { moduleId: "mikrocontroller", day: "Donnerstag", slot: "09:45", lecturer: "Hufnagel", room: "HQ.013" },
  { moduleId: "embedded-systems", day: "Donnerstag", slot: "11:30", lecturer: "Stappert", room: "HQ.105" },
  { moduleId: "cms", day: "Donnerstag", slot: "14:00", lecturer: "von Zadow", room: "HW.209" },
  { moduleId: "embedded-systems", day: "Donnerstag", slot: "15:45", lecturer: "Stappert", room: "HQ.105" },
  { moduleId: "cms", day: "Donnerstag", slot: "17:30", lecturer: "von Zadow", room: "HW.209" },
  { moduleId: "electronic-commerce", day: "Freitag", slot: "09:45", lecturer: "Kiesler", room: "HQ.405" },
  { moduleId: "crm", day: "Freitag", slot: "11:30", lecturer: "Rausch", room: "HQ.306" },
  { moduleId: "projektmanagement-trends", day: "Freitag", slot: "14:00", lecturer: "Roßleben", room: "HQ.306" },
  { moduleId: "technical-computing", day: "Freitag", slot: "15:45", lecturer: "von Rymon Lipinski", room: "HQ.305" },
  { moduleId: "softwaretest", day: "Freitag", slot: "17:30", lecturer: "Roscher", room: "HQ.406" },
] as const;

export function TimetableModal({
  onClose,
  onJumpToModule,
}: {
  onClose: () => void;
  onJumpToModule: (moduleId: string) => void;
}) {
  const moduleMap = useMemo(
    () => new Map(modules.map((module) => [module.id, module])),
    [],
  );

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-ink/45 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="timetable-title"
      onMouseDown={onClose}
    >
      <section
        className="pixel-panel w-full max-w-7xl overflow-visible bg-white p-4 md:p-5"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-end">
          <button
            className="border-3 border-ink bg-paper px-3 py-2 font-pixel text-xs font-black uppercase shadow-[3px_3px_0_#171717] transition-transform hover:-translate-y-0.5 hover:bg-white active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_#171717]"
            type="button"
            onClick={onClose}
          >
            schließen
          </button>
        </div>

        <div className="bg-white p-2 font-sans text-ink">
          <header className="mb-5 grid grid-cols-[1fr_auto_1fr] items-start gap-4">
            <div className="flex items-start gap-2">
              <span className="text-5xl font-black leading-none text-[#c9232d]">ohm</span>
              <span className="mt-2 text-[10px] leading-3 text-[#c9232d]">
                Technische
                <br />
                Hochschule
                <br />
                Nürnberg
              </span>
              <span className="mt-2 text-[10px] leading-3 text-[#c9232d]">
                Fakultät
                <br />
                Informatik
              </span>
            </div>
            <h2 id="timetable-title" className="pt-3 text-center text-lg font-black">
              FWPF
            </h2>
            <p className="pt-3 text-right text-sm">Sommersemester 2026</p>
          </header>

          <div className="overflow-x-auto pb-2">
            <table className="mx-auto min-w-[980px] table-fixed border-collapse border border-black text-center text-[12px]">
              <thead>
                <tr>
                  <th className="w-14 border border-black py-2" />
                  {timetableDays.map((day) => (
                    <th key={day} className="border border-black py-2 text-sm font-black">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((slot) => (
                  <tr key={slot} className="h-24 align-top">
                    <th className="border border-black px-2 text-left align-middle text-sm font-black">
                      {slot}
                    </th>
                    {timetableDays.map((day) => {
                    const entries = timetableEntries.filter(
                      (entry) => entry.day === day && entry.slot === slot,
                    );

                    return (
                      <td key={`${day}-${slot}`} className="border border-black p-2 align-top">
                        <div className="grid gap-3">
                          {entries.map((entry) => {
                            const module = moduleMap.get(entry.moduleId);

                            if (!module) {
                              return null;
                            }

                            const shortLabel = moduleShortLabels[module.id] ?? module.title;

                            return (
                              <div
                                key={`${entry.moduleId}-${day}-${slot}`}
                                className="group relative"
                              >
                                <button
                                  className="cursor-pointer bg-transparent p-0 font-black underline decoration-ink/30 decoration-2 underline-offset-2 outline-none hover:decoration-ink focus-visible:bg-amber"
                                  type="button"
                                  onClick={() => onJumpToModule(module.id)}
                                >
                                  {shortLabel}
                                </button>
                                <div className="pointer-events-none absolute left-1/2 top-full z-[70] mt-2 hidden w-56 -translate-x-1/2 border-3 border-ink bg-ballot p-3 text-left shadow-pixel-sm group-hover:block group-focus-within:block">
                                  <p className="font-pixel text-[11px] font-black uppercase text-ink/70">
                                    Modul
                                  </p>
                                  <p className="mt-1 text-sm font-black leading-5">
                                    {module.title}
                                  </p>
                                  <p className="mt-2 text-xs leading-5">
                                    {module.sws} SWS · {entry.lecturer} · {entry.room}
                                  </p>
                                </div>
                                <div>{entry.lecturer}</div>
                                <div>{entry.room}</div>
                              </div>
                            );
                          })}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
              </tbody>
            </table>
          </div>

          <footer className="mt-2 flex justify-between text-xs">
            <p>Abkürzungen anklicken oder per Hover anzeigen</p>
            <p>13.01.2026</p>
          </footer>
        </div>
      </section>
    </div>
  );
}

export function RulebookNotice() {
  const [isTimetableOpen, setIsTimetableOpen] = useState(false);
  const {
    isWahlrahmenSet,
    isPrioritizationComplete,
    arePrioritiesSaved,
    isSubmitted,
  } = useWorkflowStatus();
  const validityChecks = [
    { label: "Wahlrahmen gesetzt", complete: isWahlrahmenSet },
    { label: "Priorisierung durchgeführt", complete: isPrioritizationComplete },
    { label: "Prioritäten übernommen", complete: arePrioritiesSaved },
    { label: "Stimmzettel abgegeben", complete: isSubmitted },
  ];

  function jumpToModule(moduleId: string) {
    setIsTimetableOpen(false);
    window.dispatchEvent(
      new CustomEvent("fwpf:focus-module", {
        detail: { moduleId },
      }),
    );
  }

  return (
    <section id="wahlordnung" className="grid scroll-mt-6 gap-4">
      <article className="pixel-panel bg-ballot p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b-4 border-ink pb-5">
          <div>
            <p className="font-pixel text-xs font-black uppercase text-ink/60">
              Regelwerk
            </p>
            <h3 className="mt-2 font-pixel text-2xl font-black">
              Regelblatt für deinen digitalen Stimmzettel
            </h3>
          </div>
          <div className="grid gap-2 text-right font-pixel text-xs font-black uppercase">
            <span className="border-3 border-ink bg-paper px-3 py-2 shadow-[2px_2px_0_#171717]">
              Aktenzeichen FWPF-BA-WI-2009/10
            </span>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="border-3 border-ink bg-paper p-3">
            <p className="font-pixel text-xs font-black uppercase text-ink/70">
              Studiengang
            </p>
            <p className="mt-1 font-black">Bachelor Wirtschaftsinformatik</p>
          </div>
          <div className="border-3 border-ink bg-paper p-3">
            <p className="font-pixel text-xs font-black uppercase text-ink/70">
              Studienordnung
            </p>
            <p className="mt-1 font-black">ab 2009/10</p>
          </div>
          <div className="border-3 border-ink bg-paper p-3">
            <p className="font-pixel text-xs font-black uppercase text-ink/70">
              Wahlumfang
            </p>
            <p className="mt-1 font-black">16 SWS gesamt · 12 SWS Schwerpunkt</p>
          </div>
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="border-4 border-ink bg-white">
            {ruleSections.map((rule, index) => (
              <section
                key={rule.paragraph}
                className={`grid gap-4 p-4 md:grid-cols-[4rem_minmax(0,1fr)] ${
                  index === 0 ? "" : "border-t-4 border-ink"
                }`}
              >
                <div className="grid h-12 w-16 place-items-center border-3 border-ink bg-paper font-pixel text-sm font-black shadow-[2px_2px_0_#171717]">
                  {rule.paragraph}
                </div>
                <div>
                  <h4 className="font-pixel text-sm font-black uppercase">
                    {rule.title}
                  </h4>
                  <p className="mt-2 leading-6">{rule.body}</p>
                </div>
              </section>
            ))}
          </div>

          <aside className="grid h-full gap-3 xl:grid-rows-[1fr_auto]">
            <div className="flex h-full flex-col border-4 border-ink bg-paper p-3">
              <p className="font-pixel text-sm font-black uppercase">
                Gültigkeitscheck
              </p>
              <div className="grid flex-1 content-center gap-5">
                {validityChecks.map((check) => (
                  <div
                    key={check.label}
                    className="flex items-center gap-2 border-3 border-ink bg-white px-2 py-2"
                  >
                    <span
                      className={`grid h-7 w-7 shrink-0 place-items-center border-3 border-ink font-pixel text-base font-black leading-none shadow-[2px_2px_0_#171717] ${
                        check.complete ? "bg-mint" : "bg-coral"
                      }`}
                    >
                      {check.complete ? "✓" : "✕"}
                    </span>
                    <p className="text-sm leading-5">{check.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              className="border-4 border-ink bg-coral p-3 text-left shadow-pixel-sm transition-transform hover:-translate-y-0.5 hover:bg-white active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_#171717]"
              type="button"
              onClick={() => setIsTimetableOpen(true)}
            >
              <span className="font-pixel text-sm font-black uppercase">
                Stundenplan beachten
              </span>
              <span className="mt-2 block text-sm leading-6">
                Öffne den aktuellen Stundenplan und prüfe die Verteilung der Module.
              </span>
            </button>
          </aside>
        </div>
      </article>

      {isTimetableOpen ? (
        <TimetableModal
          onClose={() => setIsTimetableOpen(false)}
          onJumpToModule={jumpToModule}
        />
      ) : null}
    </section>
  );
}
