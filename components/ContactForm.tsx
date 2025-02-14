"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLinkIcon } from "lucide-react";
import { SectionTitle } from "@/components/ui/section-title";
import { useToast } from "@/components/ui/use-toast";
import {
  IoMail,
  IoCall,
  IoPaperPlane,
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
          subtitle="Have questions about Innothon 2025? We're here to help! Reach out to us through the form below or use our direct contact details."
        />

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Three cards with equal height */}
          <div className="space-y-8">
            {/* Contact Information Card */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-gray-900 to-black p-8">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-50" />
              <div className="relative">
                <h3 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-6">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <a
                    href="mailto:bspc.hits@gmail.com"
                    className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors group"
                  >
                    <div className="p-3 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                      <IoMail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-gray-400">
                        bspc.hits@gmail.com
                      </p>
                    </div>
                  </a>
                  <a
                    href="tel:+919884819912"
                    className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors group"
                  >
                    <div className="p-3 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                      <IoCall className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-sm text-gray-400">+91 98848 19912</p>
                    </div>
                  </a>
                </div>
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

            {/* Social Media Card */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-gray-900 to-black p-8">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-50" />
              <div className="relative">
                <h3 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-6">
                  Connect With Us
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      icon: IoLogoLinkedin,
                      label: "LinkedIn",
                      href: "https://www.linkedin.com/in/bspc-hits/",
                      color: "purple",
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
                      className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors group"
                    >
                      <div
                        className={`p-3 rounded-lg bg-${social.color}-500/10 group-hover:bg-${social.color}-500/20 transition-colors`}
                      >
                        <social.icon className="h-5 w-5" />
                      </div>
                      <p className="font-medium">{social.label}</p>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form - Right side with matching height */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-gray-900 to-black p-8 h-full">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-50" />
            <form
              onSubmit={handleSubmit}
              className="relative space-y-6 h-full flex flex-col"
            >
              <div className="space-y-6">
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
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium flex items-center justify-center gap-2 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    Send Message
                    <IoPaperPlane className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
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
                      March 21, 2025
                    </p>
                    <p className="text-gray-400">Mark your calendar!</p>
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
