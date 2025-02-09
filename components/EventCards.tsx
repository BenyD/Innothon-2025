"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Modal from "react-modal";

type Event = {
  title: string;
  image: string;
  description: string;
  details: string;
  rules: string[];
};

const events = [
  {
    title: "HackQuest 2025",
    image: "/hackquest.jpg",
    description: "A cybersecurity CTF competition with cryptography, web exploitation, and more.",
    details: 
      "Join our Capture The Flag competition where teams solve challenges in cryptography, web exploitation, reverse engineering, and forensics. Compete through two intense rounds to prove your cybersecurity skills!",
    rules: [
      "Two rounds: 60-min Qualifier and 60-min Finals",
      "Top 5-6 teams qualify for finals",
      "Individual or team participation (max 3 members)",
      "Bring your own laptop",
      "Internet access provided",
      "Time: 10:45 AM - 2:15 PM (includes lunch break)"
    ],
  },
  {
    title: "AI Genesis",
    image: "/ai-genesis.jpg",
    description: "Create innovative solutions using Generative AI tools.",
    details:
      "Unleash your creativity with AI! Teams will use various AI tools to generate innovative solutions for real-world problems. Present your AI-generated content and explain its impact to our panel of experts.",
    rules: [
      "Two phases: 60-min Problem-Solving and 45-min Presentation",
      "Teams of 2-3 members",
      "Access to OpenAI, Stable Diffusion provided",
      "Original solutions only",
      "Time: 10:45 AM - 2:15 PM (includes lunch break)"
    ],
  },
  {
    title: "CodeArena",
    image: "/code-arena.jpg",
    description: "Competitive programming contest with live leaderboard.",
    details:
      "Test your coding prowess in our 75-minute programming challenge! Solve algorithmic problems of increasing difficulty while competing against other talented programmers.",
    rules: [
      "75-minute single round format",
      "5-6 problems of varying difficulty",
      "Individual participation",
      "Any programming language allowed",
      "Time: 1:00 PM - 2:15 PM"
    ],
  },
  {
    title: "Tech Queens",
    image: "/tech-queens.jpg",
    description: "Women-exclusive tech idea presentation competition.",
    details:
      "Calling all women innovators! Present your groundbreaking tech ideas that can make a real difference. Share your vision with industry experts and win exciting prizes.",
    rules: [
      "Women-only participation",
      "5-7 minutes presentation + 2-3 minutes Q&A",
      "Individual or team (max 2 members)",
      "PowerPoint/PDF presentations allowed",
      "Time: 1:00 PM - 2:15 PM"
    ],
  }
];

const EventCards = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    // Set the app element when the component mounts
    if (typeof window !== "undefined") {
      Modal.setAppElement("body");
    }
  }, []);

  return (
    <section id="events" className="py-20 px-4">
      <h2 className="text-4xl font-bold text-center mb-12">Our Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event, index) => (
          <motion.div
            key={event.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105 border border-gray-800"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Image
              src={event.image || "/placeholder.svg"}
              alt={event.title}
              width={400}
              height={200}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
              <p className="text-gray-300 mb-4">{event.description}</p>
              <button
                onClick={() => setSelectedEvent(event)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
              >
                Learn More
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      <Modal
        isOpen={!!selectedEvent}
        onRequestClose={() => setSelectedEvent(null)}
        className="bg-gray-900 text-white rounded-lg p-8 max-w-2xl mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
      >
        {selectedEvent && (
          <div>
            <h2 className="text-3xl font-bold mb-4">{selectedEvent.title}</h2>
            <p className="mb-4">{selectedEvent.details}</p>
            <h3 className="text-xl font-semibold mb-2">Rules:</h3>
            <ul className="list-disc pl-5 mb-4">
              {selectedEvent.rules.map((rule, index) => (
                <li key={index}>{rule}</li>
              ))}
            </ul>
            <button
              onClick={() => setSelectedEvent(null)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
            >
              Close
            </button>
          </div>
        )}
      </Modal>
    </section>
  );
};

export default EventCards;
