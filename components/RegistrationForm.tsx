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
import Image from "next/image";

const INITIAL_MEMBER: TeamMember = {
  name: "",
  email: "",
  phone: "",
  college: "",
  department: "",
  year: "",
};

const YEAR_OPTIONS = [
  { value: "1", label: "First Year" },
  { value: "2", label: "Second Year" },
  { value: "3", label: "Third Year" },
  { value: "4", label: "Fourth Year" },
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

  const calculateTotal = () => {
    return selectedEvents.length * 500;
  };

  const handleTeamSizeChange = (size: number) => {
    setTeamSize(size);
    if (size > teamMembers.length) {
      setTeamMembers([
        ...teamMembers,
        ...Array(size - teamMembers.length)
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
      // Upload screenshot first
      const screenshotFile = paymentDetails.paymentScreenshot;
      const fileExt = screenshotFile?.name.split(".").pop();
      const fileName = `payment-proofs/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("innothon")
        .upload(fileName, screenshotFile!);

      if (uploadError) throw uploadError;

      // Create the registration record with payment details
      const { data: registration, error: registrationError } = await supabase
        .from("registrations")
        .insert([
          {
            team_size: teamSize,
            selected_events: selectedEvents,
            total_amount: calculateTotal(),
            status: "pending",
            payment_status: "pending",
            payment_proof: fileName,
            transaction_id: paymentDetails.transactionId,
            payment_method: paymentDetails.paymentMethod,
          },
        ])
        .select()
        .single();

      if (registrationError) throw registrationError;

      // Insert team members
      const teamMembersData = teamMembers.map((member, index) => ({
        registration_id: registration.id,
        name: member.name,
        email: member.email,
        phone: member.phone,
        college: member.college,
        department: member.department,
        year: member.year,
        is_team_leader: index === 0,
      }));

      const { error: teamMembersError } = await supabase
        .from("team_members")
        .insert(teamMembersData);

      if (teamMembersError) throw teamMembersError;

      toast({
        title: "Registration Successful!",
        description:
          "Your team has been registered. We'll verify your payment and update you soon.",
        variant: "success",
      });

      // Reset form
      setSelectedEvents([]);
      setTeamSize(1);
      setTeamMembers([{ ...INITIAL_MEMBER }]);
      setCurrentStep(1);
      setPaymentDetails({
        transactionId: "",
        paymentScreenshot: null,
        paymentMethod: "upi",
      });
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

            <form onSubmit={handleSubmit} className="space-y-8">
              {currentStep === 1 ? (
                <>
                  {/* Team Size Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-4">
                      Team Size
                    </label>
                    <div className="flex gap-4">
                      {[1, 2, 3].map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => handleTeamSizeChange(size)}
                          className={`px-6 py-3 rounded-lg border ${
                            teamSize === size
                              ? "border-purple-500 bg-purple-500/20 text-white"
                              : "border-white/10 text-gray-400 hover:border-white/20"
                          } transition-all`}
                        >
                          {size} {size === 1 ? "Member" : "Members"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Fixed height container for team members */}
                  <div className="min-h-[400px] transition-all duration-300">
                    {teamMembers.map((member, index) => (
                      <div key={index} className="space-y-6 mb-8">
                        <div className="border-b border-white/10 pb-2">
                          <h3 className="text-lg font-medium text-white">
                            Team Member {index + 1}
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Full Name
                            </label>
                            <input
                              type="text"
                              required
                              value={member.name}
                              onChange={(e) =>
                                updateTeamMember(index, "name", e.target.value)
                              }
                              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Email
                            </label>
                            <input
                              type="email"
                              required
                              value={member.email}
                              onChange={(e) =>
                                updateTeamMember(index, "email", e.target.value)
                              }
                              onBlur={(e) => {
                                if (
                                  e.target.value &&
                                  !isValidEmail(e.target.value)
                                ) {
                                  toast({
                                    title: "Invalid Email",
                                    description:
                                      "Please enter a valid email address",
                                    variant: "destructive",
                                  });
                                }
                              }}
                              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Phone
                            </label>
                            <input
                              type="tel"
                              required
                              value={member.phone}
                              onChange={(e) =>
                                updateTeamMember(index, "phone", e.target.value)
                              }
                              onBlur={(e) => {
                                if (
                                  e.target.value &&
                                  !isValidIndianPhone(e.target.value)
                                ) {
                                  toast({
                                    title: "Invalid Phone Number",
                                    description:
                                      "Please enter a valid 10-digit Indian mobile number",
                                    variant: "destructive",
                                  });
                                }
                              }}
                              placeholder="10-digit mobile number"
                              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              College
                            </label>
                            <input
                              type="text"
                              required
                              value={member.college}
                              onChange={(e) =>
                                updateTeamMember(
                                  index,
                                  "college",
                                  e.target.value
                                )
                              }
                              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Department
                            </label>
                            <input
                              type="text"
                              required
                              value={member.department}
                              onChange={(e) =>
                                updateTeamMember(
                                  index,
                                  "department",
                                  e.target.value
                                )
                              }
                              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Year
                            </label>
                            <select
                              required
                              value={member.year}
                              onChange={(e) =>
                                updateTeamMember(index, "year", e.target.value)
                              }
                              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                            >
                              <option value="" className="bg-gray-900">
                                Select Year
                              </option>
                              {YEAR_OPTIONS.map((option) => (
                                <option
                                  key={option.value}
                                  value={option.value}
                                  className="bg-gray-900"
                                >
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Event Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-4">
                      Select Events (₹500 per event)
                    </label>
                    <div className="space-y-4">
                      {events.map((event) => (
                        <div
                          key={event.id}
                          className="flex items-center space-x-3"
                        >
                          <Checkbox
                            id={event.id}
                            checked={selectedEvents.includes(event.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedEvents([
                                  ...selectedEvents,
                                  event.id,
                                ]);
                              } else {
                                setSelectedEvents(
                                  selectedEvents.filter((id) => id !== event.id)
                                );
                              }
                            }}
                          />
                          <label
                            htmlFor={event.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-300"
                          >
                            {event.title}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-6">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-gray-300">Total Amount:</span>
                      <span className="text-xl font-semibold text-white">
                        ₹{calculateTotal()}
                      </span>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting || selectedEvents.length === 0}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Registering...</span>
                        </div>
                      ) : (
                        "Register Now"
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  <div className="bg-black/30 p-4 sm:p-6 rounded-lg border border-white/10">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-medium text-white">
                        Payment Details
                      </h3>
                      <div className="px-4 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
                        <span className="text-sm text-purple-400">
                          Step 2 of 2
                        </span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <Progress value={100} className="mb-8" />

                    {/* Payment Method Selection - Make it stack on mobile */}
                    <div className="mb-6 sm:mb-8">
                      <Label className="text-gray-300 mb-3 block">
                        Select Payment Method
                      </Label>
                      <div className="grid grid-cols-1 gap-3 sm:gap-4">
                        <button
                          type="button"
                          onClick={() =>
                            setPaymentDetails((prev) => ({
                              ...prev,
                              paymentMethod: "upi",
                            }))
                          }
                          className={`p-3 sm:p-4 rounded-lg border transition-all ${
                            paymentDetails.paymentMethod === "upi"
                              ? "border-purple-500/50 bg-purple-500/10"
                              : "border-white/10 hover:border-white/20"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                              <Image
                                src="/upi-icon.png"
                                width={24}
                                height={24}
                                alt="UPI"
                                className="opacity-80"
                              />
                            </div>
                            <div className="text-left">
                              <p className="text-white font-medium">
                                Google Pay / UPI
                              </p>
                              <p className="text-sm text-gray-400">
                                Pay using any UPI app
                              </p>
                            </div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setPaymentDetails((prev) => ({
                              ...prev,
                              paymentMethod: "bank",
                            }))
                          }
                          className={`p-3 sm:p-4 rounded-lg border transition-all ${
                            paymentDetails.paymentMethod === "bank"
                              ? "border-purple-500/50 bg-purple-500/10"
                              : "border-white/10 hover:border-white/20"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                              <Image
                                src="/bank-icon.png"
                                width={24}
                                height={24}
                                alt="Bank"
                                className="opacity-80"
                              />
                            </div>
                            <div className="text-left">
                              <p className="text-white font-medium">
                                Bank Transfer
                              </p>
                              <p className="text-sm text-gray-400">
                                Direct bank transfer
                              </p>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Payment Details - Stack on mobile */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="p-4 sm:p-6 rounded-lg bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-white/10">
                        {paymentDetails.paymentMethod === "upi" ? (
                          <>
                            <h4 className="text-lg font-medium text-white mb-4">
                              UPI Details
                            </h4>
                            <div className="space-y-4">
                              <div className="bg-black/30 p-4 rounded-lg border border-white/10">
                                <p className="text-sm text-gray-400 mb-1">
                                  UPI ID
                                </p>
                                <p className="text-white font-medium">
                                  example@upi
                                </p>
                              </div>
                              <div className="flex justify-center">
                                <Image
                                  src="/qr-code.png"
                                  alt="UPI QR Code"
                                  width={200}
                                  height={200}
                                  className="rounded-lg"
                                />
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <h4 className="text-lg font-medium text-white mb-4">
                              Bank Details
                            </h4>
                            <div className="space-y-3">
                              <div className="bg-black/30 p-3 rounded-lg border border-white/10">
                                <p className="text-sm text-gray-400">
                                  Account Name
                                </p>
                                <p className="text-white">Your Name</p>
                              </div>
                              <div className="bg-black/30 p-3 rounded-lg border border-white/10">
                                <p className="text-sm text-gray-400">
                                  Account Number
                                </p>
                                <p className="text-white">XXXXXXXXXX</p>
                              </div>
                              <div className="bg-black/30 p-3 rounded-lg border border-white/10">
                                <p className="text-sm text-gray-400">
                                  IFSC Code
                                </p>
                                <p className="text-white">XXXXX0000XXX</p>
                              </div>
                              <div className="bg-black/30 p-3 rounded-lg border border-white/10">
                                <p className="text-sm text-gray-400">
                                  Bank Name
                                </p>
                                <p className="text-white">Bank Name</p>
                              </div>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-black/30 border border-white/10">
                          <h4 className="text-lg font-medium text-white mb-2">
                            Amount to Pay
                          </h4>
                          <div className="text-2xl sm:text-3xl font-bold text-white">
                            ₹{calculateTotal()}
                          </div>
                          <p className="text-sm text-gray-400 mt-2">
                            Please pay the exact amount
                          </p>
                        </div>

                        {/* Transaction ID - Mobile friendly padding */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="transactionId"
                            className="text-gray-300"
                          >
                            Transaction ID
                          </Label>
                          <Input
                            id="transactionId"
                            value={paymentDetails.transactionId}
                            onChange={(e) =>
                              setPaymentDetails((prev) => ({
                                ...prev,
                                transactionId: e.target.value,
                              }))
                            }
                            className="bg-black/30 border-white/10 text-white placeholder-gray-500 h-11"
                            placeholder="Enter your transaction ID"
                          />
                        </div>

                        {/* File Upload - Better mobile touch target */}
                        <div className="space-y-2">
                          <Label htmlFor="screenshot" className="text-gray-300">
                            Payment Screenshot
                          </Label>
                          <div className="mt-1">
                            <label
                              htmlFor="screenshot"
                              className="flex items-center justify-center w-full h-24 sm:h-32 px-4 transition bg-black/30 border-2 border-white/10 border-dashed rounded-lg appearance-none cursor-pointer hover:border-purple-500/50 focus:outline-none active:border-purple-500/50 touch-manipulation"
                            >
                              <span className="flex items-center space-x-2">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-6 h-6 text-gray-400"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                  />
                                </svg>
                                <span className="text-gray-400">
                                  {paymentDetails.paymentScreenshot
                                    ? paymentDetails.paymentScreenshot.name
                                    : "Click to upload payment proof"}
                                </span>
                              </span>
                              <input
                                id="screenshot"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    setPaymentDetails((prev) => ({
                                      ...prev,
                                      paymentScreenshot: file,
                                    }));
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Buttons - Fixed styling and mobile-friendly */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(1)}
                      className="w-full sm:flex-1 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white active:bg-white/20 touch-manipulation"
                    >
                      ← Back to Details
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 active:from-purple-800 active:to-blue-800 touch-manipulation"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Processing...</span>
                        </div>
                      ) : (
                        "Complete Registration →"
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegistrationForm;
