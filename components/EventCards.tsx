"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { events } from "@/data/events";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { SectionTitle } from "@/components/ui/section-title";

const EventCards = () => {
  return (
    <section id="events" className="py-16 sm:py-24 px-4 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          title="Our Events"
          subtitle="Explore our exciting lineup of technical competitions and challenges"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {events.map((event, index) => (
            <Link href={`/events/${event.id}`} key={event.id} scroll={false}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 h-full flex flex-col"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Image */}
                <div className="relative h-40 sm:h-48 overflow-hidden">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 flex-grow flex flex-col">
                  <h3 className="text-lg sm:text-xl font-semibold">
                    {event.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-400 line-clamp-2 flex-grow">
                    {event.shortDescription}
                  </p>

                  {/* Event Details */}
                  <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-300 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>{event.time}</span>
                    </div>
                  </div>

                  {/* Learn More */}
                  <div className="flex items-center gap-2 text-sm sm:text-base text-blue-400 group-hover:text-blue-300 transition-colors pt-1 sm:pt-2">
                    Learn More
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventCards;
