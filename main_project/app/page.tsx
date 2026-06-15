import { FwpfPageShell } from "@/components/workflow/FwpfPageShell";
import { RulebookNotice } from "@/components/rulebook/RulebookNotice";
import { StepNavigation } from "@/components/layout/StepNavigation";

export default function Home() {
  return (
    <main className="mx-auto grid max-w-[1440px] gap-8 px-4 py-6 md:px-8 md:py-10">
      <FwpfPageShell>
        <StepNavigation />
        <RulebookNotice />
      </FwpfPageShell>
    </main>
  );
}
