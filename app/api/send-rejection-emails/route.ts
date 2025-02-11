import { NextResponse } from "next/server";
import { Resend } from "resend";
import { RegistrationRejectedEmail } from "@/lib/email-templates/registration-rejected";
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
      "Attempting to send rejection emails to:",
      teamMembers.map((m: TeamMember) => m.email)
    );

    const emailPromises = teamMembers.map(
      async (member: TeamMember, index: number) => {
        try {
          const result = await resend.emails.send({
            from: "Innothon <noreply@beny.one>",
            to: member.email,
            subject: "Registration Update Required - Innothon'25",
            react: RegistrationRejectedEmail({
              teamMember: member,
              registrationId,
              selectedEvents,
              totalAmount,
              isTeamLeader: index === 0,
              teamSize,
            }) as React.ReactElement,
          });
          console.log(`Rejection email sent to ${member.email}:`, result);
          return result;
        } catch (err) {
          console.error(`Failed to send rejection email to ${member.email}:`, err);
          throw err;
        }
      }
    );

    const results = await Promise.all(emailPromises);
    console.log("All rejection email results:", results);

    return NextResponse.json({ success: true, results });
  } catch (error: unknown) {
    console.error("Error sending rejection emails:", error);
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