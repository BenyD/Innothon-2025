"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { SectionTitle } from "@/components/ui/section-title";
import {
  MapPin,
  Clock,
  Calendar,
  Bus,
  Train,
  Car,
  Phone,
  Mail,
} from "lucide-react";
import Link from "next/link";

const Venue = () => {
  return (
    <section id="venue" className="py-16 sm:py-24 px-4 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          title="Event Venue"
          subtitle="Join us at the prestigious Hindustan Institute of Technology and Science"
        />

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          {/* Map and Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Interactive Map */}
            <div className="aspect-video w-full rounded-xl overflow-hidden border border-white/10">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3890.0407961044!2d80.22976387486!3d12.800513487476373!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525b3d8c1f1f3d%3A0xab5b28638d31e4ea!2sHindustan%20Institute%20of%20Technology%20and%20Science!5e0!3m2!1sen!2sin!4v1709812345678!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Event Venue Map"
                className="w-full h-full"
              ></iframe>
            </div>

            {/* Venue Images */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10">
                <Image
                  src="/venue/venue-1.jpeg"
                  alt="HITS Campus Exterior"
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10">
                <Image
                  src="/venue/venue-2.jpg"
                  alt="HITS Campus Interior"
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>
          </motion.div>

          {/* Venue Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Address and Contact */}
            <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-purple-500/30 transition-all duration-300">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-purple-400" />
                <span>Venue Address</span>
              </h3>
              <p className="text-sm sm:text-base text-gray-300 mb-4">
                Hindustan Institute of Technology and Science
                <br />
                Rajiv Gandhi Salai (OMR), Padur
                <br />
                (Via) Kelambakkam, Chennai - 603 103
                <br />
                Tamil Nadu, India
              </p>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Phone className="w-4 h-4 text-blue-400" />
                  <span>1800 425 44 38 (Toll Free)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <span>info@hindustanuniv.ac.in</span>
                </div>
              </div>
            </div>

            {/* Event Timing */}
            <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-purple-500/30 transition-all duration-300">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                <span>Event Schedule</span>
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-blue-400 mt-1" />
                  <div>
                    <p className="text-sm sm:text-base font-medium">
                      Day 1: March 21, 2025
                    </p>
                    <p className="text-xs sm:text-sm text-gray-400">
                      9:00 AM - 4:30 PM
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-blue-400 mt-1" />
                  <div>
                    <p className="text-sm sm:text-base font-medium">
                      Day 2: March 22, 2025
                    </p>
                    <p className="text-xs sm:text-sm text-gray-400">
                      9:00 AM - 12:30 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Transportation */}
            <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-purple-500/30 transition-all duration-300">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
                <span>Getting There</span>
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-green-500/10 text-green-400">
                    <Bus className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm sm:text-base font-medium">By Bus</p>
                    <p className="text-xs sm:text-sm text-gray-400">
                      Multiple bus routes on OMR stop at Padur/HITS Bus Stop
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-purple-500/10 text-purple-400">
                    <Car className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm sm:text-base font-medium">By Car</p>
                    <p className="text-xs sm:text-sm text-gray-400">
                      Located on OMR (Rajiv Gandhi Salai), 30 km from Chennai
                      city center
                      <br />
                      Ample parking available on campus
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Get Directions Button */}
            <div className="text-center sm:text-left">
              <Link
                href="https://maps.app.goo.gl/Yx5Ld9Yx5Ld9Yx5Ld"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-colors text-sm sm:text-base font-medium"
              >
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                Get Directions
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Venue;
