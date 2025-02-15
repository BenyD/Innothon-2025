/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { Page, Text, View, StyleSheet, Image, Font } from "@react-pdf/renderer";
import type { TeamMember } from "@/types/registration";

interface AdmitCardProps {
  teamMember: TeamMember;
  registrationId: string;
  selectedEvents: string[];
  qrCodeDataUrl: string;
}

const getOrdinalSuffix = (year: number): string => {
  if (year === 1) return "st";
  if (year === 2) return "nd";
  if (year === 3) return "rd";
  return "th";
};

Font.register({
  family: "Inter",
  src: `https://vxybvvrsiujnqatmncjt.supabase.co/storage/v1/object/public/innothon/fonts/Inter-Regular.ttf`,
});

Font.register({
  family: "Inter-Bold",
  src: `https://vxybvvrsiujnqatmncjt.supabase.co/storage/v1/object/public/innothon/fonts/Inter-Bold.ttf`,
});

const styles = StyleSheet.create({
  page: {
    padding: "40 60",
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 40,
    marginBottom: 25,
  },
  logo: {
    width: 80,
    height: 80,
    objectFit: "contain",
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontFamily: "Inter-Bold",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: "Inter",
    color: "#4a5568",
  },
  mainContent: {
    flexDirection: "row",
    gap: 40,
    border: "2 solid #e2e8f0",
    borderRadius: 12,
    padding: 30,
  },
  leftSection: {
    flex: 2,
  },
  rightSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 10,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Inter-Bold",
    color: "#2d3748",
    marginBottom: 12,
    textTransform: "uppercase",
  },
  text: {
    fontSize: 13,
    fontFamily: "Inter",
    color: "#4a5568",
    marginBottom: 8,
    lineHeight: 1.4,
  },
  qrCode: {
    width: 140,
    height: 140,
    marginBottom: 12,
  },
  qrText: {
    fontSize: 10,
    color: "#718096",
    textAlign: "center",
    fontFamily: "Inter",
  },
  eventsList: {
    marginTop: 8,
  },
  event: {
    fontSize: 12,
    fontFamily: "Inter",
    color: "#4a5568",
    marginBottom: 6,
    lineHeight: 1.4,
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 60,
    right: 60,
    textAlign: "center",
    fontSize: 10,
    color: "#718096",
    fontFamily: "Inter",
    lineHeight: 1.6,
  },
  divider: {
    borderBottom: "1 solid #e2e8f0",
    marginVertical: 4,
  },
});

export const AdmitCard: React.FC<AdmitCardProps> = ({
  teamMember,
  registrationId,
  selectedEvents,
  qrCodeDataUrl,
}) => (
  <Page size="A4" style={styles.page}>
    <View style={styles.header}>
      <Image
        src="https://vxybvvrsiujnqatmncjt.supabase.co/storage/v1/object/public/innothon/images/hits_logo_black.png"
        style={styles.logo}
      />
      <Image
        src="https://vxybvvrsiujnqatmncjt.supabase.co/storage/v1/object/public/innothon/images/bsp_logo.png"
        style={styles.logo}
      />
    </View>

    <View style={styles.titleContainer}>
      <Text style={styles.title}>Innothon&apos;25</Text>
      <Text style={styles.subtitle}>Official Admit Card</Text>
    </View>

    <View style={styles.mainContent}>
      <View style={styles.leftSection}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Registration Details</Text>
          <Text style={styles.text}>Registration ID: {registrationId}</Text>
          <Text style={styles.text}>Event Date: March 21, 2025</Text>
          <Text style={styles.text}>Reporting Time: 8:30 AM</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Participant Information</Text>
          <Text style={styles.text}>Name: {teamMember.name}</Text>
          <Text style={styles.text}>College: {teamMember.college}</Text>
          <Text style={styles.text}>Department: {teamMember.department}</Text>
          <Text style={styles.text}>
            Year: {teamMember.year}
            {getOrdinalSuffix(parseInt(teamMember.year))} Year
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Registered Events</Text>
          <View style={styles.eventsList}>
            {selectedEvents.map((event, index) => (
              <Text key={index} style={styles.event}>
                • {event}
              </Text>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.rightSection}>
        <Image src={qrCodeDataUrl} style={styles.qrCode} />
        <Text style={styles.qrText}>Scan to verify registration</Text>
      </View>
    </View>

    <Text style={styles.footer}>
      This admit card must be presented along with a valid college ID and
      government photo ID for entry.
      {"\n\n"}
      Organized by Blue Screen Programming Club
      {"\n"}
      Department of Computer Science and Engineering
      {"\n"}
      Hindustan Institute of Technology and Science, Padur, Chennai - 603103
    </Text>
  </Page>
);
