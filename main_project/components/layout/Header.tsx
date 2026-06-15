import type { ReactNode } from "react";
import { StatusBadge } from "@/components/ui/StatusBadge";

function PersonalHighlight({ children }: { children: ReactNode }) {
  return <span className="font-semibold text-ink">{children}</span>;
}

function PixelBallotIllustration() {
  return (
    <div className="relative h-full min-h-40 min-w-64 border-4 border-ink bg-sky shadow-pixel pixel-corners lg:w-72">
      <div className="absolute left-1/2 top-3 h-24 w-16 -translate-x-1/2 rotate-6 border-4 border-ink bg-ballot shadow-pixel-sm">
        <div className="mx-3 mt-3 h-2 bg-ink" />
        <div className="mx-3 mt-3 h-2 bg-coral" />
        <div className="mx-3 mt-3 h-2 bg-mint" />
        <div className="mx-3 mt-3 h-2 bg-amber" />
      </div>
      <div className="absolute bottom-5 left-1/2 h-28 w-56 -translate-x-1/2 border-4 border-ink bg-sky shadow-pixel-sm">
        <div className="mx-auto mt-5 h-4 w-28 border-4 border-ink bg-ink" />
        <div className="absolute bottom-0 left-0 h-10 w-full border-t-4 border-ink bg-paper" />
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 border-4 border-ink bg-white px-4 py-2 font-pixel text-xs font-black">
          FWPF
        </div>
      </div>
    </div>
  );
}

type HeaderProps = {
  isSubmitted?: boolean;
};

export function Header({ isSubmitted = false }: HeaderProps) {
  return (
    <header className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-stretch">
      <div className="pixel-panel flex min-h-40 flex-col justify-center p-5 md:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="border-2 border-ink bg-white px-2 py-1 font-pixel text-[13px] font-black uppercase shadow-[2px_2px_0_#171717]">
              Max Mustermann
            </span>
            <span className="border-2 border-ink bg-white px-2 py-1 font-pixel text-[13px] font-black uppercase shadow-[2px_2px_0_#171717]">
              Matrikel-Nr. 1234567
            </span>
          </div>
          {isSubmitted ? (
            <StatusBadge tone="success">Einschreibung abgeschlossen</StatusBadge>
          ) : null}
        </div>
        <p className="font-pixel text-xs font-black uppercase tracking-normal text-ink/70">
          Einschreibung zu den FWPF ·{" "}
          <PersonalHighlight>Studienordnung ab 2009/10</PersonalHighlight>
        </p>
        <h1 className="mt-3 max-w-4xl font-pixel text-4xl font-black leading-tight text-ink md:text-6xl">
          FWPF Wahlzettel
        </h1>
        <p className="mt-4 max-w-4xl text-lg leading-7">
          Dein digitaler FWPF-Stimmzettel für das kommende Semester im{" "}
          <PersonalHighlight>Bachelor Wirtschaftsinformatik</PersonalHighlight>.
        </p>
      </div>
      <PixelBallotIllustration />
    </header>
  );
}
