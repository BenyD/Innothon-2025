"use client";

import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { SectionTitle } from "@/components/ui/section-title";
import {
  Clock,
  MapPin,
  Trophy,
  Calendar,
  ChevronRight,
  ArrowRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import { events } from "@/data/events";
import { useEffect, useRef, useState } from "react";

// Organize events by date and time
const scheduleData = [
  {
    day: "Day 1 - March 21, 2025",
    date: "March 21",
    events: [
      {
        time: "08:30 AM - 09:30 AM",
        title: "Registration & Check-in",
        description: "Collect your event kit and ID Cards",
        location: "Main Entrance, Architecture Block",
        isHighlight: false,
      },
      {
        time: "09:30 AM - 10:30 AM",
        title: "Opening Ceremony",
        description: "Welcome address, keynote speech, and event overview",
        location: "Andromeda Lecture Theatre, Ground Floor, Jubilee Block",
        isHighlight: true,
      },
      {
        time: "11:00 AM - 01:00 PM",
        title: "AI Genesis",
        description:
          "AI Ad Slogan Challenge - Create compelling ad campaigns using AI",
        location:
          events.find((e) => e.id === "ai-genesis")?.venue ||
          "Data Science Lab, 2nd Floor, Computer Science Extension Block",
        isHighlight: false,
      },
      {
        time: "11:00 AM - 01:00 PM",
        title: "Digital Divas",
        description: "Women-exclusive tech poster design competition",
        location:
          events.find((e) => e.id === "digital-divas")?.venue ||
          "Coder's Hub, Main Block, 2nd Floor",
        isHighlight: false,
      },
      {
        time: "11:00 AM - 04:00 PM",
        title: "IdeaFusion",
        description: "Innovative solution presentation competition",
        location:
          events.find((e) => e.id === "idea-fusion")?.venue ||
          "Andromeda Lecture Theatre, Ground Floor, Jubilee Block",
        isHighlight: true,
      },
      {
        time: "11:00 AM - 04:00 PM",
        title: "Pixel Showdown",
        description: "Multi-game tournament featuring Free Fire, BGMI, and PES",
        location:
          events.find((e) => e.id === "pixel-showdown")?.venue ||
          "Room-PX003, Ground Floor, Computer Science Extension Block",
        isHighlight: false,
      },
      {
        time: "01:00 PM - 02:00 PM",
        title: "Lunch Break",
        description: "Refreshments provided",
        location: "Garage Cafe and Other Hangout Spots",
        isHighlight: false,
      },
      {
        time: "02:00 PM - 04:00 PM",
        title: "HackQuest",
        description: "A Capture the Flag (CTF) competition using TryHackMe",
        location:
          events.find((e) => e.id === "hackquest")?.venue ||
          "Coder's Hub, Main Block, 2nd Floor",
        isHighlight: false,
      },
      {
        time: "02:00 PM - 04:00 PM",
        title: "CodeArena",
        description:
          "Two-round coding competition focusing on error identification and debugging",
        location:
          events.find((e) => e.id === "code-arena")?.venue ||
          "Data Science Lab, 2nd Floor, Computer Science Extension Block",
        isHighlight: false,
      },
    ],
  },
  {
    day: "Day 2 - March 22, 2025",
    date: "March 22",
    events: [
      {
        time: "09:00 AM - 09:30 AM",
        title: "Day 2 Check-in",
        description: "Attendance confirmation for finalists",
        location: "Main Entrance, Architecture Block",
        isHighlight: false,
      },
      {
        time: "09:30 AM - 12:30 PM",
        title: "Valedictory Ceremony",
        description: "Closing ceremony and awards presentation",
        location: "Andromeda Lecture Theatre, Ground Floor, Jubilee Block",
        isHighlight: true,
      },
    ],
  },
];

const Schedule = () => {
  // State for active day tab
  const [activeDay, setActiveDay] = useState(0);

  // State for expanded event on mobile
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null);

  // Reference for the schedule section
  const scheduleRef = useRef<HTMLDivElement>(null);

  // Use framer-motion's useScroll hook to track scroll progress
  const { scrollYProgress } = useScroll({
    target: scheduleRef,
    offset: ["start start", "end end"],
  });

  // Transform the scroll progress to use for the timeline
  const timelineProgress = useTransform(scrollYProgress, [0, 0.9], [0, 1]);

  // Function to toggle expanded event on mobile
  const toggleEventExpansion = (index: number) => {
    setExpandedEvent(expandedEvent === index ? null : index);
  };

  // Function to format time for better display
  const formatTimeDisplay = (timeString: string) => {
    const [start, end] = timeString.split(" - ");
    return (
      <div className="flex flex-col">
        <span className="font-medium">{start}</span>
        <span className="text-xs text-gray-400">to {end}</span>
      </div>
    );
  };

  return (
    <section
      id="schedule"
      ref={scheduleRef}
      className="py-16 sm:py-24 px-4 scroll-mt-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          title="Event Schedule"
          subtitle="Plan your Innothon 2025 experience"
        />

        {/* Day Selector Tabs - Improved for all breakpoints */}
        <div className="mt-10 mb-8">
          <div className="flex justify-center">
            <div className="inline-flex p-1.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl shadow-lg shadow-purple-900/5">
              {scheduleData.map((day, index) => (
                <button
                  key={`tab-${index}`}
                  onClick={() => setActiveDay(index)}
                  className={`relative px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
                    activeDay === index
                      ? "text-white"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  {activeDay === index && (
                    <motion.div
                      layoutId="activeDayIndicator"
                      className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-lg border border-purple-500/20"
                      initial={false}
                      transition={{ type: "spring", duration: 0.5 }}
                    />
                  )}
                  <span className="relative flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">Day {index + 1}</span>
                    <span className="sm:hidden">D{index + 1}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Schedule Content with AnimatePresence for smooth transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`day-content-${activeDay}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="relative"
          >
            {/* Day Header */}
            <div className="mb-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="text-2xl sm:text-3xl font-bold mb-2">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                    {scheduleData[activeDay].day}
                  </span>
                </h3>
                <p className="text-gray-400 text-sm sm:text-base">
                  Join us for an exciting day of innovation and technology
                </p>
              </motion.div>
            </div>

            {/* Desktop Timeline View - Hidden on mobile */}
            <div className="hidden md:block relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/5 transform -translate-x-1/2"></div>

              {/* Animated timeline progress */}
              <motion.div
                className="absolute left-1/2 top-0 w-0.5 bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400 transform -translate-x-1/2 origin-top"
                style={{
                  scaleY: timelineProgress,
                  height: "100%",
                  boxShadow: "0 0 8px rgba(139, 92, 246, 0.4)",
                }}
              ></motion.div>

              {/* Events */}
              <div className="space-y-12">
                {scheduleData[activeDay].events.map((event, eventIndex) => {
                  const isEven = eventIndex % 2 === 0;

                  return (
                    <div
                      key={`desktop-${event.title}-${eventIndex}`}
                      className="relative"
                    >
                      {/* Timeline dot */}
                      <div className="absolute left-1/2 top-6 transform -translate-x-1/2 z-10">
                        <div
                          className={`w-4 h-4 rounded-full border ${
                            event.isHighlight
                              ? "bg-gradient-to-r from-blue-400 to-purple-500 border-purple-300/30"
                              : "bg-gray-800 border-white/20"
                          }`}
                        >
                          <div
                            className={`absolute inset-0 rounded-full ${
                              event.isHighlight
                                ? "bg-purple-400/20"
                                : "bg-white/5"
                            } animate-ping opacity-75`}
                            style={{ animationDuration: "3s" }}
                          ></div>
                        </div>
                      </div>

                      {/* Content card - alternating sides */}
                      <div
                        className={`flex ${isEven ? "justify-end" : "justify-start"}`}
                      >
                        <motion.div
                          initial={{ opacity: 0, x: isEven ? 20 : -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, margin: "-100px" }}
                          transition={{
                            duration: 0.5,
                            delay: eventIndex * 0.05,
                          }}
                          className={`w-[calc(50%-40px)] ${isEven ? "mr-10" : "ml-10"}`}
                        >
                          <div
                            className={`p-5 rounded-xl backdrop-blur-sm border transition-all duration-300 hover:translate-y-[-2px] ${
                              event.isHighlight
                                ? "bg-gradient-to-br from-purple-900/30 to-blue-900/20 border-purple-500/20 hover:border-purple-500/40"
                                : "bg-black/20 border-white/10 hover:border-white/20"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-lg font-semibold flex items-center gap-2">
                                {event.title}
                                {events.some(
                                  (e) => e.title === event.title
                                ) && (
                                  <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full">
                                    Competition
                                  </span>
                                )}
                              </h4>
                              <div className="text-xs font-medium text-gray-400 flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded-md border border-white/5">
                                <Clock className="w-3.5 h-3.5 text-purple-300" />
                                <span className="text-white/80">
                                  {event.time.split(" - ")[0]}
                                </span>
                                <span className="text-gray-500">—</span>
                                <span>{event.time.split(" - ")[1]}</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-400 mb-3">
                              {event.description}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <MapPin className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                              <span>{event.location}</span>
                            </div>

                            {/* Prize info for competition events */}
                            {events.some((e) => e.title === event.title) && (
                              <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                                <Trophy className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />
                                <span>
                                  {events.find((e) => e.title === event.title)
                                    ?.prizes?.Main?.First || "Prizes available"}
                                </span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile Timeline View - Card-based approach */}
            <div className="md:hidden">
              <div className="space-y-4">
                {scheduleData[activeDay].events.map((event, eventIndex) => (
                  <motion.div
                    key={`mobile-${event.title}-${eventIndex}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: eventIndex * 0.05 }}
                    className={`rounded-xl overflow-hidden border ${
                      event.isHighlight
                        ? "bg-gradient-to-br from-purple-900/30 to-blue-900/20 border-purple-500/20"
                        : "bg-black/20 border-white/10"
                    }`}
                  >
                    {/* Card Header with time and title */}
                    <div
                      className="flex items-center justify-between p-4 cursor-pointer"
                      onClick={() => toggleEventExpansion(eventIndex)}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex-shrink-0 p-2.5 rounded-lg ${
                            event.isHighlight
                              ? "bg-purple-500/20"
                              : "bg-gray-800/50"
                          }`}
                        >
                          <Clock
                            className={`w-4 h-4 ${
                              event.isHighlight
                                ? "text-purple-300"
                                : "text-gray-400"
                            }`}
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-medium text-gray-400 flex items-center gap-1 mb-0.5 flex-wrap">
                            <span className="text-white/80">
                              {event.time.split(" - ")[0]}
                            </span>
                            <span className="text-gray-500 mx-0.5">—</span>
                            <span>{event.time.split(" - ")[1]}</span>
                          </div>
                          <h4 className="font-medium text-white truncate">
                            {event.title}
                          </h4>
                        </div>
                      </div>
                      <ChevronRight
                        className={`w-5 h-5 text-gray-500 transition-transform ${
                          expandedEvent === eventIndex ? "rotate-90" : ""
                        }`}
                      />
                    </div>

                    {/* Expandable content */}
                    <AnimatePresence>
                      {expandedEvent === eventIndex && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 pt-0 border-t border-white/5">
                            <p className="text-sm text-gray-400 mb-3">
                              {event.description}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <MapPin className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                              <span>{event.location}</span>
                            </div>

                            {/* Prize info for competition events */}
                            {events.some((e) => e.title === event.title) && (
                              <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                                <Trophy className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />
                                <span>
                                  {events.find((e) => e.title === event.title)
                                    ?.prizes?.Main?.First || "Prizes available"}
                                </span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Schedule;
