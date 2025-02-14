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

    console.log(
      "Attempting to send emails to:",
      teamMembers.map((m: TeamMember) => m.email)
    );

    const emailPromises = teamMembers.map(
      async (member: TeamMember, index: number) => {
        try {
          // Generate admit card PDF for this team member
          const admitCardBuffer = await generateAdmitCard(
            member,
            registrationId,
            selectedEvents
          );

          console.log("PDF Buffer generated successfully:", !!admitCardBuffer);

          const result = await resend.emails.send({
            from: "Innothon <noreply@beny.one>",
            to: member.email,
            subject: "Registration Approved - Innothon'25",
            react: RegistrationApprovedEmail({
              teamMember: member,
              registrationId,
              selectedEvents,
              totalAmount,
              isTeamLeader: index === 0,
              teamSize,
            }) as React.ReactElement,
            attachments: [
              {
                filename: `innothon_admit_card_${registrationId}.pdf`,
                content: admitCardBuffer,
              },
            ],
          });

          console.log(`Email sent to ${member.email}:`, result);
          return result;
        } catch (err) {
          console.error(`Failed to send email to ${member.email}:`, err);
          console.error("Error details:", JSON.stringify(err, null, 2));
          throw err;
        }
      }
    );

    const results = await Promise.all(emailPromises);
    console.log("All email results:", results);

    return NextResponse.json({ success: true, results });
  } catch (error: unknown) {
    console.error("Error sending approval emails:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
