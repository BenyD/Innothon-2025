import { NextResponse } from "next/server";
import { Resend } from "resend";
import { RegistrationApprovedEmail } from "@/lib/email-templates/registration-approved";
import { generateAdmitCard } from "@/lib/generate-admit-card";
import type { TeamMember } from "@/types/registration";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const {
      teamMembers,
      registrationId,
      selectedEvents,
      totalAmount,
      teamSize,
    } = await request.json();

    const emailPromises = teamMembers.map(
      async (member: TeamMember, index: number) => {
        // Generate admit card PDF for this member
        const admitCard = await generateAdmitCard(
          member,
          registrationId,
          selectedEvents
        );

        await resend.emails.send({
          from: "Innothon'25 <noreply@hitscseinnothon.com>",
          to: member.email,
          subject: "Registration Approved - Innothon'25",
          react: RegistrationApprovedEmail({
            teamMember: member,
            registrationId,
            selectedEvents,
            totalAmount,
            isTeamLeader: index === 0,
            teamSize,
          }),
          attachments: [
            {
              filename: `admit-card-${registrationId}.pdf`,
              content: admitCard,
            },
          ],
        });
      }
    );

    await Promise.all(emailPromises);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending approval emails:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send emails" },
      { status: 500 }
    );
  }
}
