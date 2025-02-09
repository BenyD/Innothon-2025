"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [totalScrollProgress, setTotalScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll percentage for the first 100px (navbar background)
      const progress = Math.min(window.scrollY / 100, 1);
      setScrollProgress(progress);
      setScrolled(window.scrollY > 20);

      // Calculate total scroll progress for the progress bar
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const totalProgress = (window.scrollY / totalHeight) * 100;
      setTotalScrollProgress(totalProgress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed w-full z-50">
      <div
        className="relative transition-all duration-300"
        style={{
          backgroundColor: `rgba(0, 0, 0, ${scrollProgress * 0.8})`,
          backdropFilter: `blur(${scrollProgress * 16}px)`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`flex items-center justify-between ${
              scrolled ? "py-2" : "py-4"
            } transition-all duration-300`}
          >
            {/* Left side - Logos */}
            <motion.div
              className="flex items-center gap-8"
              animate={{ scale: scrolled ? 0.9 : 1 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src="/hits_logo.svg"
                alt="College Logo"
                width={180}
                height={180}
                className="w-[130px] h-auto md:w-[180px] hover:scale-105 transition-transform duration-300"
                priority
              />
              <div className="hidden md:block h-16 w-px bg-gradient-to-b from-blue-500/40 via-purple-500/40 to-pink-500/40" />
              <Image
                src="/bsp_logo.png"
                alt="Club Logo"
                width={80}
                height={80}
                className="w-[60px] h-auto md:w-[80px] hover:scale-105 transition-transform duration-300"
                priority
              />
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {["Events", "Rules", "Contact"].map((item) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="relative text-gray-300 hover:text-white transition-colors group"
                >
                  <span className="relative z-10">{item}</span>
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </Link>
              ))}
              <motion.button
                className="relative group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-300"></div>
                <span className="relative px-6 py-2 bg-black rounded-full inline-block text-white group-hover:bg-black/95 transition-colors">
                  Register
                </span>
              </motion.button>
            </div>

            {/* Mobile Menu Button with updated animation */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden relative group p-2"
            >
              <div className="w-6 h-4 flex flex-col justify-between">
                <span
                  className={`w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform transition-all duration-300 ${
                    isOpen ? "rotate-45 translate-y-1.5" : ""
                  }`}
                />
                <span
                  className={`w-full h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 ${
                    isOpen ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`w-full h-0.5 bg-gradient-to-r from-pink-500 to-blue-500 transform transition-all duration-300 ${
                    isOpen ? "-rotate-45 -translate-y-1.5" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/5">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
            style={{
              width: `${totalScrollProgress}%`,
              transition: "width 0.1s ease-out",
            }}
          />
        </div>
      </div>

      {/* Mobile Menu with glass morphism */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 backdrop-blur-lg border-t border-white/10"
          >
            <div className="px-4 py-6 space-y-4">
              {["Events", "Rules", "Contact"].map((item) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  {item}
                </Link>
              ))}
              <div className="relative group w-full">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-lg opacity-75 group-hover:opacity-100 blur transition duration-300"></div>
                <button className="relative w-full px-6 py-2 bg-black rounded-lg text-white group-hover:bg-black/95 transition-colors">
                  Register
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
