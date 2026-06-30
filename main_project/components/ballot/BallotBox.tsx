"use client";

import { useState } from "react";

function SubmitBallot({ isAnimating }: { isAnimating: boolean }) {
  return (
    <div
      className={`h-48 w-32 border-4 border-ink bg-white shadow-pixel-sm ${
        isAnimating ? "ballot-submit-animation" : ""
      }`}
      style={
        {
          "--ballot-x": "17.8rem",
          "--ballot-lift": "-70px",
          "--ballot-drop": "126px",
          maxWidth: "8rem",
        } as React.CSSProperties
      }
    >
      <div className="mx-4 mt-4 h-3 bg-ink" />
      <div className="mx-4 mt-4 h-3 bg-coral" />
      <div className="mx-4 mt-4 h-3 bg-mint" />
      <div className="mx-4 mt-4 h-3 bg-amber" />
      <div className="mx-4 mt-4 h-3 bg-paper" />
      <div className="mx-4 mt-4 h-3 bg-sky" />
    </div>
  );
}

type BallotBoxProps = {
  isSubmitted?: boolean;
  onSubmitBallot?: () => void;
  onWithdrawBallot?: () => void;
  onSavePriorities?: () => void;
  submitAnimationMode?: "default" | "none";
  showIllustration?: boolean;
};

export function BallotBox({
  isSubmitted = false,
  onSubmitBallot,
  onWithdrawBallot,
  onSavePriorities,
  submitAnimationMode = "default",
  showIllustration = true,
}: BallotBoxProps) {
  const [animationKey, setAnimationKey] = useState(0);
  const isAnimating = submitAnimationMode === "default" && animationKey > 0;

  function submitBallot() {
    if (submitAnimationMode === "none") {
      onSubmitBallot?.();
      return;
    }

    setAnimationKey((current) => current + 1);
    window.setTimeout(() => {
      setAnimationKey(0);
      onSubmitBallot?.();
    }, 1500);
  }

  function withdrawBallot() {
    setAnimationKey(0);
    onWithdrawBallot?.();
  }

  return (
    <section className="pixel-panel overflow-hidden bg-paper">
      <div
        className={`grid gap-6 p-5 md:items-center md:p-6 ${
          showIllustration ? "md:grid-cols-[minmax(620px,1fr)_auto]" : ""
        }`}
      >
        <div>
          <p className="font-pixel text-sm font-black uppercase text-ink">
            Abgabe
          </p>
          <h2 className="mt-2 font-pixel text-[1.65rem] font-black leading-8">
            Stimmzettel einwerfen
          </h2>
          <p className="mt-3 max-w-2xl text-[18px] leading-8">
            Wirkt alles vollständig, kannst du den Stimmzettel einwerfen. Die
            Auswahl lässt sich in dieser Testansicht wieder zurücknehmen.
          </p>
          <div className="mt-5 grid gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                className="pixel-button bg-white px-4 py-3"
                type="button"
                onClick={onSavePriorities}
              >
                Modulprioritäten übernehmen
              </button>
              <button className="pixel-button bg-white px-4 py-3" type="button">
                Quittung anfordern
              </button>
              {isSubmitted ? (
                <button
                  className="pixel-button bg-white px-4 py-3"
                  type="button"
                  onClick={withdrawBallot}
                >
                  Auswahl zurücknehmen
                </button>
              ) : (
                <button
                  className="pixel-button bg-amber px-4 py-3"
                  type="button"
                  onClick={submitBallot}
                >
                  Stimmzettel einwerfen
                </button>
              )}
            </div>
          </div>
        </div>

        {showIllustration ? (
          <div className="relative h-60 w-full max-w-[31rem] justify-self-center overflow-hidden md:w-[31rem]">
            <div className="absolute bottom-0 right-0 z-10 h-32 w-72 border-4 border-ink bg-sky shadow-pixel" />

            {!isSubmitted || isAnimating ? (
              <div className="absolute left-0 top-4 z-30">
                <SubmitBallot key={animationKey} isAnimating={isAnimating} />
              </div>
            ) : null}

            <div className="absolute bottom-0 right-0 z-40 h-[5.75rem] w-72 border-x-4 border-b-4 border-ink bg-sky">
              <div className="absolute bottom-0 left-0 h-12 w-full border-t-4 border-ink bg-paper" />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 border-4 border-ink bg-white px-4 py-2 font-pixel text-xs font-black">
                FWPF
              </div>
            </div>

            <div className="absolute bottom-[5.75rem] right-[4.5rem] z-50 h-4 w-36 border-4 border-ink bg-ink" />
          </div>
        ) : null}
      </div>
    </section>
  );
}
