"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  AlertCircle,
  CheckCircle2,
  Shield,
} from "lucide-react";
import { SectionTitle } from "@/components/ui/section-title";

const Rules = () => {
  const rules = [
    {
      icon: Shield,
      title: "General Rules",
      items: [
        "All participants must be currently enrolled students",
        "Valid college ID is required for registration and participation",
        "Participants must adhere to the code of conduct throughout the event",
        "The decision of the judges and organizers will be final and binding",
      ],
    },
    {
      icon: Users,
      title: "Participation Guidelines",
      items: [
        "Registration is mandatory for all events",
        "Participants can register for multiple events, but should ensure there are no time conflicts",
        "Team events require all team members to be present during the event",
        "Use of unfair means will result in immediate disqualification",
      ],
    },
    {
      icon: AlertCircle,
      title: "Important Notes",
      items: [
        "Bring your own laptop and necessary equipment",
        "Internet access will be provided at the venue",
        "Maintain professional conduct throughout the event",
        "Follow all safety and security protocols",
      ],
    },
  ];

  return (
    <section id="rules" className="py-24 px-4 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          title="Rules & Guidelines"
          subtitle="Please review all rules and guidelines carefully before participating in any event. Failure to comply may result in disqualification."
        />

        {/* Tighter separator for mobile */}
        <div className="relative my-4 sm:my-12">
          <div className="h-px w-[90%] sm:w-[80%] mx-auto bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="absolute inset-0 w-[70%] sm:w-[60%] mx-auto bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-sm" />
        </div>

        {/* Tighter grid for mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-8">
          {rules.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-25px" }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative group touch-manipulation"
            >
              {/* Improved card background with better mobile contrast */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 rounded-lg sm:rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />

              <div className="relative h-full bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg sm:rounded-xl p-4 sm:p-6 hover:border-white/20 transition-colors">
                {/* Header with improved mobile spacing */}
                <div className="flex items-center gap-2.5 sm:gap-4 mb-3 sm:mb-6">
                  <div className="p-2 sm:p-2.5 rounded-lg bg-white/5 border border-white/10">
                    <section.icon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold">
                    {section.title}
                  </h3>
                </div>

                {/* Rules List with improved mobile spacing */}
                <ul className="space-y-2.5 sm:space-y-4">
                  {section.items.map((item, itemIndex) => (
                    <motion.li
                      key={itemIndex}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.1 + itemIndex * 0.1,
                      }}
                      className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-300"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400 shrink-0 mt-0.5" />
                      <span className="leading-normal sm:leading-relaxed">
                        {item}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tighter spacing for mobile note */}
        <motion.div className="mt-4 sm:mt-12 text-center">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/5 border border-white/10 text-xs sm:text-sm">
            <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
            <span className="text-gray-400">
              For event-specific rules, please check individual event pages
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Rules;
