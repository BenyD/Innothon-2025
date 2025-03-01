"use client";

import { motion } from "framer-motion";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { useEffect, useState, useMemo } from "react";
import { ArrowRight, Clock, Trophy } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { scrollToSection } from "@/utils/scroll";
import Link from "next/link";

const Hero = () => {
  const eventDate = useMemo(() => new Date("2025-03-21T09:00:00"), []);
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +eventDate - +new Date();
      if (difference <= 0)
        return { days: "00", hours: "00", minutes: "00", seconds: "00" };

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24))
          .toString()
          .padStart(2, "0"),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24)
          .toString()
          .padStart(2, "0"),
        minutes: Math.floor((difference / 1000 / 60) % 60)
          .toString()
          .padStart(2, "0"),
        seconds: Math.floor((difference / 1000) % 60)
          .toString()
          .padStart(2, "0"),
      };
    };

    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [eventDate]);

  return (
    <section className="relative min-h-[80vh] sm:min-h-[85vh] w-full flex items-center justify-center overflow-hidden pt-16 md:pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <FlickeringGrid
          className="absolute inset-0 z-0"
          squareSize={3}
          gridGap={8}
          color="rgb(255, 255, 255)"
          maxOpacity={0.03}
          flickerChance={0.15}
        />
      </div>

      {/* Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-[128px] animate-blob" />
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 -right-20 w-96 h-96 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
            {/* Left Column - Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left space-y-4 sm:space-y-6 lg:space-y-8"
            >
              {/* Department Name - Moved to top with enhanced styling */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex flex-col items-center lg:items-start gap-2"
              >
                <div className="px-3 sm:px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                  <p className="text-xs sm:text-sm text-gray-400">
                    Presented By
                  </p>
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                  Department of Computer Science{" "}
                  <br className="hidden xs:block" />
                  and Engineering
                </h2>
              </motion.div>

              {/* Event Status Badges */}
              <div className="flex flex-row flex-wrap justify-center lg:justify-start gap-2 sm:gap-3">
                {/* Date Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
                >
                  <span className="relative flex h-2.5 sm:h-3 w-2.5 sm:w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 sm:h-3 w-2.5 sm:w-3 bg-purple-500"></span>
                  </span>
                  <p className="text-xs sm:text-sm text-gray-300 whitespace-nowrap">
                    <span className="text-white font-medium">
                      March 21-22, 2025
                    </span>
                  </p>
                </motion.div>

                {/* Countdown Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
                >
                  <Clock className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-purple-400" />
                  <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                    <div className="flex items-center">
                      <span className="text-white font-medium">
                        {timeLeft.days}
                      </span>
                      <span className="text-gray-400 ml-0.5 sm:ml-1">d</span>
                    </div>
                    <span className="text-gray-600">:</span>
                    <div className="flex items-center">
                      <span className="text-white font-medium">
                        {timeLeft.hours}
                      </span>
                      <span className="text-gray-400 ml-0.5 sm:ml-1">h</span>
                    </div>
                    <span className="text-gray-600">:</span>
                    <div className="flex items-center">
                      <span className="text-white font-medium">
                        {timeLeft.minutes}
                      </span>
                      <span className="text-gray-400 ml-0.5 sm:ml-1">m</span>
                    </div>
                    <span className="text-gray-600">:</span>
                    <div className="flex items-center">
                      <span className="text-white font-medium">
                        {timeLeft.seconds}
                      </span>
                      <span className="text-gray-400 ml-0.5 sm:ml-1">s</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Main Event Title and Description */}
              <div className="space-y-4 sm:space-y-6">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                    Innothon 2025
                  </span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-xl leading-relaxed mx-auto lg:mx-0">
                  Join the next generation of tech innovators and showcase your
                  skills at the biggest tech event of the year.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                {/* Register Button */}
                <Link href="/register">
                  <Button className="relative h-12 sm:h-14 px-6 sm:px-8 w-full sm:w-auto bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:opacity-90 transition-all duration-300">
                    <div className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 blur-xl opacity-50 group-hover:opacity-75 transition-opacity -z-10"></div>
                    <span className="flex items-center gap-2 text-base sm:text-lg">
                      Register Now
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </Button>
                </Link>

                {/* Explore Events Button */}
                <div className="relative group w-full sm:w-auto">
                  <div className="absolute -inset-[3px] bg-gradient-to-r from-blue-600/25 via-purple-600/25 to-pink-600/25 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  <button
                    onClick={() => scrollToSection("events")}
                    className="relative w-full h-12 sm:h-14 px-6 sm:px-8 bg-black/20 hover:bg-black/40 border border-white/5 group-hover:border-white/10 rounded-lg text-gray-300 hover:text-white transition-all duration-300"
                  >
                    <span className="flex items-center justify-center gap-2 text-base sm:text-lg">
                      <span>Explore Events</span>
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </button>
                </div>
              </div>

              {/* Prize Information with enhanced styling */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-yellow-500/5 border border-yellow-500/10 backdrop-blur-sm"
              >
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                <span className="text-xs sm:text-sm text-gray-300">
                  Win exciting prizes worth up to{" "}
                  <span className="text-yellow-400 font-semibold">₹50,000</span>
                </span>
              </motion.div>
            </motion.div>

            {/* Right Column - Image Grid */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-2 gap-2 sm:gap-3 p-2 sm:p-4"
            >
              <div className="space-y-3">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-lg group-hover:blur-xl opacity-20 group-hover:opacity-40 transition-all duration-500"></div>
                  <div className="relative h-36 sm:h-56 rounded-xl overflow-hidden border border-white/10 group-hover:border-white/20 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 group-hover:opacity-60 transition-opacity duration-500" />
                    <Image
                      src="/college-1.jpg"
                      alt="College Campus"
                      fill
                      sizes="(max-width: 640px) 45vw, (max-width: 1024px) 250px, 400px"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      priority
                    />
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur-lg group-hover:blur-xl opacity-20 group-hover:opacity-40 transition-all duration-500"></div>
                  <div className="relative h-44 sm:h-72 rounded-xl overflow-hidden border border-white/10 group-hover:border-white/20 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 group-hover:opacity-60 transition-opacity duration-500" />
                    <Image
                      src="/event-1.png"
                      alt="Tech Event"
                      fill
                      sizes="(max-width: 640px) 45vw, (max-width: 1024px) 250px, 400px"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      priority
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-6">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-blue-600 rounded-xl blur-lg group-hover:blur-xl opacity-20 group-hover:opacity-40 transition-all duration-500"></div>
                  <div className="relative h-44 sm:h-72 rounded-xl overflow-hidden border border-white/10 group-hover:border-white/20 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-blue-500/10 group-hover:opacity-60 transition-opacity duration-500" />
                    <Image
                      src="/college-2.png"
                      alt="College Life"
                      fill
                      sizes="(max-width: 640px) 45vw, (max-width: 1024px) 250px, 400px"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      priority
                    />
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-lg group-hover:blur-xl opacity-20 group-hover:opacity-40 transition-all duration-500"></div>
                  <div className="relative h-36 sm:h-56 rounded-xl overflow-hidden border border-white/10 group-hover:border-white/20 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 group-hover:opacity-60 transition-opacity duration-500" />
                    <Image
                      src="/event-2.jpg"
                      alt="Student Activities"
                      fill
                      sizes="(max-width: 640px) 45vw, (max-width: 1024px) 250px, 400px"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      priority
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
