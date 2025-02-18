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
  Target,
  Gamepad2,
  Swords,
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

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Content - 2 Columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-blue-400" />
                <h2 className="text-xl font-semibold">About the Event</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">{event.fullDescription}</p>
            </div>

            {/* Event Structure - If available */}
            {event.eventStructure && (
              <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 mb-4">
                  <Layers className="w-5 h-5 text-purple-400" />
                  <h2 className="text-xl font-semibold">Event Structure</h2>
                </div>
                <div className="space-y-4">
                  {event.eventStructure.map((phase, index) => (
                    <div key={index} className="p-4 rounded-lg bg-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-white">{phase.phase}</h3>
                        {phase.duration && (
                          <span className="text-xs px-2 py-1 rounded-full bg-purple-500/10 text-purple-400">
                            {phase.duration}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-300 text-sm">{phase.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rules and Guidelines Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 mb-4">
                  <ClipboardList className="w-5 h-5 text-red-400" />
                  <h2 className="text-xl font-semibold">Rules</h2>
                </div>
                <ul className="space-y-2">
                  {event.rules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-300 text-sm">
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
                    <li key={index} className="flex items-start gap-2 text-gray-300 text-sm">
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
                    <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 rounded-lg bg-white/5">
                      <div className="flex items-center gap-2 min-w-[200px]">
                        <span className="text-yellow-400 font-semibold">
                          {criteria.criterion}
                        </span>
                        <span className="text-sm px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-400">
                          {criteria.weightage}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm">{criteria.description}</p>
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
                          <li key={reqIndex} className="flex items-start gap-2 text-gray-300 text-sm">
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
          </div>

          {/* Right Sidebar - 1 Column */}
          <div className="space-y-6">
            {/* Registration Card */}
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
              <h2 className="text-xl font-semibold mb-4">Registration Details</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-300 text-sm">Entry Fee</span>
                  <span className="text-white font-medium">{event.registrationFee}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-300 text-sm">Team Size</span>
                  <span className="text-white font-medium">{event.teamSize}</span>
                </div>
              </div>
              <Link href="/register">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6">
                  Register Now
                  <ExternalLink className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Prizes Card */}
            {event.id === "pixel-showdown" ? (
              <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <h2 className="text-xl font-semibold">Prizes</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Free Fire Squad */}
                  <div className="p-4 rounded-lg bg-gradient-to-r from-orange-500/10 to-transparent">
                    <h3 className="text-orange-400 font-medium mb-3">Free Fire Squad</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-yellow-400 text-sm">First Prize</span>
                        <span className="text-white">{event.prizes["Free Fire Squad"].First}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Second Prize</span>
                        <span className="text-white">{event.prizes["Free Fire Squad"].Second}</span>
                      </div>
                    </div>
                  </div>

                  {/* Free Fire Duo */}
                  <div className="p-4 rounded-lg bg-gradient-to-r from-red-500/10 to-transparent">
                    <h3 className="text-red-400 font-medium mb-3">Free Fire Duo</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-yellow-400 text-sm">First Prize</span>
                        <span className="text-white">{event.prizes["Free Fire Duo"].First}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Second Prize</span>
                        <span className="text-white">{event.prizes["Free Fire Duo"].Second}</span>
                      </div>
                    </div>
                  </div>

                  {/* BGMI Squad */}
                  <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-transparent">
                    <h3 className="text-blue-400 font-medium mb-3">BGMI Squad</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-yellow-400 text-sm">First Prize</span>
                        <span className="text-white">{event.prizes["BGMI Squad"].First}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Second Prize</span>
                        <span className="text-white">{event.prizes["BGMI Squad"].Second}</span>
                      </div>
                    </div>
                  </div>

                  {/* PES Solo */}
                  <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-transparent">
                    <h3 className="text-purple-400 font-medium mb-3">PES Solo</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-yellow-400 text-sm">First Prize</span>
                        <span className="text-white">{event.prizes["PES Solo"].First}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Second Prize</span>
                        <span className="text-white">{event.prizes["PES Solo"].Second}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <h2 className="text-xl font-semibold">Prizes</h2>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-yellow-500/10 to-transparent rounded-lg">
                    <span className="text-yellow-400 text-sm">First Prize</span>
                    <span className="text-white font-medium">{event.prizes.Main.First}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-gray-400/10 to-transparent rounded-lg">
                    <span className="text-gray-400 text-sm">Second Prize</span>
                    <span className="text-white font-medium">{event.prizes.Main.Second}</span>
                  </div>
                  {event.prizes.Main.Third && (
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-orange-500/10 to-transparent rounded-lg">
                      <span className="text-orange-400 text-sm">Third Prize</span>
                      <span className="text-white font-medium">{event.prizes.Main.Third}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Coordinators Card */}
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
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
                        <h3 className="font-medium text-white">{coordinator.name}</h3>
                        <p className="text-gray-400 text-sm">{coordinator.role}</p>
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
        </div>

        {/* Add this after the Main Grid Layout section */}
        {event.id === "pixel-showdown" && event.gameDetails && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
              <Gamepad2 className="w-6 h-6 text-purple-400" />
              Game Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {event.gameDetails.map((game) => (
                <div
                  key={game.game}
                  className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
                >
                  <div className="p-6 border-b border-white/10 bg-white/5">
                    <h3 className="text-xl font-semibold text-white mb-2">{game.game}</h3>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>{game.teamSize}</span>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div>
                      <div className="text-sm font-medium text-gray-400 mb-1">Registration Fee</div>
                      <div className="text-white">{game.registrationFee}</div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-gray-400 mb-1">Format</div>
                      <div className="text-white">{game.format}</div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-gray-400 mb-1">Scoring System</div>
                      <div className="space-y-2">
                        {game.scoring.placement && (
                          <div className="flex items-start gap-2 text-white">
                            <Target className="w-4 h-4 text-blue-400 mt-1 shrink-0" />
                            <span>Placement: {game.scoring.placement}</span>
                          </div>
                        )}
                        {game.scoring.kills && (
                          <div className="flex items-start gap-2 text-white">
                            <Swords className="w-4 h-4 text-red-400 mt-1 shrink-0" />
                            <span>Kills: {game.scoring.kills}</span>
                          </div>
                        )}
                        {game.scoring.league && (
                          <div className="flex items-start gap-2 text-white">
                            <Trophy className="w-4 h-4 text-yellow-400 mt-1 shrink-0" />
                            <span>League: {game.scoring.league}</span>
                          </div>
                        )}
                        {game.scoring.tiebreakers && (
                          <div className="text-sm text-gray-400 mt-2">
                            <span className="font-medium">Tiebreakers:</span> {game.scoring.tiebreakers}
                          </div>
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
  );
}
