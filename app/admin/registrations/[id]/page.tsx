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
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { sendApprovalEmails, sendRejectionEmails } from "@/lib/send-email";
import { events } from "@/data/events";

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
        .select(
          `
          *,
          team_members (*)
        `
        )
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
      <div className="space-y-6">
        {/* Back Button and Status Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Registrations</span>
          </button>

          {/* Status Actions - Stack on mobile */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button
              onClick={() => handleStatusUpdate("approved")}
              disabled={updating || registration?.status === "approved"}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
            >
              <Check className="w-4 h-4 mr-2" />
              Approve
            </Button>
            <Button
              onClick={() => handleStatusUpdate("rejected")}
              disabled={updating || registration?.status === "rejected"}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
            >
              <X className="w-4 h-4 mr-2" />
              Reject
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Status Badge - More prominent on mobile */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10">
              <span className="text-sm text-gray-400">Status:</span>
              <span
                className={`px-2 py-1 rounded-full text-sm font-medium ${
                  registration?.status === "approved"
                    ? "bg-green-500/10 text-green-400"
                    : registration?.status === "rejected"
                      ? "bg-red-500/10 text-red-400"
                      : "bg-yellow-500/10 text-yellow-400"
                }`}
              >
                {registration?.status.charAt(0).toUpperCase() +
                  registration?.status.slice(1)}
              </span>
            </div>

            {/* Resend Emails Button - Moved here */}
            {registration.status === "approved" && (
              <Button
                variant="secondary"
                onClick={handleResendEmails}
                disabled={updating}
                className="h-[52px] bg-white/5 hover:bg-white/10 text-white border-white/10"
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
            )}
          </div>

          {/* Team Members and Details - Stack on mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Team Members Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                Team Members
              </h3>
              <div className="space-y-3">
                {registration?.team_members.map((member, index) => (
                  <div
                    key={member.id}
                    className="bg-white/5 border border-white/10 rounded-lg p-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <h4 className="text-base text-white font-medium flex items-center gap-2">
                        <User className="w-4 h-4 text-purple-400" />
                        {member.name}
                        {index === 0 && (
                          <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">
                            Team Leader
                          </span>
                        )}
                      </h4>
                    </div>
                    <div className="grid gap-2 text-sm text-gray-400">
                      <p className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {member.email}
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {member.phone}
                      </p>
                      <p className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        {member.college}
                      </p>
                      <p>
                        {member.department} - {formatYear(member.year)} Year
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Event and Payment Details */}
            <div className="space-y-6">
              {/* Events Section */}
              <div>
                <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-purple-400" />
                  Event Details
                </h3>
                <div className="space-y-3">
                  {registration?.selected_events.map((eventId) => (
                    <div
                      key={eventId}
                      className="bg-white/5 border border-white/10 rounded-lg p-4"
                    >
                      <h4 className="text-base text-white font-medium mb-2">
                        {events.find((e) => e.id === eventId)?.title}
                      </h4>
                      <p className="text-sm text-gray-400">
                        {events.find((e) => e.id === eventId)?.shortDescription}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Details */}
              <div>
                <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                  <svg
                    className="w-5 h-5 text-purple-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Payment Details
                </h3>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Status:</span>
                      <span className="text-white">
                        {registration?.payment_status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Amount:</span>
                      <span className="text-white">
                        ₹{registration?.total_amount}
                      </span>
                    </div>
                    {registration?.transaction_id && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Transaction ID:</span>
                        <span className="text-white break-all">
                          {registration.transaction_id}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
