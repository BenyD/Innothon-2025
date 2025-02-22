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
    <footer className="relative mt-16 border-t border-white/10">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 pt-12 pb-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Logo & Description - Full width on mobile */}
          <div className="space-y-4 col-span-1 lg:col-span-2">
            <Image
              src="/bsp_logo.png"
              alt="Blue Screen Programming Club Logo"
              width={60}
              height={60}
              className="w-[50px] h-auto"
            />
            <p className="text-sm text-gray-400 leading-relaxed max-w-md">
              Blue Screen Programming Club - Fostering innovation and technical
              excellence through coding, competitions, and collaborative
              learning at Hindustan Institute of Technology and Science.
            </p>
          </div>

          {/* Navigation Links - Optimized for mobile */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Navigation</h3>
            <ul className="space-y-3">
              {[
                { name: "Home", href: "/" },
                { name: "Events", href: "#events" },
                { name: "Rules", href: "#rules" },
                { name: "Contact", href: "#contact" },
                { name: "Admin", href: "/admin" },
              ].map((item) => (
                <li key={item.name} className="flex items-center gap-2">
                  <span className="hidden sm:inline-block h-1.5 w-1.5 rounded-full bg-purple-400/70"></span>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors inline-block py-1"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info - Mobile optimized */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact</h3>
            <div className="space-y-4 sm:space-y-6">
              {/* Staff Contacts */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-purple-400">
                  Staff Coordinators
                </h4>
                <ul className="space-y-3">
                  <li>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="font-medium text-gray-300">
                        Dr. J. Thangakumar
                      </span>
                      <span className="text-gray-500 text-sm">(Convenor)</span>
                    </div>
                    <a
                      href="tel:+919500091229"
                      className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mt-1"
                    >
                      <IoCall className="w-4 h-4 text-blue-400" />
                      <span>+91 95000 91229</span>
                    </a>
                  </li>
                  <li>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="font-medium text-gray-300">
                        Ms. Praisy Evangelin A
                      </span>
                    </div>
                    <a
                      href="tel:+919443961274"
                      className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mt-1"
                    >
                      <IoCall className="w-4 h-4 text-purple-400" />
                      <span>+91 94439 61274</span>
                    </a>
                  </li>
                </ul>
              </div>

              {/* Student Contacts */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-purple-400">
                  Student Coordinators
                </h4>
                <ul className="space-y-3">
                  <li>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="font-medium text-gray-300">
                        Beny Dishon K
                      </span>
                      <span className="text-gray-500 text-sm">(President)</span>
                    </div>
                    <a
                      href="tel:+919884819912"
                      className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mt-1"
                    >
                      <IoCall className="w-4 h-4 text-blue-400" />
                      <span>+91 98848 19912</span>
                    </a>
                  </li>
                  <li>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="font-medium text-gray-300">
                        M. Ashwini
                      </span>
                      <span className="text-gray-500 text-sm">
                        (Vice President)
                      </span>
                    </div>
                    <a
                      href="tel:+917739962694"
                      className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mt-1"
                    >
                      <IoCall className="w-4 h-4 text-purple-400" />
                      <span>+91 77399 62694</span>
                    </a>
                  </li>
                </ul>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-purple-400">Email</h4>
                <a
                  href="mailto:bspc.hits@gmail.com"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <IoMail className="w-4 h-4 text-pink-400" />
                  <span>bspc.hits@gmail.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links - Centered on mobile */}
        <div className="mt-8 pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-semibold text-white mb-3">Socials</h3>
              <div className="flex items-center justify-center sm:justify-start gap-4">
                <motion.a
                  href="https://www.linkedin.com/in/bspc-hits/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IoLogoLinkedin className="w-5 h-5 text-blue-400" />
                </motion.a>
                <motion.a
                  href="https://instagram.com/bspc_hits"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IoLogoInstagram className="w-5 h-5 text-pink-400" />
                </motion.a>
              </div>
            </div>

            <Separator className="bg-white/10 sm:hidden" />

            {/* Copyright - Improved mobile layout with reordered content */}
            <div className="text-center sm:text-right space-y-2">
              <p className="text-xs text-gray-500">
                Developed by{" "}
                <a
                  href="https://beny.one"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Beny Dishon K
                </a>
              </p>
              <p className="text-xs text-gray-500 flex items-center justify-center sm:justify-end gap-1.5">
                Crafted with{" "}
                <span className="text-red-500 animate-pulse">❤️</span> by Blue
                Screen Programming Club
              </p>
              <p className="text-sm text-gray-400">
                © 2025 Blue Screen Programming Club. All rights reserved.
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
