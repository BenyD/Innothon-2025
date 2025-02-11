"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase";
import type { Registration } from "@/types/registration";
import { Button } from "@/components/ui/button";
import { Check, X, ArrowLeft, Calendar, Mail } from "lucide-react";
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
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {registration.status === "pending" ? (
            <div className="flex gap-3">
              <Button
                onClick={() => handleStatusUpdate("approved")}
                disabled={updating}
                className="bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 hover:border-green-500/30 transition-colors"
              >
                <Check className="w-4 h-4 mr-2" />
                {updating ? "Approving..." : "Approve Registration"}
              </Button>
              <Button
                onClick={() => handleStatusUpdate("rejected")}
                disabled={updating}
                className="bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/30 transition-colors"
              >
                <X className="w-4 h-4 mr-2" />
                {updating ? "Rejecting..." : "Reject Registration"}
              </Button>
            </div>
          ) : (
            registration.status === "approved" && (
              <Button
                onClick={handleResendEmails}
                className="bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/30 transition-colors"
              >
                <Mail className="w-4 h-4 mr-2" />
                Resend Approval Emails
              </Button>
            )
          )}
        </div>

        {/* Registration Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Team Details */}
          <div className="space-y-6">
            <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Team Details
                </h3>
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
              <div className="space-y-4">
                {registration.team_members.map((member, index) => (
                  <div
                    key={member.id}
                    className="bg-white/5 border border-white/10 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-medium">
                        {member.name}
                        {index === 0 && (
                          <span className="ml-2 text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">
                            Team Leader
                          </span>
                        )}
                      </h4>
                    </div>
                    <div className="space-y-2 text-sm text-gray-400">
                      <p>Email: {member.email}</p>
                      <p>Phone: {member.phone}</p>
                      <p>College: {member.college}</p>
                      <p>Department: {member.department}</p>
                      <p>Year: {formatYear(member.year)} Year</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Event and Payment Details */}
          <div className="space-y-6">
            <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Event Details
                </h3>
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    {new Date(registration.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">
                    Selected Events
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
              </div>
            </div>

            <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Payment Details
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">
                    Amount
                  </h4>
                  <p className="text-2xl font-semibold text-white">
                    ₹{registration.total_amount}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">
                      Payment Method
                    </h4>
                    <p className="text-gray-300">
                      {registration.payment_method === "upi"
                        ? "UPI"
                        : registration.payment_method === "bank"
                          ? "BANK"
                          : registration.payment_method}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">
                      Transaction ID
                    </h4>
                    <p className="text-gray-300">
                      {registration.transaction_id}
                    </p>
                  </div>
                </div>
                {registration.payment_proof && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">
                      Payment Proof
                    </h4>
                    <a
                      href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/innothon/${registration.payment_proof}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      View Payment Proof
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
