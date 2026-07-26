import type * as React from "react";

let mockLoading = false;
interface CapturedPDFLinkProps {
  fileName: string | undefined;
  document: React.ReactElement | undefined;
}
let capturedPDFLinkProps: CapturedPDFLinkProps | null = null;

jest.mock("next/dynamic", () => (_importFn: unknown, _opts: unknown) => {
  return function DynamicWrapper(props: {
    children: (params: { loading: boolean }) => React.ReactNode;
    fileName?: string;
    document?: React.ReactElement;
  }): React.ReactElement {
    // Capture props at render time (not at module init time) for spy assertions
    capturedPDFLinkProps = { fileName: props.fileName, document: props.document };
    const renderer = jest.requireMock("@react-pdf/renderer") as {
      PDFDownloadLink: (props: {
        children: (params: { loading: boolean }) => React.ReactNode;
        fileName?: string;
        document?: React.ReactElement;
      }) => React.ReactElement;
    };
    return renderer.PDFDownloadLink(props);
  };
});

jest.mock("@react-pdf/renderer", () => ({
  PDFDownloadLink: ({
    children,
    fileName: _fileName,
    document: _document,
  }: {
    children: (params: { loading: boolean }) => React.ReactNode;
    fileName?: string;
    document?: React.ReactElement;
  }): React.ReactElement => <>{children({ loading: mockLoading })}</>,
  Document: ({ children }: { children?: React.ReactNode }): React.ReactElement => (
    <div data-testid="pdf-document">{children}</div>
  ),
  Page: ({ children }: { children?: React.ReactNode }): React.ReactElement => (
    <div data-testid="pdf-page">{children}</div>
  ),
  View: ({ children }: { children?: React.ReactNode }): React.ReactElement => <div>{children}</div>,
  Text: ({ children }: { children?: React.ReactNode }): React.ReactElement => (
    <span>{children}</span>
  ),
  StyleSheet: {
    create: <T extends Record<string, object>>(s: T): T => s,
  },
  Font: { register: jest.fn() },
}));

import { act, render, screen } from "@testing-library/react";

import DownloadCVButton from "./DownloadCVButton";

describe("DownloadCVButton", () => {
  beforeEach(() => {
    mockLoading = false;
  });

  // Loading=false state (default)

  it("Test 1: renders a button element in the document", () => {
    render(<DownloadCVButton />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("Test 2: button has aria-label 'Download CV as PDF' in default (loading=false) state", () => {
    render(<DownloadCVButton />);
    expect(screen.getByRole("button", { name: "Download CV as PDF" })).toBeInTheDocument();
  });

  it("Test 3: button text contains 'Download CV' in default state", () => {
    render(<DownloadCVButton />);
    expect(screen.getByText("Download CV")).toBeInTheDocument();
  });

  it("Test 4: button is NOT disabled when loading=false", () => {
    render(<DownloadCVButton />);
    expect(screen.getByRole("button")).not.toBeDisabled();
  });

  it("Test 5: Download icon is present (aria-hidden on icon) in loading=false state", () => {
    const { container } = render(<DownloadCVButton />);
    const icon = container.querySelector("svg[aria-hidden='true']");
    expect(icon).toBeInTheDocument();
  });

  // Loading=true state

  it("Test 6: button has aria-label 'Generating PDF, please wait' when loading=true", () => {
    mockLoading = true;
    render(<DownloadCVButton />);
    expect(screen.getByRole("button", { name: "Generating PDF, please wait" })).toBeInTheDocument();
  });

  it("Test 7: button text contains 'Generating…' (unicode ellipsis) when loading=true", () => {
    mockLoading = true;
    render(<DownloadCVButton />);
    expect(screen.getByText("Generating…")).toBeInTheDocument();
  });

  it("Test 8: button IS disabled when loading=true", () => {
    mockLoading = true;
    render(<DownloadCVButton />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("Test 9: Loader2 spinner (animate-spin icon) is present when loading=true", () => {
    mockLoading = true;
    const { container } = render(<DownloadCVButton />);
    const spinner = container.querySelector("svg[aria-hidden='true']");
    expect(spinner).toBeInTheDocument();
  });

  // General: PDFDownloadLink invocation
  // Tests 10 and 11 use capturedPDFLinkProps — the DynamicWrapper mock captures props at render time
  // into this module-level variable so we can inspect them after render.

  it("Test 10: PDFDownloadLink is called with fileName='andy-olarte-cv.pdf'", () => {
    capturedPDFLinkProps = null;
    render(<DownloadCVButton />);
    // Type cast: render() triggers DynamicWrapper which sets capturedPDFLinkProps — safe at runtime
    const captured = capturedPDFLinkProps as CapturedPDFLinkProps | null;
    expect(captured).not.toBeNull();
    expect(captured?.fileName).toBe("andy-olarte-cv.pdf");
  });

  it("Test 11: PDFDownloadLink receives a document prop (CVDocument element)", () => {
    capturedPDFLinkProps = null;
    render(<DownloadCVButton />);
    // Type cast: render() triggers DynamicWrapper which sets capturedPDFLinkProps — safe at runtime
    const captured = capturedPDFLinkProps as CapturedPDFLinkProps | null;
    expect(captured).not.toBeNull();
    expect(captured?.document).toBeDefined();
  });

  // Focus-restoration behavior across a loading=false -> true -> false cycle

  it("Test 12: restores focus to the button after a loading cycle if it was focused right before the disable transition", () => {
    const { rerender } = render(<DownloadCVButton />);
    const button = screen.getByRole("button");

    act(() => {
      button.focus();
    });
    expect(button).toHaveFocus();

    mockLoading = true;
    rerender(<DownloadCVButton />);
    // Simulate the browser's forced blur when a focused control becomes disabled
    act(() => {
      button.blur();
    });
    expect(button).not.toHaveFocus();

    mockLoading = false;
    rerender(<DownloadCVButton />);

    expect(screen.getByRole("button", { name: "Download CV as PDF" })).toHaveFocus();
  });

  it("Test 13: does not steal focus after a loading cycle if the button was never focused beforehand", () => {
    const { rerender } = render(<DownloadCVButton />);
    const button = screen.getByRole("button");
    expect(button).not.toHaveFocus();

    mockLoading = true;
    rerender(<DownloadCVButton />);

    mockLoading = false;
    rerender(<DownloadCVButton />);

    expect(screen.getByRole("button", { name: "Download CV as PDF" })).not.toHaveFocus();
  });
});
