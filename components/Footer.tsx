"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  IoMail,
  IoCall,
  IoLogoLinkedin,
  IoLogoInstagram,
  IoArrowUp,
} from "react-icons/io5";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative">
      {/* Main footer content with enhanced design */}
      <div className="bg-black/40 backdrop-blur-lg border-t border-white/5 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Branding Section */}
            <div className="space-y-4">
              <div className="flex items-center">
                <Image
                  src="/bsp_logo.png"
                  alt="Blue Screen Programming Club Logo"
                  width={100}
                  height={100}
                  className="w-[90px] h-auto"
                />
              </div>
              <p className="text-gray-400">
                Blue Screen Programming Club - Fostering innovation and
                technical excellence through coding, competitions, and
                collaborative learning at HITS.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Navigation</h3>
              <div className="space-y-3">
                {["Home", "Events", "Rules", "Contact"].map((item) => (
                  <Link
                    key={item}
                    href={item === "Home" ? "/" : `#${item.toLowerCase()}`}
                    className="block text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-2"
                    >
                      <span className="h-px w-4 bg-gradient-to-r from-blue-500 to-purple-500" />
                      {item}
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact</h3>
              <div className="space-y-3">
                <a
                  href="mailto:bspc.hits@gmail.com"
                  className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
                >
                  <IoMail className="h-4 w-4" />
                  bspc.hits@gmail.com
                </a>
                <a
                  href="tel:+919884819912"
                  className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
                >
                  <IoCall className="h-4 w-4" />
                  +91 98848 19912
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Connect</h3>
              <div className="flex gap-4">
                {[
                  {
                    icon: IoLogoLinkedin,
                    href: "",
                    label: "LinkedIn",
                  },
                  {
                    icon: IoLogoInstagram,
                    href: "https://www.instagram.com/bspc_hits",
                    label: "Instagram",
                  },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex"
                  >
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-black/40 border-white/10 hover:bg-white/5 hover:border-white/20 transition-all relative"
                      aria-label={social.label}
                    >
                      <social.icon className="h-4 w-4 text-white hover:text-white" />
                    </Button>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <Separator className="mb-8 bg-white/5" />

          {/* Bottom bar with enhanced design */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Blue Screen Programming Club.
              All rights reserved.
            </p>
            <div className="flex flex-col items-center md:items-end gap-2">
              <p className="text-gray-400 text-sm">
                Developed by{" "}
                <a
                  href="https://beny.one"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 hover:underline decoration-2 underline-offset-4 transition-all"
                >
                  Beny Dishon K
                </a>
              </p>
              <p className="text-gray-400 text-sm">
                Crafted with ❤️ by Blue Screen Programming Club
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add a fixed scroll-to-top button */}
      <Button
        variant="outline"
        size="icon"
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 z-50 bg-black/60 border border-white/10 hover:bg-black/80 hover:border-white/20 transition-all duration-300 group"
      >
        <IoArrowUp className="h-4 w-4 text-white group-hover:text-white transition-all duration-300 transform group-hover:-translate-y-0.5" />
      </Button>
    </footer>
  );
};

export default Footer;
