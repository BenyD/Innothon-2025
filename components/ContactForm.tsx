"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLinkIcon } from "lucide-react";
import { SectionTitle } from "@/components/ui/section-title";
import { useToast } from "@/components/ui/use-toast";
import {
  IoCall,
  IoLogoLinkedin,
  IoLogoInstagram,
  IoCalendar,
} from "react-icons/io5";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

// Add validation functions at the top
const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidIndianPhone = (phone: string) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\D/g, ""));
};

// Update the core team section without role field
const coreTeam = [
  {
    title: "President",
    name: "Beny Dishon K",
    phone: "+91 98848 19912",
    color: "blue",
  },
  {
    title: "Vice President",
    name: "M. Ashwini",
    phone: "+91 77399 62694",
    color: "purple",
  },
  {
    title: "General Secretary",
    name: "Shibani A B",
    phone: "+91 73393 72992",
    color: "pink",
  },
  {
    title: "Joint Secretary",
    name: "Arsha M Nair",
    phone: "+91 96795 97410",
    color: "blue",
  },
];

// Update event coordinators with data from events.ts
const eventCoordinators = [
  {
    role: "Cybersecurity Lead",
    name: "Chandaluri Monish N S S Gupta",
    phone: "+91 824 807 7123",
    color: "blue",
  },
  {
    role: "AI Lead",
    name: "Shubham Choudhary",
    phone: "+91 6289 578 020",
    color: "purple",
  },
  {
    role: "Coding & Development Lead",
    name: "Gokulakrishnan",
    phone: "+91 7418 232 796",
    color: "pink",
  },
  {
    role: "Design & UI/UX Lead",
    name: "Samyuktha S",
    phone: "+91 72000 97390",
    color: "blue",
  },
  {
    role: "Data Science & Analytics Lead",
    name: "Pavan Sai H V",
    phone: "+91 96770 73103",
    color: "purple",
  },
  {
    role: "Gaming Head",
    name: "NV Yogeshwaran",
    phone: "+91 72001 37507",
    color: "pink",
  },
];

// Update event management team with common coordinators
const eventManagementTeam = [
  {
    role: "Event Coordinator",
    name: "V Vishal",
    phone: "+91 93841 59875",
    color: "blue",
  },
  {
    role: "Assistant Event Coordinator",
    name: "Anna Elizabeth Pravin",
    phone: "+91 63824 96273",
    color: "purple",
  },
  {
    role: "PR Lead",
    name: "Janani ER",
    phone: "+91 9360 864828",
    color: "pink",
  },
];

// Add new staff section after the core team array
const staffTeam = [
  {
    title: "Convenor",
    name: "Dr. J. Thangakumar, Professor & Head - CSE, HITS",
    phone: "+91 95000 91229",
    color: "blue",
  },
];

const staffCoordinators = [
  {
    title: "Staff Coordinator",
    name: "Ms. Praisy Evangelin A, AP, CSE",
    phone: "+91 94439 61274",
    color: "purple",
  },
  {
    title: "Staff Coordinator",
    name: "Ms.Meena Priyadharsini, AP, CSE",
    phone: "+91 98406 95728",
    color: "pink",
  },
  {
    title: "Staff Coordinator",
    name: "Ms. Dheepthi R, AP, CSE",
    phone: "+91 97877 09639",
    color: "blue",
  },
];

const ContactForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Format phone number input
    if (name === "phone") {
      const formattedValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: formattedValue }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Validate email and phone
    if (!isValidEmail(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    if (!isValidIndianPhone(formData.phone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit Indian mobile number",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Basic validation
      if (
        !formData.name ||
        !formData.email ||
        !formData.phone ||
        !formData.message
      ) {
        toast({
          title: "Missing information",
          description: "Please fill in all fields",
          variant: "destructive",
        });
        return;
      }

      // Insert data
      const { data, error } = await supabase
        .from("contact_messages")
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            message: formData.message,
            read: false, // Add default value
          },
        ])
        .select()
        .single();

      if (error) {
        if (error.code === "42P01") {
          throw new Error(
            "Database table not found. Please ensure the table exists."
          );
        } else if (error.code === "23502") {
          throw new Error(
            "Missing required fields. Please fill in all information."
          );
        } else {
          throw new Error(
            error.message || "An error occurred while sending the message."
          );
        }
      }

      if (data) {
        // Handle successful submission
        toast({
          title: "Message sent!",
          description: "We'll get back to you soon.",
          variant: "success",
        });
      }
    } catch (error) {
      console.error("Error details:", error);
      toast({
        title: "Failed to send message",
        description:
          error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        <SectionTitle
          title="Get in Touch"
          subtitle="Have questions about Innothon 2025? We're here to help! Reach out to us through any of these channels."
        />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Cards - Left Column */}
          <div className="lg:col-span-2 grid gap-6">
            {/* Core Team Card */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-gray-900 to-black p-8">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-50" />
              <div className="relative">
                <h3 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-6">
                  Core Committee
                </h3>
                <div className="grid sm:grid-cols-2 gap-6">
                  {coreTeam.map((member, index) => (
                    <div
                      key={index}
                      className="flex flex-col p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-sm font-medium text-gray-400">
                            {member.title}
                          </h4>
                          <p className="text-white font-medium mt-1">
                            {member.name}
                          </p>
                        </div>
                        <div
                          className={`p-2 rounded-lg bg-${member.color}-500/10`}
                        >
                          <IoCall
                            className={`h-4 w-4 text-${member.color}-400`}
                          />
                        </div>
                      </div>
                      <div className="space-y-2 mt-auto">
                        <a
                          href={`tel:${member.phone}`}
                          className={`flex items-center gap-2 text-${member.color}-400 hover:text-${member.color}-300 transition-colors text-sm`}
                        >
                          <IoCall className="h-4 w-4" />
                          {member.phone}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Staff Team Card */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-gray-900 to-black p-8">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-50" />
              <div className="relative">
                <h3 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-6">
                  Faculty Team
                </h3>
                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Conveyor */}
                  {staffTeam.map((member, index) => (
                    <div
                      key={index}
                      className="flex flex-col p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all sm:col-span-2"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-sm font-medium text-gray-400">
                            {member.title}
                          </h4>
                          <p className="text-white font-medium mt-1">
                            {member.name}
                          </p>
                        </div>
                        <div
                          className={`p-2 rounded-lg bg-${member.color}-500/10`}
                        >
                          <IoCall
                            className={`h-4 w-4 text-${member.color}-400`}
                          />
                        </div>
                      </div>
                      <div className="mt-auto">
                        <a
                          href={`tel:${member.phone}`}
                          className={`flex items-center gap-2 text-${member.color}-400 hover:text-${member.color}-300 transition-colors text-sm`}
                        >
                          <IoCall className="h-4 w-4" />
                          {member.phone}
                        </a>
                      </div>
                    </div>
                  ))}

                  {/* Staff Coordinators */}
                  {staffCoordinators.map((member, index) => (
                    <div
                      key={index}
                      className="flex flex-col p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-sm font-medium text-gray-400">
                            {member.title}
                          </h4>
                          <p className="text-white font-medium mt-1">
                            {member.name}
                          </p>
                        </div>
                        <div
                          className={`p-2 rounded-lg bg-${member.color}-500/10`}
                        >
                          <IoCall
                            className={`h-4 w-4 text-${member.color}-400`}
                          />
                        </div>
                      </div>
                      <div className="mt-auto">
                        <a
                          href={`tel:${member.phone}`}
                          className={`flex items-center gap-2 text-${member.color}-400 hover:text-${member.color}-300 transition-colors text-sm`}
                        >
                          <IoCall className="h-4 w-4" />
                          {member.phone}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Event Coordinators Card */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-gray-900 to-black p-8">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-50" />
              <div className="relative">
                <h3 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-6">
                  Event Coordinators
                </h3>
                <div className="grid sm:grid-cols-3 gap-6">
                  {eventCoordinators.map((coordinator, index) => (
                    <div
                      key={index}
                      className="flex flex-col p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                    >
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-400">
                          {coordinator.role}
                        </h4>
                        <p className="text-white font-medium mt-1">
                          {coordinator.name}
                        </p>
                      </div>
                      <a
                        href={`tel:${coordinator.phone}`}
                        className={`flex items-center gap-2 text-${coordinator.color}-400 hover:text-${coordinator.color}-300 transition-colors text-sm mt-auto`}
                      >
                        <IoCall className="h-4 w-4" />
                        {coordinator.phone}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Event Management Team Card */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-gray-900 to-black p-8">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-50" />
              <div className="relative">
                <h3 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-6">
                  Event Management Team
                </h3>
                <div className="grid sm:grid-cols-3 gap-6">
                  {eventManagementTeam.map((member, index) => (
                    <div
                      key={index}
                      className="flex flex-col p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                    >
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-400">
                          {member.role}
                        </h4>
                        <p className="text-white font-medium mt-1">
                          {member.name}
                        </p>
                      </div>
                      <a
                        href={`tel:${member.phone}`}
                        className={`flex items-center gap-2 text-${member.color}-400 hover:text-${member.color}-300 transition-colors text-sm mt-auto`}
                      >
                        <IoCall className="h-4 w-4" />
                        {member.phone}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form and Additional Info - Right Column */}
          <div className="space-y-6">
            {/* Contact Form Card */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-gray-900 to-black p-8">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-50" />
              <div className="relative">
                <h3 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-6">
                  Send us a Message
                </h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={(e) => {
                        if (e.target.value && !isValidEmail(e.target.value)) {
                          toast({
                            title: "Invalid Email",
                            description: "Please enter a valid email address",
                            variant: "destructive",
                          });
                        }
                      }}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                      placeholder="Your email"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Phone
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
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
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                      placeholder="Enter your 10-digit mobile number"
                      maxLength={10}
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all resize-none"
                      placeholder="Your message"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Sending...</span>
                      </div>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </form>
              </div>
            </div>

            {/* Location Card */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-gray-900 to-black p-8">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-50" />
              <div className="relative">
                <h3 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
                  Location
                </h3>
                <p className="text-gray-300">
                  Hindustan Institute of Technology and Science
                  <br />
                  Old Mahabalipuram Road (OMR)
                  <br />
                  Padur, Chennai - 603103
                </p>
              </div>
            </div>

            {/* Social Links Card */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-gray-900 to-black p-8">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-50" />
              <div className="relative">
                <h3 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
                  Connect With Us
                </h3>
                <div className="flex gap-4">
                  {[
                    {
                      icon: IoLogoLinkedin,
                      label: "LinkedIn",
                      href: "https://www.linkedin.com/in/bspc-hits/",
                      color: "blue",
                    },
                    {
                      icon: IoLogoInstagram,
                      label: "Instagram",
                      href: "https://www.instagram.com/bspc_hits",
                      color: "pink",
                    },
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-${social.color}-500/10 hover:bg-${social.color}-500/20 text-${social.color}-400 transition-colors`}
                    >
                      <social.icon className="h-5 w-5" />
                      <span className="font-medium">{social.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section - Moved below contact form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-3xl border border-white/10">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-3xl" />
            <div className="relative bg-black/40 p-6 sm:p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4 text-center md:text-left">
                  <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    Ready to Join Innothon 2025?
                  </h2>
                  <p className="text-lg text-gray-400">
                    Join the next generation of tech innovators and showcase
                    your skills at the biggest tech event of the year.
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    <Badge
                      variant="outline"
                      className="text-purple-400 border-purple-400/30 px-4 py-2"
                    >
                      Registration Open
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-blue-400 border-blue-400/30 px-4 py-2"
                    >
                      Limited Spots
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-col items-center md:items-end gap-6">
                  <div className="text-center md:text-right">
                    <p className="text-2xl font-bold text-white flex items-center justify-center md:justify-end gap-2">
                      <IoCalendar className="h-6 w-6" />
                      March 21-22, 2025
                    </p>
                    <p className="text-gray-400">Two days of innovation!</p>
                  </div>
                  <Link href="/register">
                    <Button className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg">
                      Register Now
                      <ExternalLinkIcon className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactForm;
