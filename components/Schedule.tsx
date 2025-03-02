"use client";

import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/section-title";
import { Clock, MapPin, Trophy } from "lucide-react";
import { events } from "@/data/events";

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
  return (
    <section id="schedule" className="py-16 sm:py-24 px-4 scroll-mt-20">
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

        <div className="mt-12 space-y-16">
          {scheduleData.map((day, dayIndex) => (
            <motion.div
              id={`day-${dayIndex}`}
              key={day.day}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: dayIndex * 0.1 }}
              className="space-y-6 scroll-mt-32"
            >
              <h3 className="text-center text-xl sm:text-2xl font-semibold">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                  {day.day}
                </span>
              </h3>

              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 opacity-50"></div>

                <div className="space-y-8">
                  {day.events.map((event, eventIndex) => (
                    <motion.div
                      key={`${event.title}-${eventIndex}`}
                      initial={{
                        opacity: 0,
                        x: eventIndex % 2 === 0 ? -20 : 20,
                      }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: dayIndex * 0.1 + eventIndex * 0.05,
                      }}
                      className={`relative flex flex-col md:flex-row items-start gap-4 md:gap-8 pl-12 md:pl-0 ${
                        eventIndex % 2 === 0
                          ? "md:pr-1/2"
                          : "md:pl-1/2 md:flex-row-reverse"
                      }`}
                    >
                      {/* Timeline dot */}
                      <div className="absolute left-4 md:left-1/2 top-4 md:top-0 md:transform md:-translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 z-10"></div>

                      {/* Time card - Mobile: Above event details, Desktop: Side by side */}
                      <div className="flex-shrink-0 w-full md:w-auto order-1 md:order-none">
                        <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg p-3 md:p-4 hover:border-purple-500/30 transition-all duration-300">
                          <div className="flex items-center gap-2 text-purple-400">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              {event.time}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Event details */}
                      <div className="w-full bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-4 md:p-6 hover:border-purple-500/30 transition-all duration-300 order-2 md:order-none">
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
                          <span className="break-words">{event.location}</span>
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
                  ))}
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
