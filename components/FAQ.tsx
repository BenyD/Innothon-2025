"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/section-title";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { scrollToSection } from "@/utils/scroll";

// Sample FAQ data - replace with your actual FAQs
const faqData = [
  {
    category: "Registration & Eligibility",
    questions: [
      {
        question: "Who can participate in Innothon 2025?",
        answer:
          "Innothon 2025 is open to all college students pursuing undergraduate or postgraduate degrees. Both individual and team participation is allowed, depending on the event.",
      },
      {
        question: "Is there a registration fee?",
        answer:
          "Yes, there is a registration fee that varies by event (₹200-₹500). The fee covers participation materials, refreshments, and certificates.",
      },
      {
        question: "How do I register for the events?",
        answer:
          "You can register through our website by visiting the Registration page. Fill out the required details, select your events, and complete the payment process.",
      },
      {
        question: "Can I participate in multiple events?",
        answer:
          "Yes, you can participate in multiple events as long as there are no schedule conflicts. Each event requires separate registration.",
      },
    ],
  },
  {
    category: "Event Format & Rules",
    questions: [
      {
        question: "What is the format of the competitions?",
        answer:
          "Most events have preliminary and final rounds. The format varies by event - some are time-bound challenges, while others may be project submissions or presentations.",
      },
      {
        question: "Do I need to bring my own laptop?",
        answer:
          "It's recommended to bring your own laptop for most technical events. However, lab computers will be available if needed. Required software should be pre-installed.",
      },
      {
        question: "What are the judging criteria?",
        answer:
          "Judging criteria vary by event but generally include technical accuracy, innovation, presentation, and adherence to guidelines. Specific criteria are available on each event's page.",
      },
      {
        question: "Will internet access be provided?",
        answer:
          "WiFi access won't be provided, but all lab computers are equipped with internet access. Participants with laptops should ensure they enable mobile hotspot if they need internet connectivity.",
      },
    ],
  },
  {
    category: "Logistics & Accommodations",
    questions: [
      {
        question: "Is accommodation provided for outstation participants?",
        answer:
          "Accommodation is not provided in hostels, but we can arrange alternatives. Please contact the organizing team for assistance with accommodation arrangements.",
      },
      {
        question: "Will food be provided during the event?",
        answer:
          "Refreshments will be provided on March 21st, 2025 only. No food will be provided on other days of the event.",
      },
      {
        question: "How do I reach the venue?",
        answer:
          "Detailed directions to the venue, along with nearby transportation options, will be sent to registered participants. The venue is well-connected by public transport.",
      },
      {
        question: "What should I bring on the day of the event?",
        answer:
          "Bring your college ID, government photo ID, registration confirmation, laptop (if required for your event), and any specific materials mentioned in your event guidelines.",
      },
    ],
  },
  {
    category: "Prizes & Certificates",
    questions: [
      {
        question: "What are the prizes for winning teams?",
        answer:
          "Winners will receive certificates and cash prizes depending on the event. The prize amount varies based on the competition category.",
      },
      {
        question: "How will cash prizes be distributed for gaming events?",
        answer:
          "E-Certificates will be sent to the respective email address used for registration. The winning team will be contacted personally and will have the option of collecting the cash prize via bank transfer/UPI or offline on the day of the valedictory ceremony.",
      },
      {
        question: "Will all participants receive certificates?",
        answer:
          "Yes, all registered participants will receive participation certificates. Winners will receive special merit certificates and prizes.",
      },
      {
        question: "When will the results be announced?",
        answer:
          "Results for most events will be announced during the valedictory ceremony on March 22, 2025. Some events may have results announced earlier.",
      },
    ],
  },
];

const FAQ = () => {
  const [openCategory, setOpenCategory] = useState<string | null>(
    faqData[0].category
  );
  const [openQuestions, setOpenQuestions] = useState<Record<string, boolean>>(
    {}
  );

  const toggleCategory = (category: string) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  const toggleQuestion = (questionId: string) => {
    setOpenQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  return (
    <section id="faq" className="py-16 sm:py-24 px-4 scroll-mt-20">
      <div className="max-w-4xl mx-auto">
        <SectionTitle
          title="Frequently Asked Questions"
          subtitle="Find answers to common questions about Innothon 2025"
        />

        <div className="mt-12 space-y-6">
          {faqData.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: categoryIndex * 0.1 }}
              className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden"
            >
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.category)}
                className="w-full flex items-center justify-between p-4 sm:p-6 text-left hover:bg-white/5 transition-colors"
              >
                <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                  <span className="text-purple-400">
                    <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  </span>
                  {category.category}
                </h3>
                <span>
                  {openCategory === category.category ? (
                    <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  )}
                </span>
              </button>

              {/* Questions */}
              {openCategory === category.category && (
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-3 sm:space-y-4">
                  {category.questions.map((faq, faqIndex) => {
                    const questionId = `${category.category}-${faqIndex}`;
                    return (
                      <div
                        key={questionId}
                        className="border border-white/5 rounded-lg overflow-hidden"
                      >
                        <button
                          onClick={() => toggleQuestion(questionId)}
                          className="w-full flex items-center justify-between p-3 sm:p-4 text-left hover:bg-white/5 transition-colors"
                        >
                          <h4 className="text-sm sm:text-base font-medium">
                            {faq.question}
                          </h4>
                          <span>
                            {openQuestions[questionId] ? (
                              <ChevronUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                            )}
                          </span>
                        </button>

                        {openQuestions[questionId] && (
                          <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-0 sm:pt-0">
                            <p className="text-xs sm:text-sm text-gray-400">
                              {faq.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Still Have Questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="inline-block p-0.5 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
            <div className="bg-black rounded-md px-6 py-4">
              <h4 className="text-base sm:text-lg font-semibold mb-2">
                Still have questions?
              </h4>
              <p className="text-xs sm:text-sm text-gray-400 mb-4">
                Contact our support team for more information
              </p>
              <button
                onClick={() => scrollToSection("contact")}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium"
              >
                Contact Support
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
