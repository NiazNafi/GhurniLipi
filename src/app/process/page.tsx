import type { Metadata } from "next";

import { CtaBand } from "@/components/CtaBand";
import { ProcessContent } from "@/components/ProcessContent";

export const metadata: Metadata = {
  title: "কীভাবে হয় / How this works",
  description:
    "ঘূর্ণিলিপির কাজের ধরন — কত সময় লাগে, কী কী পাওয়া যায়, কোন নাম হয় না, আর টাকার হিসাব। Turnaround, deliverables, revisions, and which name pairs will not work.",
  alternates: { canonical: "/process" },
};

export default function ProcessPage() {
  return (
    <>
      <ProcessContent />
      <CtaBand />
    </>
  );
}
