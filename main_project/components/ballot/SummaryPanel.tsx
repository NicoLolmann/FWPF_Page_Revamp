import { FwpfModule } from "@/data/modules";

type SummaryPanelProps = {
  selectedModules: Array<FwpfModule | undefined>;
  neverModules: FwpfModule[];
  desiredSws: number;
  desiredModuleCount: number;
  expectedPriorities: number;
};

export function SummaryPanel({
  selectedModules,
  neverModules,
  desiredSws,
  desiredModuleCount,
  expectedPriorities,
}: SummaryPanelProps) {
  const compactSelection = selectedModules.filter(
    (module): module is FwpfModule => Boolean(module),
  );
  const hasEnoughPriorities = compactSelection.length >= expectedPriorities;
  const firstChoiceChance = 84;
  const secondChoiceChance = 96;

  return (
    <section className="pixel-panel p-4 md:p-6">
      <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="min-w-0">
          <p className="font-pixel text-sm font-black uppercase text-ink/70">
            Stimmzettel prüfen
          </p>
          <h2 className="mt-2 font-pixel text-xl font-black sm:text-2xl">Zusammenfassung</h2>
          <p className="mt-3 leading-7">
            Prüfe hier, ob deine Prioritäten breit genug aufgestellt sind. Je mehr
            sinnvolle Alternativen du angibst, desto besser kann die spätere
            Verteilung eine passende Auswahl finden.
          </p>
        </div>
        <div className="grid min-w-0 gap-4 md:grid-cols-3">
          <div className="grid min-h-32 min-w-0 grid-rows-[auto_1fr] border-4 border-ink bg-white p-3 sm:p-4">
            <p className="font-pixel text-xs font-black uppercase">Prioritäten</p>
            <p className="grid place-items-center text-center text-3xl font-black sm:text-4xl">
              <span className="whitespace-nowrap">
                {compactSelection.length} <span className="px-3">/</span>
                {expectedPriorities}
              </span>
            </p>
          </div>
          <div className="grid min-h-32 min-w-0 grid-rows-[auto_1fr] border-4 border-ink bg-white p-3 sm:p-4">
            <p className="font-pixel text-xs font-black uppercase">Erstwahl-Chance</p>
            <p className="grid place-items-center text-center text-3xl font-black sm:text-4xl">
              {firstChoiceChance}%
            </p>
          </div>
          <div className="grid min-h-32 min-w-0 grid-rows-[auto_1fr] border-4 border-ink bg-white p-3 sm:p-4">
            <p className="font-pixel text-xs font-black uppercase">Top-2-Chance</p>
            <p className="grid place-items-center text-center text-3xl font-black sm:text-4xl">
              {secondChoiceChance}%
            </p>
          </div>
        </div>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="border-4 border-ink bg-amber p-4">
          <p className="font-pixel text-sm font-black uppercase">Hinweis</p>
          <p className="mt-2 leading-6">
            Bei {desiredSws} SWS rechnen wir mit {desiredModuleCount}{" "}
            gewünschten Modulen. Dafür sollten mindestens {expectedPriorities}{" "}
            Module priorisiert werden.
          </p>
        </div>
        <div className={`border-4 border-ink p-4 ${hasEnoughPriorities ? "bg-mint" : "bg-coral"}`}>
          <p className="font-pixel text-sm font-black uppercase">
            {hasEnoughPriorities ? "Erfolg" : "Noch zu wenig Auswahl"}
          </p>
          <p className="mt-2 leading-6">
            {hasEnoughPriorities
              ? "Die Mindestanzahl an Prioritäten ist erreicht. Die Prozentwerte orientieren sich an der letzten BA-FWPF-Verteilung und sind keine individuelle Vergabeprognose."
              : `Du kannst den Stimmzettel auch mit weniger Prioritäten abgeben. Es fehlen aber noch ${expectedPriorities - compactSelection.length} Prioritäten zur empfohlenen Auswahlbreite. Dadurch sinkt die Chance, deine Wunschmodule oder überhaupt ein passendes Modul zu bekommen.`}
          </p>
        </div>
      </div>
    </section>
  );
}
