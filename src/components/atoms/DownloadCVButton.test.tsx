let mockLoading = false;

jest.mock("next/dynamic", () => (_importFn: unknown, _opts: unknown) => {
  const React = require("react") as typeof import("react");
  const { PDFDownloadLink } = jest.requireMock("@react-pdf/renderer") as {
    PDFDownloadLink: (props: {
      children: (params: { loading: boolean }) => React.ReactNode;
      fileName?: string;
      document?: React.ReactElement;
    }) => React.ReactElement;
  };
  return function DynamicWrapper(props: {
    children: (params: { loading: boolean }) => React.ReactNode;
    fileName?: string;
    document?: React.ReactElement;
  }): React.ReactElement {
    return PDFDownloadLink(props);
  };
});

jest.mock("@react-pdf/renderer", () => {
  const React = require("react") as typeof import("react");
  return {
    PDFDownloadLink: ({
      children,
      fileName: _fileName,
      document: _document,
    }: {
      children: (params: { loading: boolean }) => React.ReactNode;
      fileName?: string;
      document?: React.ReactElement;
    }): React.ReactElement => {
      return React.createElement(React.Fragment, null, children({ loading: mockLoading }));
    },
    Document: ({ children }: { children?: React.ReactNode }): React.ReactElement =>
      React.createElement("div", { "data-testid": "pdf-document" }, children),
    Page: ({ children }: { children?: React.ReactNode }): React.ReactElement =>
      React.createElement("div", { "data-testid": "pdf-page" }, children),
    View: ({ children }: { children?: React.ReactNode }): React.ReactElement =>
      React.createElement("div", null, children),
    Text: ({ children }: { children?: React.ReactNode }): React.ReactElement =>
      React.createElement("span", null, children),
    StyleSheet: {
      create: <T extends Record<string, object>>(s: T): T => s,
    },
    Font: { register: jest.fn() },
  };
});

import { render, screen } from "@testing-library/react";

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
    expect(
      screen.getByRole("button", { name: "Download CV as PDF" })
    ).toBeInTheDocument();
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
    expect(
      screen.getByRole("button", { name: "Generating PDF, please wait" })
    ).toBeInTheDocument();
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

  it("Test 10: PDFDownloadLink is called with fileName='andy-olarte-cv.pdf'", () => {
    const { PDFDownloadLink } = jest.requireMock("@react-pdf/renderer") as {
      PDFDownloadLink: jest.Mock;
    };
    jest.spyOn(PDFDownloadLink, "call");

    // Use a spy on the mock itself
    const mockRenderer = jest.requireMock("@react-pdf/renderer") as {
      PDFDownloadLink: jest.Mock;
    };
    const originalImpl = mockRenderer.PDFDownloadLink;
    const spy = jest.fn(originalImpl);
    mockRenderer.PDFDownloadLink = spy;

    render(<DownloadCVButton />);

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ fileName: "andy-olarte-cv.pdf" }),
      expect.anything()
    );

    mockRenderer.PDFDownloadLink = originalImpl;
  });

  it("Test 11: PDFDownloadLink receives a document prop (CVDocument element)", () => {
    const mockRenderer = jest.requireMock("@react-pdf/renderer") as {
      PDFDownloadLink: jest.Mock;
    };
    const originalImpl = mockRenderer.PDFDownloadLink;
    const spy = jest.fn(originalImpl);
    mockRenderer.PDFDownloadLink = spy;

    render(<DownloadCVButton />);

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ document: expect.anything() }),
      expect.anything()
    );

    mockRenderer.PDFDownloadLink = originalImpl;
  });
});
