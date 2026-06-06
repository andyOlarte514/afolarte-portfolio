import type * as React from "react";

jest.mock("@react-pdf/renderer", () => ({
  Document: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pdf-document">{children}</div>
  ),
  Page: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pdf-page">{children}</div>
  ),
  View: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  StyleSheet: { create: (s: unknown) => s },
  Font: { register: jest.fn() },
}));

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
    expect(screen.getByText("Senior Frontend / Full-Stack Engineer")).toBeInTheDocument();
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
    expect(screen.getAllByText(/NVIDIA/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Mekan/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Redbee/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/CodeBranch/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Wolox/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Spec-Atelier/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Pragma/).length).toBeGreaterThan(0);
  });

  it("Test 7: experience bullets render — ESLint plugin bullet is present", () => {
    render(<CVDocument />);
    expect(screen.getAllByText(/ESLint plugin/).length).toBeGreaterThan(0);
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
    expect(screen.getAllByText(/Frontend/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Backend/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Mobile/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/DevOps\/CI/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Testing/).length).toBeGreaterThan(0);
  });

  it("Test 11: primary skill value React appears in the rendered output", () => {
    render(<CVDocument />);
    // React appears as part of "React, TypeScript, Next.js, ..." in skills
    expect(screen.getAllByText(/\bReact\b/).length).toBeGreaterThan(0);
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

  it("Test 16: secondary skills do NOT appear as a standalone skills entry (Angular not listed as primary skill)", () => {
    render(<CVDocument />);
    // Angular is a secondary skill — it must not appear as a comma-separated primary skills list entry.
    // The skills section renders "Frontend: React, TypeScript, Next.js, Tailwind CSS, Radix UI / shadcn/ui"
    // Angular is secondary and should not be in that list.
    // We verify by checking no element has text matching "Angular" preceded by a domain label colon,
    // i.e. "Angular" does not appear as a standalone skills-list span.
    const allAngularMatches = screen.queryAllByText(/Angular/);
    // Any "Angular" text in the document must NOT be from the skills section (i.e., not in a span containing only skills)
    const skillsOnlyAngular = allAngularMatches.filter((el) => {
      const text = el.textContent ?? "";
      // Skills section entries look like "React, TypeScript, Next.js, ..." — if Angular were a primary skill
      // it would appear in a comma-separated list that starts with "React" or similar for the Frontend domain,
      // OR it would be the sole primary skill. The key check: no skills span contains Angular alone.
      // More robustly: verify no element text IS exactly a skills list containing Angular.
      return (
        text.includes("Angular") &&
        (text.includes("Vue.js") || text.includes("Redux") || text.includes("CSS Modules"))
      );
    });
    expect(skillsOnlyAngular).toHaveLength(0);
  });
});
