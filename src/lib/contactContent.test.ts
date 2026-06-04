import { contactContent } from "./contactContent";

describe("contactContent", () => {
  it("has the correct headline", () => {
    expect(contactContent.headline).toBe("Let's build something great together.");
  });

  it("has a non-empty pitch string", () => {
    expect(contactContent.pitch.length).toBeGreaterThan(0);
  });

  it("has the correct pitch content", () => {
    expect(contactContent.pitch).toBe(
      "Senior engineer with 10+ years delivering production-grade frontends and full-stack systems. Currently leading at NVIDIA and Mekan. Looking for senior remote roles at international companies where craft and scale matter."
    );
  });

  it("has the correct location", () => {
    expect(contactContent.location).toBe("Medellín, Colombia");
  });

  it("has the correct availability text", () => {
    expect(contactContent.availability).toBe("Open to remote opportunities");
  });

  it("has exactly 3 links", () => {
    expect(contactContent.links).toHaveLength(3);
  });

  it("first link is the mail link", () => {
    const mailLink = contactContent.links[0];
    expect(mailLink?.type).toBe("mail");
    expect(mailLink?.href).toBe("mailto:andy.olarte514@gmail.com");
    expect(mailLink?.ariaLabel).toBe("Send Andy an email");
  });

  it("second link is the github link", () => {
    const githubLink = contactContent.links[1];
    expect(githubLink?.type).toBe("github");
    expect(githubLink?.href).toBe("https://github.com/andyOlarte514");
    expect(githubLink?.ariaLabel).toBe("Andy's GitHub profile");
  });

  it("third link is the linkedin link", () => {
    const linkedinLink = contactContent.links[2];
    expect(linkedinLink?.type).toBe("linkedin");
    expect(linkedinLink?.href).toContain("linkedin.com");
    expect(linkedinLink?.ariaLabel).toBe("Andy's LinkedIn profile");
  });

  it("all links have non-empty href, ariaLabel, and type", () => {
    for (const link of contactContent.links) {
      expect(link.href.length).toBeGreaterThan(0);
      expect(link.ariaLabel.length).toBeGreaterThan(0);
      expect(link.type.length).toBeGreaterThan(0);
    }
  });

  it("link types are the expected union values", () => {
    const types = contactContent.links.map((l) => l.type);
    expect(types).toEqual(["mail", "github", "linkedin"]);
  });
});
