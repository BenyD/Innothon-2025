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
  Info,
  ClipboardList,
  CheckCircle2,
  Award,
  Wrench,
  Layers,
  Gamepad2,
  IndianRupee,
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
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative h-[50vh] w-full">
        {/* Dark overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black z-10" />

        {/* Background Image */}
        <Image
          src={event.image}
          alt={event.title}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />

        {/* Hero Content */}
        <div className="relative z-20 h-full w-full max-w-7xl mx-auto px-4">
          {/* Back Button */}
          <div className="pt-24">
            <Link
              href="/#events"
              className="inline-flex items-center text-gray-300 hover:text-white"
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

      {/* Main Content - Bento Grid Layout */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Quick Navigation - Mobile Only */}
        <div className="lg:hidden mb-6">
          {/* Hide scrollbar but keep functionality */}
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-3 pb-4 min-w-max">
              <button
                onClick={() =>
                  document
                    .getElementById("about")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-4 py-2 text-sm bg-white/5 rounded-lg border border-white/10 text-gray-300 hover:bg-white/10"
              >
                About
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("registration")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-4 py-2 text-sm bg-white/5 rounded-lg border border-white/10 text-gray-300 hover:bg-white/10"
              >
                Register
              </button>
              {event.eventStructure && (
                <button
                  onClick={() =>
                    document
                      .getElementById("structure")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="px-4 py-2 text-sm bg-white/5 rounded-lg border border-white/10 text-gray-300 hover:bg-white/10"
                >
                  Structure
                </button>
              )}
              <button
                onClick={() =>
                  document
                    .getElementById("prizes")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-4 py-2 text-sm bg-white/5 rounded-lg border border-white/10 text-gray-300 hover:bg-white/10"
              >
                Prizes
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("rules")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-4 py-2 text-sm bg-white/5 rounded-lg border border-white/10 text-gray-300 hover:bg-white/10"
              >
                Rules
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-4 py-2 text-sm bg-white/5 rounded-lg border border-white/10 text-gray-300 hover:bg-white/10"
              >
                Contact
              </button>
            </div>
          </div>
        </div>

        {/* Key Event Details Cards */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="inline-flex items-center gap-2 text-gray-300 bg-white/5 px-4 py-2 rounded-lg border border-white/10 backdrop-blur-sm">
            <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
            <span className="text-sm whitespace-nowrap">{event.date}</span>
          </div>
          <div className="inline-flex items-center gap-2 text-gray-300 bg-white/5 px-4 py-2 rounded-lg border border-white/10 backdrop-blur-sm">
            <Clock className="w-4 h-4 text-purple-400 shrink-0" />
            <span className="text-sm whitespace-nowrap">{event.time}</span>
          </div>
          <div className="inline-flex items-center gap-2 text-gray-300 bg-white/5 px-4 py-2 rounded-lg border border-white/10 backdrop-blur-sm">
            <MapPin className="w-4 h-4 text-pink-400 shrink-0" />
            <span className="text-sm whitespace-nowrap">{event.venue}</span>
          </div>
          <div className="inline-flex items-center gap-2 text-gray-300 bg-white/5 px-4 py-2 rounded-lg border border-white/10 backdrop-blur-sm">
            <Users className="w-4 h-4 text-green-400 shrink-0" />
            <span className="text-sm whitespace-nowrap">{event.teamSize}</span>
          </div>
        </div>

        {/* Main Content Grid - Reordered for mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Right Column - Prizes, Register, and Contact */}
          <div className="space-y-6 lg:order-last">
            {/* Register Card */}
            <div
              id="registration"
              className="bg-white/5 p-6 rounded-xl border border-white/10"
            >
              <h2 className="text-xl font-semibold text-white mb-4">
                Register Now
              </h2>
              <div className="space-y-4">
                <p className="text-gray-400">
                  Registration Fee:{" "}
                  <span className="text-white font-medium">
                    {event.registrationFee}
                  </span>
                </p>
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
                >
                  <Link href="/register">Register Now</Link>
                </Button>
              </div>
            </div>

            {/* Prizes Section */}
            <div
              id="prizes"
              className="bg-white/5 p-6 rounded-xl border border-white/10"
            >
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <h2 className="text-xl font-semibold">Prizes</h2>
              </div>
              {event.id === "pixel-showdown" ? (
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <h3 className="text-lg font-medium mb-2">BGMI</h3>
                      <p className="text-sm text-gray-400">Squad (4 players)</p>
                      <p className="text-sm text-purple-400 mt-2">
                        ₹200 per team
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <h3 className="text-lg font-medium mb-2">PES</h3>
                      <p className="text-sm text-gray-400">Individual</p>
                      <p className="text-sm text-purple-400 mt-2">
                        ₹100 per person
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <h3 className="text-lg font-medium mb-2">Free Fire</h3>
                      <p className="text-sm text-gray-400">Squad (4 players)</p>
                      <p className="text-sm text-purple-400 mt-2">
                        ₹200 per team
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-yellow-500/10 to-transparent rounded-lg">
                    <span className="text-yellow-400 text-sm">First Prize</span>
                    <span className="text-white font-medium">
                      {event.prizes.Main.First}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-gray-400/10 to-transparent rounded-lg">
                    <span className="text-gray-400 text-sm">Second Prize</span>
                    <span className="text-white font-medium">
                      {event.prizes.Main.Second}
                    </span>
                  </div>
                  {event.prizes.Main.Third && (
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-orange-500/10 to-transparent rounded-lg">
                      <span className="text-orange-400 text-sm">
                        Third Prize
                      </span>
                      <span className="text-white font-medium">
                        {event.prizes.Main.Third}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Coordinators Card */}
            <div
              id="contact"
              className="bg-white/5 p-6 rounded-xl border border-white/10"
            >
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-green-400" />
                <h2 className="text-xl font-semibold">Event Coordinators</h2>
              </div>
              <div className="space-y-3">
                {event.coordinators.map((coordinator, index) => (
                  <div
                    key={index}
                    className="p-3 bg-white/5 rounded-lg space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-white">
                          {coordinator.name}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {coordinator.role}
                        </p>
                      </div>
                      <a
                        href={`tel:${coordinator.contact}`}
                        className="text-sm text-gray-300 hover:text-white flex items-center gap-1"
                      >
                        <span>{coordinator.contact}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Left Column Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <div
              id="about"
              className="bg-white/5 p-6 rounded-xl border border-white/10"
            >
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-blue-400" />
                <h2 className="text-xl font-semibold">About the Event</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">
                {event.fullDescription}
              </p>
            </div>

            {/* Event Structure */}
            {event.eventStructure && (
              <div
                id="structure"
                className="bg-white/5 p-6 rounded-xl border border-white/10"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Layers className="w-5 h-5 text-purple-400" />
                  <h2 className="text-xl font-semibold">Event Structure</h2>
                </div>
                <div className="space-y-4">
                  {event.eventStructure.map((phase, index) => (
                    <div key={index} className="p-4 rounded-lg bg-white/5">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                        <h3 className="font-medium text-white">
                          {phase.phase}
                        </h3>
                        {phase.duration && (
                          <span className="text-xs px-2 py-1 rounded-full bg-purple-500/10 text-purple-400 w-fit">
                            {phase.duration}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-300 text-sm">
                        {phase.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rules and Guidelines Grid */}
            <div id="rules" className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 mb-4">
                  <ClipboardList className="w-5 h-5 text-red-400" />
                  <h2 className="text-xl font-semibold">Rules</h2>
                </div>
                <ul className="space-y-2">
                  {event.rules.map((rule, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-gray-300 text-sm"
                    >
                      <span className="text-red-400 font-bold mt-1">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <h2 className="text-xl font-semibold">Guidelines</h2>
                </div>
                <ul className="space-y-2">
                  {event.guidelines.map((guideline, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-gray-300 text-sm"
                    >
                      <span className="text-green-400 font-bold mt-1">•</span>
                      <span>{guideline}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Judging Criteria - If available */}
            {event.judgingCriteria && (
              <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-yellow-400" />
                  <h2 className="text-xl font-semibold">Judging Criteria</h2>
                </div>
                <div className="space-y-4">
                  {event.judgingCriteria.map((criteria, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 rounded-lg bg-white/5"
                    >
                      <div className="flex items-center gap-2 min-w-[200px]">
                        <span className="text-yellow-400 font-semibold">
                          {criteria.criterion}
                        </span>
                        <span className="text-sm px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-400">
                          {criteria.weightage}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm">
                        {criteria.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Setup Requirements - If available */}
            {event.setupRequirements && (
              <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 mb-4">
                  <Wrench className="w-5 h-5 text-blue-400" />
                  <h2 className="text-xl font-semibold">Setup Requirements</h2>
                </div>
                <div className="space-y-4">
                  {event.setupRequirements.map((setup, index) => (
                    <div key={index} className="p-4 rounded-lg bg-white/5">
                      <h3 className="text-lg font-medium text-blue-400 mb-3">
                        {setup.category}
                      </h3>
                      <ul className="space-y-2">
                        {setup.requirements.map((req, reqIndex) => (
                          <li
                            key={reqIndex}
                            className="flex items-start gap-2 text-gray-300 text-sm"
                          >
                            <span className="text-blue-400 font-bold">•</span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Game Details Section for Pixel Showdown */}
            {event.id === "pixel-showdown" && event.gameDetails && (
              <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 mb-6">
                  <Gamepad2 className="w-5 h-5 text-purple-400" />
                  <h2 className="text-xl font-semibold">Game Details</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {event.gameDetails.map((game) => (
                    <div
                      key={game.game}
                      className={`p-4 rounded-lg bg-gradient-to-r ${
                        game.game === "valorant"
                          ? "from-red-500/10"
                          : game.game === "Free Fire"
                            ? "from-orange-500/10"
                            : game.game === "BGMI"
                              ? "from-purple-500/10"
                              : "from-green-500/10"
                      } to-transparent`}
                    >
                      <h3
                        className={`font-medium mb-4 ${
                          game.game === "valorant"
                            ? "text-red-400"
                            : game.game === "Free Fire"
                              ? "text-orange-400"
                              : game.game === "BGMI"
                                ? "text-purple-400"
                                : "text-green-400"
                        }`}
                      >
                        {game.game.toUpperCase()}
                      </h3>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-gray-300">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{game.teamSize}</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-300">
                          <IndianRupee className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">
                            {game.registrationFee}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-300">
                          <Trophy className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{game.format}</span>
                        </div>

                        <div className="mt-4 p-3 rounded-md bg-black/20">
                          <p className="text-xs font-medium text-gray-400 mb-2">
                            Scoring System
                          </p>
                          <div className="space-y-1 text-sm text-gray-300">
                            <p>• {game.scoring.placement}</p>
                            {game.scoring.kills && (
                              <p>• {game.scoring.kills}</p>
                            )}
                            {game.scoring.league && (
                              <p>• {game.scoring.league}</p>
                            )}
                            {game.scoring.tiebreakers && (
                              <p>• {game.scoring.tiebreakers}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
