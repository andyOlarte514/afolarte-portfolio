"use client";

import { useEffect, useRef, useState } from "react";
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
  const buttonRef = useRef<HTMLButtonElement>(null);
  // `isFocused` is updated exclusively via onFocus/onBlur event handlers
  // (never read/written during render via a ref) so it always reflects the
  // button's focus state up to and including the instant right before a
  // render commits the `disabled` attribute.
  const [isFocused, setIsFocused] = useState(false);
  const [prevLoading, setPrevLoading] = useState(loading);
  const [wasFocusedBeforeLoading, setWasFocusedBeforeLoading] = useState(false);

  // React-sanctioned "adjust state during render" pattern: compare the
  // incoming prop to state (not a ref) to detect the false-to-true loading
  // transition synchronously, before React commits the `disabled` attribute
  // and the browser auto-blurs the element. By the time a useEffect for this
  // transition would run, the browser has already blurred the element, so
  // this capture cannot be deferred to an effect.
  if (loading !== prevLoading) {
    setPrevLoading(loading);
    if (loading) {
      setWasFocusedBeforeLoading(isFocused);
    }
  }

  // Intentionally does not reset `wasFocusedBeforeLoading` after consuming it:
  // the render-phase adjustment above always overwrites it on the *next*
  // false-to-true loading transition (based on the then-current `isFocused`),
  // so a stale `true` value here cannot cause a repeat/unwanted focus() call —
  // this effect only re-runs when `loading` or `wasFocusedBeforeLoading`
  // actually change.
  useEffect(() => {
    if (!loading && wasFocusedBeforeLoading) {
      buttonRef.current?.focus();
    }
  }, [loading, wasFocusedBeforeLoading]);

  return (
    <Button
      ref={buttonRef}
      variant="outline"
      size="sm"
      disabled={loading}
      aria-label={loading ? "Generating PDF, please wait" : "Download CV as PDF"}
      className="h-9 gap-1"
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
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
