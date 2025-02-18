/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { Page, Text, View, StyleSheet, Image, Font } from "@react-pdf/renderer";
import type { TeamMember } from "@/types/registration";

interface AdmitCardProps {
  teamMember: TeamMember;
  registrationId: string;
  selectedEvents: string[];
  qrCodeDataUrl: string;
  teamId: string;
}

// Register Geist font
Font.register({
  family: "Geist",
  fonts: [
    { 
      src: "https://jycgacsicczslkfiazkw.supabase.co/storage/v1/object/public/beny//Geist-Regular.otf",
      fontWeight: 400 
    },
    { 
      src: "https://jycgacsicczslkfiazkw.supabase.co/storage/v1/object/public/beny//Geist-SemiBold.otf",
      fontWeight: 600 
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#ffffff',
    fontFamily: 'Geist',
  },
  borderContainer: {
    border: '2 solid #000',
    padding: 20,
    height: '100%',
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    borderBottom: '1 solid #000',
    paddingBottom: 15,
  },
  logo: {
    width: 50,
    height: 50,
  },
  titleContainer: {
    marginLeft: 15,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 600,
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 600,
    color: '#1a1a1a',
    backgroundColor: '#f0f0f0',
    padding: '6 10',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 6,
    padding: '3 10',
  },
  label: {
    width: '35%',
    fontSize: 10,
    color: '#444444',
    fontWeight: 400,
  },
  value: {
    flex: 1,
    fontSize: 10,
    color: '#000000',
    fontWeight: 600,
  },
  eventsList: {
    padding: '0 10',
  },
  event: {
    fontSize: 10,
    marginBottom: 4,
    color: '#000000',
  },
  qrSection: {
    position: 'absolute',
    right: 20,
    top: 90,
    alignItems: 'center',
  },
  qrCode: {
    width: 80,
    height: 80,
  },
  qrText: {
    fontSize: 8,
    color: '#666666',
    marginTop: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  footerText: {
    fontSize: 8,
    color: '#666666',
    textAlign: 'center',
  },
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) rotate(-45deg)',
    fontSize: 50,
    color: '#f0f0f0',
    opacity: 0.5,
  },
  idSection: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
    padding: '0 10',
  },
  idBox: {
    flex: 1,
    padding: 8,
    backgroundColor: '#f7f7f7',
    borderRadius: 4,
  },
  idLabel: {
    fontSize: 8,
    color: '#666666',
    marginBottom: 2,
  },
  idValue: {
    fontSize: 9,
    color: '#000000',
    fontWeight: 600,
  },
});

export const AdmitCard = ({ teamMember, registrationId, selectedEvents, qrCodeDataUrl, teamId }: AdmitCardProps) => (
  <Page size="A5" style={styles.page}>
    <View style={styles.borderContainer}>
      {/* Watermark */}
      <Text style={styles.watermark}>INNOTHON&apos;25</Text>

      {/* Header */}
      <View style={styles.header}>
        <Image
          src="https://jycgacsicczslkfiazkw.supabase.co/storage/v1/object/public/beny//hits-logo-black.png"
          style={styles.logo}
        />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>INNOTHON&apos;25</Text>
          <Text style={styles.subtitle}>ADMIT CARD</Text>
        </View>
      </View>

      {/* ID Section */}
      <View style={styles.idSection}>
        <View style={styles.idBox}>
          <Text style={styles.idLabel}>Team ID</Text>
          <Text style={styles.idValue}>{teamId}</Text>
        </View>
        <View style={styles.idBox}>
          <Text style={styles.idLabel}>Registration ID</Text>
          <Text style={styles.idValue}>{registrationId}</Text>
        </View>
      </View>

      {/* Participant Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Participant Details</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{teamMember.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>College</Text>
          <Text style={styles.value}>{teamMember.college}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Department</Text>
          <Text style={styles.value}>{teamMember.department}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{teamMember.email}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Phone</Text>
          <Text style={styles.value}>{teamMember.phone}</Text>
        </View>
      </View>

      {/* Events */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Registered Events</Text>
        <View style={styles.eventsList}>
          {selectedEvents.map((event, index) => (
            <Text key={index} style={styles.event}>
              {index + 1}. {event}
            </Text>
          ))}
        </View>
      </View>

      {/* QR Code */}
      <View style={styles.qrSection}>
        <Image src={qrCodeDataUrl} style={styles.qrCode} />
        <Text style={styles.qrText}>Scan to verify</Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          March 21, 2025 • Hindustan Institute of Technology and Science{"\n"}
          This admit card must be presented at the venue for entry • Not transferable
        </Text>
      </View>
    </View>
  </Page>
);
