"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    const fetchRegistrations = async () => {
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
        return;
      }

      setRegistrations(data || []);
    };

    fetchRegistrations();
  }, []);

  const handleStatusUpdate = async (
    id: string,
    status: "approved" | "rejected"
  ) => {
    try {
      const { error } = await supabase
        .from("registrations")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      setRegistrations(
        registrations.map((reg) => (reg.id === id ? { ...reg, status } : reg))
      );

      toast({
        title: "Status updated",
        description: `Registration has been ${status}`,
        variant: "success",
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update status",
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
                      {registration.team_members[0]?.department} -{" "}
                      {registration.team_members[0]?.year} Year
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
