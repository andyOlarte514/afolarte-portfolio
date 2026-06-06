import { educationContent } from "./educationContent";

describe("educationContent", () => {
  it("is a readonly array with exactly 1 element", () => {
    expect(Array.isArray(educationContent)).toBe(true);
    expect(educationContent).toHaveLength(1);
  });

  it("has institution === 'SENA' for the single entry", () => {
    expect(educationContent[0]?.institution).toBe("SENA");
  });

  it("has the correct qualification for the single entry", () => {
    expect(educationContent[0]?.qualification).toBe(
      "Análisis y Desarrollo de Sistemas de Información (Tecnología)"
    );
  });

  it("has location === 'Medellín, Colombia' for the single entry", () => {
    expect(educationContent[0]?.location).toBe("Medellín, Colombia");
  });

  it("has dateRange === 'Ene 2014 – Jun 2016' for the single entry", () => {
    expect(educationContent[0]?.dateRange).toBe("Ene 2014 – Jun 2016");
  });

  it("the exported type EducationEntry has all four required fields (shape test)", () => {
    const entry = educationContent[0];
    expect(entry).toBeDefined();
    expect(typeof entry?.institution).toBe("string");
    expect(typeof entry?.qualification).toBe("string");
    expect(typeof entry?.location).toBe("string");
    expect(typeof entry?.dateRange).toBe("string");
  });
});
