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
      .channel('registration_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'registrations'
        },
        async () => {
          const { data, error } = await supabase
            .from("registrations")
            .select(`
              *,
              team_members (*)
            `)
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

  const handleStatusUpdate = async (id: string, status: "approved" | "rejected") => {
    try {
      console.log("Updating status for ID:", id, "to:", status);
      
      // First, verify we can read the registration
      const { data: existingReg, error: readError } = await supabase
        .from("registrations")
        .select("*")
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
          payment_status: status === "approved" ? "completed" : "pending"
        })
        .eq("id", id)
        .select();

      if (updateError) {
        console.error("Error updating status:", updateError);
        throw updateError;
      }

      console.log("Update response:", updateData);

      // Update local state
      setRegistrations(prevRegistrations =>
        prevRegistrations.map(reg =>
          reg.id === id
            ? {
                ...reg,
                status: status,
                payment_status: status === "approved" ? "completed" : "pending"
              }
            : reg
        )
      );

      // Fetch fresh data
      const { data: refreshData, error: refreshError } = await supabase
        .from("registrations")
        .select(`
          *,
          team_members (*)
        `)
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
        description: error.message || "Failed to update status",
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
              className="group relative bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 lg:p-6 hover:bg-white/5 cursor-pointer transition-colors"
              onClick={() =>
                router.push(`/admin/registrations/${registration.id}`)
              }
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-purple-400" />
                    <span className="text-white font-medium">
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
                  <div className="flex items-center gap-3 text-gray-400">
                    <Mail className="w-4 h-4" />
                    <span>{registration.team_members[0]?.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400">
                    <Phone className="w-4 h-4" />
                    <span>{registration.team_members[0]?.phone}</span>
                  </div>
                  <div className="text-gray-400">
                    <p>{registration.team_members[0]?.college}</p>
                    <p>
                      {registration.team_members[0]?.department} - {" "}
                      {formatYear(registration.team_members[0]?.year)} Year
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">
                      Registered Events
                    </h4>
                    <div className="space-y-2">
                      {registration.selected_events.map((eventId) => (
                        <div
                          key={eventId}
                          className="bg-white/5 px-3 py-2 rounded-lg text-sm text-gray-300"
                        >
                          {events.find((e) => e.id === eventId)?.title}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">
                      Total Amount
                    </h4>
                    <p className="text-xl font-semibold text-white">
                      ₹{registration.total_amount}
                    </p>
                  </div>
                  {registration.status === "pending" && (
                    <div className="flex gap-3">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusUpdate(registration.id, "approved");
                        }}
                        className="flex-1 bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 hover:border-green-500/30 transition-colors"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusUpdate(registration.id, "rejected");
                        }}
                        className="flex-1 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/30 transition-colors"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 p-4 bg-white/5 rounded-lg">
                <h4 className="text-sm font-medium text-gray-400 mb-2">
                  Payment Details
                </h4>
                <div className="space-y-2">
                  <p className="text-gray-300">
                    Transaction ID: {registration.transaction_id}
                  </p>
                  <p className="text-gray-300">
                    Payment Method: {registration.payment_method}
                  </p>
                  {registration.payment_proof && (
                    <a
                      href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/innothon/${registration.payment_proof}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      View Payment Proof
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
