import { ModuleCategory, ModuleStatus, categoryLabels, statusLabels } from "@/data/modules";

type StatusBadgeProps = {
  children?: React.ReactNode;
  category?: ModuleCategory;
  status?: ModuleStatus;
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
};

const toneClasses = {
  neutral: "bg-white text-ink",
  success: "bg-mint text-ink",
  warning: "bg-amber text-ink",
  danger: "bg-coral text-ink",
  info: "bg-sky text-ink",
};

export function StatusBadge({
  children,
  category,
  status,
  tone = "neutral",
}: StatusBadgeProps) {
  if (status === "normal") {
    return null;
  }

  const label =
    children ??
    (status ? statusLabels[status] : category ? categoryLabels[category] : undefined);

  if (!label) {
    return null;
  }

  return (
    <span
      className={`inline-flex border-2 border-ink px-2 py-1 font-pixel text-[11px] font-black uppercase leading-none shadow-[2px_2px_0_#171717] ${toneClasses[tone]}`}
    >
      {label}
    </span>
  );
}
