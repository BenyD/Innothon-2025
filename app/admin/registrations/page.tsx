"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "@/components/admin/AdminLayout";
import { motion } from "framer-motion";
import { User, Mail, Phone, Check, X, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import type { Registration } from "@/types/registration";
import { events } from "@/data/events";
import { useRouter } from "next/navigation";
import { sendApprovalEmails, sendRejectionEmails } from "@/lib/send-email";
import { Button } from "@/components/ui/button";

export default function Registrations() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const { toast } = useToast();
  const router = useRouter();
  const [updating, setUpdating] = useState<string | null>(null);

  const formatYear = (year: string) => {
    const yearMap: { [key: string]: string } = {
      "1": "1st",
      "2": "2nd",
      "3": "3rd",
      "4": "4th",
    };
    return yearMap[year] || year;
  };

  const fetchRegistrations = useCallback(async () => {
    try {
      console.log("Fetching all registrations");
      const { data, error } = await supabase
        .from("registrations")
        .select(
          `
          *,
          team_members (*)
        `
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching registrations:", error);
        throw error;
      }

      if (data) {
        console.log("Fetched registrations:", data);
        setRegistrations(data);
      }
    } catch (error) {
      console.error("Error in fetchRegistrations:", error);
    }
  }, []);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  useEffect(() => {
    const channel = supabase
      .channel("registration_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "registrations",
        },
        async () => {
          const { data, error } = await supabase
            .from("registrations")
            .select(
              `
              *,
              team_members (*)
            `
            )
            .order("created_at", { ascending: false });

          if (!error && data) {
            setRegistrations(data);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleStatusUpdate = async (
    e: React.MouseEvent,
    id: string,
    status: "approved" | "rejected"
  ) => {
    e.stopPropagation(); // Prevent navigation when clicking buttons
    try {
      setUpdating(id);

      // First, verify we can read the registration
      const { data: existingReg, error: readError } = await supabase
        .from("registrations")
        .select("*, team_members(*)")
        .eq("id", id)
        .single();

      if (readError) throw readError;

      // Update the status
      const { error: updateError } = await supabase
        .from("registrations")
        .update({
          status: status,
          payment_status: status === "approved" ? "completed" : "pending",
        })
        .eq("id", id);

      if (updateError) throw updateError;

      // Send appropriate emails
      if (status === "approved") {
        await sendApprovalEmails(
          existingReg.team_members,
          existingReg.id,
          existingReg.selected_events,
          existingReg.total_amount,
          existingReg.team_size
        );
      } else {
        await sendRejectionEmails(
          existingReg.team_members,
          existingReg.id,
          existingReg.selected_events,
          existingReg.total_amount,
          existingReg.team_size
        );
      }

      toast({
        title: "Success",
        description: `Registration ${status} successfully`,
        variant: "success",
      });

      // Refresh the registrations
      await fetchRegistrations();
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update registration status",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Event Registrations
          </h2>
          <p className="text-gray-400 mt-1">
            View and manage event registrations
          </p>
        </div>

        <div className="grid gap-4">
          {registrations.map((registration) => (
            <motion.div
              key={registration.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/5 cursor-pointer transition-colors"
              onClick={() =>
                router.push(`/admin/registrations/${registration.id}`)
              }
            >
              {/* Team Leader Info */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3">
                  {/* Header with Name and Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <User className="w-4 h-4 shrink-0 text-purple-400" />
                      <span className="text-sm text-white font-medium">
                        {registration.team_members[0]?.name}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          registration.status === "approved"
                            ? "bg-green-500/10 text-green-400"
                            : registration.status === "rejected"
                              ? "bg-red-500/10 text-red-400"
                              : "bg-yellow-500/10 text-yellow-400"
                        }`}
                      >
                        {registration.status.charAt(0).toUpperCase() +
                          registration.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3 shrink-0 text-gray-400" />
                      <span className="text-xs text-gray-400 truncate">
                        {registration.team_members[0]?.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3 h-3 shrink-0 text-gray-400" />
                      <span className="text-xs text-gray-400">
                        {registration.team_members[0]?.phone}
                      </span>
                    </div>
                  </div>

                  {/* College Info */}
                  <div className="text-xs text-gray-400">
                    <p className="truncate">
                      {registration.team_members[0]?.college}
                    </p>
                    <p>
                      {registration.team_members[0]?.department} -{" "}
                      {formatYear(registration.team_members[0]?.year)} Year
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-white/10" />

                {/* Events and Payment */}
                <div className="space-y-3">
                  {/* Registered Events */}
                  <div>
                    <h4 className="text-xs font-medium text-gray-400 mb-2">
                      Registered Events
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {registration.selected_events.map((eventId) => (
                        <div
                          key={eventId}
                          className="bg-white/5 px-2 py-1 rounded-lg text-xs text-gray-300"
                        >
                          {events.find((e) => e.id === eventId)?.title}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total Amount */}
                  <div>
                    <h4 className="text-xs font-medium text-gray-400 mb-1">
                      Total Amount
                    </h4>
                    <p className="text-base font-semibold text-white">
                      ₹{registration.total_amount}
                    </p>
                  </div>
                </div>

                {/* Add action buttons */}
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    onClick={(e) =>
                      handleStatusUpdate(e, registration.id, "approved")
                    }
                    disabled={
                      updating === registration.id ||
                      registration.status === "approved"
                    }
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {updating === registration.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4 mr-2" />
                    )}
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    onClick={(e) =>
                      handleStatusUpdate(e, registration.id, "rejected")
                    }
                    disabled={
                      updating === registration.id ||
                      registration.status === "rejected"
                    }
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    {updating === registration.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <X className="w-4 h-4 mr-2" />
                    )}
                    Reject
                  </Button>
                </div>
              </div>

              {/* Arrow indicator for mobile */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 lg:hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </div>

              {/* Make the entire card clickable except for the buttons */}
              <div
                className="absolute inset-0 cursor-pointer"
                onClick={(e) => e.stopPropagation()}
                style={{ pointerEvents: "auto" }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
