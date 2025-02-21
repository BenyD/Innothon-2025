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
        try {
          // Log the email data before sending
          console.log("Email data:", {
            to: member.email,
            registrationId,
            teamId,
            selectedEvents,
            admitCardSize: admitCard?.length || 0,
          });

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
              teamId,
            }),
            attachments: admitCard
              ? [
                  {
                    filename: `admit-card-${registrationId}.pdf`,
                    content: admitCard,
                  },
                ]
              : undefined,
          });

          console.log(
            `Email sent successfully to ${member.email}`,
            emailResult
          );

          emailResults.push({
            success: true,
            email: member.email,
            result: emailResult,
          });
        } catch (emailError) {
          console.error(
            "Detailed email error for",
            member.email,
            ":",
            emailError,
            "\nFull error object:",
            JSON.stringify(emailError, null, 2)
          );
          throw emailError;
        }
      } catch (error) {
        const errorDetails = {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          fullError: error,
        };

        console.error(
          `Detailed error for ${member.email}:`,
          JSON.stringify(errorDetails, null, 2)
        );

        emailResults.push({
          success: false,
          email: member.email,
          error: errorDetails.message,
          details: errorDetails,
        });
      }
    }

    const failedEmails = emailResults.filter((result) => !result.success);

    if (failedEmails.length > 0) {
      console.error(
        "Failed emails details:",
        JSON.stringify(failedEmails, null, 2)
      );
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
    const errorDetails = {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      fullError: error,
    };

    console.error(
      "Detailed route error:",
      JSON.stringify(errorDetails, null, 2)
    );
    return NextResponse.json(
      {
        success: false,
        error: errorDetails.message,
        details: errorDetails,
      },
      { status: 500 }
    );
  }
}
