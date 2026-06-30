"use client";

type ImmersiveModeToggleProps = {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  variant?: "panel" | "floating";
};

export function ImmersiveModeToggle({
  enabled,
  onChange,
  variant = "panel",
}: ImmersiveModeToggleProps) {
  if (variant === "floating") {
    return (
      <button
        aria-pressed={enabled}
        className="border-4 border-ink bg-ballot px-5 py-4 font-pixel text-sm font-black uppercase shadow-pixel transition-transform hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_#171717]"
        type="button"
        onClick={() => onChange(!enabled)}
      >
        {enabled ? "Dokumentmodus" : "Immersive Mode"}
      </button>
    );
  }

  return (
    <div className="pixel-panel relative overflow-hidden bg-amber p-4 sm:p-5">
      <div className="absolute inset-y-0 left-0 w-3 bg-ohm" />
      <div className="flex flex-wrap items-center justify-between gap-4 pl-2">
        <div className="min-w-0">
          <p className="font-pixel text-sm font-black uppercase text-ink/75">
            Ansichtsmodus
          </p>
          <p className="mt-1 font-pixel text-[1.65rem] font-black leading-8">
            {enabled ? "Immersive Wahlraum aktiv" : "Wahlraum als Spielszene"}
          </p>
        </div>
        <button
          aria-pressed={enabled}
          className={`immersive-rainbow-button border-4 border-ink px-5 py-4 font-pixel text-sm font-black uppercase shadow-pixel-sm transition-transform hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_#171717] ${
            enabled ? "bg-coral" : "bg-white"
          }`}
          type="button"
          onClick={() => onChange(!enabled)}
        >
          {enabled ? "Dokumentmodus" : "Immersive Mode"}
        </button>
      </div>
    </div>
  );
}
