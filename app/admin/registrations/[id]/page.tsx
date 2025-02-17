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
  Building2,
  Phone,
  Loader2,
  GraduationCap,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { sendApprovalEmails, sendRejectionEmails } from "@/lib/send-email";
import { events } from "@/data/events";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
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
    if (!registration?.team_members) return;
    
    try {
      setUpdating(true);
      
      const { error: updateError } = await supabase
        .from("registrations")
        .update({
          status,
          payment_status: status === "approved" ? "completed" : "pending",
        })
        .eq("id", params.id);

      if (updateError) throw updateError;

      // Send emails based on status
      const emailResult = await (status === "approved" 
        ? sendApprovalEmails(
            registration.team_members,
            registration.id,
            registration.selected_events,
            registration.total_amount,
            registration.team_size
          )
        : sendRejectionEmails(
            registration.team_members,
            registration.id,
            registration.selected_events,
            registration.total_amount,
            registration.team_size
          ));

      if (!emailResult.success) {
        toast({
          title: "Warning",
          description: `Registration ${status} but failed to send notification emails`,
          variant: "destructive",
        });
      }

      await fetchRegistration();
      toast({
        title: "Success",
        description: `Registration ${status} successfully`,
        variant: "success",
      });
    } catch (error) {
      console.error(`Error ${status} registration:`, error);
      toast({
        title: "Error",
        description: `Failed to ${status} registration`,
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
        <div className="p-6 text-center">
          <h2 className="text-xl font-medium text-gray-400">Registration not found</h2>
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mt-4 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
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
        className="max-w-5xl mx-auto space-y-6 p-4 sm:p-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-4 text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Registrations
            </Button>
            <h1 className="text-2xl font-bold text-white">Registration Details</h1>
          </div>
          
          {/* Action Buttons */}
          {registration.status === "pending" && (
            <div className="flex gap-3">
              <Button
                onClick={() => handleStatusUpdate("rejected")}
                variant="destructive"
                disabled={updating}
                className="bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20"
              >
                {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4 mr-2" />}
                Reject
              </Button>
              <Button
                onClick={() => handleStatusUpdate("approved")}
                variant="default"
                disabled={updating}
                className="bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20"
              >
                {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                Approve
              </Button>
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Team Information */}
          <motion.div
            variants={item}
            className="lg:col-span-2 space-y-6"
          >
            {/* Team Details */}
            <div className="bg-white/5 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-medium text-white">Team Information</h2>
              
              {/* Team Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  <span className="text-white font-medium">
                    {registration.team_members[0]?.name}
                    {registration.team_size > 1 && 
                      <span className="text-gray-400 ml-2">
                        +{registration.team_size - 1} members
                      </span>
                    }
                  </span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium
                  ${registration.status === "approved"
                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : registration.status === "rejected"
                    ? "bg-red-500/10 text-red-400 border border-red-500/20"
                    : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                  }`}
                >
                  {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                </span>
              </div>

              {/* Team Members List */}
              <div className="space-y-4 mt-6">
                {registration.team_members.map((member, index) => (
                  <div 
                    key={member.id}
                    className="p-4 rounded-lg bg-white/[0.02] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-medium">
                        {member.name}
                        {index === 0 && 
                          <span className="text-xs text-purple-400 ml-2">Team Leader</span>
                        }
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Mail className="w-4 h-4 text-blue-400" />
                        {member.email}
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Phone className="w-4 h-4 text-green-400" />
                        {member.phone}
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Building2 className="w-4 h-4 text-purple-400" />
                        {member.college}
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <GraduationCap className="w-4 h-4 text-yellow-400" />
                        {formatYear(member.year)} Year
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Events */}
            <div className="bg-white/5 rounded-xl p-6">
              <h2 className="text-lg font-medium text-white mb-4">Selected Events</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {registration.selected_events.map((eventId) => {
                  const event = events.find(e => e.id === eventId);
                  return (
                    <div
                      key={eventId}
                      className="p-3 rounded-lg bg-white/[0.02] flex items-center gap-2"
                    >
                      <Calendar className="w-4 h-4 text-purple-400" />
                      <span className="text-gray-400">{event?.title || eventId}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Side Panel */}
          <motion.div variants={item} className="space-y-6">
            {/* Payment Information */}
            <div className="bg-white/5 rounded-xl p-6">
              <h2 className="text-lg font-medium text-white mb-4">Payment Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/[0.02]">
                  <span className="text-gray-400">Amount</span>
                  <span className="text-white font-medium">₹{registration.total_amount}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/[0.02]">
                  <span className="text-gray-400">Payment Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium
                    ${registration.payment_status === "completed"
                      ? "bg-green-500/10 text-green-400"
                      : "bg-yellow-500/10 text-yellow-400"
                    }`}
                  >
                    {registration.payment_status.charAt(0).toUpperCase() + 
                      registration.payment_status.slice(1)}
                  </span>
                </div>
                {registration.transaction_id && (
                  <div className="flex justify-between items-center p-3 rounded-lg bg-white/[0.02]">
                    <span className="text-gray-400">Transaction ID</span>
                    <span className="text-white font-medium">{registration.transaction_id}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Registration Info */}
            <div className="bg-white/5 rounded-xl p-6">
              <h2 className="text-lg font-medium text-white mb-4">Registration Info</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/[0.02]">
                  <span className="text-gray-400">Team ID</span>
                  <span className="text-white font-medium">{registration.team_id}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/[0.02]">
                  <span className="text-gray-400">Registered On</span>
                  <span className="text-white font-medium">
                    {new Date(registration.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Resend Email Button */}
            {registration.status === "approved" && (
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
                    <span>Resend Approval Email</span>
                  </>
                )}
              </Button>
            )}
          </motion.div>
        </div>
      </motion.div>
    </AdminLayout>
  );
}
