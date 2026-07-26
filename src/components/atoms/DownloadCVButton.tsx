"use client";

import { Download, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";

import CVDocument from "@/components/atoms/CVDocument";
import { Button } from "@/components/ui/button";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

const cvDocument = <CVDocument />;

function DownloadButtonContent({ loading }: { loading: boolean }): React.ReactNode {
  // Use `aria-disabled` (via Base UI's `focusableWhenDisabled`) instead of the
  // native `disabled` HTML attribute. A natively `disabled` control is
  // programmatically un-focusable per the HTML spec: if it is focused right
  // as `loading` flips true, the browser force-blurs it immediately, AND any
  // focus() attempt landing in that same instant (e.g. a fast keyboard-nav or
  // test-automation focus call racing the ~150ms loading window) silently
  // no-ops with no focus/blur event ever firing — there is no reliable signal
  // to "restore" focus from afterward. Keeping the element natively
  // focusable throughout eliminates the race entirely rather than reacting
  // to it: the button is never removed from the tab order, so it can never
  // be force-blurred and a focus() call can never silently fail. Interaction
  // (click / Enter / Space) is still blocked by Base UI's built-in
  // `disabled` handling in this mode.
  return (
    <Button
      variant="outline"
      size="sm"
      disabled={loading}
      focusableWhenDisabled
      aria-label={loading ? "Generating PDF, please wait" : "Download CV as PDF"}
      className="h-9 gap-1 aria-disabled:pointer-events-none aria-disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      ) : (
        <Download className="size-4" aria-hidden="true" />
      )}
      {loading ? "Generating…" : "Download CV"}
    </Button>
  );
}

export default function DownloadCVButton(): React.ReactNode {
  return (
    <PDFDownloadLink document={cvDocument} fileName="andy-olarte-cv.pdf">
      {(params: { loading: boolean }) => <DownloadButtonContent loading={params.loading} />}
    </PDFDownloadLink>
  );
}
