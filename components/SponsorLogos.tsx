"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

// Sample sponsor data - replace with your actual sponsors
const sponsors = [
  {
    name: "IET",
    logo: "/sponsors/iet.png",
    website: "https://www.theiet.org/",
    tier: "platinum",
  },
  {
    name: "Code Builders",
    logo: "/sponsors/vps-color.png",
    website: "https://www.codebuilders.in/",
    tier: "gold",
  },
];

const SponsorLogos = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-scrolling effect with improved performance
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const scrollWidth = scrollContainer.scrollWidth / 2;
    let scrollPosition = 0;
    let animationId: number | null = null;

    // Adjust speed based on screen size
    const speed = window.innerWidth < 640 ? 0.3 : 0.5;

    const scroll = () => {
      if (!scrollContainer || isPaused) return;

      scrollPosition += speed;

      // Reset position when we've scrolled through the original items
      if (scrollPosition >= scrollWidth) {
        scrollPosition = 0;
      }

      scrollContainer.scrollLeft = scrollPosition;
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    // Clean up animation frame on unmount
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [isPaused]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="w-full mt-6 sm:mt-8"
    >
      <div className="text-center lg:text-left mb-2 text-xs sm:text-sm text-gray-400">
        Proudly Sponsored By
      </div>

      <div
        className="relative overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Gradient fade on left */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 z-10 bg-gradient-to-r from-black to-transparent pointer-events-none" />

        {/* Scrolling container */}
        <div
          ref={scrollRef}
          className="flex items-center gap-4 sm:gap-8 py-3 overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* First set of logos */}
          {sponsors.map((sponsor) => (
            <Link
              key={sponsor.name}
              href={sponsor.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 group relative"
              aria-label={`${sponsor.name} website`}
            >
              <div className="relative h-8 sm:h-10 w-20 sm:w-28 bg-white/5 rounded-md p-1.5 transition-all duration-300 group-hover:bg-white/10 group-hover:scale-105">
                <Image
                  src={sponsor.logo}
                  alt={`${sponsor.name} logo`}
                  fill
                  sizes="(max-width: 640px) 80px, 112px"
                  className="object-contain p-1 filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                />
              </div>
            </Link>
          ))}

          {/* Duplicate set for seamless scrolling */}
          {sponsors.map((sponsor) => (
            <Link
              key={`${sponsor.name}-dup`}
              href={sponsor.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 group relative"
              aria-label={`${sponsor.name} website`}
            >
              <div className="relative h-8 sm:h-10 w-20 sm:w-28 bg-white/5 rounded-md p-1.5 transition-all duration-300 group-hover:bg-white/10 group-hover:scale-105">
                <Image
                  src={sponsor.logo}
                  alt={`${sponsor.name} logo`}
                  fill
                  sizes="(max-width: 640px) 80px, 112px"
                  className="object-contain p-1 filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                />
              </div>
            </Link>
          ))}
        </div>

        {/* Gradient fade on right */}
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 z-10 bg-gradient-to-l from-black to-transparent pointer-events-none" />
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </motion.div>
  );
};

export default SponsorLogos;
