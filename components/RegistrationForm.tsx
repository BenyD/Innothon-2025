"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { events } from "@/data/events";
import { supabase } from "@/lib/supabase";
import { Checkbox } from "@/components/ui/checkbox";
import { SectionTitle } from "@/components/ui/section-title";
import type { TeamMember } from "@/types/registration";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Smartphone, Building2, Check, User } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const INITIAL_MEMBER: TeamMember = {
  id: "",
  name: "",
  email: "",
  phone: "",
  college: "",
  department: "",
  year: "",
  gender: "",
};

const YEAR_OPTIONS = [
  { value: "1", label: "First Year" },
  { value: "2", label: "Second Year" },
  { value: "3", label: "Third Year" },
  { value: "4", label: "Fourth Year" },
];

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidIndianPhone = (phone: string) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\D/g, ""));
};

const RegistrationForm = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [teamSize, setTeamSize] = useState<number>(1);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { ...INITIAL_MEMBER },
  ]);
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [paymentDetails, setPaymentDetails] = useState({
    transactionId: "",
    paymentScreenshot: null as File | null,
    paymentMethod: "upi" as "upi" | "bank",
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const calculateTotal = () => {
    return selectedEvents.length * 500;
  };

  const handleTeamSizeChange = (size: number) => {
    setTeamSize(size);
    if (size > teamMembers.length) {
      setTeamMembers([
        ...teamMembers,
        ...Array(Math.min(size, 3) - teamMembers.length)
          .fill(null)
          .map(() => ({ ...INITIAL_MEMBER })),
      ]);
    } else {
      setTeamMembers(teamMembers.slice(0, size));
    }
  };

  const updateTeamMember = (
    index: number,
    field: keyof TeamMember,
    value: string
  ) => {
    const updatedMembers = [...teamMembers];

    if (field === "phone") {
      // Remove non-digits and limit to 10 digits
      value = value.replace(/\D/g, "").slice(0, 10);
    }

    updatedMembers[index] = {
      ...updatedMembers[index],
      [field]: value,
    };
    setTeamMembers(updatedMembers);
  };

  const validatePaymentDetails = () => {
    if (!paymentDetails.transactionId) {
      toast({
        title: "Missing Transaction ID",
        description: "Please enter the transaction ID",
        variant: "destructive",
      });
      return false;
    }
    if (!paymentDetails.paymentScreenshot) {
      toast({
        title: "Missing Payment Proof",
        description: "Please upload the payment screenshot",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (currentStep === 1) {
      // Validate first step
      const isValid = teamMembers.every(
        (member) =>
          member.name &&
          member.email &&
          isValidEmail(member.email) &&
          member.phone &&
          isValidIndianPhone(member.phone) &&
          member.college &&
          member.department &&
          member.year
      );

      if (!isValid) {
        toast({
          title: "Validation Error",
          description:
            "Please check all fields. Ensure valid email and 10-digit Indian phone number.",
          variant: "destructive",
        });
        return;
      }

      if (selectedEvents.length === 0) {
        toast({
          title: "Error",
          description: "Please select at least one event",
          variant: "destructive",
        });
        return;
      }

      // Move to payment step
      setCurrentStep(2);
      return;
    }

    // Handle final submission
    if (!validatePaymentDetails()) return;

    setIsSubmitting(true);

    try {
      // Generate a unique team ID (you can use any UUID generation method)
      const team_id = `TEAM-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Create the registration object
      const registration = {
        team_id,
        team_size: teamSize,
        selected_events: selectedEvents,
        total_amount: calculateTotal(),
        status: "pending",
        payment_status: "pending",
        created_at: new Date().toISOString(),
        payment_method: paymentDetails.paymentMethod,
        transaction_id: paymentDetails.transactionId,
      };

      // Insert registration
      const { data: regData, error: regError } = await supabase
        .from("registrations")
        .insert([registration])
        .select()
        .single();

      if (regError) throw regError;

      // Update team members with the registration ID and team ID
      const updatedTeamMembers = teamMembers.map((member) => ({
        ...member,
        id: Math.random().toString(36).substr(2, 9),
        registration_id: regData.id,
        team_id: team_id
      }));

      // Insert team members
      const { error: teamError } = await supabase
        .from("team_members")
        .insert(updatedTeamMembers);

      if (teamError) throw teamError;

      // Show success modal instead of toast
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description:
          "There was an error processing your registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="px-4">
      <div className="max-w-3xl mx-auto">
        <SectionTitle
          title="Register for Events"
          subtitle="Fill out the form below to register for our exciting events"
        />

        <div className="relative mt-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-xl blur-lg opacity-50" />
          <div className="relative bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 md:p-8">
            {/* Progress Bar */}
            <div className="mb-8">
              <Progress value={currentStep === 1 ? 50 : 100} className="h-2" />
              <div className="flex justify-between mt-2 text-sm text-gray-400">
                <span
                  className={
                    currentStep === 1 ? "text-purple-400" : "text-green-400"
                  }
                >
                  Registration Details
                </span>
                <span
                  className={
                    currentStep === 2 ? "text-purple-400" : "text-gray-400"
                  }
                >
                  Payment
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
              {currentStep === 1 ? (
                <>
                  {/* Step 1: Event Selection and Team Details */}
                  <div className="space-y-8">
                    {/* Event Selection */}
                    <div>
                      <SectionTitle
                        title="Select Events"
                        subtitle="Choose the events you want to participate in"
                      />
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                        {events.map((event) => (
                          <label
                            key={event.id}
                            className={`relative flex flex-col gap-2 p-4 rounded-xl border cursor-pointer transition-all ${
                              selectedEvents.includes(event.id)
                                ? "bg-white/10 border-purple-500"
                                : "bg-black/50 border-white/10 hover:bg-white/5"
                            }`}
                          >
                            <Checkbox
                              checked={selectedEvents.includes(event.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedEvents([
                                    ...selectedEvents,
                                    event.id,
                                  ]);
                                } else {
                                  setSelectedEvents(
                                    selectedEvents.filter(
                                      (id) => id !== event.id
                                    )
                                  );
                                }
                              }}
                              className="absolute right-3 top-3"
                            />
                            <h3 className="font-medium text-white pr-8">
                              {event.title}
                            </h3>
                            <p className="text-sm text-gray-400">
                              {event.shortDescription}
                            </p>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Team Size Selection */}
                    <div>
                      <SectionTitle
                        title="Team Size"
                        subtitle="Select the number of team members"
                      />
                      <div className="grid grid-cols-3 gap-3 mt-4">
                        {[1, 2, 3].map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => handleTeamSizeChange(size)}
                            className={`p-4 rounded-xl border text-center transition-all ${
                              teamSize === size
                                ? "bg-white/10 border-purple-500 text-white"
                                : "bg-black/50 border-white/10 text-gray-400 hover:bg-white/5 hover:text-white"
                            }`}
                          >
                            <span className="text-lg">{size}</span>
                            <br />
                            <span className="text-sm">
                              {size === 1 ? "Member" : "Members"}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Team Members Details */}
                    <div>
                      <SectionTitle
                        title="Team Details"
                        subtitle="Fill in the details for each team member"
                      />
                      <div className="space-y-6 mt-4">
                        {teamMembers.map((member, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-black/50 border border-white/10 rounded-xl p-4 space-y-4"
                          >
                            <div className="flex items-center gap-2 text-white">
                              <User className="w-5 h-5" />
                              <h3 className="font-medium">
                                {index === 0
                                  ? "Team Leader"
                                  : `Member ${index + 1}`}
                              </h3>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                              <div className="space-y-2">
                                <Label htmlFor={`name-${index}`}>
                                  Full Name
                                </Label>
                                <Input
                                  id={`name-${index}`}
                                  value={member.name}
                                  onChange={(e) =>
                                    updateTeamMember(
                                      index,
                                      "name",
                                      e.target.value
                                    )
                                  }
                                  className="bg-white/5 border-white/10"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`email-${index}`}>Email</Label>
                                <Input
                                  id={`email-${index}`}
                                  type="email"
                                  value={member.email}
                                  onChange={(e) =>
                                    updateTeamMember(
                                      index,
                                      "email",
                                      e.target.value
                                    )
                                  }
                                  className="bg-white/5 border-white/10"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`phone-${index}`}>Phone</Label>
                                <div className="relative">
                                  <Input
                                    id={`phone-${index}`}
                                    value={member.phone}
                                    onChange={(e) =>
                                      updateTeamMember(
                                        index,
                                        "phone",
                                        e.target.value
                                      )
                                    }
                                    className="bg-white/5 border-white/10 pl-10"
                                  />
                                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`college-${index}`}>
                                  College
                                </Label>
                                <div className="relative">
                                  <Input
                                    id={`college-${index}`}
                                    value={member.college}
                                    onChange={(e) =>
                                      updateTeamMember(
                                        index,
                                        "college",
                                        e.target.value
                                      )
                                    }
                                    className="bg-white/5 border-white/10 pl-10"
                                  />
                                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`department-${index}`}>
                                  Department
                                </Label>
                                <Input
                                  id={`department-${index}`}
                                  value={member.department}
                                  onChange={(e) =>
                                    updateTeamMember(
                                      index,
                                      "department",
                                      e.target.value
                                    )
                                  }
                                  className="bg-white/5 border-white/10"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`year-${index}`}>Year</Label>
                                <select
                                  id={`year-${index}`}
                                  value={member.year}
                                  onChange={(e) =>
                                    updateTeamMember(
                                      index,
                                      "year",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                  <option value="">Select Year</option>
                                  {YEAR_OPTIONS.map((option) => (
                                    <option
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`gender-${index}`}>Gender</Label>
                                <Select
                                  value={member.gender}
                                  onValueChange={(value) => updateTeamMember(index, "gender", value)}
                                >
                                  <SelectTrigger
                                    id={`gender-${index}`}
                                    className="w-full bg-white/5 border-white/10 text-white"
                                  >
                                    <SelectValue placeholder="Select Gender" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {GENDER_OPTIONS.map((option) => (
                                      <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Next Step Button */}
                    <div className="sticky bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black to-transparent pt-6 pb-4 -mx-4 px-4 sm:static sm:bg-none sm:p-0 sm:mx-0">
                      <Button
                        type="submit"
                        disabled={selectedEvents.length === 0}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Continue to Payment
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-8">
                    {/* Payment Instructions */}
                    <div className="space-y-6 mt-8">
                      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                        <h3 className="text-2xl font-semibold text-white mb-4">
                          Payment Details
                        </h3>

                        {/* Total Amount Display */}
                        <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
                          <div className="text-center">
                            <p className="text-gray-400 text-sm">
                              Total Amount
                            </p>
                            <p className="text-3xl font-bold text-white">
                              ₹{calculateTotal()}
                            </p>
                          </div>
                        </div>

                        {/* Payment Method Selection */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <label
                            className={`relative flex flex-col p-4 border rounded-lg cursor-pointer
                              ${
                                paymentDetails.paymentMethod === "upi"
                                  ? "border-purple-500 bg-purple-500/10"
                                  : "border-white/10 bg-white/5 hover:bg-white/10"
                              }`}
                          >
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="upi"
                              checked={paymentDetails.paymentMethod === "upi"}
                              onChange={(e) =>
                                setPaymentDetails({
                                  ...paymentDetails,
                                  paymentMethod: e.target.value as
                                    | "upi"
                                    | "bank",
                                })
                              }
                              className="absolute right-3 top-3"
                            />
                            <h4 className="font-medium text-white">
                              UPI Payment
                            </h4>
                            <p className="text-sm text-gray-400">
                              Scan QR code or pay to UPI ID
                            </p>
                          </label>

                          <label
                            className={`relative flex flex-col p-4 border rounded-lg cursor-pointer
                              ${
                                paymentDetails.paymentMethod === "bank"
                                  ? "border-purple-500 bg-purple-500/10"
                                  : "border-white/10 bg-white/5 hover:bg-white/10"
                              }`}
                          >
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="bank"
                              checked={paymentDetails.paymentMethod === "bank"}
                              onChange={(e) =>
                                setPaymentDetails({
                                  ...paymentDetails,
                                  paymentMethod: e.target.value as
                                    | "upi"
                                    | "bank",
                                })
                              }
                              className="absolute right-3 top-3"
                            />
                            <h4 className="font-medium text-white">
                              Bank Transfer
                            </h4>
                            <p className="text-sm text-gray-400">
                              NEFT, IMPS, or Direct Transfer
                            </p>
                          </label>
                        </div>

                        {/* Payment Details Based on Selection */}
                        {paymentDetails.paymentMethod === "upi" ? (
                          <div className="space-y-4">
                            <div className="flex justify-center">
                              <div className="bg-white p-4 rounded-lg">
                                <Image
                                  src="/qr-code.png"
                                  alt="Payment QR Code"
                                  width={200}
                                  height={200}
                                  className="rounded-lg"
                                />
                              </div>
                            </div>
                            <div className="text-center">
                              <p className="text-gray-400 text-sm mb-2">
                                UPI ID
                              </p>
                              <p className="text-white font-medium">
                                8668090679@iob
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                              <div className="grid gap-3">
                                <div>
                                  <p className="text-sm text-gray-400">
                                    Account Name
                                  </p>
                                  <p className="text-white">
                                    HINDUSTAN INSTITUTE OF TECHNOLOGY AND
                                    SCIENCE
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-400">
                                    Account Number
                                  </p>
                                  <p className="text-white">255402000000001</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-400">
                                    IFSC Code
                                  </p>
                                  <p className="text-white">IOBA000254</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-400">
                                    Bank & Branch
                                  </p>
                                  <p className="text-white">
                                    Indian Overseas Bank, Padur
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Transaction ID and Screenshot Upload */}
                        <div className="space-y-4 mt-6">
                          <div>
                            <Label
                              htmlFor="transactionId"
                              className="flex items-center gap-1"
                            >
                              Transaction ID
                              <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="transactionId"
                              value={paymentDetails.transactionId}
                              onChange={(e) =>
                                setPaymentDetails({
                                  ...paymentDetails,
                                  transactionId: e.target.value,
                                })
                              }
                              placeholder="Enter your transaction ID"
                              className="mt-1"
                              required
                            />
                          </div>

                          <div>
                            <Label className="flex items-center gap-1">
                              Payment Screenshot
                              <span className="text-red-500">*</span>
                            </Label>
                            <div className="mt-1">
                              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer border-white/10 bg-white/5 hover:bg-white/10">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  {paymentDetails.paymentScreenshot ? (
                                    <p className="text-sm text-gray-400">
                                      {paymentDetails.paymentScreenshot.name}
                                    </p>
                                  ) : (
                                    <>
                                      <svg
                                        className="w-8 h-8 mb-4 text-gray-400"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 20 16"
                                      >
                                        <path
                                          stroke="currentColor"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                        />
                                      </svg>
                                      <p className="mb-2 text-sm text-gray-400">
                                        <span className="font-semibold">
                                          Click to upload
                                        </span>{" "}
                                        or drag and drop
                                      </p>
                                      <p className="text-xs text-gray-400">
                                        PNG, JPG or JPEG (MAX. 2MB)
                                      </p>
                                    </>
                                  )}
                                </div>
                                <input
                                  type="file"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={(e) =>
                                    setPaymentDetails({
                                      ...paymentDetails,
                                      paymentScreenshot:
                                        e.target.files?.[0] || null,
                                    })
                                  }
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="sticky bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black to-transparent pt-6 pb-4 -mx-4 px-4 sm:static sm:bg-none sm:p-0 sm:mx-0">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Registering...</span>
                          </div>
                        ) : (
                          "Complete Registration"
                        )}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowSuccessModal(false)}
          />

          {/* Modal Content */}
          <div className="relative h-full flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-gradient-to-b from-gray-900/95 to-black border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="flex flex-col items-center text-center">
                {/* Success Icon with Animation */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2, duration: 0.6 }}
                  className="relative"
                >
                  <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                    <div className="absolute inset-0 rounded-full bg-green-500/10 animate-ping" />
                    <Check className="w-10 h-10 text-green-400" />
                  </div>
                </motion.div>

                {/* Content */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-2xl font-semibold text-white mb-3">
                    Registration Successful! 🎉
                  </h3>
                  <div className="space-y-4 mb-8">
                    <p className="text-gray-300">
                      Thank you for registering for our events.
                    </p>
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                      <p className="text-sm text-gray-300">
                        We will verify your payment and send a confirmation
                        email containing your{" "}
                        <span className="text-purple-400 font-medium">
                          admit card
                        </span>{" "}
                        and other important details within{" "}
                        <span className="text-purple-400 font-medium">
                          24-48 hours
                        </span>
                        .
                      </p>
                    </div>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={() => {
                      setShowSuccessModal(false);
                      // Reset form state
                      setSelectedEvents([]);
                      setTeamSize(1);
                      setTeamMembers([{ ...INITIAL_MEMBER }]);
                      setCurrentStep(1);
                      setPaymentDetails({
                        transactionId: "",
                        paymentScreenshot: null,
                        paymentMethod: "upi",
                      });
                      // Navigate to home page
                      router.push("/");
                    }}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium
                      hover:from-purple-700 hover:to-blue-700 active:from-purple-800 active:to-blue-800
                      transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
                      focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-gray-900"
                  >
                    Close
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </section>
  );
};

export default RegistrationForm;
