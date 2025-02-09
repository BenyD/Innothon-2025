"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  GithubIcon,
  LinkedinIcon,
  TwitterIcon,
  MailIcon,
  PhoneIcon,
  ArrowUpIcon,
} from "lucide-react";

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
              <div className="flex items-center gap-6">
                <Image
                  src="/hits_logo.svg"
                  alt="College Logo"
                  width={130}
                  height={130}
                  className="w-[110px] h-auto"
                />
                <Image
                  src="/bsp_logo.png"
                  alt="Club Logo"
                  width={80}
                  height={80}
                  className="w-[75px] h-auto"
                />
              </div>
              <p className="text-gray-400">
                Empowering innovation through technology at Hindustan Institute
                of Technology and Science.
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
                  href="mailto:innothon@hindustanuniv.ac.in"
                  className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
                >
                  <MailIcon className="h-4 w-4" />
                  innothon@hindustanuniv.ac.in
                </a>
                <a
                  href="tel:+919876543210"
                  className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
                >
                  <PhoneIcon className="h-4 w-4" />
                  +91 98765 43210
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Connect</h3>
              <div className="flex gap-4">
                {[
                  { icon: GithubIcon, href: "#" },
                  { icon: LinkedinIcon, href: "#" },
                  { icon: TwitterIcon, href: "#" },
                ].map((social, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="icon"
                    className="bg-transparent border-white/10 hover:bg-white/5"
                  >
                    <social.icon className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <Separator className="mb-8 bg-white/5" />

          {/* Bottom bar with enhanced design */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Innothon. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <p className="text-gray-400 text-sm">
                Crafted with{" "}
                <span className="text-red-500 animate-pulse">❤</span> by Blue
                Screen Programming Club
              </p>
              <Button
                variant="outline"
                size="icon"
                className="bg-transparent border-white/10 hover:bg-white/5"
                onClick={scrollToTop}
              >
                <ArrowUpIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
