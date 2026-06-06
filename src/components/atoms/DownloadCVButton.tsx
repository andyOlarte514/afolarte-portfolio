"use client";

import { Download, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";

import CVDocument from "@/components/atoms/CVDocument";
import { Button } from "@/components/ui/button";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

export default function DownloadCVButton(): React.ReactNode {
  return (
    <PDFDownloadLink document={<CVDocument />} fileName="andy-olarte-cv.pdf">
      {(params: { loading: boolean }) => (
        <Button
          variant="outline"
          size="sm"
          disabled={params.loading}
          aria-label={params.loading ? "Generating PDF, please wait" : "Download CV as PDF"}
          className="h-9 gap-1"
        >
          {params.loading ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Download className="size-4" aria-hidden="true" />
          )}
          {params.loading ? "Generating…" : "Download CV"}
        </Button>
      )}
    </PDFDownloadLink>
  );
}
