/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { Page, Text, View, StyleSheet, Image, Font } from "@react-pdf/renderer";
import type { TeamMember } from "@/types/registration";

interface AdmitCardProps {
  teamMember: TeamMember;
  registrationId: string;
  qrCodeDataUrl: string;
  teamId: string;
}

// Register Inter font for a modern look
Font.register({
  family: "Inter",
  fonts: [
    {
      src: "https://jycgacsicczslkfiazkw.supabase.co/storage/v1/object/public/beny/fonts/Inter-Regular.ttf",
      fontWeight: 400,
    },
    {
      src: "https://jycgacsicczslkfiazkw.supabase.co/storage/v1/object/public/beny/fonts/Inter-Medium.ttf",
      fontWeight: 500,
    },
    {
      src: "https://jycgacsicczslkfiazkw.supabase.co/storage/v1/object/public/beny/fonts/Inter-SemiBold.ttf",
      fontWeight: 600,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "#ffffff",
    fontFamily: "Inter",
  },
  container: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
  },
  logoContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  logo: {
    width: 80,
    height: 80,
    objectFit: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: 600,
    color: "#1a1a1a",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 40,
    textAlign: "center",
  },
  qrContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  qrCode: {
    width: 180,
    height: 180,
  },
  qrText: {
    fontSize: 12,
    color: "#666666",
    marginTop: 8,
  },
  infoContainer: {
    width: "100%",
    maxWidth: 400,
    marginBottom: "auto",
  },
  infoItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#f8fafc",
    borderRadius: 8,
  },
  label: {
    fontSize: 10,
    color: "#666666",
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    color: "#1a1a1a",
    fontWeight: 500,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    borderTop: "1 solid #e2e8f0",
    backgroundColor: "#f8fafc",
  },
  footerText: {
    fontSize: 10,
    color: "#666666",
    textAlign: "center",
  },
  watermark: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%) rotate(-45deg)",
    fontSize: 100,
    color: "#f1f5f9",
    opacity: 0.2,
    zIndex: -1,
  },
});

export const AdmitCard = ({
  teamMember,
  registrationId,
  qrCodeDataUrl,
  teamId,
}: AdmitCardProps) => (
  <Page size="A5" style={styles.page}>
    <View style={styles.container}>
      <Text style={styles.watermark}>INNOTHON&apos;25</Text>

      {/* Logo & Title */}
      <View style={styles.logoContainer}>
        <Image
          src="https://jycgacsicczslkfiazkw.supabase.co/storage/v1/object/public/beny//hits-logo-black.png"
          style={styles.logo}
        />
        <Text style={styles.title}>ADMIT CARD</Text>
        <Text style={styles.subtitle}>INNOTHON&apos;25</Text>
      </View>

      {/* QR Code */}
      <View style={styles.qrContainer}>
        <Image src={qrCodeDataUrl} style={styles.qrCode} />
        <Text style={styles.qrText}>Scan to verify participant</Text>
      </View>

      {/* Participant Info */}
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Text style={styles.label}>PARTICIPANT NAME</Text>
          <Text style={styles.value}>{teamMember.name}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>TEAM ID</Text>
          <Text style={styles.value}>{teamId}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>REGISTRATION ID</Text>
          <Text style={styles.value}>{registrationId}</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Valid only for March 21, 2025 • Not transferable{"\n"}
          Hindustan Institute of Technology and Science, Chennai
        </Text>
      </View>
    </View>
  </Page>
);
