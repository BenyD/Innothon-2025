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

    const emailPromises = teamMembers.map(
      async (member: TeamMember, index: number) => {
        await resend.emails.send({
          from: "Innothon'25 <noreply@hitscseinnothon.com>",
          to: member.email,
          subject: "Registration Update - Innothon'25",
          react: RegistrationRejectedEmail({
            teamMember: member,
            registrationId,
            selectedEvents,
            totalAmount,
            isTeamLeader: index === 0,
            teamSize,
          }),
        });
      }
    );

    await Promise.all(emailPromises);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending rejection emails:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send emails" },
      { status: 500 }
    );
  }
}
