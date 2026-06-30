"use client";

import { useWorkflowStatus } from "@/components/workflow/WorkflowStatusContext";

type WorkflowProgressBarProps = {
  variant?: "panel" | "hud";
};

const progressSteps = [
  { label: "Wahlrahmen", key: "isWahlrahmenSet" },
  { label: "Priorisierung", key: "isPrioritizationComplete" },
  { label: "Uebernommen", key: "arePrioritiesSaved" },
  { label: "Abgegeben", key: "isSubmitted" },
] as const;

export function WorkflowProgressBar({ variant = "panel" }: WorkflowProgressBarProps) {
  const status = useWorkflowStatus();
  const completedCount = progressSteps.filter((step) => status[step.key]).length;
  const progressPercent = completedCount * 25;
  const progressSprite = `/assets/immersive/sprites/progress-${completedCount}.png`;

  if (variant === "hud") {
    return (
      <div className="flex items-center gap-3" aria-label="Wahlfortschritt">
        <p className="font-pixel text-xl font-black uppercase text-white drop-shadow-[2px_2px_0_#24211e]">
          Wahlfortschritt
        </p>
        <img
          src={progressSprite}
          alt={`${completedCount} von 4 Schritten erledigt`}
          className="h-auto w-72 object-contain [image-rendering:pixelated] drop-shadow-[3px_3px_0_#24211e]"
          draggable={false}
        />
      </div>
    );
  }

  return (
    <section
      className="border-4 border-ink bg-ballot p-4 shadow-pixel sm:p-5"
      aria-label="Wahlfortschritt"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-pixel text-sm font-black uppercase text-ink/70">
            Wahlfortschritt
          </p>
          <p className="mt-1 font-pixel text-xl font-black leading-7">
            {completedCount}/4 Stationen erledigt
          </p>
        </div>
      </div>

      <div className="mt-4 border-4 border-ink bg-white p-1 shadow-pixel-inset">
        <div className="relative h-8 overflow-hidden bg-paper">
          <div
            className="h-full bg-mint transition-[width] duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
          <div className="absolute inset-0 grid grid-cols-4">
            {progressSteps.map((step, index) => (
              <div
                key={step.key}
                className={`border-r-4 border-ink last:border-r-0 ${
                  index < completedCount ? "bg-mint/20" : "bg-transparent"
                }`}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-4">
        {progressSteps.map((step, index) => {
          const complete = status[step.key];

          return (
            <div
              key={step.key}
              className={`border-3 border-ink px-2 py-2 font-pixel text-xs font-black uppercase ${
                complete ? "bg-mint" : "bg-paper"
              }`}
            >
              {index + 1}. {step.label}
            </div>
          );
        })}
      </div>
    </section>
  );
}
