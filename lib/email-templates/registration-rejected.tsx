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
  Link,
} from "@react-email/components";
import * as React from "react";
import type { TeamMember } from "@/types/registration";

interface RegistrationRejectedEmailProps {
  teamMember: TeamMember;
  registrationId: string;
  selectedEvents: string[];
  totalAmount: number;
  isTeamLeader: boolean;
  teamSize: number;
}

export const RegistrationRejectedEmail = ({
  teamMember,
  registrationId,
  selectedEvents,
}: RegistrationRejectedEmailProps) => {
  const previewText = `Important update regarding your Innothon'25 payment`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img
              src="https://vxybvvrsiujnqatmncjt.supabase.co/storage/v1/object/public/innothon/images/email-header.png"
              width="600"
              height="200"
              alt="Innothon'25 Header"
              style={headerImage}
            />
          </Section>

          <Section style={content}>
            <Text style={title}>Registration Update</Text>

            <Text style={greeting}>Dear {teamMember.name},</Text>

            <Text style={paragraph}>
              We regret to inform you that we couldn&apos;t verify your payment
              for Innothon&apos;25. This could be due to one of the following
              reasons:
            </Text>

            {/* Registration Details */}
            <Section style={card}>
              <Text style={cardTitle}>Registration Details</Text>
              <div style={cardGrid}>
                <div style={cardItem}>
                  <Text style={cardLabel}>Registration ID</Text>
                  <Text style={cardValue}>{registrationId}</Text>
                </div>
                <div style={cardItem}>
                  <Text style={cardLabel}>Selected Events</Text>
                  <Text style={cardValue}>{selectedEvents.length}</Text>
                </div>
              </div>
            </Section>

            {/* Next Steps */}
            <Section style={card}>
              <Text style={cardTitle}>What&apos;s Next?</Text>
              <ul style={notesList}>
                <li style={notesItem}>
                  Please ensure your payment transaction was completed
                  successfully
                </li>
                <li style={notesItem}>
                  If amount was deducted, please share the transaction details
                  and screenshot to bspc.hit@gmail.com
                </li>
                <li style={notesItem}>
                  You can try registering again with a different payment method
                </li>
                <li style={notesItem}>
                  If amount was deducted, it will be refunded within 5-7 working
                  days
                </li>
              </ul>
            </Section>

            {/* Contact Section */}
            <Section style={contactSection}>
              <Text style={contactTitle}>Questions?</Text>
              <Text style={contactText}>
                If you have any questions or need clarification, please contact
                us:
                <br />
                <br />
                Email: bspc.hit@gmail.com
                <br />
                Phone: +91 98848 19912 (Beny Dishon K)
                <br />
                Website:{" "}
                <Link style={link} href="https://www.hitscseinnothon.com">
                  hitscseinnothon.com
                </Link>
              </Text>
            </Section>

            {/* Payment Support Section */}
            <Section style={card}>
              <Text style={cardTitle}>Common Payment Issues</Text>
              <ul style={notesList}>
                <li style={notesItem}>Transaction timeout or network error</li>
                <li style={notesItem}>Payment gateway technical issues</li>
                <li style={notesItem}>
                  Incorrect or incomplete transaction details
                </li>
                <li style={notesItem}>Bank server downtime</li>
              </ul>
            </Section>

            <Hr style={divider} />

            <Section style={footer}>
              <Text style={footerText}>
                Blue Screen Programming Club
                <br />
                Department of Computer Science and Engineering
                <br />
                Hindustan Institute of Technology and Science
                <br />
                Chennai, India
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles (same as approved email template)
const main = {
  backgroundColor: "#f5f5f5",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

const container = {
  margin: "0 auto",
  padding: "20px 0",
  width: "100%",
  maxWidth: "600px",
};

const header = {
  padding: "0",
  margin: "0",
};

const headerImage = {
  width: "100%",
  height: "auto",
  borderRadius: "8px 8px 0 0",
};

const content = {
  backgroundColor: "#ffffff",
  padding: "40px",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
};

const title = {
  fontSize: "28px",
  lineHeight: "1.3",
  fontWeight: "700",
  textAlign: "center" as const,
  color: "#1a1a1a",
  margin: "0 0 30px",
};

const greeting = {
  fontSize: "18px",
  lineHeight: "1.4",
  color: "#1a1a1a",
  margin: "0 0 15px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "1.4",
  color: "#4a4a4a",
  margin: "0 0 30px",
};

const card = {
  backgroundColor: "#f8f9fa",
  padding: "25px",
  borderRadius: "8px",
  marginBottom: "30px",
};

const cardTitle = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#1a1a1a",
  margin: "0 0 20px",
};

const cardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "15px",
};

const cardItem = {
  padding: "10px 0",
};

const cardLabel = {
  fontSize: "14px",
  color: "#666666",
  margin: "0 0 5px",
};

const cardValue = {
  fontSize: "16px",
  fontWeight: "500",
  color: "#1a1a1a",
  margin: "0",
};

const notesList = {
  margin: "0",
  padding: "0 0 0 20px",
};

const notesItem = {
  fontSize: "14px",
  color: "#4a4a4a",
  margin: "0 0 8px",
};

const contactSection = {
  textAlign: "center" as const,
  padding: "30px 0",
};

const contactTitle = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#1a1a1a",
  margin: "0 0 15px",
};

const contactText = {
  fontSize: "14px",
  lineHeight: "1.6",
  color: "#4a4a4a",
};

const link = {
  color: "#0066cc",
  textDecoration: "none",
};

const divider = {
  margin: "30px 0",
  border: "none",
  borderTop: "1px solid #e0e0e0",
};

const footer = {
  textAlign: "center" as const,
};

const footerText = {
  fontSize: "13px",
  lineHeight: "1.6",
  color: "#666666",
};

export default RegistrationRejectedEmail;
