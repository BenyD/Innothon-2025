import { NextResponse } from "next/server";
import { Resend } from "resend";
import { RegistrationApprovedEmail } from "@/lib/email-templates/registration-approved";
import { generateAdmitCard } from "@/lib/generate-admit-card";
// import type { TeamMember } from "@/types/registration";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const {
      teamMembers,
      registrationId,
      selectedEvents,
      totalAmount,
      teamSize,
      teamId,
    } = await request.json();

    if (!teamMembers?.length) {
      throw new Error("No team members provided");
    }

    const emailResults = [];

    for (const member of teamMembers) {
      try {
        if (!member.email) {
          throw new Error(`Invalid email for team member: ${member.name}`);
        }

        console.log(`Generating admit card for ${member.name}...`);
        const admitCard = await generateAdmitCard(
          member,
          registrationId,
          teamId
        );
        console.log(`Admit card generated successfully for ${member.name}`);

        console.log(`Sending email to ${member.email}...`);
        const emailResult = await resend.emails.send({
          from: "Innothon'25 <noreply@hitscseinnothon.com>",
          to: member.email,
          subject: "Registration Approved - Innothon'25",
          react: RegistrationApprovedEmail({
            teamMember: member,
            registrationId,
            selectedEvents,
            totalAmount,
            isTeamLeader: teamMembers.indexOf(member) === 0,
            teamSize,
          }),
          attachments: [
            {
              filename: `admit-card-${registrationId}.pdf`,
              content: admitCard,
            },
          ],
        });
        console.log(`Email sent successfully to ${member.email}`, emailResult);

        emailResults.push({ 
          success: true, 
          email: member.email, 
          result: emailResult 
        });
      } catch (error) {
        console.error(`Error sending email to ${member.email}:`, error);
        emailResults.push({
          success: false,
          email: member.email,
          error: error instanceof Error ? error.message : String(error),
          details: error
        });
      }
    }

    const failedEmails = emailResults.filter(result => !result.success);
    
    if (failedEmails.length > 0) {
      console.error("Failed emails:", failedEmails);
      return NextResponse.json(
        {
          success: false,
          error: `Failed to send emails to ${failedEmails.length} recipients`,
          details: failedEmails,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      details: emailResults,
    });
  } catch (error) {
    console.error("Error in send-approval-emails:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to send emails",
        details: error
      },
      { status: 500 }
    );
  }
}
