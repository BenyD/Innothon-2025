"use client";

import { motion } from "framer-motion";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { useEffect, useState, useMemo } from "react";
import { ArrowRight, Clock } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const eventDate = useMemo(() => new Date("2025-03-21T08:30:00"), []);
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
    <section className="relative min-h-[85vh] w-full flex items-center justify-center overflow-hidden pt-12">
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left space-y-8"
          >
            {/* Event Status Badges */}
            <div className="flex flex-wrap gap-3">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
              >
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                </span>
                <p className="text-sm text-gray-300">
                  <span className="text-white font-medium">
                    21st March 2025
                  </span>
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
              >
                <Clock className="w-3 h-3 text-purple-400" />
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-white font-medium">
                    {timeLeft.days}d
                  </span>
                  <span className="text-gray-400">:</span>
                  <span className="text-white font-medium">
                    {timeLeft.hours}h
                  </span>
                  <span className="text-gray-400">:</span>
                  <span className="text-white font-medium">
                    {timeLeft.minutes}m
                  </span>
                  <span className="text-gray-400">:</span>
                  <span className="text-white font-medium">
                    {timeLeft.seconds}s
                  </span>
                </div>
              </motion.div>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                  Innothon 2025
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-xl leading-relaxed">
                Join the next generation of tech innovators and showcase your
                skills at the biggest tech event of the year.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => (window.location.href = "#register")}
                className="relative h-12 px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:opacity-90 transition-all duration-300"
              >
                <div className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 blur-xl opacity-50 group-hover:opacity-75 transition-opacity -z-10"></div>
                <span className="flex items-center gap-2">
                  Register Now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Button>

              <Button
                onClick={() => (window.location.href = "#events")}
                variant="outline"
                className="h-12 px-8 bg-black/20 border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 text-white hover:text-white transition-colors"
              >
                Explore Events
              </Button>
            </div>
          </motion.div>

          {/* Right Column - Image Grid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative grid grid-cols-2 gap-4 p-2"
          >
            <div className="space-y-4">
              <div className="relative h-56 rounded-2xl overflow-hidden shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                <Image
                  src="/college-1.jpeg"
                  alt="College Campus"
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="relative h-72 rounded-2xl overflow-hidden shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                <Image
                  src="/event-1.jpeg"
                  alt="Tech Event"
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="relative h-72 rounded-2xl overflow-hidden shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                <Image
                  src="/college-2.jpeg"
                  alt="College Life"
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="relative h-56 rounded-2xl overflow-hidden shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                <Image
                  src="/event-2.jpeg"
                  alt="Student Activities"
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
