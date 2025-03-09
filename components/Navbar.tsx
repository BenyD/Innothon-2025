"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { scrollToSection } from "@/utils/scroll";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [totalScrollProgress, setTotalScrollProgress] = useState(0);
  const pathname = usePathname();

  const navItems = [
    { name: "Events", href: "#events", id: "events" },
    { name: "Schedule", href: "#schedule", id: "schedule" },
    { name: "Rules", href: "#rules", id: "rules" },
    { name: "Speakers", href: "#speakers", id: "speakers" },
    { name: "Venue", href: "#venue", id: "venue" },
    { name: "FAQ", href: "#faq", id: "faq" },
    { name: "Contact", href: "#contact", id: "contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const progress = Math.min(window.scrollY / 100, 1);
      setScrollProgress(progress);
      setScrolled(window.scrollY > 20);

      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const totalProgress = (window.scrollY / totalHeight) * 100;
      setTotalScrollProgress(totalProgress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        isOpen &&
        !target.closest(".mobile-menu") &&
        !target.closest(".menu-button")
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen]);

  return (
    <nav className="fixed w-full z-50">
      <div
        className="relative transition-all duration-300"
        style={{
          backgroundColor: isOpen
            ? "rgba(0, 0, 0, 0.95)" // Force black background when menu is open
            : `rgba(0, 0, 0, ${scrollProgress * 0.8})`,
          backdropFilter: isOpen
            ? "blur(16px)"
            : `blur(${scrollProgress * 16}px)`,
        }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div
            className={`flex items-center justify-between ${
              scrolled ? "py-1.5 sm:py-2" : "py-2 sm:py-3"
            } transition-all duration-300`}
          >
            {/* Left side - Logos */}
            <motion.div
              className="flex items-center gap-2 sm:gap-4 md:gap-6"
              animate={{ scale: scrolled ? 0.95 : 1 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                href="/"
                className="flex items-center gap-2 sm:gap-4 md:gap-6"
              >
                <Image
                  src="/hits_logo.png"
                  alt="College Logo"
                  width={180}
                  height={180}
                  className="w-[100px] h-auto sm:w-[120px] md:w-[140px] lg:w-[160px] hover:scale-105 transition-transform duration-300"
                  priority
                />
                <div className="hidden sm:block h-8 sm:h-10 w-px bg-gradient-to-b from-blue-500/40 via-purple-500/40 to-pink-500/40" />
                <Image
                  src="/bsp_logo.png"
                  alt="Club Logo"
                  width={80}
                  height={80}
                  className="w-[40px] h-auto sm:w-[50px] md:w-[60px] lg:w-[70px] hover:scale-105 transition-transform duration-300"
                  priority
                />
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-white transition-colors hover:text-gray-300"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.id);
                  }}
                >
                  {item.name}
                </a>
              ))}
              <Link href="/register">
                <motion.button
                  className="relative group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-300" />
                  <span className="relative px-4 lg:px-6 py-1.5 lg:py-2 bg-black rounded-full inline-block text-white group-hover:bg-black/95 transition-colors text-sm lg:text-base">
                    Register
                  </span>
                </motion.button>
              </Link>
            </div>

            {/* Mobile Menu Button with pre-applied gradients */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(!isOpen);
              }}
              className="md:hidden relative group p-2 -mr-2 menu-button"
              aria-label="Toggle menu"
            >
              <div className="w-5 sm:w-6 h-4 sm:h-5 flex flex-col justify-between">
                <span
                  className={`w-full h-0.5 transition-all duration-300 ${
                    isOpen
                      ? "rotate-45 translate-y-2 sm:translate-y-2.5 bg-gradient-to-r from-blue-500 to-purple-500"
                      : "bg-gradient-to-r from-blue-500 to-purple-500"
                  }`}
                />
                <span
                  className={`w-full h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 ${
                    isOpen ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`w-full h-0.5 transition-all duration-300 ${
                    isOpen
                      ? "-rotate-45 -translate-y-1.5 sm:-translate-y-2 bg-gradient-to-r from-pink-500 to-blue-500"
                      : "bg-gradient-to-r from-pink-500 to-blue-500"
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
            style={{ width: `${totalScrollProgress}%` }}
          />
        </div>
      </div>

      {/* Mobile Menu with improved animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 mobile-menu"
          >
            <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
              <div className="space-y-2 py-6">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:text-gray-300 hover:bg-white/10 transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(item.id);
                      setIsOpen(false);
                    }}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="pt-2 sm:pt-3">
                <Link href="/register" className="block">
                  <div className="relative group w-full">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-lg opacity-75 group-hover:opacity-100 blur transition duration-300" />
                    <button
                      className="relative w-full px-4 sm:px-6 py-2 sm:py-2.5 bg-black rounded-lg text-white group-hover:bg-black/95 transition-colors active:scale-95 transform duration-200 text-sm sm:text-base"
                      onClick={() => setIsOpen(false)}
                    >
                      Register
                    </button>
                  </div>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
