import { Event } from "@/types/event";

export const events: Event[] = [
  {
    id: "hackquest-2025",
    title: "HackQuest 2025",
    shortDescription:
      "A cybersecurity CTF competition with cryptography, web exploitation, and more.",
    fullDescription:
      "Join our Capture The Flag competition where teams solve challenges in cryptography, web exploitation, reverse engineering, and forensics. Compete through two intense rounds to prove your cybersecurity skills!",
    image: "/events/hackquest.jpg",
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
      first: "₹15,000",
      second: "₹10,000",
      third: "₹5,000",
    },
    coordinators: [
      {
        name: "John Doe",
        role: "Technical Lead",
        contact: "+91 98765 43210",
      },
      {
        name: "Jane Smith",
        role: "Event Coordinator",
        contact: "+91 98765 43211",
      },
    ],
    registrationFee: "₹300 per team",
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
      first: "₹12,000",
      second: "₹8,000",
      third: "₹4,000",
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
    registrationFee: "₹250 per team",
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
      first: "₹10,000",
      second: "₹7,000",
      third: "₹3,000",
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
    registrationFee: "₹200",
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
      first: "₹10,000",
      second: "₹7,000",
      third: "₹3,000",
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
    registrationFee: "₹150",
    teamSize: "1-2 members",
    status: "upcoming",
  },
  {
    id: "blockchain-battle",
    title: "Blockchain Battle",
    shortDescription:
      "Create and deploy innovative blockchain solutions in this hackathon.",
    fullDescription:
      "Dive into the world of Web3 with this intensive blockchain development challenge. Build decentralized applications, smart contracts, and innovative blockchain solutions to tackle real-world problems.",
    image: "/events/blockchain-battle.jpg",
    date: "March 21, 2025",
    time: "10:45 AM - 2:15 PM",
    venue: "Computer Science Block, Lab 404",
    rules: [
      "Build on Ethereum/Polygon/Solana",
      "Smart contract deployment required",
      "Original solutions only",
      "Live demo required",
      "Code must be open-source",
    ],
    guidelines: [
      "Knowledge of Solidity/Rust required",
      "Bring development environment setup",
      "Web3 wallet required",
      "Test networks will be used",
      "Documentation is mandatory",
    ],
    prizes: {
      first: "₹20,000",
      second: "₹15,000",
      third: "₹10,000",
    },
    coordinators: [
      {
        name: "Vitalik Smith",
        role: "Blockchain Lead",
        contact: "+91 98765 43218",
      },
      {
        name: "Ada Nakamoto",
        role: "Technical Advisor",
        contact: "+91 98765 43219",
      },
    ],
    registrationFee: "₹400 per team",
    teamSize: "2-4 members",
    status: "upcoming",
  },
];

export const getEventById = (id: string): Event | undefined => {
  return events.find((event) => event.id === id);
};
