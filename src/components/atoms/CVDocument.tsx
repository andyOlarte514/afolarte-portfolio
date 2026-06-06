"use client";

import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

import { contactContent } from "@/lib/contactContent";
import { educationContent } from "@/lib/educationContent";
import { experienceContent } from "@/lib/experienceContent";
import { heroContent } from "@/lib/heroContent";
import { skillsContent } from "@/lib/skillsContent";

const TEAL = "#1b4a5c";
const TEAL_LINK = "#1b7080";
const SIDEBAR_BG = "#c2d6de";
const WHITE = "#ffffff";
const DARK = "#1a1a1a";
const MUTED = "#4a4a4a";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    flexDirection: "row",
    backgroundColor: WHITE,
  },

  // ── Sidebar ──────────────────────────────────────────────
  sidebar: {
    width: "32%",
    backgroundColor: SIDEBAR_BG,
    paddingTop: 32,
    paddingBottom: 32,
    paddingLeft: 18,
    paddingRight: 18,
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: "#8faab5",
    borderRadius: 4,
    marginBottom: 20,
    alignSelf: "center",
  },
  sidebarHeading: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: TEAL,
    textTransform: "uppercase",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  sidebarRule: {
    height: 1.5,
    backgroundColor: TEAL,
    marginBottom: 8,
  },
  sidebarSection: {
    marginBottom: 16,
  },
  sidebarItem: {
    fontSize: 8.5,
    fontFamily: "Helvetica",
    color: DARK,
    lineHeight: 1.6,
    marginBottom: 2,
  },
  sidebarBullet: {
    fontSize: 8.5,
    fontFamily: "Helvetica",
    color: DARK,
    lineHeight: 1.6,
    marginBottom: 3,
  },

  // ── Main ─────────────────────────────────────────────────
  main: {
    width: "68%",
    backgroundColor: WHITE,
    paddingTop: 32,
    paddingBottom: 32,
    paddingLeft: 24,
    paddingRight: 24,
  },
  name: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    color: DARK,
    lineHeight: 1.2,
    marginBottom: 6,
  },
  tagline: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    color: TEAL,
    marginBottom: 8,
  },
  mainRule: {
    height: 1.5,
    backgroundColor: TEAL,
    marginBottom: 14,
  },
  mainSection: {
    marginBottom: 14,
  },
  mainHeading: {
    fontSize: 10.5,
    fontFamily: "Helvetica-Bold",
    color: DARK,
    textTransform: "uppercase",
    marginBottom: 3,
    letterSpacing: 0.3,
  },
  mainSectionRule: {
    height: 1,
    backgroundColor: TEAL,
    marginBottom: 8,
  },

  // ── Work entry ───────────────────────────────────────────
  entryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 1,
  },
  roleText: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: DARK,
    textTransform: "uppercase",
  },
  dateText: {
    fontSize: 8.5,
    fontFamily: "Helvetica",
    color: MUTED,
  },
  companyText: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: TEAL_LINK,
    marginBottom: 4,
  },
  bulletRow: {
    flexDirection: "row",
    paddingLeft: 8,
    marginTop: 2,
  },
  bulletDot: {
    fontSize: 8.5,
    fontFamily: "Helvetica",
    color: DARK,
    lineHeight: 1.5,
    width: 10,
  },
  bulletText: {
    fontSize: 8.5,
    fontFamily: "Helvetica",
    color: DARK,
    lineHeight: 1.5,
    flex: 1,
  },
  entryContainer: {
    marginBottom: 10,
  },

  // ── Education entry ──────────────────────────────────────
  eduRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 1,
  },
  eduTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: DARK,
    textTransform: "uppercase",
  },
  eduSub: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: TEAL_LINK,
    marginBottom: 2,
  },
  eduBody: {
    fontSize: 8.5,
    fontFamily: "Helvetica",
    color: DARK,
  },
});

export default function CVDocument(): React.ReactNode {
  const [emailLink, githubLink] = contactContent.links;
  const email = emailLink.href.replace("mailto:", "");
  const github = githubLink.href.replace("https://", "");

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* ── LEFT SIDEBAR ── */}
        <View style={styles.sidebar}>
          {/* Photo placeholder */}
          <View style={styles.photoPlaceholder} />

          {/* CONTACT */}
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarHeading}>Contact</Text>
            <View style={styles.sidebarRule} />
            <Text style={styles.sidebarItem}>{contactContent.location}</Text>
            <Text style={styles.sidebarItem}>{contactContent.phone}</Text>
            <Text style={styles.sidebarItem}>{email}</Text>
            <Text style={styles.sidebarItem}>{github}</Text>
          </View>

          {/* SKILLS */}
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarHeading}>Experience &amp; Skills</Text>
            <View style={styles.sidebarRule} />
            {skillsContent.map((group) => (
              <View key={group.domainKey} style={{ marginBottom: 6 }}>
                <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: TEAL, marginBottom: 2 }}>
                  {group.domain}
                </Text>
                {group.primary.map((skill) => (
                  <Text key={`${group.domainKey}-${skill}`} style={styles.sidebarBullet}>
                    {"• "}{skill}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        </View>

        {/* ── MAIN CONTENT ── */}
        <View style={styles.main}>

          {/* Name + tagline + separator */}
          <Text style={styles.name}>{heroContent.name}</Text>
          <Text style={styles.tagline}>{heroContent.title}</Text>
          <View style={styles.mainRule} />

          {/* SUMMARY */}
          <View style={styles.mainSection}>
            <Text style={{ fontSize: 8.5, fontFamily: "Helvetica", color: DARK, lineHeight: 1.5 }}>
              {heroContent.bio} {contactContent.pitch}
            </Text>
          </View>

          {/* EDUCATION */}
          <View style={styles.mainSection}>
            <Text style={styles.mainHeading}>Education</Text>
            <View style={styles.mainSectionRule} />
            {educationContent.map((entry) => (
              <View key={entry.institution}>
                <View style={styles.eduRow}>
                  <Text style={styles.eduTitle}>{entry.qualification}</Text>
                  <Text style={styles.dateText}>{entry.dateRange}</Text>
                </View>
                <Text style={styles.eduSub}>
                  <Text>{entry.institution}</Text>
                  <Text style={{ color: MUTED }}> — {entry.location}</Text>
                </Text>
              </View>
            ))}
          </View>

          {/* WORK EXPERIENCE */}
          <View style={styles.mainSection}>
            <Text style={styles.mainHeading}>Work Experience</Text>
            <View style={styles.mainSectionRule} />
            {experienceContent.map((entry) => (
              <View key={`${entry.company}-${entry.role}`} style={styles.entryContainer}>
                <View style={styles.entryRow}>
                  <Text style={styles.roleText}>{entry.role}</Text>
                  <Text style={styles.dateText}>{entry.dateRange}</Text>
                </View>
                <Text style={styles.companyText}>{entry.company}</Text>
                {entry.bullets.map((bullet, i) => (
                  <View key={i} style={styles.bulletRow}>
                    <Text style={styles.bulletDot}>{"• "}</Text>
                    <Text style={styles.bulletText}>{bullet}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>

        </View>
      </Page>
    </Document>
  );
}
