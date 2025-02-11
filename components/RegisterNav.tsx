"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const RegisterNav = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-20" />
      
      {/* Navigation Bar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div
          className={`relative transition-all duration-300 ${
            scrolled ? "bg-black/80 backdrop-blur-xl" : "bg-transparent"
          }`}
        >
          {/* Gradient Border Bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-300" 
            style={{ opacity: scrolled ? 1 : 0 }}
          />

          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-20">
              {/* Logo Group */}
              <motion.div
                className="flex items-center gap-4"
                animate={{ scale: scrolled ? 0.95 : 1 }}
                transition={{ duration: 0.3 }}
              >
                <Link href="/" className="flex items-center gap-4">
                  <div className="relative group">
                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Image
                      src="/hits_logo.svg"
                      alt="College Logo"
                      width={180}
                      height={180}
                      className="relative w-[120px] h-auto hover:scale-105 transition-transform duration-300"
                      priority
                    />
                  </div>
                  <div className="hidden sm:block h-10 w-px bg-gradient-to-b from-blue-500/20 via-purple-500/20 to-pink-500/20" />
                  <div className="relative group">
                    <div className="absolute -inset-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Image
                      src="/bsp_logo.png"
                      alt="Club Logo"
                      width={80}
                      height={80}
                      className="relative w-[50px] h-auto hover:scale-105 transition-transform duration-300"
                      priority
                    />
                  </div>
                </Link>
              </motion.div>

              {/* Back Button */}
              <Link href="/">
                <div className="relative group">
                  <div className="absolute -inset-[3px] bg-gradient-to-r from-blue-600/25 via-purple-600/25 to-pink-600/25 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  <button className="relative px-4 py-2 bg-black/20 hover:bg-black/40 border border-white/5 group-hover:border-white/10 rounded-lg text-gray-300 hover:text-white transition-all duration-300">
                    <span className="flex items-center gap-2">
                      <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                      <span className="hidden sm:block">Return to Home</span>
                    </span>
                  </button>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>
    </>
  );
};

export default RegisterNav; 