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
import { Smartphone, Building2, Check, User, GraduationCap, User2, Mail, Wallet, CreditCard, IndianRupee, Receipt, QrCode, Building, Upload, Copy, Users, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { v4 as uuidv4 } from 'uuid';
import { uploadPaymentProof } from "@/lib/upload-helper";
import { cleanupFailedRegistration } from "@/lib/cleanup-helper";
import { generateTeamId } from "@/lib/generate-team-id";

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

const MUTUALLY_EXCLUSIVE_EVENTS = [
  ['ai-genesis', 'digital-divas'],
  ['code-arena', 'hackquest']
];

const isEventDisabled = (eventId: string, selectedEvents: string[]): boolean => {
  for (const exclusiveGroup of MUTUALLY_EXCLUSIVE_EVENTS) {
    if (exclusiveGroup.includes(eventId)) {
      // Find the other events in this exclusive group
      const otherEvents = exclusiveGroup.filter(e => e !== eventId);
      // If any of the other events are selected, this event should be disabled
      if (otherEvents.some(e => selectedEvents.includes(e))) {
        return true;
      }
    }
  }
  return false;
};

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidIndianPhone = (phone: string) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\D/g, ""));
};

const validateFileSize = (file: File): { valid: boolean; error?: string } => {
  const MAX_SIZE_MB = 5;
  const fileSizeMB = file.size / (1024 * 1024);
  
  if (fileSizeMB > MAX_SIZE_MB) {
    return {
      valid: false,
      error: `File size (${fileSizeMB.toFixed(1)}MB) exceeds the ${MAX_SIZE_MB}MB limit`
    };
  }
  
  return { valid: true };
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

  const handleEventSelection = (eventId: string, checked: boolean) => {
    // Add console logs to debug
    console.log('Attempting to select:', eventId);
    console.log('Currently selected:', selectedEvents);
    console.log('Checking against groups:', MUTUALLY_EXCLUSIVE_EVENTS);

    if (checked) {
      // Check if selecting this event would violate mutual exclusivity
      const conflictingGroup = MUTUALLY_EXCLUSIVE_EVENTS.find(group => 
        group.includes(eventId) && group.some(e => selectedEvents.includes(e))
      );

      console.log('Found conflicting group:', conflictingGroup);

      if (conflictingGroup) {
        const conflictingEventId = conflictingGroup.find(id => id !== eventId);
        const conflictingEvent = events.find(e => e.id === conflictingEventId);
        
        console.log('Conflicting event:', conflictingEvent);

        toast({
          title: "Cannot Select Event",
          description: `This event cannot be selected together with ${conflictingEvent?.title}`,
          variant: "destructive",
        });
        return;
      }
      setSelectedEvents([...selectedEvents, eventId]);
    } else {
      setSelectedEvents(selectedEvents.filter(id => id !== eventId));
    }
  };

  const handleEmailBlur = (index: number, value: string) => {
    if (value && !isValidEmail(value)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
    }
  };

  const handlePhoneBlur = (index: number, value: string) => {
    if (value && !isValidIndianPhone(value)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit Indian phone number",
        variant: "destructive",
      });
    }
  };

  const handleEmailChange = (index: number, value: string) => {
    const newTeamMembers = [...teamMembers];
    newTeamMembers[index].email = value;
    setTeamMembers(newTeamMembers);
  };

  const handlePhoneChange = (index: number, value: string) => {
    const newTeamMembers = [...teamMembers];
    // Remove non-digits and limit to 10 digits
    const formattedValue = value.replace(/\D/g, "").slice(0, 10);
    newTeamMembers[index].phone = formattedValue;
    setTeamMembers(newTeamMembers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // If already submitting, prevent double submission
    if (isSubmitting) return;

    // Handle first step validation and navigation
    if (currentStep === 1) {
      const isValid = teamMembers.every(
        (member) =>
          member.name &&
          member.email &&
          isValidEmail(member.email) &&
          member.phone &&
          isValidIndianPhone(member.phone) &&
          member.gender &&
          member.college &&
          member.department &&
          member.year
      );

      if (!isValid) {
        toast({
          title: "Validation Error",
          description: "Please ensure all fields are filled with valid email and 10-digit Indian phone number.",
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
      // Generate team ID first
      const teamId = await generateTeamId();
      
      // Generate registration ID (can keep UUID for internal use)
      const registrationId = uuidv4();

      // Prepare team members with IDs
      const updatedTeamMembers = teamMembers.map((member) => ({
        ...member,
        id: uuidv4(),
        registration_id: registrationId,
        team_id: teamId,
      }));

      // Upload payment proof if exists
      let paymentProofUrl = null;
      if (paymentDetails.paymentScreenshot) {
        try {
          paymentProofUrl = await uploadPaymentProof(
            paymentDetails.paymentScreenshot,
            registrationId
          );
        } catch (uploadError) {
          console.error('Upload error:', uploadError);
          toast({
            title: "Upload Failed",
            description: "Failed to upload payment proof. Please try again.",
            variant: "destructive",
          });
          setIsSubmitting(false); // Reset submitting state
          return;
        }
      }

      // Create registration first
      const { error: registrationError } = await supabase
        .from("registrations")
        .insert({
          id: registrationId,
          team_id: teamId,
          team_size: teamSize,
          selected_events: selectedEvents,
          total_amount: calculateTotal(),
          status: "pending",
          payment_status: "pending",
          transaction_id: paymentDetails.transactionId,
          payment_method: paymentDetails.paymentMethod,
          payment_proof: paymentProofUrl,
        })
        .select()
        .single(); // Add single() to ensure only one record is inserted

      if (registrationError) {
        throw registrationError;
      }

      // Insert team members
      const { error: teamError } = await supabase
        .from("team_members")
        .insert(updatedTeamMembers)
        .select(); // Add select() to ensure the operation completes before proceeding

      if (teamError) {
        // If team member insertion fails, clean up the registration
        await cleanupFailedRegistration(registrationId);
        throw teamError;
      }

      setShowSuccessModal(true);
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: "There was an error processing your registration. Please try again.",
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
                        {events.map((event) => {
                          const isDisabled = isEventDisabled(event.id, selectedEvents);
                          return (
                            <label
                              key={event.id}
                              className={`relative flex flex-col gap-2 p-4 rounded-xl border transition-all ${
                                selectedEvents.includes(event.id)
                                  ? "bg-white/10 border-purple-500"
                                  : isDisabled
                                  ? "bg-black/50 border-white/10 opacity-50 cursor-not-allowed"
                                  : "bg-black/50 border-white/10 hover:bg-white/5"
                              }`}
                            >
                              <div className="absolute right-3 top-3">
                                <Checkbox
                                  checked={selectedEvents.includes(event.id)}
                                  onCheckedChange={(checked) => 
                                    handleEventSelection(event.id, checked as boolean)
                                  }
                                  disabled={isDisabled}
                                  className={isDisabled ? "cursor-not-allowed" : ""}
                                />
                              </div>
                              <h3 className="font-medium text-white pr-8">{event.title}</h3>
                              <p className="text-sm text-gray-400">{event.shortDescription}</p>
                              {isDisabled && !selectedEvents.includes(event.id) && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl">
                                  <p className="text-sm text-gray-400 px-4 text-center">
                                    Cannot be selected with {events.find(e => 
                                      MUTUALLY_EXCLUSIVE_EVENTS.find(group => 
                                        group.includes(event.id))?.find(id => id !== event.id) === e.id
                                    )?.title}
                                  </p>
                                </div>
                              )}
                            </label>
                          );
                        })}
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
                                <div className="relative">
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
                                    className="bg-white/5 border-white/10 pl-10"
                                  />
                                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`email-${index}`}>Email</Label>
                                <div className="relative">
                                  <Input
                                    id={`email-${index}`}
                                    type="email"
                                    value={member.email}
                                    onBlur={(e) => handleEmailBlur(index, e.target.value)}
                                    onChange={(e) => handleEmailChange(index, e.target.value)}
                                    className="bg-white/5 border-white/10 pl-10"
                                  />
                                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`phone-${index}`}>Phone</Label>
                                <div className="relative">
                                  <Input
                                    id={`phone-${index}`}
                                    type="tel"
                                    value={member.phone}
                                    onBlur={(e) => handlePhoneBlur(index, e.target.value)}
                                    onChange={(e) => handlePhoneChange(index, e.target.value)}
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
                                <div className="relative">
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
                                    className="bg-white/5 border-white/10 pl-10"
                                  />
                                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`year-${index}`}>Year</Label>
                                <Select
                                  value={member.year}
                                  onValueChange={(value) => updateTeamMember(index, "year", value)}
                                >
                                  <SelectTrigger
                                    id={`year-${index}`}
                                    className="w-full bg-white/5 border-white/10 text-white"
                                  >
                                    <div className="flex items-center gap-2">
                                      <GraduationCap className="w-4 h-4 text-gray-400" />
                                      <SelectValue placeholder="Select Year" />
                                    </div>
                                  </SelectTrigger>
                                  <SelectContent>
                                    {YEAR_OPTIONS.map((option) => (
                                      <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
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
                                    <div className="flex items-center gap-2">
                                      <User2 className="w-4 h-4 text-gray-400" />
                                      <SelectValue placeholder="Select Gender" />
                                    </div>
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
                    {/* Payment Summary */}
                    <div>
                      <SectionTitle
                        title="Payment Summary"
                        subtitle="Review your registration details"
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-6 rounded-xl bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10 border border-white/10"
                      >
                        <div className="space-y-4">
                          <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                            <div className="flex items-center gap-2">
                              <Receipt className="w-4 h-4 text-purple-400" />
                              <span className="text-gray-300">Events Selected</span>
                            </div>
                            <span className="text-white font-medium">{selectedEvents.length}</span>
                          </div>
                          <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-blue-400" />
                              <span className="text-gray-300">Team Size</span>
                            </div>
                            <span className="text-white font-medium">{teamSize}</span>
                          </div>
                          <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                            <div className="flex items-center gap-2">
                              <IndianRupee className="w-4 h-4 text-green-400" />
                              <span className="text-gray-300">Amount per Event</span>
                            </div>
                            <span className="text-white font-medium">₹500</span>
                          </div>
                          <div className="border-t border-white/10 pt-4 mt-4">
                            <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20">
                              <div className="flex items-center gap-2">
                                <Wallet className="w-5 h-5 text-purple-400" />
                                <span className="text-white font-medium">Total Amount</span>
                              </div>
                              <span className="text-lg font-semibold text-white">₹{calculateTotal()}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Payment Method Selection */}
                    <div>
                      <SectionTitle
                        title="Payment Method"
                        subtitle="Choose your preferred payment method"
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <button
                          type="button"
                          onClick={() => setPaymentDetails(prev => ({ ...prev, paymentMethod: "upi" }))}
                          className={`p-4 rounded-xl border transition-all ${
                            paymentDetails.paymentMethod === "upi"
                              ? "bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-purple-500/20 border-purple-500"
                              : "bg-white/5 border-white/10 hover:bg-white/10"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                              <QrCode className="w-5 h-5 text-purple-400" />
                            </div>
                            <div className="text-left">
                              <h3 className="font-medium text-white">UPI Payment</h3>
                              <p className="text-sm text-gray-400">Pay using any UPI app</p>
                            </div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentDetails(prev => ({ ...prev, paymentMethod: "bank" }))}
                          className={`p-4 rounded-xl border transition-all ${
                            paymentDetails.paymentMethod === "bank"
                              ? "bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-blue-500/20 border-blue-500"
                              : "bg-white/5 border-white/10 hover:bg-white/10"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                              <Building className="w-5 h-5 text-blue-400" />
                            </div>
                            <div className="text-left">
                              <h3 className="font-medium text-white">Bank Transfer</h3>
                              <p className="text-sm text-gray-400">Pay via NEFT/IMPS</p>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Payment Details */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl border border-white/10 overflow-hidden"
                    >
                      {paymentDetails.paymentMethod === "upi" ? (
                        <div className="p-6 space-y-6">
                          <div className="flex flex-col items-center">
                            <Image
                              src="/upi-qr.png"
                              alt="UPI QR Code"
                              width={200}
                              height={200}
                              className="rounded-lg"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            <div className="mt-4 text-center">
                              <p className="text-gray-400 text-sm">UPI ID</p>
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-white font-medium">8668090679@iob</p>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText("8668090679@iob");
                                    toast({
                                      title: "Copied to clipboard",
                                      description: "UPI ID has been copied to your clipboard",
                                    });
                                  }}
                                  className="p-1 rounded-md hover:bg-white/10"
                                >
                                  <Copy className="w-4 h-4 text-gray-400" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="divide-y divide-white/10">
                          <div className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                            <h3 className="text-lg font-medium text-white mb-4">Bank Account Details</h3>
                            <div className="grid gap-4">
                              {[
                                { label: "Account Name", value: "HINDUSTAN INSTITUTE OF TECHNOLOGY AND SCIENCE" },
                                { label: "Account Number", value: "255402000000001" },
                                { label: "IFSC Code", value: "IOBA000254" },
                                { label: "Bank & Branch", value: "Indian Overseas Bank, Padur" },
                              ].map((detail) => (
                                <div key={detail.label} className="flex justify-between items-center">
                                  <span className="text-gray-400">{detail.label}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-white font-medium">{detail.value}</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        navigator.clipboard.writeText(detail.value);
                                        toast({
                                          title: "Copied to clipboard",
                                          description: `${detail.label} has been copied to your clipboard`,
                                        });
                                      }}
                                      className="p-1 rounded-md hover:bg-white/10"
                                    >
                                      <Copy className="w-4 h-4 text-gray-400" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>

                    {/* Transaction Details */}
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="transactionId" className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-purple-400" />
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
                          className="mt-1.5 bg-white/5 border-white/10"
                        />
                      </div>

                      <div>
                        <Label className="flex items-center gap-2">
                          <Upload className="w-4 h-4 text-purple-400" />
                          Payment Screenshot
                          <span className="text-red-500">*</span>
                        </Label>
                        <div className="mt-1.5">
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              {paymentDetails.paymentScreenshot ? (
                                <p className="text-sm text-gray-400">
                                  {paymentDetails.paymentScreenshot.name}
                                </p>
                              ) : (
                                <>
                                  <Upload className="w-8 h-8 mb-4 text-gray-400" />
                                  <p className="mb-2 text-sm text-gray-400">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                  </p>
                                  <p className="text-xs text-gray-400">PNG, JPG or JPEG (MAX. 2MB)</p>
                                </>
                              )}
                            </div>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const validation = validateFileSize(file);
                                  if (!validation.valid) {
                                    toast({
                                      title: "File Too Large",
                                      description: validation.error,
                                      variant: "destructive",
                                    });
                                    // Reset the input
                                    e.target.value = '';
                                    return;
                                  }
                                  setPaymentDetails({
                                    ...paymentDetails,
                                    paymentScreenshot: file,
                                  });
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Back and Submit Buttons */}
                  <div className="flex flex-col gap-8 mt-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="w-full bg-white/5 hover:bg-white/10 text-white py-6 text-lg border border-white/10"
                      >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Details
                      </Button>
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
