import React from "react";
import QRCode from "qrcode";
import { renderToBuffer } from "@react-pdf/renderer";
import { AdmitCard } from "./pdf-templates/AdmitCard";
import type { TeamMember } from "@/types/registration";
import { Document } from "@react-pdf/renderer";

export async function generateAdmitCard(
  teamMember: TeamMember,
  registrationId: string,
  teamId: string
) {
  try {
    // Generate QR code with registration details
    const qrData = JSON.stringify({
      regId: registrationId,
      teamId: teamId,
      name: teamMember.name,
      email: teamMember.email,
    });

    const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
      margin: 1,
      width: 500, // Increased size for better quality
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });

    const pdfBuffer = await renderToBuffer(
      React.createElement(
        Document,
        null,
        React.createElement(AdmitCard, {
          teamMember,
          registrationId,
          qrCodeDataUrl,
          teamId,
        })
      )
    );

    return pdfBuffer;
  } catch (error) {
    console.error("Error generating admit card:", error);
    throw error;
  }
}
