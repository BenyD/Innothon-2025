"use client";

import { motion } from "framer-motion";
import {
  Users,
  AlertCircle,
  CheckCircle2,
  Shield,
  Clock,
  IdCard,
  Laptop,
  Shirt,
} from "lucide-react";
import { SectionTitle } from "@/components/ui/section-title";

const Rules = () => {
  const rules = [
    {
      icon: Shield,
      title: "General Rules",
      rules: [
        "All participants must attend the opening ceremony at 9:30 AM",
        "Professional dress code is mandatory for all events",
        "Participants must bring college ID and government photo ID proof",
        "No malpractice or unfair means will be tolerated",
        "Judges' decisions will be final and binding",
        "No unauthorized collaboration or external help allowed",
        "Disqualification for any rule violations",
      ],
    },
    {
      icon: Clock,
      title: "Schedule & Timing",
      rules: [
        "Opening Ceremony: 9:30 AM - 10:30 AM",
        "Morning Events: 11:00 AM - 1:00 PM",
        "Lunch Break: 1:00 PM - 2:00 PM",
        "Afternoon Events: 2:00 PM - 4:00 PM",
        "Valedictory: 22nd March 2025",
        "Report 30 minutes before event start",
        "Strict adherence to event timings",
        "Late submissions will not be accepted",
      ],
    },
    {
      icon: Users,
      title: "Team Guidelines",
      rules: [
        "Team sizes vary by event (1-3 members)",
        "Cross-college teams are allowed",
        "Team changes not permitted after registration",
        "One participant can join multiple events",
        "Register early to secure your spot",
        "All team members must be present during the event",
      ],
    },
    {
      icon: Laptop,
      title: "Technical Requirements",
      rules: [
        "Bring your own laptop (recommended)",
        "Required software must be pre-installed",
        "Stable internet connection needed (Mobile Hotspot)",
        "Lab computers available if needed",
        "Technical support will be provided",
        "No unauthorized software or tools allowed",
        "Internet access will be provided only to the lab computers",
      ],
    },
    {
      icon: IdCard,
      title: "Registration & Facilities",
      rules: [
        "Registration fees vary by event (₹200-₹500)",
        "Lunch will be provided",
        "Carry all required documents",
        "On-spot registrations not allowed",
        "College ID mandatory for participation",
        "Winners must attend prize distribution",
      ],
    },
    {
      icon: Shirt,
      title: "Dress Code & Conduct",
      rules: [
        "Formal/Smart casual attire mandatory",
        "College ID must be visible at all times",
        "Maintain professional behavior",
        "Follow venue-specific guidelines",
        "Respect fellow participants",
        "Fair play and sportsmanship mandatory",
      ],
    },
  ];

  return (
    <section id="rules" className="py-10 sm:py-16 scroll-mt-20">
      <div className="container px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionTitle
          title="Rules & Guidelines"
          subtitle="Important information for all participants"
        />

        <div className="mt-6 sm:mt-8 lg:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {rules.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-3 sm:p-4 lg:p-6 hover:border-purple-500/50 transition-colors duration-300"
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="p-1.5 sm:p-2 rounded-lg bg-purple-500/10">
                  <section.icon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white">
                  {section.title}
                </h3>
              </div>
              <ul className="space-y-2 sm:space-y-3">
                {section.rules.map((rule, ruleIndex) => (
                  <motion.li
                    key={ruleIndex}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + ruleIndex * 0.05 }}
                    className="flex items-start gap-2 sm:gap-2.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 text-green-400 shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                      {rule}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-6 sm:mt-8 lg:mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/5 border border-white/10 text-xs sm:text-sm backdrop-blur-sm hover:border-purple-500/50 transition-colors duration-300">
            <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />
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
