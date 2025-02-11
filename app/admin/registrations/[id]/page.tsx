"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase";
import { Registration } from "@/types/registration";
import { Button } from "@/components/ui/button";
import {
  Check,
  X,
  ArrowLeft,
  IndianRupee,
  Users,
  Calendar,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

export default function RegistrationDetail() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

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
  }, [params.id]);

  useEffect(() => {
    fetchRegistration();
  }, [fetchRegistration]);

  useEffect(() => {
    const channel = supabase
      .channel("registration_detail_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "registrations",
          filter: `id=eq.${params.id}`,
        },
        () => {
          fetchRegistration();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [params.id]);

  async function handleStatusUpdate(status: "approved" | "rejected") {
    try {
      setUpdating(true);
      console.log("Updating status to:", status);

      // First, verify we can read the registration
      const { data: existingReg, error: readError } = await supabase
        .from("registrations")
        .select("*")
        .eq("id", params.id)
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
        .eq("id", params.id)
        .select();

      if (updateError) {
        console.error("Error updating status:", updateError);
        throw updateError;
      }

      console.log("Update response:", updateData);

      // Update local state
      if (updateData?.[0]) {
        setRegistration((prev) => ({
          ...prev!,
          status: status,
          payment_status: status === "approved" ? "completed" : "pending",
        }));
      }

      // Fetch fresh data
      await fetchRegistration();

      toast({
        title: "Success",
        description: `Registration ${status} successfully`,
        variant: status === "approved" ? "default" : "destructive",
      });
    } catch (error) {
      console.error("Error in handleStatusUpdate:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update registration status",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  }

  const formatYear = (year: string) => {
    const yearMap: { [key: string]: string } = {
      "1": "1st",
      "2": "2nd",
      "3": "3rd",
      "4": "4th",
    };
    return yearMap[year] || year;
  };

  const formatPaymentMethod = (method: string) => {
    const methodMap: { [key: string]: string } = {
      upi: "UPI",
      bank: "Bank Transfer",
    };
    return methodMap[method] || method;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!registration) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center">
            <p className="text-gray-400">Registration not found</p>
          </div>
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
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white hover:border-white/20 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          {registration.status === "pending" && (
            <div className="flex gap-3">
              <Button
                onClick={() => handleStatusUpdate("approved")}
                disabled={updating}
                className="flex-1 bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 hover:border-green-500/30 transition-colors"
              >
                <Check className="w-4 h-4 mr-2" />
                {updating ? "Approving..." : "Approve Registration"}
              </Button>
              <Button
                onClick={() => handleStatusUpdate("rejected")}
                disabled={updating}
                className="flex-1 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/30 transition-colors"
              >
                <X className="w-4 h-4 mr-2" />
                {updating ? "Rejecting..." : "Reject Registration"}
              </Button>
            </div>
          )}
        </div>

        {/* Registration Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Team Details */}
          <div className="space-y-6">
            <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Team Details
              </h3>
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

          {/* Payment and Status Details */}
          <div className="space-y-6">
            <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Registration Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">Team Size</span>
                  </div>
                  <p className="text-white font-medium">
                    {registration.team_size}
                  </p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <IndianRupee className="w-4 h-4" />
                    <span className="text-sm">Amount</span>
                  </div>
                  <p className="text-white font-medium">
                    ₹{registration.total_amount}
                  </p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Registered On</span>
                  </div>
                  <p className="text-white font-medium">
                    {new Date(registration.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <span className="text-sm">Status</span>
                  </div>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs ${
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
            </div>

            {/* Payment Details */}
            <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Payment Details
              </h3>
              <div className="space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <p className="text-gray-400 mb-1">Transaction ID</p>
                  <p className="text-white">{registration.transaction_id}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <p className="text-gray-400 mb-1">Payment Method</p>
                  <p className="text-white">
                    {formatPaymentMethod(registration.payment_method)}
                  </p>
                </div>
                {registration.payment_proof && (
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <p className="text-gray-400 mb-2">Payment Proof</p>
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
