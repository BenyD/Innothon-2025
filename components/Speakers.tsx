"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { SectionTitle } from "@/components/ui/section-title";
import { IoLogoLinkedin } from "react-icons/io5";
import Link from "next/link";

// Updated speakers data with 2 keynote speakers and 3 judges
const speakers = [
  {
    name: "Blessing Selvaraj",
    role: "Senior Manager & System Architect",
    company: "Iron Mountain, Chennai",
    image: "/speakers/blessing.jpeg",
    linkedin: "https://www.linkedin.com/in/blessingh-selvaraj-265b72119/",
    type: "keynote",
  },
  {
    name: "Dr. Shilfa Nigar",
    role: "Dentist",
    company: "Apollo Dental Hospital",
    image: "/speakers/shilfa.jpeg",
    linkedin: "https://www.linkedin.com/in/dr-shilfa-nigar-0144191a9/",
    type: "keynote",
  },
  {
    name: "Rahul Narayanan",
    role: "Principal Data Scientist, AI & Advanced Analytics",
    company: "Fidelity Investments",
    image: "/speakers/rahul.jpeg",
    linkedin: "https://www.linkedin.com/in/rahul-narayanan19/",
    type: "judge",
  },
  {
    name: "Ashish (Thomas) Cherian",
    role: "Software Engineer",
    company: "Saama",
    image: "/speakers/ashish.jpeg",
    linkedin: "https://www.linkedin.com/in/reach2ashish/",
    type: "judge",
  },
  {
    name: "Aswini Priyanka Rajendran Nadar",
    role: "Founder & CEO",
    company: "ASSR Emphorium",
    image: "/speakers/aswini.jpeg",
    linkedin:
      "https://www.linkedin.com/in/%F0%9F%91%B8-aswini-priyanka-rajendran-nadar-3aab13b0/",
    type: "judge",
  },
];

const Speakers = () => {
  // Filter speakers and judges
  const keynoteSpeakers = speakers.filter(
    (person) => person.type === "keynote"
  );
  const judges = speakers.filter((person) => person.type === "judge");

  return (
    <section id="speakers" className="py-12 sm:py-20 px-4 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          title="Speakers & Judges"
          subtitle="Meet the industry experts and professionals at Innothon 2025"
        />

        {/* Keynote Speakers */}
        <div className="mt-10 sm:mt-12">
          <h3 className="text-center text-xl sm:text-2xl font-semibold mb-6 sm:mb-8">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Keynote Speakers
            </span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
            {keynoteSpeakers.map((speaker, index) => (
              <motion.div
                key={speaker.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-purple-500/30 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="relative w-full sm:w-[240px] h-[280px] sm:h-[280px] flex-shrink-0">
                    <Image
                      src={speaker.image}
                      alt={speaker.name}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-5 sm:p-6 flex flex-col justify-between flex-grow">
                    <div>
                      <h4 className="text-lg sm:text-xl font-semibold text-white">
                        {speaker.name}
                      </h4>
                      <p className="text-sm text-purple-400 mt-1">
                        {speaker.role}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {speaker.company}
                      </p>
                    </div>
                    <div className="mt-4">
                      {speaker.linkedin && (
                        <Link
                          href={speaker.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group text-sm"
                        >
                          <IoLogoLinkedin className="w-4 h-4 text-blue-400" />
                          <span className="text-gray-300 group-hover:text-white transition-colors">
                            LinkedIn Profile
                          </span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Judges */}
        <div className="mt-16 sm:mt-20">
          <h3 className="text-center text-xl sm:text-2xl font-semibold mb-6 sm:mb-8">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Event Jury
            </span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {judges.map((judge, index) => (
              <motion.div
                key={judge.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-purple-500/30 transition-all duration-300 flex flex-col h-full"
              >
                <div className="relative w-full aspect-square">
                  <Image
                    src={judge.image}
                    alt={judge.name}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  />
                </div>
                <div className="p-5 flex flex-col justify-between flex-grow">
                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-white">
                      {judge.name}
                    </h4>
                    <p className="text-sm text-purple-400 mt-1 line-clamp-1">
                      {judge.role}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {judge.company}
                    </p>
                  </div>
                  <div className="mt-4">
                    {judge.linkedin && (
                      <Link
                        href={judge.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group text-sm"
                      >
                        <IoLogoLinkedin className="w-4 h-4 text-blue-400" />
                        <span className="text-gray-300 group-hover:text-white transition-colors">
                          LinkedIn
                        </span>
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Speakers;
