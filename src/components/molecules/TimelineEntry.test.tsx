import React from "react";

import { render, screen } from "@testing-library/react";

import type { WorkEntry } from "@/types/experience";

import TimelineEntry from "./TimelineEntry";

jest.mock("@/components/atoms/CompanyAvatar", () => {
  return function MockCompanyAvatar({ initials }: { initials: string }): React.ReactElement {
    return <div data-testid="company-avatar">{initials}</div>;
  };
});

jest.mock("@/components/atoms/EntryBadge", () => {
  return function MockEntryBadge({ label }: { label: string }): React.ReactElement {
    return <span data-testid="entry-badge">{label}</span>;
  };
});

const nvidiaEntry: WorkEntry = {
  company: "NVIDIA",
  role: "Frontend Engineer / Full-Stack",
  dateRange: "Apr 2025 – Present",
  companyInitials: "NV",
  avatarColor: "#16a34a",
  tags: ["Tech Lead", "Full-stack"],
  bullets: ["Built ESLint plugin", "1,490+ commits"],
};

const pragmaEntry: WorkEntry = {
  company: "Pragma S.A.",
  role: "Front-End Developer",
  dateRange: "Jan 2016 – Sep 2018",
  companyInitials: "PR",
  avatarColor: "#475569",
  bullets: ["Built frontend features"],
};

describe("TimelineEntry", () => {
  describe("NVIDIA fixture (tags present)", () => {
    it("renders company name 'NVIDIA' in the DOM", () => {
      render(<TimelineEntry entry={nvidiaEntry} />);
      expect(screen.getByText("NVIDIA")).toBeInTheDocument();
    });

    it("renders role title containing 'Frontend Engineer'", () => {
      render(<TimelineEntry entry={nvidiaEntry} />);
      expect(screen.getByText(/Frontend Engineer/)).toBeInTheDocument();
    });

    it("renders date range containing 'Apr 2025'", () => {
      render(<TimelineEntry entry={nvidiaEntry} />);
      expect(screen.getByText(/Apr 2025/)).toBeInTheDocument();
    });

    it("renders all bullet point texts", () => {
      render(<TimelineEntry entry={nvidiaEntry} />);
      expect(screen.getByText("Built ESLint plugin")).toBeInTheDocument();
      expect(screen.getByText("1,490+ commits")).toBeInTheDocument();
    });

    it("renders exactly 2 EntryBadge components when tags are present", () => {
      render(<TimelineEntry entry={nvidiaEntry} />);
      expect(screen.getAllByTestId("entry-badge")).toHaveLength(2);
    });

    it("renders CompanyAvatar with initials 'NV'", () => {
      render(<TimelineEntry entry={nvidiaEntry} />);
      expect(screen.getByTestId("company-avatar")).toHaveTextContent("NV");
    });
  });

  describe("Pragma fixture (tags absent)", () => {
    it("renders zero EntryBadge components when tags are absent", () => {
      render(<TimelineEntry entry={pragmaEntry} />);
      expect(screen.queryAllByTestId("entry-badge")).toHaveLength(0);
    });

    it("renders company name 'Pragma S.A.'", () => {
      render(<TimelineEntry entry={pragmaEntry} />);
      expect(screen.getByText("Pragma S.A.")).toBeInTheDocument();
    });
  });
});
