import type { ReactNode } from "react";

type InfoCardProps = {
  label: string;
  value: ReactNode;
  detail?: ReactNode;
  tone?: "mint" | "sky" | "amber" | "violet" | "white";
};

const toneClasses = {
  mint: "bg-mint",
  sky: "bg-sky",
  amber: "bg-amber",
  violet: "bg-violet",
  white: "bg-white",
};

export function InfoCard({ label, value, detail, tone = "white" }: InfoCardProps) {
  return (
    <article className={`border-4 border-ink p-4 shadow-pixel-sm ${toneClasses[tone]}`}>
      <p className="font-pixel text-xs font-black uppercase leading-5">{label}</p>
      <h3 className="mt-2 text-xl font-black leading-7">{value}</h3>
      {detail ? <p className="mt-3 text-[17px] leading-7">{detail}</p> : null}
    </article>
  );
}
