"use client";

import { useEffect, useState } from "react";

type ElectionCountdownProps = {
  variant?: "header" | "hud";
};

// Prototype deadline. Adjust this ISO timestamp when the real enrollment end is known.
const electionDeadline = new Date("2026-07-15T23:59:59+02:00").getTime();

function getRemainingTime() {
  const totalSeconds = Math.max(0, Math.floor((electionDeadline - Date.now()) / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    totalSeconds,
    days,
    hours,
    minutes,
    seconds,
    isExpired: totalSeconds === 0,
  };
}

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

export function ElectionCountdown({ variant = "header" }: ElectionCountdownProps) {
  const [remaining, setRemaining] = useState(() => getRemainingTime());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setRemaining(getRemainingTime());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const timeLabel = remaining.isExpired
    ? "00:00:00"
    : `${pad(remaining.hours)}:${pad(remaining.minutes)}:${pad(remaining.seconds)}`;

  if (variant === "hud") {
    return (
      <div
        className="hud-election-timer"
        aria-label="Verbleibende Wahlzeit"
      >
        <img
          src="/assets/immersive/sprites/election_timer_frame.png"
          alt=""
          className="hud-election-timer__frame"
          draggable={false}
        />
        <div className="hud-election-timer__time">
          <p className="font-pixel text-xs font-black uppercase leading-none tracking-normal text-[#6f2d32]">
            Wahlzeit
          </p>
          <p className="mt-0.5 font-sans text-[1.12rem] font-black leading-none text-[#24211e]">
            {remaining.days}T {timeLabel}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-w-[17rem] border-3 border-ink bg-ohm-soft px-3 py-1.5 text-center shadow-pixel-sm"
      aria-label="Verbleibende Wahlzeit"
    >
      <p className="font-pixel text-sm font-black uppercase text-ink/75">
        Wahlzeit verbleibend
      </p>
      <p className="mt-0.5 font-sans text-xl font-black leading-none">
        {remaining.days}T {timeLabel}
      </p>
    </div>
  );
}
