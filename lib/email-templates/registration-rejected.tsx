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
  totalAmount,
  isTeamLeader,
  teamSize,
}: RegistrationRejectedEmailProps) => {
  const previewText = `Your registration for Innothon'25 needs attention`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoSection}>
            <Img
              src="https://vxybvvrsiujnqatmncjt.supabase.co/storage/v1/object/public/innothon/images/hits_logo_black.png"
              width="120"
              height="50"
              alt="HIT Logo"
              style={logo}
            />
            <Img
              src="https://vxybvvrsiujnqatmncjt.supabase.co/storage/v1/object/public/innothon/images/bsp_logo.png"
              width="100"
              height="50"
              alt="Blue Screen Club Logo"
              style={logo}
            />
          </Section>

          <Section style={content}>
            <Text style={eventTitle}>Innothon&apos;25</Text>
            <Text style={subtitle}>Registration Update Required</Text>

            <Text style={paragraph}>Dear {teamMember.name},</Text>

            <Text style={paragraph}>
              We noticed some issues with your registration (ID:{" "}
              {registrationId}) for Innothon&apos;25. This could be due to
              payment verification issues or incomplete information.
              {isTeamLeader && teamSize > 1
                ? ` As the team leader, please inform your team members about this update.`
                : ``}
            </Text>

            <Section style={boxContainer}>
              <Text style={boxHeader}>Registration Details</Text>
              <Text style={detailText}>Registration ID: {registrationId}</Text>
              <Text style={detailText}>
                Events: {selectedEvents.join(", ")}
              </Text>
              <Text style={detailText}>Amount: ₹{totalAmount}</Text>
            </Section>

            <Text style={paragraph}>What you can do:</Text>
            <ul style={list}>
              <li>Submit a new registration with correct payment details</li>
              <li>
                If you believe this is an error, please contact us with your
                registration ID and payment proof
              </li>
            </ul>

            <Text style={paragraph}>Contact us:</Text>
            <Text style={contactText}>
              Email:{" "}
              <Link href="mailto:bspc.hit@gmail.com" style={linkStyle}>
                bspc.hit@gmail.com
              </Link>
              <br />
              Beny Dishon K (President): +91 98848 19912
              <br />
              Santhosh Kumar S (Secretary): +91 93446 76938
            </Text>

            <Hr style={divider} />

            <Text style={paragraph}>
              Best regards,
              <br />
              Team Innothon
            </Text>

            <Section style={footer}>
              <Text style={footerText}>
                Organized by
                <br />
                Blue Screen Programming Club
                <br />
                Department of Computer Science and Engineering
                <br />
                Hindustan Institute of Technology and Science
                <br />
                Phase 1, Rajiv Gandhi Salai (OMR)
                <br />
                Padur, Chennai - 603103
              </Text>
              <Link href="https://innothon.beny.one/" style={footerLink}>
                Visit our website
              </Link>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles (reusing the same styles from the approval email)
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
  borderRadius: "8px",
};

const logoSection = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "20px",
  padding: "20px 0",
};

const logo = {
  margin: "0 10px",
};

const eventTitle = {
  fontSize: "32px",
  fontWeight: "bold",
  textAlign: "center" as const,
  color: "#1a1a1a",
  marginBottom: "32px",
};

const subtitle = {
  fontSize: "18px",
  color: "#4a5568",
  textAlign: "center" as const,
  marginBottom: "32px",
};

const content = {
  padding: "0 48px",
};

const paragraph = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
  margin: "16px 0",
};

const boxContainer = {
  padding: "24px",
  backgroundColor: "#f6f9fc",
  borderRadius: "6px",
  marginBottom: "24px",
  border: "1px solid #e6e6e6",
};

const boxHeader = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#1a1a1a",
  marginBottom: "12px",
};

const detailText = {
  fontSize: "14px",
  color: "#525f7f",
  margin: "4px 0",
  lineHeight: "20px",
};

const list = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "24px",
  marginLeft: "24px",
};

const contactText = {
  color: "#525f7f",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "8px 0",
};

const linkStyle = {
  color: "#556cd6",
  textDecoration: "none",
};

const divider = {
  borderTop: "1px solid #e6e6e6",
  margin: "32px 0",
};

const footer = {
  textAlign: "center" as const,
  marginTop: "32px",
  borderTop: "1px solid #e6e6e6",
  paddingTop: "32px",
};

const footerText = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "20px",
};

const footerLink = {
  color: "#556cd6",
  textDecoration: "none",
  fontSize: "14px",
  marginTop: "16px",
  display: "block",
};

export default RegistrationRejectedEmail;
