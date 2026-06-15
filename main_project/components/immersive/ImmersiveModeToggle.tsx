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
        className="border-4 border-ink bg-ballot px-4 py-3 font-pixel text-xs font-black uppercase shadow-pixel transition-transform hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_#171717]"
        type="button"
        onClick={() => onChange(!enabled)}
      >
        {enabled ? "Dokumentmodus" : "Immersive Mode"}
      </button>
    );
  }

  return (
    <div className="pixel-panel flex flex-wrap items-center justify-between gap-4 bg-ballot p-4">
      <div>
        <p className="font-pixel text-xs font-black uppercase text-ink/70">
          Ansichtsmodus
        </p>
        <p className="mt-1 font-pixel text-xl font-black">
          {enabled ? "Immersive Wahlraum" : "Dokumentmodus"}
        </p>
      </div>
      <button
        aria-pressed={enabled}
        className={`border-4 border-ink px-4 py-3 font-pixel text-xs font-black uppercase shadow-pixel-sm transition-transform hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_#171717] ${
          enabled ? "bg-coral" : "bg-paper"
        }`}
        type="button"
        onClick={() => onChange(!enabled)}
      >
        {enabled ? "Dokumentmodus" : "Immersive Mode"}
      </button>
    </div>
  );
}
