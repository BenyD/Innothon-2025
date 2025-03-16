"use client";

import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/section-title";
import { MapPin, Clock, Calendar, Phone, Mail, Info } from "lucide-react";

export default function InfoPage() {
  return (
    <div className="space-y-8 md:space-y-12 py-8 md:py-12 px-3 md:px-4 pt-24 md:pt-32">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
          Innothon 2025
        </h1>
        <p className="mt-3 md:mt-4 text-lg md:text-xl text-white/80">
          Your complete guide for the event day
        </p>
      </motion.div>

      {/* Campus Map */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="max-w-5xl mx-auto w-full"
      >
        <SectionTitle
          title="Campus Map"
          subtitle="Navigate the Hindustan Institute of Technology and Science campus"
        />

        <div className="mt-4 md:mt-6 rounded-xl overflow-hidden border border-white/10">
          <div className="aspect-[16/9] w-full relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1945.0203980522!2d80.22421912167815!3d12.800556399999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5250847d3353d7%3A0x6a585af1f362dadb!2sHindustan%20Institute%20of%20Technology%20%26%20Science!5e0!3m2!1sen!2sin!4v1710693845678!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Campus Map"
              className="w-full h-full"
            ></iframe>
          </div>
        </div>

        <div className="mt-4 md:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          <div className="bg-white/5 p-3 md:p-4 rounded-lg border border-white/10">
            <div className="flex items-start gap-2 md:gap-3">
              <MapPin className="text-purple-400 mt-1 flex-shrink-0 h-4 w-4 md:h-5 md:w-5" />
              <div>
                <h3 className="font-medium text-white text-sm md:text-base">
                  Entrance of Jubilee Block
                </h3>
                <p className="text-white/70 text-xs md:text-sm">
                  Registration and check-in point
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 p-3 md:p-4 rounded-lg border border-white/10">
            <div className="flex items-start gap-2 md:gap-3">
              <MapPin className="text-blue-400 mt-1 flex-shrink-0 h-4 w-4 md:h-5 md:w-5" />
              <div>
                <h3 className="font-medium text-white text-sm md:text-base">
                  Andromeda Hall, Jubilee Block
                </h3>
                <p className="text-white/70 text-xs md:text-sm">
                  Main event venue for opening and closing ceremonies
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 p-3 md:p-4 rounded-lg border border-white/10">
            <div className="flex items-start gap-2 md:gap-3">
              <MapPin className="text-green-400 mt-1 flex-shrink-0 h-4 w-4 md:h-5 md:w-5" />
              <div>
                <h3 className="font-medium text-white text-sm md:text-base">
                  Computer Science Block & Extension Block
                </h3>
                <p className="text-white/70 text-xs md:text-sm">
                  Venue for technical events and competitions
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 p-3 md:p-4 rounded-lg border border-white/10">
            <div className="flex items-start gap-2 md:gap-3">
              <MapPin className="text-amber-400 mt-1 flex-shrink-0 h-4 w-4 md:h-5 md:w-5" />
              <div>
                <h3 className="font-medium text-white text-sm md:text-base">
                  Cafeteria
                </h3>
                <p className="text-white/70 text-xs md:text-sm">Garage Cafe</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Venue Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="max-w-5xl mx-auto w-full"
      >
        <SectionTitle
          title="Venue Information"
          subtitle="Detailed locations for all Innothon 2025 events"
        />

        <div className="mt-4 md:mt-6 grid grid-cols-1 gap-3 md:gap-4">
          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <div className="flex items-start gap-3">
              <MapPin className="text-purple-400 mt-1 flex-shrink-0 h-5 w-5" />
              <div>
                <h3 className="font-medium text-white text-base">
                  Andromeda Lecture Theatre
                </h3>
                <p className="text-white/70 text-sm">
                  Ground Floor, Jubilee Block
                </p>
                <p className="text-white/60 text-xs mt-1">
                  Events: Opening Ceremony, IdeaFusion, Valedictory Ceremony
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <div className="flex items-start gap-3">
              <MapPin className="text-blue-400 mt-1 flex-shrink-0 h-5 w-5" />
              <div>
                <h3 className="font-medium text-white text-base">
                  Data Science Lab
                </h3>
                <p className="text-white/70 text-sm">
                  2nd Floor, Computer Science Extension Block
                </p>
                <p className="text-white/60 text-xs mt-1">
                  Events: HackQuest, Digital Divas
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <div className="flex items-start gap-3">
              <MapPin className="text-green-400 mt-1 flex-shrink-0 h-5 w-5" />
              <div>
                <h3 className="font-medium text-white text-base">
                  Coder&apos;s Hub
                </h3>
                <p className="text-white/70 text-sm">Main Block, 2nd Floor</p>
                <p className="text-white/60 text-xs mt-1">Events: CodeArena</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <div className="flex items-start gap-3">
              <MapPin className="text-amber-400 mt-1 flex-shrink-0 h-5 w-5" />
              <div>
                <h3 className="font-medium text-white text-base">Room-PX003</h3>
                <p className="text-white/70 text-sm">
                  Ground Floor, Computer Science Extension Block
                </p>
                <p className="text-white/60 text-xs mt-1">
                  Events: Pixel Showdown (Free Fire, BGMI, and PES)
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <div className="flex items-start gap-3">
              <MapPin className="text-pink-400 mt-1 flex-shrink-0 h-5 w-5" />
              <div>
                <h3 className="font-medium text-white text-base">
                  Millenium Lab 1 & 2
                </h3>
                <p className="text-white/70 text-sm">
                  2nd Floor, Computer Science Block
                </p>
                <p className="text-white/60 text-xs mt-1">Events: AI Genesis</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <div className="flex items-start gap-3">
              <MapPin className="text-indigo-400 mt-1 flex-shrink-0 h-5 w-5" />
              <div>
                <h3 className="font-medium text-white text-base">
                  Garage Cafe
                </h3>
                <p className="text-white/70 text-sm">Campus Cafeteria</p>
                <p className="text-white/60 text-xs mt-1">
                  Lunch and refreshments will be served here
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Event Schedule */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-5xl mx-auto w-full"
      >
        <SectionTitle
          title="Event Schedule"
          subtitle="Complete timeline of Innothon 2025 events"
        />

        <div className="mt-4 md:mt-6 space-y-4 md:space-y-6">
          {/* Day 1 */}
          <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-3 md:p-4">
              <div className="flex items-center gap-2">
                <Calendar className="text-purple-400 h-4 w-4 md:h-5 md:w-5" />
                <h3 className="font-semibold text-base md:text-lg">
                  Day 1 - March 21, 2025
                </h3>
              </div>
            </div>

            <div className="p-3 md:p-4 space-y-4">
              <div className="relative pl-4 md:pl-6 border-l-2 border-purple-500/30 pb-4 md:pb-6">
                <div className="absolute -left-[7px] md:-left-[9px] top-0 w-3 h-3 md:w-4 md:h-4 rounded-full bg-purple-500"></div>
                <div className="flex flex-col justify-between gap-2">
                  <div>
                    <h4 className="font-medium text-sm md:text-base">
                      Registration & Check-in
                    </h4>
                    <p className="text-white/70 text-xs md:text-sm">
                      Collect your event kit and ID Cards
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 mt-1">
                    <div className="flex items-center gap-1 text-white/70">
                      <Clock size={12} className="md:w-4 md:h-4" />
                      <span className="text-xs md:text-sm">
                        08:30 AM - 09:30 AM
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-white/70">
                      <MapPin size={12} className="md:w-4 md:h-4" />
                      <span className="text-xs md:text-sm">Jubilee Block</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative pl-4 md:pl-6 border-l-2 border-blue-500/30 pb-4 md:pb-6">
                <div className="absolute -left-[7px] md:-left-[9px] top-0 w-3 h-3 md:w-4 md:h-4 rounded-full bg-blue-500"></div>
                <div className="flex flex-col justify-between gap-2">
                  <div>
                    <h4 className="font-medium text-sm md:text-base">
                      Opening Ceremony
                    </h4>
                    <p className="text-white/70 text-xs md:text-sm">
                      Welcome address, keynote speech, and event overview
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 mt-1">
                    <div className="flex items-center gap-1 text-white/70">
                      <Clock size={12} className="md:w-4 md:h-4" />
                      <span className="text-xs md:text-sm">
                        09:30 AM - 10:30 AM
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-white/70">
                      <MapPin size={12} className="md:w-4 md:h-4" />
                      <span className="text-xs md:text-sm">
                        Andromeda Hall, Ground Floor, Jubilee Block
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative pl-4 md:pl-6 border-l-2 border-green-500/30 pb-4 md:pb-6">
                <div className="absolute -left-[7px] md:-left-[9px] top-0 w-3 h-3 md:w-4 md:h-4 rounded-full bg-green-500"></div>
                <div className="flex flex-col justify-between gap-2">
                  <div>
                    <h4 className="font-medium text-sm md:text-base">
                      AI Genesis
                    </h4>
                    <p className="text-white/70 text-xs md:text-sm">
                      AI Ad Slogan Challenge - Create compelling ad campaigns
                      using AI
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 mt-1">
                    <div className="flex items-center gap-1 text-white/70">
                      <Clock size={12} className="md:w-4 md:h-4" />
                      <span className="text-xs md:text-sm">
                        11:00 AM - 01:00 PM
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-white/70">
                      <MapPin size={12} className="md:w-4 md:h-4" />
                      <span className="text-xs md:text-sm">
                        Millenium Lab 1 & 2, 2nd Floor, Computer Science Block
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative pl-4 md:pl-6 border-l-2 border-indigo-500/30 pb-4 md:pb-6">
                <div className="absolute -left-[7px] md:-left-[9px] top-0 w-3 h-3 md:w-4 md:h-4 rounded-full bg-indigo-500"></div>
                <div className="flex flex-col justify-between gap-2">
                  <div>
                    <h4 className="font-medium text-sm md:text-base">
                      Digital Divas
                    </h4>
                    <p className="text-white/70 text-xs md:text-sm">
                      Women-exclusive tech poster design competition
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 mt-1">
                    <div className="flex items-center gap-1 text-white/70">
                      <Clock size={12} className="md:w-4 md:h-4" />
                      <span className="text-xs md:text-sm">
                        11:00 AM - 01:00 PM
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-white/70">
                      <MapPin size={12} className="md:w-4 md:h-4" />
                      <span className="text-xs md:text-sm">
                        Data Science Lab, 2nd Floor, Computer Science Extension
                        Block
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative pl-4 md:pl-6 border-l-2 border-pink-500/30 pb-4 md:pb-6">
                <div className="absolute -left-[7px] md:-left-[9px] top-0 w-3 h-3 md:w-4 md:h-4 rounded-full bg-pink-500"></div>
                <div className="flex flex-col justify-between gap-2">
                  <div>
                    <h4 className="font-medium text-sm md:text-base">
                      IdeaFusion
                    </h4>
                    <p className="text-white/70 text-xs md:text-sm">
                      Innovative solution presentation competition
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 mt-1">
                    <div className="flex items-center gap-1 text-white/70">
                      <Clock size={12} className="md:w-4 md:h-4" />
                      <span className="text-xs md:text-sm">
                        11:00 AM - 04:00 PM
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-white/70">
                      <MapPin size={12} className="md:w-4 md:h-4" />
                      <span className="text-xs md:text-sm">
                        Andromeda Hall, Ground Floor, Jubilee Block
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative pl-4 md:pl-6 border-l-2 border-orange-500/30 pb-4 md:pb-6">
                <div className="absolute -left-[7px] md:-left-[9px] top-0 w-3 h-3 md:w-4 md:h-4 rounded-full bg-orange-500"></div>
                <div className="flex flex-col justify-between gap-2">
                  <div>
                    <h4 className="font-medium text-sm md:text-base">
                      Pixel Showdown
                    </h4>
                    <p className="text-white/70 text-xs md:text-sm">
                      Multi-game tournament featuring Free Fire, BGMI, and PES
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 mt-1">
                    <div className="flex items-center gap-1 text-white/70">
                      <Clock size={12} className="md:w-4 md:h-4" />
                      <span className="text-xs md:text-sm">
                        11:00 AM - 04:00 PM
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-white/70">
                      <MapPin size={12} className="md:w-4 md:h-4" />
                      <span className="text-xs md:text-sm">
                        Room-PX003, Ground Floor, Computer Science Extension
                        Block
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative pl-4 md:pl-6 border-l-2 border-amber-500/30 pb-4 md:pb-6">
                <div className="absolute -left-[7px] md:-left-[9px] top-0 w-3 h-3 md:w-4 md:h-4 rounded-full bg-amber-500"></div>
                <div className="flex flex-col justify-between gap-2">
                  <div>
                    <h4 className="font-medium text-sm md:text-base">
                      Lunch Break
                    </h4>
                    <p className="text-white/70 text-xs md:text-sm">
                      Networking and refreshments
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 mt-1">
                    <div className="flex items-center gap-1 text-white/70">
                      <Clock size={12} className="md:w-4 md:h-4" />
                      <span className="text-xs md:text-sm">
                        01:00 PM - 02:00 PM
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-white/70">
                      <MapPin size={12} className="md:w-4 md:h-4" />
                      <span className="text-xs md:text-sm">
                        Garage Cafe and Other Hangout Spots
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative pl-4 md:pl-6 border-l-2 border-cyan-500/30 pb-4 md:pb-6">
                <div className="absolute -left-[7px] md:-left-[9px] top-0 w-3 h-3 md:w-4 md:h-4 rounded-full bg-cyan-500"></div>
                <div className="flex flex-col justify-between gap-2">
                  <div>
                    <h4 className="font-medium text-sm md:text-base">
                      HackQuest
                    </h4>
                    <p className="text-white/70 text-xs md:text-sm">
                      A Capture the Flag (CTF) competition using TryHackMe
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 mt-1">
                    <div className="flex items-center gap-1 text-white/70">
                      <Clock size={12} className="md:w-4 md:h-4" />
                      <span className="text-xs md:text-sm">
                        02:00 PM - 04:00 PM
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-white/70">
                      <MapPin size={12} className="md:w-4 md:h-4" />
                      <span className="text-xs md:text-sm">
                        Data Science Lab, 2nd Floor, Computer Science Extension
                        Block
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative pl-4 md:pl-6 border-l-2 border-teal-500/30">
                <div className="absolute -left-[7px] md:-left-[9px] top-0 w-3 h-3 md:w-4 md:h-4 rounded-full bg-teal-500"></div>
                <div className="flex flex-col justify-between gap-2">
                  <div>
                    <h4 className="font-medium text-sm md:text-base">
                      CodeArena
                    </h4>
                    <p className="text-white/70 text-xs md:text-sm">
                      Two-round coding competition focusing on error
                      identification and debugging
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 mt-1">
                    <div className="flex items-center gap-1 text-white/70">
                      <Clock size={12} className="md:w-4 md:h-4" />
                      <span className="text-xs md:text-sm">
                        02:00 PM - 04:00 PM
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-white/70">
                      <MapPin size={12} className="md:w-4 md:h-4" />
                      <span className="text-xs md:text-sm">
                        Coder&apos;s Hub, Main Block, 2nd Floor
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Day 2 */}
          <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-3 md:p-4">
              <div className="flex items-center gap-2">
                <Calendar className="text-purple-400 h-4 w-4 md:h-5 md:w-5" />
                <h3 className="font-semibold text-base md:text-lg">
                  Day 2 - March 22, 2025
                </h3>
              </div>
            </div>

            <div className="p-3 md:p-4 space-y-4">
              <div className="relative pl-4 md:pl-6 border-l-2 border-purple-500/30 pb-4 md:pb-6">
                <div className="absolute -left-[7px] md:-left-[9px] top-0 w-3 h-3 md:w-4 md:h-4 rounded-full bg-purple-500"></div>
                <div className="flex flex-col justify-between gap-2">
                  <div>
                    <h4 className="font-medium text-sm md:text-base">
                      Day 2 Check-in
                    </h4>
                    <p className="text-white/70 text-xs md:text-sm">
                      Attendance confirmation for finalists
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 mt-1">
                    <div className="flex items-center gap-1 text-white/70">
                      <Clock size={12} className="md:w-4 md:h-4" />
                      <span className="text-xs md:text-sm">
                        09:00 AM - 09:30 AM
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-white/70">
                      <MapPin size={12} className="md:w-4 md:h-4" />
                      <span className="text-xs md:text-sm">
                        Main Entrance, Jubilee Block
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative pl-4 md:pl-6 border-l-2 border-blue-500/30">
                <div className="absolute -left-[7px] md:-left-[9px] top-0 w-3 h-3 md:w-4 md:h-4 rounded-full bg-blue-500"></div>
                <div className="flex flex-col justify-between gap-2">
                  <div>
                    <h4 className="font-medium text-sm md:text-base">
                      Valedictory Ceremony
                    </h4>
                    <p className="text-white/70 text-xs md:text-sm">
                      Closing ceremony and awards presentation
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 mt-1">
                    <div className="flex items-center gap-1 text-white/70">
                      <Clock size={12} className="md:w-4 md:h-4" />
                      <span className="text-xs md:text-sm">
                        09:30 AM - 12:30 PM
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-white/70">
                      <MapPin size={12} className="md:w-4 md:h-4" />
                      <span className="text-xs md:text-sm">
                        Andromeda Hall, Ground Floor, Jubilee Block
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Contact Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="max-w-5xl mx-auto w-full"
      >
        <SectionTitle
          title="Important Contacts"
          subtitle="Reach out to us for any assistance during the event"
        />

        <div className="mt-4 md:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          <div className="bg-white/5 p-3 md:p-4 rounded-lg border border-white/10">
            <div className="flex items-start gap-2 md:gap-3">
              <Phone className="text-purple-400 mt-1 flex-shrink-0 h-4 w-4 md:h-5 md:w-5" />
              <div>
                <h3 className="font-medium text-white text-sm md:text-base">
                  Event Coordinator
                </h3>
                <p className="text-white/70 text-xs md:text-sm">
                  V Vishal: +91 93841 59875
                </p>
                <p className="text-white/70 text-xs md:text-sm">
                  For general inquiries and assistance
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 p-3 md:p-4 rounded-lg border border-white/10">
            <div className="flex items-start gap-2 md:gap-3">
              <Phone className="text-blue-400 mt-1 flex-shrink-0 h-4 w-4 md:h-5 md:w-5" />
              <div>
                <h3 className="font-medium text-white text-sm md:text-base">
                  Assistant Event Coordinator
                </h3>
                <p className="text-white/70 text-xs md:text-sm">
                  Anna Elizabeth Pravin: +91 63824 96273
                </p>
                <p className="text-white/70 text-xs md:text-sm">
                  For registration and event-specific queries
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 p-3 md:p-4 rounded-lg border border-white/10">
            <div className="flex items-start gap-2 md:gap-3">
              <Phone className="text-green-400 mt-1 flex-shrink-0 h-4 w-4 md:h-5 md:w-5" />
              <div>
                <h3 className="font-medium text-white text-sm md:text-base">
                  PR Lead
                </h3>
                <p className="text-white/70 text-xs md:text-sm">
                  Janani ER: +91 9360 864828
                </p>
                <p className="text-white/70 text-xs md:text-sm">
                  For media and publicity inquiries
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 p-3 md:p-4 rounded-lg border border-white/10">
            <div className="flex items-start gap-2 md:gap-3">
              <Phone className="text-amber-400 mt-1 flex-shrink-0 h-4 w-4 md:h-5 md:w-5" />
              <div>
                <h3 className="font-medium text-white text-sm md:text-base">
                  General Secretary
                </h3>
                <p className="text-white/70 text-xs md:text-sm">
                  Shibani A B: +91 73393 72992
                </p>
                <p className="text-white/70 text-xs md:text-sm">
                  For administrative and official matters
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 p-3 md:p-4 rounded-lg border border-white/10">
            <div className="flex items-start gap-2 md:gap-3">
              <Phone className="text-pink-400 mt-1 flex-shrink-0 h-4 w-4 md:h-5 md:w-5" />
              <div>
                <h3 className="font-medium text-white text-sm md:text-base">
                  Vice President
                </h3>
                <p className="text-white/70 text-xs md:text-sm">
                  M. Ashwini: +91 77399 62694
                </p>
                <p className="text-white/70 text-xs md:text-sm">
                  For escalations and major concerns
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 p-3 md:p-4 rounded-lg border border-white/10">
            <div className="flex items-start gap-2 md:gap-3">
              <Phone className="text-indigo-400 mt-1 flex-shrink-0 h-4 w-4 md:h-5 md:w-5" />
              <div>
                <h3 className="font-medium text-white text-sm md:text-base">
                  Staff Coordinator
                </h3>
                <p className="text-white/70 text-xs md:text-sm">
                  Ms. Praisy Evangelin A: +91 94439 61274
                </p>
                <p className="text-white/70 text-xs md:text-sm">
                  For faculty and staff assistance
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 p-3 md:p-4 rounded-lg border border-white/10">
            <div className="flex items-start gap-2 md:gap-3">
              <Mail className="text-teal-400 mt-1 flex-shrink-0 h-4 w-4 md:h-5 md:w-5" />
              <div>
                <h3 className="font-medium text-white text-sm md:text-base">
                  Email Support
                </h3>
                <p className="text-white/70 text-xs md:text-sm">
                  bspc.hits@gmail.com
                </p>
                <p className="text-white/70 text-xs md:text-sm">
                  For detailed queries and feedback
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 p-3 md:p-4 rounded-lg border border-white/10">
            <div className="flex items-start gap-2 md:gap-3">
              <Info className="text-cyan-400 mt-1 flex-shrink-0 h-4 w-4 md:h-5 md:w-5" />
              <div>
                <h3 className="font-medium text-white text-sm md:text-base">
                  Information Desk
                </h3>
                <p className="text-white/70 text-xs md:text-sm">
                  Located at the Entrance of Jubilee Block
                </p>
                <p className="text-white/70 text-xs md:text-sm">
                  Open throughout the event
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Additional Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="max-w-5xl mx-auto w-full"
      >
        <SectionTitle
          title="Additional Information"
          subtitle="Important details for participants"
        />

        <div className="mt-4 md:mt-6 bg-white/5 p-4 md:p-6 rounded-xl border border-white/10">
          <div className="space-y-3 md:space-y-4">
            <div>
              <h3 className="text-base md:text-lg font-medium text-blue-400">
                Lunch Arrangements
              </h3>
              <p className="mt-1 text-white/80 text-xs md:text-sm">
                Lunch will be provided at Garage Cafe
              </p>
              <p className="text-white/80 text-xs md:text-sm">
                Use the tokens provided at the registration desk
              </p>
              <p className="text-white/80 text-xs md:text-sm">
                Tokens will be distributed when you first report to us
              </p>
            </div>

            <div>
              <h3 className="text-base md:text-lg font-medium text-green-400">
                Dress Code
              </h3>
              <p className="mt-1 text-white/80 text-xs md:text-sm">
                Smart casual attire is recommended
              </p>
              <p className="text-white/80 text-xs md:text-sm">
                Participants must wear their ID cards at all times
              </p>
            </div>

            <div>
              <h3 className="text-base md:text-lg font-medium text-amber-400">
                Parking
              </h3>
              <p className="mt-1 text-white/80 text-xs md:text-sm">
                Bike and car parking available on first-come, first-served basis
              </p>
              <p className="text-white/80 text-xs md:text-sm">
                Park only in designated spaces near Jubilee Block
              </p>
              <p className="text-white/80 text-xs md:text-sm">
                Follow parking attendants&apos; instructions
              </p>
            </div>

            <div>
              <h3 className="text-base md:text-lg font-medium text-pink-400">
                Transportation
              </h3>
              <p className="mt-1 text-white/80 text-xs md:text-sm">
                MTC Bus - 102X, 102 from Kelambakkam to Broadway
              </p>
              <p className="text-white/80 text-xs md:text-sm">
                MTC Bus - 19 from Kelambakkam to T Nagar
              </p>
              <p className="text-white/80 text-xs md:text-sm">
                Campus is a short walk from Kelambakkam bus stop
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
