"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { SectionTitle } from "@/components/ui/section-title";
import { Clock, MapPin, Trophy } from "lucide-react";
import { events } from "@/data/events";
import { useEffect, useRef, useState } from "react";

// Organize events by date and time
const scheduleData = [
  {
    day: "Day 1 - March 21, 2025",
    events: [
      {
        time: "08:30 AM - 09:30 AM",
        title: "Registration & Check-in",
        description: "Collect your event kit and ID Cards",
        location: "Main Entrance, Architecture Block",
      },
      {
        time: "09:30 AM - 10:30 AM",
        title: "Opening Ceremony",
        description: "Welcome address, keynote speech, and event overview",
        location: "Andromeda Lecture Theatre, Ground Floor, Jubilee Block",
      },
      {
        time: "11:00 AM - 01:00 PM",
        title: "AI Genesis",
        description:
          "AI Ad Slogan Challenge - Create compelling ad campaigns using AI",
        location:
          events.find((e) => e.id === "ai-genesis")?.venue ||
          "Data Science Lab, 2nd Floor, Computer Science Extension Block",
      },
      {
        time: "11:00 AM - 01:00 PM",
        title: "Digital Divas",
        description: "Women-exclusive tech poster design competition",
        location:
          events.find((e) => e.id === "digital-divas")?.venue ||
          "Coder's Hub, Main Block, 2nd Floor",
      },
      {
        time: "11:00 AM - 04:00 PM",
        title: "IdeaFusion",
        description: "Innovative solution presentation competition",
        location:
          events.find((e) => e.id === "idea-fusion")?.venue ||
          "Andromeda Lecture Theatre, Ground Floor, Jubilee Block",
      },
      {
        time: "11:00 AM - 04:00 PM",
        title: "Pixel Showdown",
        description: "Multi-game tournament featuring Free Fire, BGMI, and PES",
        location:
          events.find((e) => e.id === "pixel-showdown")?.venue ||
          "Room-PX003, Ground Floor, Computer Science Extension Block",
      },
      {
        time: "01:00 PM - 02:00 PM",
        title: "Lunch Break",
        description: "Refreshments provided",
        location: "Garage Cafe and Other Hangout Spots",
      },
      {
        time: "02:00 PM - 04:00 PM",
        title: "HackQuest",
        description: "A Capture the Flag (CTF) competition using TryHackMe",
        location:
          events.find((e) => e.id === "hackquest")?.venue ||
          "Coder's Hub, Main Block, 2nd Floor",
      },
      {
        time: "02:00 PM - 04:00 PM",
        title: "CodeArena",
        description:
          "Two-round coding competition focusing on error identification and debugging",
        location:
          events.find((e) => e.id === "code-arena")?.venue ||
          "Data Science Lab, 2nd Floor, Computer Science Extension Block",
      },
    ],
  },
  {
    day: "Day 2 - March 22, 2025",
    events: [
      {
        time: "09:00 AM - 09:30 AM",
        title: "Day 2 Check-in",
        description: "Attendance confirmation for finalists",
        location: "Main Entrance, Architecture Block",
      },
      {
        time: "09:30 AM - 12:30 AM",
        title: "Valedictory Ceremony",
        description: "Closing ceremony and awards presentation",
        location: "Andromeda Lecture Theatre, Ground Floor, Jubilee Block",
      },
    ],
  },
];

const Schedule = () => {
  // Calculate total number of events
  const totalEvents = scheduleData.reduce(
    (acc, day) => acc + day.events.length,
    0
  );

  // Reference for the schedule section
  const scheduleRef = useRef<HTMLDivElement>(null);

  // Use framer-motion's useScroll hook to track scroll progress
  const { scrollYProgress } = useScroll({
    target: scheduleRef,
    offset: ["start start", "end end"],
  });

  // Transform the scroll progress to use for the timeline
  const timelineProgress = useTransform(scrollYProgress, [0, 0.9], [0, 1]);

  // State to track which events are visible
  const [visibleEventIndices, setVisibleEventIndices] = useState<number[]>([]);

  // Refs for event elements and observer
  const eventRefs = useRef<(HTMLDivElement | null)[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Initialize refs array
  useEffect(() => {
    eventRefs.current = Array(totalEvents).fill(null);
  }, [totalEvents]);

  // Set up intersection observer to track event visibility
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = eventRefs.current.findIndex(
            (ref) => ref === entry.target
          );

          if (index !== -1) {
            setVisibleEventIndices((prev) => {
              if (entry.isIntersecting && !prev.includes(index)) {
                return [...prev, index].sort((a, b) => a - b);
              } else if (!entry.isIntersecting && prev.includes(index)) {
                return prev.filter((i) => i !== index);
              }
              return prev;
            });
          }
        });
      },
      { threshold: 0.3, rootMargin: "-10% 0px -10% 0px" }
    );

    // Observe all event elements
    eventRefs.current.forEach((ref) => {
      if (ref) {
        observerRef.current?.observe(ref);
      }
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return (
    <section
      id="schedule"
      ref={scheduleRef}
      className="py-16 sm:py-24 px-4 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          title="Event Schedule"
          subtitle="Plan your Innothon 2025 experience"
        />

        {/* Mobile View Toggle Tabs */}
        <div className="md:hidden mt-8 mb-6">
          <div className="flex justify-center">
            <div className="inline-flex p-1 bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg">
              {scheduleData.map((day, index) => (
                <button
                  key={`tab-${index}`}
                  onClick={() => {
                    const element = document.getElementById(`day-${index}`);
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    index === 0
                      ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Day {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 space-y-24">
          {scheduleData.map((day, dayIndex) => (
            <motion.div
              id={`day-${dayIndex}`}
              key={day.day}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: dayIndex * 0.1 }}
              className="space-y-10 scroll-mt-32"
            >
              <h3 className="text-center text-xl sm:text-2xl font-semibold">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                  {day.day}
                </span>
              </h3>

              <div className="relative">
                {/* Timeline container for better positioning */}
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0 md:transform md:-translate-x-px flex flex-col items-center">
                  {/* Timeline background line (empty) */}
                  <div className="absolute inset-0 w-[1px] bg-white/5"></div>

                  {/* Timeline progress line (filled) with glow effect */}
                  <motion.div
                    className="absolute top-0 left-0 w-[1px] bg-gradient-to-b from-blue-400/50 via-purple-400/50 to-pink-400/50 origin-top"
                    style={{
                      scaleY: timelineProgress,
                      height: "100%",
                      boxShadow:
                        "0 0 6px rgba(139, 92, 246, 0.3), 0 0 2px rgba(139, 92, 246, 0.5)",
                    }}
                  ></motion.div>
                </div>

                <div className="space-y-16">
                  {day.events.map((event, eventIndex) => {
                    // Calculate the global index for this event
                    const globalIndex =
                      dayIndex === 0
                        ? eventIndex
                        : scheduleData[0].events.length + eventIndex;

                    const isVisible = visibleEventIndices.includes(globalIndex);
                    const isEven = eventIndex % 2 === 0;

                    return (
                      <motion.div
                        key={`${event.title}-${eventIndex}`}
                        ref={(el) => {
                          eventRefs.current[globalIndex] = el;
                        }}
                        initial={{
                          opacity: 0,
                          y: 10,
                          x: isEven ? -10 : 10,
                        }}
                        whileInView={{
                          opacity: 1,
                          y: 0,
                          x: 0,
                        }}
                        viewport={{ once: true, margin: "-10% 0px" }}
                        transition={{
                          duration: 0.5,
                          delay: dayIndex * 0.1 + eventIndex * 0.05,
                        }}
                        className={`relative flex flex-col md:flex-row items-start gap-4 md:gap-10 pl-12 md:pl-0 ${
                          isEven ? "md:pr-1/2" : "md:pl-1/2 md:flex-row-reverse"
                        }`}
                      >
                        {/* Timeline dot with pulse effect */}
                        <div className="absolute left-4 md:left-1/2 top-4 md:top-0 md:transform md:-translate-x-1/2 z-20">
                          <motion.div
                            className={`w-3 h-3 rounded-full ${
                              isVisible
                                ? "bg-gradient-to-r from-blue-400/90 to-purple-400/90 border border-white/20"
                                : "bg-white/10 border border-white/5"
                            }`}
                            animate={{
                              scale: isVisible ? [1, 1.1, 1] : 1,
                            }}
                            transition={{
                              duration: 2,
                              repeat: isVisible ? Infinity : 0,
                              repeatType: "loop",
                            }}
                          />
                          {isVisible && (
                            <motion.div
                              className="absolute inset-0 rounded-full bg-purple-400/20"
                              initial={{ scale: 1, opacity: 1 }}
                              animate={{ scale: 1.8, opacity: 0 }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                repeatType: "loop",
                              }}
                            />
                          )}
                        </div>

                        {/* Time card - Mobile: Above event details, Desktop: Side by side */}
                        <div className="flex-shrink-0 w-full md:w-auto order-1 md:order-none">
                          <motion.div
                            className="bg-black/20 backdrop-blur-sm border border-white/5 rounded-lg p-3 md:p-4 transition-all duration-300"
                            whileHover={{
                              borderColor: "rgba(168, 85, 247, 0.2)",
                              backgroundColor: "rgba(0, 0, 0, 0.3)",
                            }}
                          >
                            <div className="flex items-center gap-2 text-purple-300">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm font-medium">
                                {event.time}
                              </span>
                            </div>
                          </motion.div>
                        </div>

                        {/* Event details */}
                        <motion.div
                          className="w-full bg-black/20 backdrop-blur-sm border border-white/5 rounded-xl p-4 md:p-6 transition-all duration-300 order-2 md:order-none"
                          whileHover={{
                            borderColor: "rgba(168, 85, 247, 0.2)",
                            backgroundColor: "rgba(0, 0, 0, 0.3)",
                            y: -2,
                          }}
                        >
                          <h4 className="text-base md:text-lg font-semibold mb-2 flex items-center gap-2 flex-wrap">
                            {event.title}
                            {events.some((e) => e.title === event.title) && (
                              <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full">
                                Competition
                              </span>
                            )}
                          </h4>
                          <p className="text-sm text-gray-400 mb-3">
                            {event.description}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
                            <MapPin className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                            <span className="break-words">
                              {event.location}
                            </span>
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
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Schedule;
