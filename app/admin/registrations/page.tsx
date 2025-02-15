"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "@/components/admin/AdminLayout";
import { motion } from "framer-motion";
import { User, Mail, Phone, Check, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import type { Registration } from "@/types/registration";
import { events } from "@/data/events";
import { useRouter } from "next/navigation";
import { sendApprovalEmails, sendRejectionEmails } from "@/lib/send-email";

export default function Registrations() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const { toast } = useToast();
  const router = useRouter();

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
    id: string,
    status: "approved" | "rejected"
  ) => {
    try {
      console.log("Updating status for ID:", id, "to:", status);

      // First, verify we can read the registration
      const { data: existingReg, error: readError } = await supabase
        .from("registrations")
        .select("*, team_members(*)")
        .eq("id", id)
        .single();

      if (readError) {
        console.error("Error reading registration:", readError);
        throw readError;
      }

      console.log("Existing registration:", existingReg);

      // Then update the status
      const { data: updateData, error: updateError } = await supabase
        .from("registrations")
        .update({
          status: status,
          payment_status: status === "approved" ? "completed" : "pending",
        })
        .eq("id", id)
        .select();

      if (updateError) {
        console.error("Error updating status:", updateError);
        throw updateError;
      }

      console.log("Update response:", updateData);

      // Send appropriate emails based on status
      if (status === "approved") {
        const emailResult = await sendApprovalEmails(
          existingReg.team_members,
          existingReg.id,
          existingReg.selected_events,
          existingReg.total_amount,
          existingReg.team_size
        );

        if (!emailResult.success) {
          console.error("Error sending approval emails:", emailResult.error);
          toast({
            title: "Warning",
            description:
              "Registration approved but failed to send notification emails",
            variant: "destructive",
          });
        }
      } else if (status === "rejected") {
        const emailResult = await sendRejectionEmails(
          existingReg.team_members,
          existingReg.id,
          existingReg.selected_events,
          existingReg.total_amount,
          existingReg.team_size
        );

        if (!emailResult.success) {
          console.error("Error sending rejection emails:", emailResult.error);
          toast({
            title: "Warning",
            description:
              "Registration rejected but failed to send notification emails",
            variant: "destructive",
          });
        }
      }

      // Update local state
      setRegistrations((prevRegistrations) =>
        prevRegistrations.map((reg) =>
          reg.id === id
            ? {
                ...reg,
                status: status,
                payment_status: status === "approved" ? "completed" : "pending",
              }
            : reg
        )
      );

      // Fetch fresh data
      const { data: refreshData, error: refreshError } = await supabase
        .from("registrations")
        .select(
          `
          *,
          team_members (*)
        `
        )
        .order("created_at", { ascending: false });

      if (refreshError) {
        console.error("Error refreshing data:", refreshError);
        throw refreshError;
      }

      if (refreshData) {
        setRegistrations(refreshData);
      }

      toast({
        title: "Status updated",
        description: `Registration has been ${status}`,
        variant: "success",
      });
    } catch (error) {
      console.error("Error in handleStatusUpdate:", error);
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to update status",
        variant: "destructive",
      });
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
              onClick={() => router.push(`/admin/registrations/${registration.id}`)}
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
                        {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
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
                    <p className="truncate">{registration.team_members[0]?.college}</p>
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
            </motion.div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
