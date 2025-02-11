"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { events } from "@/data/events";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { SectionTitle } from "@/components/ui/section-title";

const EventCards = () => {
  return (
    <section id="events" className="py-24 px-4 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <SectionTitle 
          title="Our Events"
          subtitle="Explore our exciting lineup of technical competitions and challenges"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <Link href={`/events/${event.id}`} key={event.id} scroll={false}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold">{event.title}</h3>
                  <p className="text-gray-400 line-clamp-2">{event.shortDescription}</p>
                  
                  {/* Event Details */}
                  <div className="flex items-center gap-4 text-sm text-gray-300">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{event.time}</span>
                    </div>
                  </div>

                  {/* Learn More */}
                  <div className="flex items-center gap-2 text-blue-400 group-hover:text-blue-300 transition-colors">
                    Learn More
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
