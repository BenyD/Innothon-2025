import type { Registration } from "@/types/registration";

export const calculateRegistrationRevenue = (
  registration: Registration
): number => {
  if (registration.status !== "approved") return 0;

  let totalAmount = 0;
  registration.selected_events.forEach((eventId) => {
    if (eventId === "digital-divas") {
      totalAmount += registration.team_size * 200; // ₹200 per participant
    } else if (eventId === "pixel-showdown" && registration.game_details) {
      const { game, format } = registration.game_details;
      if (game === "pes")
        totalAmount += 100; // ₹100 per individual
      else if (game === "bgmi")
        totalAmount += 200; // ₹200 per team
      else if (game === "valorant")
        totalAmount += 250; // ₹250 per team
      else if (game === "freefire") {
        totalAmount += 200; // ₹200 for squad
      }
    } else {
      totalAmount += 500; // Default price for other events
    }
  });

  return totalAmount;
};

export const calculateTotalRevenue = (
  registrations: Registration[]
): number => {
  return registrations.reduce(
    (sum, registration) => sum + calculateRegistrationRevenue(registration),
    0
  );
};
