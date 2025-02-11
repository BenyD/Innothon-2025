"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getEventById } from "@/data/events";
import { Event } from "@/types/event";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Trophy,
  ExternalLink,
} from "lucide-react";

export default function EventPage() {
  const params = useParams();
  const [event, setEvent] = useState<Event | undefined>();

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    if (params.id) {
      const eventData = getEventById(params.id as string);
      setEvent(eventData);
    }
  }, [params.id]);

  if (!event) return null;

  return (
    <>
      {/* Hero Section with Image */}
      <div className="relative h-[60vh] w-full">
        {/* Dark overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black z-10" />

        {/* Background Image */}
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover"
          priority
        />

        {/* Content */}
        <div className="relative z-20 h-full w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="pt-32">
            <Link
              href="/#events"
              className="inline-flex items-center text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Link>
          </div>

          {/* Event Title */}
          <div className="absolute bottom-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {event.title}
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl">
              {event.shortDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left Column - Event Details */}
          <div className="space-y-8">
            {/* Event Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-gray-300 bg-white/5 p-4 rounded-xl border border-white/10">
                <Calendar className="w-5 h-5 text-blue-400" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 bg-white/5 p-4 rounded-xl border border-white/10">
                <Clock className="w-5 h-5 text-purple-400" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 bg-white/5 p-4 rounded-xl border border-white/10">
                <MapPin className="w-5 h-5 text-pink-400" />
                <span>{event.venue}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 bg-white/5 p-4 rounded-xl border border-white/10">
                <Users className="w-5 h-5 text-green-400" />
                <span>{event.teamSize}</span>
              </div>
            </div>

            {/* Full Description */}
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
              <h2 className="text-2xl font-semibold mb-4">About the Event</h2>
              <p className="text-gray-300 leading-relaxed">
                {event.fullDescription}
              </p>
            </div>

            {/* Prizes Section */}
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
              <h2 className="text-2xl font-semibold mb-4">Prizes</h2>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(event.prizes).map(([place, amount], index) => (
                  <div
                    key={place}
                    className="text-center p-6 rounded-xl bg-black/50 border border-white/10"
                  >
                    <Trophy
                      className={`w-6 h-6 mx-auto mb-2 ${
                        index === 0
                          ? "text-yellow-400"
                          : index === 1
                          ? "text-gray-400"
                          : "text-orange-400"
                      }`}
                    />
                    <div className="font-semibold text-gray-400">{place}</div>
                    <div className="text-xl font-bold text-white">{amount}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Rules and Guidelines */}
          <div className="space-y-8">
            {/* Rules Section */}
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
              <h2 className="text-2xl font-semibold mb-4">Rules</h2>
              <ul className="space-y-2">
                {event.rules.map((rule, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-gray-300"
                  >
                    <span className="text-blue-400 font-bold">•</span>
                    {rule}
                  </li>
                ))}
              </ul>
            </div>

            {/* Guidelines Section */}
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
              <h2 className="text-2xl font-semibold mb-4">Guidelines</h2>
              <ul className="space-y-2">
                {event.guidelines.map((guideline, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-gray-300"
                  >
                    <span className="text-purple-400 font-bold">•</span>
                    {guideline}
                  </li>
                ))}
              </ul>
            </div>

            {/* Coordinators Section */}
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
              <h2 className="text-2xl font-semibold mb-4">
                Event Coordinators
              </h2>
              <div className="grid gap-4">
                {event.coordinators.map((coordinator, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 bg-black/50 rounded-lg border border-white/10"
                  >
                    <div>
                      <h3 className="font-semibold text-white">
                        {coordinator.name}
                      </h3>
                      <p className="text-gray-400">{coordinator.role}</p>
                    </div>
                    <a
                      href={`tel:${coordinator.contact}`}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all"
                    >
                      <span>{coordinator.contact}</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Registration Info */}
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">
                  Registration Fee
                </h2>
                <p className="text-gray-300">{event.registrationFee}</p>
              </div>
              <Link href="/register">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg">
                  Register Now
                  <ExternalLink className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
