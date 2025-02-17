"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase";
import type { Registration } from "@/types/registration";
import { Button } from "@/components/ui/button";
import {
  Check,
  X,
  ArrowLeft,
  Calendar,
  Mail,
  Users,
  User,
  Building2,
  Phone,
  Loader2,
  Clock,
  IndianRupee,
  GraduationCap,
  User2,
  Badge,
  Copy,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { sendApprovalEmails, sendRejectionEmails } from "@/lib/send-email";
import { events } from "@/data/events";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function RegistrationDetails() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const formatYear = (year: string) => {
    const yearMap: { [key: string]: string } = {
      "1": "1st",
      "2": "2nd",
      "3": "3rd",
      "4": "4th",
    };
    return yearMap[year] || year;
  };

  const fetchRegistration = useCallback(async () => {
    try {
      console.log("Fetching registration data for ID:", params.id);
      const { data, error } = await supabase
        .from("registrations")
        .select(`
          *,
          team_members!team_members_registration_id_fkey (*)
        `)
        .eq("id", params.id)
        .single();

      if (error) {
        console.error("Error fetching registration:", error);
        throw error;
      }

      if (data) {
        console.log("Fetched registration data:", data);
        setRegistration(data);
      }
    } catch (error) {
      console.error("Error in fetchRegistration:", error);
      toast({
        title: "Error",
        description: "Failed to load registration details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [params.id, toast]);

  useEffect(() => {
    fetchRegistration();
  }, [fetchRegistration]);

  const handleStatusUpdate = async (status: "approved" | "rejected") => {
    try {
      setUpdating(true);
      console.log("Updating status to:", status);

      const { error: updateError } = await supabase
        .from("registrations")
        .update({
          status: status,
          payment_status: status === "approved" ? "completed" : "pending",
        })
        .eq("id", params.id);

      if (updateError) throw updateError;

      // Send appropriate emails based on status
      if (status === "approved" && registration?.team_members) {
        const emailResult = await sendApprovalEmails(
          registration.team_members,
          registration.id,
          registration.selected_events,
          registration.total_amount,
          registration.team_size
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
      } else if (status === "rejected" && registration?.team_members) {
        const emailResult = await sendRejectionEmails(
          registration.team_members,
          registration.id,
          registration.selected_events,
          registration.total_amount,
          registration.team_size
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

      await fetchRegistration();
      toast({
        title: "Success",
        description: `Registration ${status} successfully`,
        variant: "success",
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update registration status",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleResendEmails = async () => {
    if (!registration?.team_members) return;

    try {
      setUpdating(true);
      const emailResult = await sendApprovalEmails(
        registration.team_members,
        registration.id,
        registration.selected_events,
        registration.total_amount,
        registration.team_size
      );

      if (!emailResult.success) {
        throw new Error(String(emailResult.error));
      }

      toast({
        title: "Success",
        description: "Approval emails resent successfully",
        variant: "success",
      });
    } catch (error) {
      console.error("Error resending emails:", error);
      toast({
        title: "Error",
        description: "Failed to resend approval emails",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </AdminLayout>
    );
  }

  if (!registration) {
    return (
      <AdminLayout>
        <div className="p-6">
          <p className="text-red-400">Registration not found</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6 max-w-5xl mx-auto"
      >
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Registration Details</h2>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="cursor-pointer" onClick={() => {
                navigator.clipboard.writeText(registration?.team_id || "");
                toast({
                  title: "Copied!",
                  description: "Team ID copied to clipboard",
                  duration: 2000,
                });
              }}>
                <span className="text-xs">{registration?.team_id}</span>
                <Copy className="w-3 h-3 ml-1" />
              </Badge>
              <span className="text-sm text-gray-400">
                Created {new Date(registration?.created_at || "").toLocaleDateString()}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Team Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <motion.div variants={item} className="p-6 rounded-xl bg-white/5 border border-white/10">
              <h3 className="text-lg font-medium text-white mb-4">Registration Status</h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Status:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-medium ${
                      registration?.status === "approved"
                        ? "bg-green-500/10 text-green-400"
                        : registration?.status === "rejected"
                        ? "bg-red-500/10 text-red-400"
                        : "bg-yellow-500/10 text-yellow-400"
                    }`}
                  >
                    {registration?.status.charAt(0).toUpperCase() + registration?.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-400">
                    Registered on: {new Date(registration?.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Team Members */}
            <motion.div variants={item} className="p-6 rounded-xl bg-white/5 border border-white/10">
              <h3 className="text-lg font-medium text-white mb-4">Team Members</h3>
              <div className="space-y-4">
                {registration?.team_members.map((member, index) => (
                  <div
                    key={member.id}
                    className="p-4 rounded-lg bg-white/5 border border-white/10 flex flex-col sm:flex-row gap-4 justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-purple-400" />
                        <span className="text-white font-medium">{member.name || "No name"}</span>
                        {index === 0 && (
                          <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">
                            Team Leader
                          </span>
                        )}
                      </div>
                      <div className="space-y-1 text-sm text-gray-400">
                        <p className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {member.email || "No email"}
                        </p>
                        <p className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {member.phone || "No phone"}
                        </p>
                        <p className="flex items-center gap-2">
                          <User2 className="w-4 h-4" />
                          {member.gender 
                            ? member.gender.charAt(0).toUpperCase() + member.gender.slice(1)
                            : "Not specified"}
                        </p>
                        <p className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4" />
                          {member.year ? formatYear(member.year) : "No year"} Year
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">
                      <p className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        {member.college}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Event Details & Payment */}
          <div className="space-y-6">
            {/* Selected Events */}
            <motion.div variants={item} className="p-6 rounded-xl bg-white/5 border border-white/10">
              <h3 className="text-lg font-medium text-white mb-4">Selected Events</h3>
              <div className="space-y-3">
                {registration?.selected_events.map((eventId) => {
                  const event = events.find((e) => e.id === eventId);
                  return (
                    <div
                      key={eventId}
                      className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2"
                    >
                      <Calendar className="w-4 h-4 text-purple-400" />
                      <span className="text-gray-300">{event?.title || "Unknown Event"}</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="text-gray-400">Total Events</span>
                <span className="text-white font-medium">
                  {registration?.selected_events.length} Events
                </span>
              </div>
            </motion.div>

            {/* Payment Details */}
            <motion.div variants={item} className="p-6 rounded-xl bg-white/5 border border-white/10">
              <h3 className="text-lg font-medium text-white mb-4">Payment Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                  <span className="text-gray-400">Total Amount</span>
                  <span className="text-white font-medium">₹{registration?.total_amount}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                  <span className="text-gray-400">Payment Status</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      registration?.payment_status === "completed"
                        ? "bg-green-500/10 text-green-400"
                        : "bg-yellow-500/10 text-yellow-400"
                    }`}
                  >
                    {registration?.payment_status 
                      ? registration.payment_status.charAt(0).toUpperCase() + 
                        registration.payment_status.slice(1)
                      : "Pending"}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Resend Emails Button */}
            {registration?.status === "approved" && (
              <motion.div variants={item}>
                <Button
                  variant="secondary"
                  onClick={handleResendEmails}
                  disabled={updating}
                  className="w-full bg-white/5 hover:bg-white/10 text-white border-white/10"
                >
                  {updating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      <span>Resending...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      <span>Resend Approval Emails</span>
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </AdminLayout>
  );
}
