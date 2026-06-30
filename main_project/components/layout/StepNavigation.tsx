"use client";

import { useEffect, useState } from "react";

const steps = [
  { id: "wahlordnung", label: "Regelwerk" },
  { id: "wahlrahmen", label: "Wahlrahmen" },
  { id: "faecher-waehlen", label: "Module wählen" },
  { id: "stimmzettel-pruefen", label: "Stimmzettel prüfen" },
  { id: "abgabe", label: "Abgabe" },
];

export function StepNavigation() {
  const [activeId, setActiveId] = useState(steps[0].id);

  useEffect(() => {
    const updateActiveStep = () => {
      const sections = steps
        .map((step) => document.getElementById(step.id))
        .filter((section): section is HTMLElement => Boolean(section));

      const anchorLine = window.innerHeight * 0.35;
      const currentSection =
        sections
          .filter((section) => section.getBoundingClientRect().top <= anchorLine)
          .at(-1) ?? sections[0];

      if (currentSection) {
        setActiveId(currentSection.id);
      }
    };

    updateActiveStep();
    window.addEventListener("scroll", updateActiveStep, { passive: true });
    window.addEventListener("resize", updateActiveStep);

    return () => {
      window.removeEventListener("scroll", updateActiveStep);
      window.removeEventListener("resize", updateActiveStep);
    };
  }, []);

  function jumpToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setActiveId(id);
  }

  return (
    <nav aria-label="Wahlprozess" className="pixel-panel overflow-hidden bg-ballot">
      <ol className="grid grid-cols-1 md:grid-cols-5">
        {steps.map((step, index) => {
          const isActive = activeId === step.id;

          return (
            <li
              key={step.id}
              className={`border-b-4 border-ink md:border-b-0 md:border-r-4 ${
                index === steps.length - 1 ? "md:border-r-0" : ""
              }`}
            >
              <button
                className={`flex h-full w-full items-center gap-3 px-4 py-4 text-left transition-colors ${
                  isActive ? "bg-amber" : "bg-white hover:bg-paper"
                }`}
                type="button"
                aria-current={isActive ? "step" : undefined}
                onClick={() => jumpToSection(step.id)}
              >
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center border-3 border-ink font-sans text-lg font-black leading-none shadow-pixel-sm ${
                    isActive ? "bg-white text-ink" : "bg-paper text-ink"
                  }`}
                >
                  {index + 1}
                </span>
                <span className="font-pixel text-base font-black uppercase leading-tight">
                  {step.label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
