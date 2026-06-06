import type { EducationEntry } from "@/types/education";

export const educationContent: readonly EducationEntry[] = [
  {
    institution: "SENA",
    qualification: "Análisis y Desarrollo de Sistemas de Información (Tecnología)",
    location: "Medellín, Colombia",
    dateRange: "Ene 2014 – Jun 2016",
  },
] as const;
