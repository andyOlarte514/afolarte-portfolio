"use client";

import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

import { contactContent } from "@/lib/contactContent";
import { educationContent } from "@/lib/educationContent";
import { experienceContent } from "@/lib/experienceContent";
import { heroContent } from "@/lib/heroContent";
import { skillsContent } from "@/lib/skillsContent";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#1a1a1a",
    backgroundColor: "#ffffff",
    paddingTop: 40,
    paddingBottom: 40,
    paddingLeft: 48,
    paddingRight: 48,
  },
  nameText: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
  },
  title: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a1a",
  },
  sectionHeading: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#000000",
    marginBottom: 4,
  },
  rule: {
    height: 1,
    backgroundColor: "#cccccc",
    marginTop: 4,
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 9,
    fontFamily: "Helvetica",
    color: "#1a1a1a",
    lineHeight: 1.5,
  },
  metadata: {
    fontSize: 9,
    fontFamily: "Helvetica",
    color: "#555555",
    lineHeight: 1.4,
  },
  domainLabel: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a1a",
  },
  entryTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a1a",
    lineHeight: 1.3,
  },
  entryContainer: {
    marginBottom: 12,
  },
  sectionContainer: {
    marginBottom: 12,
  },
});

export default function CVDocument(): React.ReactNode {
  // Contact data extraction via destructuring (safe with noUncheckedIndexedAccess — tuple positions are guaranteed)
  const [emailLink, githubLink] = contactContent.links;

  const email = emailLink.href.replace("mailto:", "");
  const github = githubLink.href.replace("https://", "");
  const phone = contactContent.phone;
  const location = contactContent.location;

  const summaryText = `${heroContent.bio} ${contactContent.pitch}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.sectionContainer}>
          <Text style={styles.nameText}>{heroContent.name}</Text>
          <Text style={styles.title}>{heroContent.title}</Text>
          <Text style={styles.metadata}>
            {email} · {phone} · {github} · {location}
          </Text>
        </View>

        {/* SUMMARY */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeading}>SUMMARY</Text>
          <View style={styles.rule} />
          <Text style={styles.bodyText}>{summaryText}</Text>
        </View>

        {/* EXPERIENCE */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeading}>EXPERIENCE</Text>
          <View style={styles.rule} />
          {experienceContent.map((entry) => (
            <View key={`${entry.company}-${entry.role}`} style={styles.entryContainer}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={styles.entryTitle}>
                  {entry.company} — {entry.role}
                </Text>
                <Text style={styles.metadata}>{entry.dateRange}</Text>
              </View>
              {entry.bullets.map((bullet, bulletIndex) => (
                <View
                  key={bulletIndex}
                  style={{ flexDirection: "row", paddingLeft: 12, marginTop: 4 }}
                >
                  <Text style={styles.bodyText}>{"• "}</Text>
                  <Text style={styles.bodyText}>{bullet}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* SKILLS */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeading}>SKILLS</Text>
          <View style={styles.rule} />
          {skillsContent.map((group) => (
            <View
              key={group.domainKey}
              style={{ flexDirection: "row", marginBottom: 4 }}
            >
              <Text style={styles.domainLabel}>{group.domain}: </Text>
              <Text style={styles.bodyText}>{group.primary.join(", ")}</Text>
            </View>
          ))}
        </View>

        {/* EDUCATION */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeading}>EDUCATION</Text>
          <View style={styles.rule} />
          {educationContent.map((entry) => (
            <View key={entry.institution} style={styles.entryContainer}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={styles.entryTitle}>{entry.institution}</Text>
                <Text style={styles.metadata}>{entry.dateRange}</Text>
              </View>
              <Text style={styles.bodyText}>{entry.qualification}</Text>
              <Text style={styles.bodyText}>{entry.location}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
