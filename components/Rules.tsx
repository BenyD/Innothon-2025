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
import { Separator } from "@/components/ui/separator";

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
    <section id="rules" className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          title="Rules & Guidelines"
          subtitle="Please review all rules and guidelines carefully before participating in any event. Failure to comply may result in disqualification."
        />

        {/* Add a decorative separator */}
        <div className="relative mb-12">
          <Separator className="bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-sm" />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {rules.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              {/* Card Background with Gradient Border */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity" />

              <div className="relative h-full bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <section.icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold">{section.title}</h3>
                </div>

                {/* Rules List */}
                <ul className="space-y-4">
                  {section.items.map((item, itemIndex) => (
                    <motion.li
                      key={itemIndex}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.1 + itemIndex * 0.1,
                      }}
                      className="flex items-start gap-3 text-gray-300"
                    >
                      <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <BookOpen className="w-4 h-4 text-purple-400" />
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
