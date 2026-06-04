import React from "react";

import { render, screen } from "@testing-library/react";

import ExperienceTimeline from "./ExperienceTimeline";

jest.mock("@/components/molecules/TimelineEntry", () => {
  return function MockTimelineEntry({
    entry,
  }: {
    entry: { company: string };
  }): React.ReactElement {
    return <li data-testid="timeline-entry">{entry.company}</li>;
  };
});

describe("ExperienceTimeline", () => {
  it("renders h2 heading with text 'Experience'", () => {
    render(<ExperienceTimeline />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Experience");
  });

  it("renders exactly 7 TimelineEntry molecules", () => {
    render(<ExperienceTimeline />);
    expect(screen.getAllByTestId("timeline-entry")).toHaveLength(7);
  });

  it("renders NVIDIA as the first entry", () => {
    render(<ExperienceTimeline />);
    const entries = screen.getAllByTestId("timeline-entry");
    // noUncheckedIndexedAccess: use non-null assertion after length check above
    expect(entries[0]).toHaveTextContent("NVIDIA");
  });

  it("renders Pragma S.A. as the last entry", () => {
    render(<ExperienceTimeline />);
    const entries = screen.getAllByTestId("timeline-entry");
    expect(entries[6]).toHaveTextContent("Pragma");
  });
});
