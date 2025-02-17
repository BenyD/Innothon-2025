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
    padding: 15,
    height: '100%',
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottom: '1 solid #000',
    paddingBottom: 15,
  },
  logo: {
    width: 60,
    height: 60,
  },
  titleContainer: {
    marginLeft: 15,
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 600,
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#1a1a1a',
    backgroundColor: '#f0f0f0',
    padding: '6 10',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
    padding: '4 10',
  },
  label: {
    width: '35%',
    fontSize: 12,
    color: '#444444',
    fontWeight: 400,
  },
  value: {
    flex: 1,
    fontSize: 12,
    color: '#000000',
    fontWeight: 600,
  },
  eventsList: {
    padding: '0 10',
  },
  event: {
    fontSize: 12,
    marginBottom: 6,
    color: '#000000',
  },
  qrSection: {
    position: 'absolute',
    right: 15,
    top: 100,
    alignItems: 'center',
  },
  qrCode: {
    width: 100,
    height: 100,
  },
  qrText: {
    fontSize: 9,
    color: '#666666',
    marginTop: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    right: 15,
  },
  footerText: {
    fontSize: 10,
    color: '#666666',
    textAlign: 'center',
  },
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) rotate(-45deg)',
    fontSize: 60,
    color: '#f0f0f0',
    opacity: 0.5,
  },
});

export const AdmitCard = ({ teamMember, registrationId, selectedEvents, qrCodeDataUrl }: AdmitCardProps) => (
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
          <Text style={styles.label}>Registration ID</Text>
          <Text style={styles.value}>{registrationId}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{teamMember.email}</Text>
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
          This admit card must be presented at the venue for entry
        </Text>
      </View>
    </View>
  </Page>
);
