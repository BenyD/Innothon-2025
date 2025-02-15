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
  const previewText = `Your registration for Innothon&apos;25 has been approved!`;

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
            <Text style={subtitle}>Registration Approved</Text>

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
              <Text style={detailText}>
                Events: {selectedEvents.join(", ")}
              </Text>
              <Text style={detailText}>Amount Paid: ₹{totalAmount}</Text>
            </Section>

            <Section style={boxContainer}>
              <Text style={boxHeader}>Event Schedule</Text>
              <Text style={detailText}>Date: March 21, 2025</Text>
              <Text style={detailText}>
                Opening Ceremony: 9:00 AM - 10:30 AM
              </Text>
              <Text style={detailText}>
                Morning Events: 10:45 AM - 12:00 PM
              </Text>
              <Text style={detailText}>Lunch Break: 12:00 PM - 1:00 PM</Text>
              <Text style={detailText}>
                Afternoon Events: 1:00 PM - 2:15 PM
              </Text>
              <Text style={detailText}>Valedictory: 3:00 PM - 4:00 PM</Text>
            </Section>

            <Section style={boxContainer}>
              <Text style={boxHeader}>Venue Details</Text>
              <Text style={detailText}>
                Opening & Valedictory: Andromeda Lecture Theatre
              </Text>
              <Text style={detailText}>
                HackQuest: Computer Science Block, Lab 401
              </Text>
              <Text style={detailText}>
                AI Genesis: Computer Science Block, Lab 402
              </Text>
              <Text style={detailText}>
                CodeArena: Computer Science Block, Lab 403
              </Text>
              <Text style={detailText}>
                Digital Divas & IdeaFusion: Seminar Hall
              </Text>
            </Section>

            <Text style={paragraph}>Important Guidelines:</Text>
            <ul style={list}>
              <li>Arrive 30 minutes before your event time</li>
              <li>Bring your college ID and a copy of this email</li>
              <li>Bring your own laptop (recommended)</li>
              <li>Internet access will be provided</li>
              <li>Food and refreshments will be provided</li>
              <li>Follow the dress code mentioned in the guidelines</li>
            </ul>

            <Text style={paragraph}>For any queries, contact:</Text>
            <Text style={contactText}>
              Email: bspc.hit@gmail.com
              <br />
              Beny Dishon K (President): +91 98848 19912
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

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "0",
  maxWidth: "600px",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
};

const logoSection = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "32px 0",
  borderBottom: "1px solid #e6e6e6",
};

const logo = {
  width: "auto",
  height: "50px",
  margin: "0",
  "@media (max-width: 600px)": {
    height: "40px",
  },
};

const eventTitle = {
  fontSize: "36px",
  fontWeight: "bold",
  textAlign: "center" as const,
  color: "#1a1a1a",
  marginBottom: "8px",
  "@media (max-width: 600px)": {
    fontSize: "28px",
  },
};

const subtitle = {
  fontSize: "18px",
  color: "#4a5568",
  textAlign: "center" as const,
  marginBottom: "32px",
  "@media (max-width: 600px)": {
    fontSize: "16px",
  },
};

const content = {
  padding: "32px",
  "@media (max-width: 600px)": {
    padding: "24px",
  },
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
  backgroundColor: "#f8fafc",
  borderRadius: "12px",
  marginBottom: "24px",
  border: "1px solid #e6e6e6",
  "@media (max-width: 600px)": {
    padding: "16px",
  },
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

export default RegistrationApprovedEmail;
