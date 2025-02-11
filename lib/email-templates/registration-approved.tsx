import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Preview,
} from "@react-email/components";
import * as React from "react";
import type { TeamMember } from "@/types/registration";

interface RegistrationApprovedEmailProps {
  teamMember: TeamMember;
  registrationId: string;
  selectedEvents: string[];
  totalAmount: number;
  isTeamLeader: boolean;
  teamSize: number;
}

export const RegistrationApprovedEmail = ({
  teamMember,
  registrationId,
  selectedEvents,
  totalAmount,
  isTeamLeader,
  teamSize,
}: RegistrationApprovedEmailProps) => {
  const previewText = `Your registration for Innothon'24 has been approved!`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logo}>
            <Text style={{ fontSize: "32px", fontWeight: "bold", textAlign: "center" as const }}>
              Innothon&apos;25
            </Text>
          </Section>
          
          <Section style={content}>
            <Text style={paragraph}>Dear {teamMember.name},</Text>
            
            <Text style={paragraph}>
              We&apos;re excited to inform you that your registration for
              Innothon&apos;25 has been approved!
              {isTeamLeader && teamSize > 1
                ? ` As the team leader, please ensure all team members are informed about the event details.`
                : ``}
            </Text>

            <Section style={boxContainer}>
              <Text style={boxHeader}>Registration Details</Text>
              <Text style={detailText}>Registration ID: {registrationId}</Text>
              <Text style={detailText}>Events: {selectedEvents.join(", ")}</Text>
              <Text style={detailText}>Amount Paid: ₹{totalAmount}</Text>
            </Section>

            <Text style={paragraph}>
              Please keep this email for your records. You&apos;ll need to
              present your college ID during the event.
            </Text>

            <Text style={paragraph}>
              Event Schedule and Guidelines:
            </Text>
            <ul style={list}>
              <li>Arrive 30 minutes before your event time</li>
              <li>Bring your college ID and a copy of this email</li>
              <li>Check the event guidelines on our website</li>
              <li>Follow the dress code mentioned in the guidelines</li>
            </ul>

            <Text style={paragraph}>
              If you have any questions, feel free to contact our coordinators or reply to this email.
            </Text>

            <Text style={paragraph}>
              Best regards,<br />
              Team Innothon
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const logo = {
  margin: "0 auto",
  marginBottom: "24px",
};

const content = {
  padding: "0 48px",
};

const paragraph = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
};

const boxContainer = {
  padding: "24px",
  backgroundColor: "#f6f9fc",
  borderRadius: "6px",
  marginBottom: "24px",
};

const boxHeader = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#525f7f",
  marginBottom: "12px",
};

const detailText = {
  fontSize: "14px",
  color: "#525f7f",
  margin: "4px 0",
};

const list = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "24px",
};

export default RegistrationApprovedEmail; 