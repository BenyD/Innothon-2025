"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Trophy, Medal, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionTitle } from "@/components/ui/section-title";

// Types for our winners
type Winner = {
  id: string;
  name: string;
  college: string;
  department: string;
  event: string;
  position: string;
  photoUrl: string;
};

// Sample placeholder data - will be replaced with actual winners after the event
const placeholderWinners: Winner[] = [
  {
    id: "1",
    name: "Coming Soon",
    college: "Winners will be announced after the event",
    department: "Computer Science",
    event: "HackQuest",
    position: "1st Place",
    photoUrl: "/placeholder-winner.jpg",
  },
  {
    id: "2",
    name: "Coming Soon",
    college: "Winners will be announced after the event",
    department: "Information Technology",
    event: "AI Genesis",
    position: "1st Place",
    photoUrl: "/placeholder-winner.jpg",
  },
  {
    id: "3",
    name: "Coming Soon",
    college: "Winners will be announced after the event",
    department: "Electronics",
    event: "CodeArena",
    position: "1st Place",
    photoUrl: "/placeholder-winner.jpg",
  },
  {
    id: "4",
    name: "Coming Soon",
    college: "Winners will be announced after the event",
    department: "Computer Science",
    event: "Digital Divas",
    position: "1st Place",
    photoUrl: "/placeholder-winner.jpg",
  },
  {
    id: "5",
    name: "Coming Soon",
    college: "Winners will be announced after the event",
    department: "Mechanical Engineering",
    event: "IdeaFusion",
    position: "1st Place",
    photoUrl: "/placeholder-winner.jpg",
  },
  {
    id: "6",
    name: "Coming Soon",
    college: "Winners will be announced after the event",
    department: "Computer Science",
    event: "Pixel Showdown",
    position: "1st Place",
    photoUrl: "/placeholder-winner.jpg",
  },
  {
    id: "7",
    name: "Coming Soon",
    college: "Winners will be announced after the event",
    department: "Information Technology",
    event: "HackQuest",
    position: "2nd Place",
    photoUrl: "/placeholder-winner.jpg",
  },
  {
    id: "8",
    name: "Coming Soon",
    college: "Winners will be announced after the event",
    department: "Computer Science",
    event: "AI Genesis",
    position: "2nd Place",
    photoUrl: "/placeholder-winner.jpg",
  },
  {
    id: "9",
    name: "Coming Soon",
    college: "Winners will be announced after the event",
    department: "Electronics",
    event: "CodeArena",
    position: "2nd Place",
    photoUrl: "/placeholder-winner.jpg",
  },
];

// Filter options for the Hall of Fame - based on actual events from the data file
const filterOptions = [
  { value: "all", label: "All Events" },
  { value: "HackQuest", label: "HackQuest" },
  { value: "AI Genesis", label: "AI Genesis" },
  { value: "CodeArena", label: "CodeArena" },
  { value: "Digital Divas", label: "Digital Divas" },
  { value: "IdeaFusion", label: "IdeaFusion" },
  { value: "Pixel Showdown", label: "Pixel Showdown" },
];

export default function HallOfFame() {
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;

  // Filter winners based on selected event
  const filteredWinners =
    filter === "all"
      ? placeholderWinners
      : placeholderWinners.filter((winner) => winner.event === filter);

  // Calculate total pages
  const totalPages = Math.ceil(filteredWinners.length / itemsPerPage);

  // Get current page items
  const currentWinners = filteredWinners.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  // Handle pagination
  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <section id="hall-of-fame" className="py-12 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionTitle
          title="Hall of Fame"
          subtitle="Celebrating the brilliant minds who showcased exceptional talent and innovation at Innothon 2025."
        />

        {/* Countdown notice */}
        <div className="text-center mb-6 md:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-center"
          >
            <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400 flex-shrink-0" />
            <span className="text-xs sm:text-sm text-gray-300">
              Winners will be announced after the event on March 21-22, 2025
            </span>
          </motion.div>
        </div>

        {/* Filter Controls - Scrollable on mobile */}
        <div className="flex overflow-x-auto pb-2 mb-6 md:mb-8 md:flex-wrap md:justify-center md:overflow-visible gap-2 scrollbar-hide">
          {filterOptions.map((option) => (
            <motion.button
              key={option.value}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              onClick={() => {
                setFilter(option.value);
                setCurrentPage(0);
              }}
              className={cn(
                "px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm transition-all whitespace-nowrap flex-shrink-0",
                filter === option.value
                  ? "bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 text-white border border-white/20"
                  : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
              )}
            >
              {option.label}
            </motion.button>
          ))}
        </div>

        {/* Winners Grid - Adjusted for mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {currentWinners.map((winner, index) => (
            <motion.div
              key={winner.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-xl blur-lg opacity-20 group-hover:opacity-40 transition-all duration-500"></div>
              <div className="relative rounded-xl overflow-hidden border border-white/10 group-hover:border-white/20 transition-all duration-300 bg-black/20 backdrop-blur-sm">
                <div className="aspect-[3/4] relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10" />
                  <Image
                    src={winner.photoUrl}
                    alt={winner.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-[1.08]"
                    sizes="(max-width: 640px) 90vw, (max-width: 768px) 45vw, 33vw"
                    onError={(e) => {
                      // Fallback for missing images
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder-winner.jpg";
                    }}
                  />

                  {/* Position Badge - Smaller on mobile */}
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-gradient-to-r from-blue-500/80 to-purple-500/80 backdrop-blur-sm">
                    <span className="text-[10px] sm:text-xs font-medium text-white">
                      {winner.position}
                    </span>
                  </div>

                  {/* Event Badge - Smaller on mobile */}
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-20 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/10">
                    <span className="text-[10px] sm:text-xs font-medium text-white">
                      {winner.event}
                    </span>
                  </div>
                </div>

                <div className="p-3 sm:p-4 relative z-20">
                  <h3 className="text-base sm:text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                    {winner.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 mt-0.5 sm:mt-1">
                    {winner.college}
                  </p>
                  <div className="flex items-center gap-1.5 text-gray-500 text-[10px] sm:text-xs mt-1.5 sm:mt-2">
                    <Users className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    <span>{winner.department}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination Controls - Larger touch targets for mobile */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 sm:mt-8 gap-2">
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className={cn(
                "p-2 sm:p-2.5 rounded-full border touch-manipulation",
                currentPage === 0
                  ? "border-white/10 text-gray-600 cursor-not-allowed"
                  : "border-white/20 text-white hover:bg-white/10 active:bg-white/15"
              )}
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div className="flex items-center px-3 sm:px-4 text-xs sm:text-sm text-gray-400">
              Page {currentPage + 1} of {totalPages}
            </div>
            <button
              onClick={nextPage}
              disabled={currentPage >= totalPages - 1}
              className={cn(
                "p-2 sm:p-2.5 rounded-full border touch-manipulation",
                currentPage >= totalPages - 1
                  ? "border-white/10 text-gray-600 cursor-not-allowed"
                  : "border-white/20 text-white hover:bg-white/10 active:bg-white/15"
              )}
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        )}

        {/* Coming Soon Message - Responsive layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 sm:mt-12 text-center p-4 sm:p-6 rounded-xl bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 border border-white/10 max-w-3xl mx-auto"
        >
          <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5 sm:mb-2">
            Winners Coming Soon!
          </h3>
          <p className="text-sm sm:text-base text-gray-400">
            The Innothon 2025 event is scheduled to take place on March 21-22,
            2025. Check back after the event to see the brilliant minds who took
            home the prizes!
          </p>

          {/* Prize display - Responsive grid for mobile */}
          <div className="grid grid-cols-3 gap-2 sm:flex sm:justify-center sm:gap-4 mt-5 sm:mt-6">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-1.5 sm:mb-2">
                <Medal className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
              </div>
              <span className="text-xs sm:text-sm text-gray-400">
                First Place
              </span>
              <span className="text-[10px] sm:text-xs text-gray-500">
                ₹3,000
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-1.5 sm:mb-2">
                <Medal className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
              </div>
              <span className="text-xs sm:text-sm text-gray-400">
                Second Place
              </span>
              <span className="text-[10px] sm:text-xs text-gray-500">
                ₹2,000
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-pink-500/20 to-red-500/20 flex items-center justify-center mb-1.5 sm:mb-2">
                <Medal className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400" />
              </div>
              <span className="text-xs sm:text-sm text-gray-400">
                Third Place
              </span>
              <span className="text-[10px] sm:text-xs text-gray-500">
                ₹1,000
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
