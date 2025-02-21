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

interface RegistrationApprovedEmailProps {
  teamMember: TeamMember;
  registrationId: string;
  selectedEvents: string[];
  totalAmount: number;
  isTeamLeader: boolean;
  teamSize: number;
  teamId: string;
}

export const RegistrationApprovedEmail = ({
  teamMember,
  registrationId,
  selectedEvents,
  totalAmount,
  isTeamLeader,
  teamSize,
  teamId,
}: RegistrationApprovedEmailProps) => {
  const previewText = `Your registration for Innothon'25 has been confirmed!`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src="https://jycgacsicczslkfiazkw.supabase.co/storage/v1/object/public/beny//hits-logo-black.png"
            width="200"
            height="200"
            alt="HITS Logo"
            style={logo}
          />
          
          <Text style={title}>Registration Confirmation</Text>
          <Text style={subtitle}>INNOTHON&apos;25</Text>

          <Section style={content}>
            <Text style={greeting}>Dear {teamMember.name},</Text>
            
            <Text style={paragraph}>
              Thank you for registering for Innothon&apos;25. Your registration has been confirmed.
              {isTeamLeader && teamSize > 1 && " As team leader, please share this information with your team members."}
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
                  <Text style={label}>Team Size:</Text>
                </div>
                <div style={valueContainer}>
                  <Text style={value}>{teamSize} member{teamSize > 1 ? 's' : ''}</Text>
                </div>
              </div>
              <div style={detailRow}>
                <div style={labelContainer}>
                  <Text style={label}>Amount Paid:</Text>
                </div>
                <div style={valueContainer}>
                  <Text style={value}>₹{totalAmount}</Text>
                </div>
              </div>
            </Section>

            {/* Events */}
            <Text style={sectionTitle}>Registered Events</Text>
            <ul style={eventsList}>
              {selectedEvents.map((event) => (
                <li key={event} style={eventItem}>{event}</li>
              ))}
            </ul>

            {/* Schedule */}
            <Text style={sectionTitle}>Event Schedule - March 21st</Text>
            <Section style={scheduleTable}>
              <div style={scheduleRow}>
                <Text style={timeColumn}>8:30 AM</Text>
                <Text style={eventColumn}>Registration & Check-in</Text>
              </div>
              <div style={scheduleRow}>
                <Text style={timeColumn}>9:30 AM</Text>
                <Text style={eventColumn}>Opening Ceremony</Text>
              </div>
              <div style={scheduleRow}>
                <Text style={timeColumn}>11:00 AM - 1:00 PM</Text>
                <Text style={eventColumn}>AI Genesis, Digital Divas</Text>
              </div>
              <div style={scheduleRow}>
                <Text style={timeColumn}>1:00 PM - 2:00 PM</Text>
                <Text style={eventColumn}>Lunch Break</Text>
              </div>
              <div style={scheduleRow}>
                <Text style={timeColumn}>2:00 PM - 4:00 PM</Text>
                <Text style={eventColumn}>CodeArena, HackQuest</Text>
              </div>
              <div style={scheduleRow}>
                <Text style={timeColumn}>11:00 AM - 4:00 PM</Text>
                <Text style={eventColumn}>IdeaFusion, Pixel Showdown</Text>
              </div>
            </Section>

            <Text style={sectionTitle}>Event Schedule - March 22nd</Text>
            <Section style={scheduleTable}>
              <div style={scheduleRow}>
                <Text style={timeColumn}>11:00 AM</Text>
                <Text style={eventColumn}>Valedictory Ceremony</Text>
              </div>
            </Section>

            {/* Rules */}
            <Text style={sectionTitle}>Important Rules</Text>
            <ul style={rulesList}>
              <li style={ruleItem}>Bring your college ID card</li>
              <li style={ruleItem}>Carry your laptop and charger</li>
              <li style={ruleItem}>Report 30 minutes before your event</li>
              <li style={ruleItem}>Follow the dress code (Smart Casuals)</li>
              <li style={ruleItem}>Maintain decorum during the event</li>
            </ul>

            <Hr style={divider} />

            <Text style={footerText}>
              For any queries, contact:<br />
              Blue Screen Programming Club<br />
              Department of Computer Science and Engineering<br />
              Hindustan Institute of Technology and Science<br />
              Email: bspc.hit@gmail.com<br />
              Phone: +91 98848 19912 (Beny Dishon K)
            </Text>

            <Text style={instituteName}>
              Blue Screen Programming Club<br />
              Department of Computer Science and Engineering<br />
              Hindustan Institute of Technology and Science<br />
              Chennai, India
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  fontFamily: '-apple-system, "Segoe UI", sans-serif',
  backgroundColor: "#ffffff",
};

const container = {
  margin: "0 auto",
  padding: "20px",
  width: "100%",
  maxWidth: "600px",
};

const logo = {
  margin: "0 auto 24px",
  display: "block",
  width: "200px",
  height: "200px",
  objectFit: "contain" as const,
};

const title = {
  fontSize: "24px",
  lineHeight: "1.3",
  fontWeight: "700",
  textAlign: "center" as const,
  margin: "0",
};

const subtitle = {
  fontSize: "16px",
  color: "#4b5563",
  textAlign: "center" as const,
  margin: "8px 0 24px",
};

const content = {
  padding: "0",
};

const greeting = {
  fontSize: "16px",
  lineHeight: "1.4",
  margin: "0 0 16px",
  fontWeight: "600",
};

const paragraph = {
  fontSize: "14px",
  lineHeight: "1.5",
  margin: "0 0 24px",
  color: "#374151",
};

const sectionTitle = {
  fontSize: "16px",
  fontWeight: "600",
  margin: "32px 0 16px",
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

const eventsList = {
  margin: "0",
  padding: "0 0 0 20px",
};

const eventItem = {
  fontSize: "14px",
  marginBottom: "8px",
  color: "#374151",
};

const scheduleTable = {
  width: "100%",
  backgroundColor: "#f8fafc",
  borderRadius: "8px",
  padding: "16px",
  marginBottom: "32px",
};

const scheduleRow = {
  display: "flex",
  padding: "12px 16px",
  borderBottom: "1px solid #e5e7eb",
  backgroundColor: "#ffffff",
  marginBottom: "8px",
  borderRadius: "6px",
};

const timeColumn = {
  width: "180px",
  fontSize: "14px",
  color: "#4b5563",
  fontWeight: "500",
};

const eventColumn = {
  flex: "1",
  fontSize: "14px",
  color: "#111827",
  fontWeight: "500",
};

const rulesList = {
  margin: "0",
  padding: "0 0 0 20px",
};

const ruleItem = {
  fontSize: "14px",
  marginBottom: "8px",
  color: "#374151",
};

const divider = {
  margin: "32px 0",
  border: "none",
  borderTop: "1px solid #e5e7eb",
};

const footerText = {
  fontSize: "14px",
  color: "#4b5563",
  textAlign: "center" as const,
  margin: "0 0 24px",
  lineHeight: "1.5",
};

const instituteName = {
  fontSize: "13px",
  color: "#6b7280",
  textAlign: "center" as const,
  lineHeight: "1.5",
};

export default RegistrationApprovedEmail;
