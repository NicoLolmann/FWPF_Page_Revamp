"use client";

import { useEffect, useState } from "react";

type PixelProgressProps = {
  label: string;
  current: number;
  target: number;
  caption?: string;
  tone: "mint" | "sky" | "amber";
};

type SwsPanelProps = {
  desiredSws: number;
  desiredModuleCount: number;
  minimumPrioritySlots: number;
  onApplyWahlrahmen: (selection: { sws: number; moduleCount: number }) => void;
};

const toneClasses = {
  mint: "bg-[#6fbf7a]",
  sky: "bg-[#c9232d]",
  amber: "bg-[#d6b25e]",
};

const swsOptions = [0, 2, 4, 6, 8, 10];
const alreadyBookedTotalSws = 6;
const alreadyBookedFocusSws = 4;
const totalTargetSws = 16;
const focusTargetSws = 12;

function getModuleCountOptions(sws: number) {
  if (sws === 0) {
    return [0];
  }

  const minimum = Math.max(1, Math.ceil(sws / 4));
  const maximum = Math.max(minimum, Math.floor(sws / 2));

  return Array.from({ length: maximum - minimum + 1 }, (_, index) => minimum + index);
}

function clampModuleCount(sws: number, moduleCount: number) {
  const options = getModuleCountOptions(sws);

  if (options.includes(moduleCount)) {
    return moduleCount;
  }

  return options[0];
}

function PixelProgress({ label, current, target, caption, tone }: PixelProgressProps) {
  const width = Math.min(100, Math.round((current / target) * 100));

  return (
    <div className="h-full border-4 border-ink bg-white p-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <h3 className="font-pixel text-sm font-black uppercase">{label}</h3>
        <p className="font-pixel text-sm font-black">
          {current}/{target} SWS
        </p>
      </div>
      <div className="mt-3 h-8 border-4 border-ink bg-white p-1 shadow-pixel-inset">
        <div className={`h-full ${toneClasses[tone]}`} style={{ width: `${width}%` }} />
      </div>
      {caption ? <p className="mt-3 text-[17px] leading-7">{caption}</p> : null}
    </div>
  );
}

export function SwsPanel({
  desiredSws,
  desiredModuleCount,
  minimumPrioritySlots,
  onApplyWahlrahmen,
}: SwsPanelProps) {
  const [draftSws, setDraftSws] = useState(desiredSws);
  const [draftModuleCount, setDraftModuleCount] = useState(desiredModuleCount);

  useEffect(() => {
    setDraftSws(desiredSws);
    setDraftModuleCount(desiredModuleCount);
  }, [desiredSws, desiredModuleCount]);

  const minSws = swsOptions[0];
  const maxSws = swsOptions.at(-1) ?? 10;
  const moduleCountOptions = getModuleCountOptions(draftSws);
  const draftPrioritySlots = draftModuleCount * 3;
  const totalAfterWish = alreadyBookedTotalSws + draftSws;
  const sliderProgress = Math.round(((draftSws - minSws) / (maxSws - minSws)) * 100);
  const hasUnappliedChanges =
    draftSws !== desiredSws || draftModuleCount !== desiredModuleCount;

  function updateDraftSws(nextSws: number) {
    setDraftSws(nextSws);
    setDraftModuleCount((current) => clampModuleCount(nextSws, current));
  }

  return (
    <section className="pixel-panel p-4 md:p-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4 border-b-4 border-ink pb-5">
        <div className="max-w-3xl">
          <p className="font-pixel text-sm font-black uppercase text-ink/70">Wahlrahmen</p>
          <h2 className="mt-2 font-pixel text-xl font-black leading-8 sm:text-[1.65rem]">
            Semesterwochenstunden festlegen
          </h2>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2 lg:items-stretch">
        <div className="flex h-full flex-col border-4 border-ink bg-paper p-3 sm:p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="border-4 border-ink bg-white p-3 shadow-pixel-sm sm:p-4">
              <p className="font-pixel text-xs font-black uppercase text-ink/70">
                Gewünschte SWS
              </p>
              <p className="mt-2 font-pixel text-3xl font-black sm:text-4xl">{draftSws}</p>
              <p className="mt-2 text-[17px] leading-7">
                Wähle in 2-SWS-Schritten.
              </p>
            </div>
            <div className="border-4 border-ink bg-white p-3 shadow-pixel-sm sm:p-4">
              <p className="font-pixel text-xs font-black uppercase text-ink/70">
                Modulanzahl
              </p>
              <p className="mt-2 font-pixel text-3xl font-black sm:text-4xl">{draftModuleCount}</p>
              <p className="mt-2 text-[17px] leading-7">
                Kombiniere 2- und 4-SWS-Module.
              </p>
            </div>
          </div>

          <label
            className="mt-5 font-pixel text-sm font-black uppercase"
            htmlFor="desired-sws-slider"
          >
            SWS auswählen
          </label>
          <input
            id="desired-sws-slider"
            className="pixel-range mt-3 w-full"
            min={minSws}
            max={maxSws}
            step={2}
            type="range"
            value={draftSws}
            style={{
              background: `linear-gradient(to right, #c9232d 0 ${sliderProgress}%, #ffffff ${sliderProgress}% 100%)`,
            }}
            onChange={(event) => updateDraftSws(Number(event.target.value))}
          />

          <div className="mt-5 border-t-4 border-ink pt-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-pixel text-sm font-black uppercase">
                Module für diesen Umfang
              </p>
              {draftSws > 0 ? (
                <p className="font-pixel text-sm font-black uppercase text-ink/70">
                  mind. {draftPrioritySlots} Prioritäten
                </p>
              ) : null}
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {moduleCountOptions.map((option) => (
                <button
                  key={option}
                  className={`border-3 border-ink px-3 py-3 font-pixel text-xs font-black uppercase shadow-[2px_2px_0_#171717] ${
                    draftModuleCount === option ? "bg-amber" : "bg-white"
                  }`}
                  type="button"
                  onClick={() => setDraftModuleCount(option)}
                >
                  {option === 0
                    ? "keine Module"
                    : `${option} ${option === 1 ? "Modul" : "Module"}`}
                </button>
              ))}
            </div>
          </div>

        </div>

        <div className="grid h-full gap-4 md:grid-cols-2 md:grid-rows-[auto_1fr]">
          <PixelProgress
            label="Schwerpunkt"
            current={alreadyBookedFocusSws}
            target={focusTargetSws}
            caption=""
            tone="mint"
          />
          <PixelProgress
            label="Gesamt nach Wunsch"
            current={totalAfterWish}
            target={totalTargetSws}
            caption=""
            tone="sky"
          />
          <div className="flex h-full flex-col justify-between border-4 border-ink bg-paper p-3 sm:p-4 md:col-span-2">
            <div>
              <p className="font-pixel text-sm font-black uppercase">
                Finaler Wahlrahmen
              </p>
              <p className="mt-2 text-3xl font-black">{desiredSws} SWS</p>
              <p className="mt-2 text-[17px] leading-7">
                {desiredModuleCount === 0
                  ? "Noch kein Wahlrahmen übernommen."
                  : `${desiredModuleCount} Module gewählt: mindestens ${minimumPrioritySlots} Prioritäten.`}
              </p>
            </div>
            {hasUnappliedChanges ? (
              <p className="mt-4 border-3 border-ink bg-amber px-3 py-2 font-pixel text-xs font-black uppercase">
                Neuer Wert noch nicht übernommen!
              </p>
            ) : null}
            <button
              className="pixel-button mt-4 w-fit px-4 py-3"
              type="button"
              onClick={() =>
                onApplyWahlrahmen({ sws: draftSws, moduleCount: draftModuleCount })
              }
            >
              Wahlrahmen übernehmen
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
