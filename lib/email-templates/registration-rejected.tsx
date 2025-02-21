import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Preview,
  Img,
  Hr,
} from "@react-email/components";
import * as React from "react";
import type { TeamMember } from "@/types/registration";

interface RegistrationRejectedEmailProps {
  teamMember: TeamMember;
  registrationId: string;
  selectedEvents: string[];
  teamId: string;
  totalAmount: number;
  teamSize: number;
  isTeamLeader: boolean;
}

export const RegistrationRejectedEmail = ({
  teamMember,
  registrationId,
  selectedEvents,
  teamId,
  totalAmount,
  teamSize,
  isTeamLeader,
}: RegistrationRejectedEmailProps) => {
  const previewText = `Important update regarding your Innothon'25 registration`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src="https://jycgacsicczslkfiazkw.supabase.co/storage/v1/object/public/beny//hits-logo-black.png"
            width="150"
            height="150"
            alt="HITS Logo"
            style={logo}
          />

          <Text style={title}>Registration Status Update</Text>
          <Text style={subtitle}>INNOTHON&apos;25</Text>

          <Section style={content}>
            <Text style={greeting}>Dear {teamMember.name},</Text>

            <Text style={paragraph}>
              We regret to inform you that we couldn&apos;t verify your payment
              for Innothon&apos;25. Please review the details below and follow
              the instructions to resolve this issue.
            </Text>

            {/* Registration Details */}
            <Text style={sectionTitle}>Registration Details</Text>
            <Section style={detailsTable}>
              <div style={detailRow}>
                <div style={labelContainer}>
                  <Text style={label}>Name:</Text>
                </div>
                <div style={valueContainer}>
                  <Text style={value}>{teamMember.name}</Text>
                </div>
              </div>
              <div style={detailRow}>
                <div style={labelContainer}>
                  <Text style={label}>Team ID:</Text>
                </div>
                <div style={valueContainer}>
                  <Text style={value}>{teamId}</Text>
                </div>
              </div>
              <div style={detailRow}>
                <div style={labelContainer}>
                  <Text style={label}>Registration ID:</Text>
                </div>
                <div style={valueContainer}>
                  <Text style={value}>{registrationId}</Text>
                </div>
              </div>
              <div style={detailRow}>
                <div style={labelContainer}>
                  <Text style={label}>Selected Events:</Text>
                </div>
                <div style={valueContainer}>
                  <Text style={value}>{selectedEvents.length}</Text>
                </div>
              </div>
              <div style={detailRow}>
                <div style={labelContainer}>
                  <Text style={label}>Team Size:</Text>
                </div>
                <div style={valueContainer}>
                  <Text style={value}>
                    {teamSize} member{teamSize > 1 ? "s" : ""}
                  </Text>
                </div>
              </div>
              <div style={detailRow}>
                <div style={labelContainer}>
                  <Text style={label}>Total Amount:</Text>
                </div>
                <div style={valueContainer}>
                  <Text style={value}>₹{totalAmount}</Text>
                </div>
              </div>
            </Section>

            {/* Resolution Steps */}
            <Text style={sectionTitle}>How to Resolve</Text>
            <ol style={stepsList}>
              <li style={stepItem}>
                Check if your payment transaction was completed
              </li>
              <li style={stepItem}>
                If amount was deducted, email us the transaction screenshot
              </li>
              <li style={stepItem}>
                You can try registering again with a different payment method
              </li>
              <li style={stepItem}>
                Any deducted amount will be refunded within 5-7 working days
              </li>
            </ol>

            {isTeamLeader && teamSize > 1 && (
              <Text style={paragraph}>
                As team leader, please share this information with your team
                members.
              </Text>
            )}

            <Hr style={divider} />

            <Text style={footerText}>
              For any queries, contact:
              <br />
              Blue Screen Programming Club
              <br />
              Department of Computer Science and Engineering
              <br />
              Hindustan Institute of Technology and Science
              <br />
              Email: bspc.hit@gmail.com
              <br />
              Phone: +91 98848 19912 (Beny Dishon K)
            </Text>

            <Text style={instituteName}>
              Blue Screen Programming Club
              <br />
              Department of Computer Science and Engineering
              <br />
              Hindustan Institute of Technology and Science
              <br />
              Chennai, India
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles (mostly shared with approved template)
const main = {
  backgroundColor: "#f4f4f5",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px",
};

const logo = {
  margin: "0 auto 24px",
  display: "block",
  width: "150px",
  height: "150px",
  objectFit: "contain" as const,
};

const title = {
  fontSize: "24px",
  fontWeight: "800",
  textAlign: "center" as const,
  color: "#dc2626",
  margin: "0",
  lineHeight: "1.3",
};

const subtitle = {
  fontSize: "16px",
  color: "#3b82f6",
  textAlign: "center" as const,
  margin: "8px 0 32px",
  fontWeight: "600",
};

const greeting = {
  fontSize: "18px",
  color: "#18181b",
  marginBottom: "16px",
  fontWeight: "600",
};

const paragraph = {
  fontSize: "16px",
  color: "#3f3f46",
  lineHeight: "1.5",
  marginBottom: "32px",
};

const sectionTitle = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#18181b",
  marginBottom: "16px",
};

const detailsTable = {
  width: "100%",
  backgroundColor: "#f8fafc",
  borderRadius: "8px",
  padding: "16px",
  marginBottom: "32px",
};

const detailRow = {
  display: "flex",
  padding: "12px 16px",
  borderBottom: "1px solid #e5e7eb",
  backgroundColor: "#ffffff",
  marginBottom: "8px",
  borderRadius: "6px",
};

const labelContainer = {
  width: "140px",
  paddingRight: "16px",
};

const valueContainer = {
  flex: "1",
};

const label = {
  fontSize: "14px",
  color: "#4b5563",
  fontWeight: "500",
};

const value = {
  fontSize: "14px",
  color: "#111827",
  fontWeight: "600",
};

const stepsList = {
  margin: "0",
  padding: "0 0 0 20px",
};

const stepItem = {
  fontSize: "14px",
  marginBottom: "12px",
  color: "#374151",
  lineHeight: "1.5",
};

const divider = {
  margin: "32px 0",
  border: "none",
  borderTop: "1px solid #e5e7eb",
};

const footerText = {
  fontSize: "14px",
  color: "#71717a",
  textAlign: "center" as const,
  lineHeight: "1.6",
};

const instituteName = {
  fontSize: "14px",
  color: "#71717a",
  textAlign: "center" as const,
  lineHeight: "1.6",
};

const content = {
  padding: "0",
};

export default RegistrationRejectedEmail;
