import type { Metadata } from "next";

import { ChatFallback } from "@/components/ChatFallback";
import { CommissionForm } from "@/components/CommissionForm";
import { HonestyNote } from "@/components/HonestyNote";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "নাম করান / Commission a piece",
  description:
    "আপনার নাম বা যুগলের নাম দিয়ে ঘূর্ণন-আম্বিগ্রাম করান। নামগুলো পাঠান, আমি জানাবো লেখাটি সম্ভব কি না। Commission a rotational ambigram of your name, or a couple's pair, in Bangla or Latin script.",
  alternates: { canonical: "/commission" },
};

/**
 * Reads `?product=` on the server so the right tier is already selected in the
 * HTML. Doing it in a client effect instead would either flash the wrong radio
 * or disagree with the server on hydration. This opts the page into dynamic
 * rendering, which costs nothing here — it is a form, not a content page.
 */
export default async function CommissionPage({
  searchParams,
}: PageProps<"/commission">) {
  const { product } = await searchParams;
  const requested = Array.isArray(product) ? product[0] : product;

  return (
    <div className="mx-auto max-w-3xl px-4 pt-10 pb-20 sm:px-6 sm:pt-14">
      <SectionHeading
        kicker="navCommission"
        title="commissionTitle"
        body="commissionIntro"
      />

      {/* Said up front and kindly, as requirements §4.8 asks. */}
      <HonestyNote />

      <CommissionForm requestedProduct={requested} />

      <ChatFallback />
    </div>
  );
}
