jest.mock("@react-pdf/renderer", () => {
  const React = require("react");
  return {
    Document: ({ children }: { children: React.ReactNode }) =>
      React.createElement("div", { "data-testid": "pdf-document" }, children),
    Page: ({ children }: { children: React.ReactNode }) =>
      React.createElement("div", { "data-testid": "pdf-page" }, children),
    View: ({ children }: { children: React.ReactNode }) =>
      React.createElement("div", null, children),
    Text: ({ children }: { children: React.ReactNode }) =>
      React.createElement("span", null, children),
    StyleSheet: { create: (s: unknown) => s },
    Font: { register: jest.fn() },
  };
});

import { render, screen } from "@testing-library/react";

import CVDocument from "./CVDocument";

describe("CVDocument", () => {
  it("Test 1: renders without throwing (smoke test)", () => {
    expect(() => render(<CVDocument />)).not.toThrow();
  });

  it("Test 2: renders hero name Andy Francisco Olarte Cardona in the header", () => {
    render(<CVDocument />);
    expect(screen.getByText("Andy Francisco Olarte Cardona")).toBeInTheDocument();
  });

  it("Test 3: renders hero title Senior Frontend / Full-Stack Engineer in the header", () => {
    render(<CVDocument />);
    expect(
      screen.getByText("Senior Frontend / Full-Stack Engineer")
    ).toBeInTheDocument();
  });

  it("Test 4: SUMMARY section contains heroContent.bio substring '10+ years building'", () => {
    render(<CVDocument />);
    const el = screen.getByText(/10\+ years building/);
    expect(el).toBeInTheDocument();
  });

  it("Test 5: SUMMARY section contains contactContent.pitch substring '10+ years delivering'", () => {
    render(<CVDocument />);
    const el = screen.getByText(/10\+ years delivering/);
    expect(el).toBeInTheDocument();
  });

  it("Test 6: all 7 experience company names appear in the document", () => {
    render(<CVDocument />);
    expect(screen.getByText(/NVIDIA/)).toBeInTheDocument();
    expect(screen.getByText(/Mekan/)).toBeInTheDocument();
    expect(screen.getByText(/Redbee/)).toBeInTheDocument();
    expect(screen.getByText(/CodeBranch/)).toBeInTheDocument();
    expect(screen.getByText(/Wolox/)).toBeInTheDocument();
    expect(screen.getByText(/Spec-Atelier/)).toBeInTheDocument();
    expect(screen.getByText(/Pragma/)).toBeInTheDocument();
  });

  it("Test 7: experience bullets render — ESLint plugin bullet is present", () => {
    render(<CVDocument />);
    expect(screen.getByText(/ESLint plugin/)).toBeInTheDocument();
  });

  it("Test 8: education institution SENA appears in the document", () => {
    render(<CVDocument />);
    expect(screen.getByText("SENA")).toBeInTheDocument();
  });

  it("Test 9: education dateRange 'Ene 2014 – Jun 2016' appears in the document", () => {
    render(<CVDocument />);
    expect(screen.getByText("Ene 2014 – Jun 2016")).toBeInTheDocument();
  });

  it("Test 10: all 5 skill domain labels appear in the document", () => {
    render(<CVDocument />);
    expect(screen.getByText(/Frontend/)).toBeInTheDocument();
    expect(screen.getByText(/Backend/)).toBeInTheDocument();
    expect(screen.getByText(/Mobile/)).toBeInTheDocument();
    expect(screen.getByText(/DevOps\/CI/)).toBeInTheDocument();
    expect(screen.getByText(/Testing/)).toBeInTheDocument();
  });

  it("Test 11: primary skill value React appears in the rendered output", () => {
    render(<CVDocument />);
    // React appears as part of "React, TypeScript, Next.js, ..." in skills
    expect(screen.getByText(/\bReact\b/)).toBeInTheDocument();
  });

  it("Test 12: contact email andy.olarte514@gmail.com appears in the document", () => {
    render(<CVDocument />);
    expect(screen.getByText(/andy\.olarte514@gmail\.com/)).toBeInTheDocument();
  });

  it("Test 13: contact phone +57 3013928467 appears in the document", () => {
    render(<CVDocument />);
    expect(screen.getByText(/\+57 3013928467/)).toBeInTheDocument();
  });

  it("Test 14: GitHub URL appears without https:// prefix", () => {
    render(<CVDocument />);
    expect(screen.getByText(/github\.com\/andyOlarte514/)).toBeInTheDocument();
    expect(screen.queryByText(/https:\/\/github\.com/)).not.toBeInTheDocument();
  });

  it("Test 15: LinkedIn does NOT appear anywhere in rendered output", () => {
    render(<CVDocument />);
    expect(screen.queryByText(/LinkedIn/i)).not.toBeInTheDocument();
  });

  it("Test 16: secondary skills do NOT appear (Angular must not be in Skills section output)", () => {
    render(<CVDocument />);
    // Angular is a secondary skill and must NOT appear
    expect(screen.queryByText(/Angular/)).not.toBeInTheDocument();
  });
});
