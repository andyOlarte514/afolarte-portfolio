"use client";

import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

import { contactContent } from "@/lib/contactContent";
import { educationContent } from "@/lib/educationContent";
import { experienceContent } from "@/lib/experienceContent";
import { heroContent } from "@/lib/heroContent";
import { skillsContent } from "@/lib/skillsContent";

const BLACK = "#000000";
const WHITE = "#ffffff";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    fontFamily: "Helvetica",
    fontSize: 9.5,
    color: BLACK,
    backgroundColor: WHITE,
    paddingTop: 36,
    paddingBottom: 36,
    paddingLeft: 42,
    paddingRight: 42,
  },

  // ── Header ───────────────────────────────────────────────
  name: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: BLACK,
    lineHeight: 1.2,
    marginBottom: 4,
  },
  title: {
    fontSize: 11,
    fontFamily: "Helvetica",
    color: BLACK,
    marginBottom: 10,
  },

  // ── Sections ─────────────────────────────────────────────
  section: {
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 10.5,
    fontFamily: "Helvetica-Bold",
    color: BLACK,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  bodyText: {
    fontSize: 9.5,
    fontFamily: "Helvetica",
    color: BLACK,
    lineHeight: 1.5,
  },

  // ── Skills ───────────────────────────────────────────────
  skillLine: {
    fontSize: 9.5,
    fontFamily: "Helvetica",
    color: BLACK,
    lineHeight: 1.5,
    marginBottom: 2,
  },
  skillDomain: {
    fontFamily: "Helvetica-Bold",
    color: BLACK,
  },

  // ── Experience entry ─────────────────────────────────────
  entryContainer: {
    marginBottom: 8,
  },
  entryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  entryTitle: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    color: BLACK,
  },
  entryDate: {
    fontSize: 9.5,
    fontFamily: "Helvetica",
    color: BLACK,
  },
  bulletText: {
    fontSize: 9.5,
    fontFamily: "Helvetica",
    color: BLACK,
    lineHeight: 1.5,
    marginLeft: 10,
    marginBottom: 1,
  },

  // ── Education entry ──────────────────────────────────────
  eduContainer: {
    marginBottom: 6,
  },
  eduSub: {
    fontSize: 9.5,
    fontFamily: "Helvetica",
    color: BLACK,
  },
});

export default function CVDocument(): React.ReactNode {
  const [emailLink, githubLink] = contactContent.links;
  const email = emailLink.href.replace("mailto:", "");
  const github = githubLink.href.replace("https://", "");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <Text style={styles.name}>{heroContent.name}</Text>
        <Text style={styles.title}>{heroContent.title}</Text>

        {/* CONTACT */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Contact</Text>
          <Text style={styles.bodyText}>
            {contactContent.location} | {contactContent.phone} | {email} | {github}
          </Text>
        </View>

        {/* SUMMARY */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Summary</Text>
          <Text style={styles.bodyText}>
            {heroContent.bio} {contactContent.pitch}
          </Text>
        </View>

        {/* SKILLS */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Skills</Text>
          {skillsContent.map((group) => (
            <Text key={group.domainKey} style={styles.skillLine}>
              <Text style={styles.skillDomain}>{group.domain}: </Text>
              {group.primary.join(", ")}
            </Text>
          ))}
        </View>

        {/* EXPERIENCE */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Experience</Text>
          {experienceContent.map((entry) => (
            <View key={`${entry.company}-${entry.role}`} style={styles.entryContainer}>
              <View style={styles.entryRow}>
                <Text style={styles.entryTitle}>
                  {entry.role} — {entry.company}
                </Text>
                <Text style={styles.entryDate}>{entry.dateRange}</Text>
              </View>
              {entry.bullets.map((bullet, i) => (
                <Text key={i} style={styles.bulletText}>
                  {"• "}
                  {bullet}
                </Text>
              ))}
            </View>
          ))}
        </View>

        {/* EDUCATION */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Education</Text>
          {educationContent.map((entry) => (
            <View key={entry.institution} style={styles.eduContainer}>
              <View style={styles.entryRow}>
                <Text style={styles.entryTitle}>{entry.qualification}</Text>
                <Text style={styles.entryDate}>{entry.dateRange}</Text>
              </View>
              <Text style={styles.eduSub}>
                {entry.institution} — {entry.location}
              </Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
