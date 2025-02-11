import { Event } from "@/types/event";

export const events: Event[] = [
  {
    id: "hackquest",
    title: "HackQuest",
    shortDescription:
      "A cybersecurity CTF competition with cryptography, web exploitation, and more.",
    fullDescription:
      "Join our Capture The Flag competition where teams solve challenges in cryptography, web exploitation, reverse engineering, and forensics. Compete through two intense rounds to prove your cybersecurity skills!",
    image: "/events/hackquest.jpeg",
    date: "March 21, 2025",
    time: "10:45 AM - 2:15 PM",
    venue: "Computer Science Block, Lab 401",
    rules: [
      "Two rounds: 60-min Qualifier and 60-min Finals",
      "Top 5-6 teams qualify for finals",
      "Individual or team participation (max 3 members)",
      "Bring your own laptop",
      "Internet access provided",
    ],
    guidelines: [
      "Basic knowledge of cybersecurity concepts required",
      "Participants must bring valid college ID",
      "Pre-installed Kali Linux recommended",
      "No external help or resources during competition",
    ],
    prizes: {
      First: "₹3,000",
      Second: "₹2,000",
      Third: "₹1,000",
    },
    coordinators: [
      {
        name: "Beny Dishon K",
        role: "President",
        contact: "+91 98765 43210",
      },
      {
        name: "Monish",
        role: "Cybersecurity Lead",
        contact: "+91 98765 43211",
      },
    ],
    registrationFee: "₹500 per team",
    teamSize: "1-3 members",
    status: "upcoming",
  },
  {
    id: "ai-genesis",
    title: "AI Genesis",
    shortDescription:
      "Create innovative solutions using Generative AI tools and technologies.",
    fullDescription:
      "Dive into the world of Generative AI! Teams will use cutting-edge AI tools to develop creative solutions for real-world challenges. Present your AI-powered innovations and compete for the top spot.",
    image: "/events/ai-genesis.jpg",
    date: "March 21, 2025",
    time: "10:45 AM - 2:15 PM",
    venue: "Computer Science Block, Lab 402",
    rules: [
      "Two phases: 60-min Problem-Solving and 45-min Presentation",
      "Teams must use approved AI tools only",
      "Original solutions only - no pre-built projects",
      "Maximum 3 members per team",
      "All code and prompts must be documented",
    ],
    guidelines: [
      "Familiarity with GenAI tools required",
      "Bring valid college ID",
      "Pre-register your AI tool accounts",
      "Prepare presentation slides",
      "Internet access will be provided",
    ],
    prizes: {
      First: "₹3,000",
      Second: "₹2,000",
      Third: "₹1,000",
    },
    coordinators: [
      {
        name: "Alex Johnson",
        role: "AI Lead",
        contact: "+91 98765 43212",
      },
      {
        name: "Sarah Williams",
        role: "Event Manager",
        contact: "+91 98765 43213",
      },
    ],
    registrationFee: "₹500 per team",
    teamSize: "2-3 members",
    status: "upcoming",
  },
  {
    id: "code-arena",
    title: "CodeArena",
    shortDescription:
      "Battle it out in this intense competitive programming contest.",
    fullDescription:
      "Test your coding skills in this high-stakes programming competition. Solve challenging algorithmic problems, optimize your solutions, and race against time to climb the leaderboard!",
    image: "/events/code-arena.jpg",
    date: "March 21, 2025",
    time: "1:00 PM - 2:15 PM",
    venue: "Computer Science Block, Lab 403",
    rules: [
      "Single round of 75 minutes",
      "5-6 problems of increasing difficulty",
      "Any programming language allowed",
      "Individual participation only",
      "Live leaderboard updates",
    ],
    guidelines: [
      "Strong programming background required",
      "Bring your own laptop",
      "IDE setup beforehand",
      "Practice on platform beforehand",
      "No external help allowed",
    ],
    prizes: {
      First: "₹3,000",
      Second: "₹2,000",
      Third: "₹1,000",
    },
    coordinators: [
      {
        name: "Mike Chen",
        role: "Technical Head",
        contact: "+91 98765 43214",
      },
      {
        name: "Lisa Kumar",
        role: "Coordinator",
        contact: "+91 98765 43215",
      },
    ],
    registrationFee: "₹500 per team",
    teamSize: "Individual",
    status: "upcoming",
  },
  {
    id: "tech-queens",
    title: "Tech Queens",
    shortDescription:
      "Women-exclusive tech innovation presentation competition.",
    fullDescription:
      "A platform for women innovators to showcase their tech ideas and solutions. Present your innovative concepts, get feedback from industry experts, and inspire the next generation of women in tech!",
    image: "/events/tech-queens.jpg",
    date: "March 21, 2025",
    time: "1:00 PM - 2:15 PM",
    venue: "Seminar Hall",
    rules: [
      "5-7 minutes presentation time",
      "2-3 minutes Q&A with judges",
      "Women-only participation",
      "Original ideas only",
      "PowerPoint/PDF presentations allowed",
    ],
    guidelines: [
      "Prepare presentation beforehand",
      "Bring presentation in USB",
      "Business casual dress code",
      "Practice your pitch",
      "Be ready for technical questions",
    ],
    prizes: {
      First: "₹3,000",
      Second: "₹2,000",
      Third: "₹1,000",
    },
    coordinators: [
      {
        name: "Priya Sharma",
        role: "Event Head",
        contact: "+91 98765 43216",
      },
      {
        name: "Emma Wilson",
        role: "Coordinator",
        contact: "+91 98765 43217",
      },
    ],
    registrationFee: "₹500 per team",
    teamSize: "1-2 members",
    status: "upcoming",
  },
  {
    id: "gaming-event",
    title: "Gaming Event",
    shortDescription:
      "Compete in exciting gaming tournaments and showcase your gaming skills.",
    fullDescription:
      "Join us for an action-packed gaming tournament featuring popular competitive games. Show off your skills, compete against fellow gamers, and battle your way to victory in this high-energy gaming event.",
    image: "/events/gaming-event.jpg",
    date: "March 21, 2025",
    time: "10:45 AM - 2:15 PM",
    venue: "Computer Science Block, Lab 404",
    rules: [
      "Multiple gaming titles available",
      "Bring your own peripherals",
      "Fair play is mandatory",
      "Time limits will be strictly followed",
      "No external software/mods allowed",
    ],
    guidelines: [
      "Basic gaming experience required",
      "Standard peripherals provided",
      "Practice sessions available",
      "Team coordination essential",
      "Follow tournament format",
    ],
    prizes: {
      First: "₹3,000",
      Second: "₹2,000",
      Third: "₹1,000",
    },
    coordinators: [
      {
        name: "Alex Gaming",
        role: "Gaming Lead",
        contact: "+91 98765 43218",
      },
      {
        name: "Sarah Player",
        role: "Tournament Manager",
        contact: "+91 98765 43219",
      },
    ],
    registrationFee: "₹500 per team",
    teamSize: "2-4 members",
    status: "upcoming",
  },
];

export const getEventById = (id: string): Event | undefined => {
  return events.find((event) => event.id === id);
};
