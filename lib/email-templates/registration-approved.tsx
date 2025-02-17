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
  const previewText = `Your registration for Innothon'25 has been confirmed!`;

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
            <Text style={title}>Registration Confirmed!</Text>
            
            <Text style={greeting}>Dear {teamMember.name},</Text>
            
            <Text style={paragraph}>
              Your registration for Innothon'25 has been confirmed! 
              {isTeamLeader && teamSize > 1 && (
                " As the team leader, please share this information with your team members."
              )}
            </Text>

            {/* Registration Card */}
            <Section style={card}>
              <Text style={cardTitle}>Registration Details</Text>
              <div style={cardGrid}>
                <div style={cardItem}>
                  <Text style={cardLabel}>Registration ID</Text>
                  <Text style={cardValue}>{registrationId}</Text>
                </div>
                <div style={cardItem}>
                  <Text style={cardLabel}>Amount Paid</Text>
                  <Text style={cardValue}>₹{totalAmount}</Text>
                </div>
                <div style={cardItem}>
                  <Text style={cardLabel}>Team Size</Text>
                  <Text style={cardValue}>{teamSize} member{teamSize > 1 ? 's' : ''}</Text>
                </div>
              </div>
            </Section>

            {/* Events Section */}
            <Section style={card}>
              <Text style={cardTitle}>Your Events</Text>
              <ul style={eventList}>
                {selectedEvents.map((event) => (
                  <li key={event} style={eventItem}>
                    {event}
                  </li>
                ))}
              </ul>
            </Section>

            {/* Schedule Card */}
            <Section style={card}>
              <Text style={cardTitle}>Event Day Schedule</Text>
              <div style={timelineContainer}>
                {scheduleItems.map((item, index) => (
                  <div key={index} style={timelineItem}>
                    <Text style={timelineTime}>{item.time}</Text>
                    <Text style={timelineEvent}>{item.event}</Text>
                  </div>
                ))}
              </div>
            </Section>

            {/* Important Notes */}
            <Section style={card}>
              <Text style={cardTitle}>Important Notes</Text>
              <ul style={notesList}>
                {importantNotes.map((note, index) => (
                  <li key={index} style={notesItem}>{note}</li>
                ))}
              </ul>
            </Section>

            {/* Contact Section */}
            <Section style={contactSection}>
              <Text style={contactTitle}>Need Help?</Text>
              <Text style={contactText}>
                Email: bspc.hit@gmail.com<br />
                Phone: +91 98848 19912 (Beny Dishon K)<br />
                Website: <Link style={link} href="https://innothon.beny.one">innothon.beny.one</Link>
              </Text>
            </Section>

            <Hr style={divider} />

            <Section style={footer}>
              <Text style={footerText}>
                Organized by Blue Screen Programming Club<br />
                Department of Computer Science and Engineering<br />
                Hindustan Institute of Technology and Science<br />
                Chennai, India
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Constants
const scheduleItems = [
  { time: "08:30 AM", event: "Registration & Check-in" },
  { time: "09:30 AM", event: "Opening Ceremony" },
  { time: "10:30 AM", event: "Events Begin" },
  { time: "01:00 PM", event: "Lunch Break" },
  { time: "02:00 PM", event: "Events Resume" },
  { time: "04:30 PM", event: "Valedictory Ceremony" }
];

const importantNotes = [
  "Bring your college ID card",
  "Carry your laptop and charger",
  "Report 30 minutes before your event",
  "Keep this email handy for reference",
  "Follow the dress code (Smart Casuals)",
  "Internet access will be provided"
];

// Styles
const main = {
  backgroundColor: "#f5f5f5",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
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

const eventList = {
  margin: "0",
  padding: "0",
  listStyle: "none",
};

const eventItem = {
  padding: "10px 15px",
  backgroundColor: "#ffffff",
  borderRadius: "6px",
  marginBottom: "8px",
  fontSize: "15px",
  color: "#1a1a1a",
};

const timelineContainer = {
  padding: "0",
  margin: "0",
};

const timelineItem = {
  display: "flex",
  alignItems: "flex-start",
  padding: "12px 0",
  borderBottom: "1px dashed #e0e0e0",
};

const timelineTime = {
  width: "100px",
  fontSize: "14px",
  fontWeight: "500",
  color: "#666666",
  margin: "0",
};

const timelineEvent = {
  flex: "1",
  fontSize: "15px",
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

export default RegistrationApprovedEmail;
