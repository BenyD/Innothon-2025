import { Event } from "@/types/event";

export const events: Event[] = [
  {
    id: "hackquest",
    title: "HackQuest",
    shortDescription: "A Capture the Flag (CTF) competition using TryHackMe",
    fullDescription: "Cyber Quest is a Capture the Flag (CTF) competition that tests cybersecurity skills using TryHackMe. Participants solve security challenges to find hidden 'flags' and earn points. Round 1 covers basic cybersecurity topics, while Round 2 includes complex challenges such as exploit development and forensic analysis.",
    image: "/events/hackquest.jpg",
    date: "March 21, 2025",
    time: "10:45 AM - 2:15 PM",
    venue: "Computer Science Block, Lab 401",
    rules: [
      "Team Composition: Up to three members per team",
      "Platform: All challenges hosted on TryHackMe",
      "Fair Play: No unauthorized collaboration or attacks",
      "Flag Submission: Must use correct format (THM{flag_here})",
      "Time Limit: No late submissions accepted",
      "Professional dress code mandatory",
      "Must attend opening ceremony at 9:00 AM",
    ],
    guidelines: [
      "Use approved tools: Wireshark, Burp Suite, Nmap",
      "Prioritize higher point challenges",
      "Practice on TryHackMe beforehand",
      "Bring your own laptop (recommended)",
      "TryHackMe account required",
      "Internet access provided",
      "Bring college ID and government photo ID proof",
      "Lunch and refreshments provided",
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
    shortDescription: "AI Ad Slogan Challenge - Create compelling ad campaigns using AI",
    fullDescription: "The AI Ad Slogan Challenge is a two-phase competition where participants use AI tools to create catchy ad slogans and develop full advertising campaigns. Participants will generate creative content and develop complete marketing campaigns using various AI tools.",
    image: "/events/ai-genesis.jpg",
    date: "March 21, 2025",
    time: "9:30 AM - 12:30 PM",
    venue: "Computer Science Block, Lab 402",
    eventStructure: [
      {
        phase: "Phase 1: Slogan & Visual Sprint",
        description: "Generate a creative slogan and visual for a randomly assigned product using AI tools",
        duration: "60 minutes"
      },
      {
        phase: "Phase 2: Full Ad Campaign",
        description: "Expand the slogan into a complete ad campaign with AI-generated content",
        duration: "60 minutes"
      }
    ],
    rules: [
      "Must use AI tools for all content creation",
      "Random product/service assignment",
      "Strict time limits for each phase",
      "Original work only - no pre-made assets",
      "Team size: 1-3 members",
      "Judges' decisions are final",
      "Professional dress code mandatory",
      "Must attend opening ceremony at 9:00 AM"
    ],
    guidelines: [
      "Be creative with slogans and campaigns",
      "Ensure coherence between elements",
      "Use AI tools effectively",
      "Focus on quality and polish",
      "Drive audience engagement",
      "Bring your own laptop (recommended)",
      "Internet access provided",
      "Lunch and refreshments provided"
    ],
    judgingCriteria: [
      {
        criterion: "Creativity",
        weightage: "30%",
        description: "Unique and original slogans and campaigns score higher"
      },
      {
        criterion: "Relevance",
        weightage: "20%",
        description: "The slogan and campaign should fit the assigned product/service well"
      },
      {
        criterion: "Technical Execution",
        weightage: "20%",
        description: "High-quality visuals, ad copy, and multimedia elements"
      },
      {
        criterion: "Persuasive Appeal",
        weightage: "20%",
        description: "Campaign effectiveness in engaging and convincing the audience"
      },
      {
        criterion: "Innovative Use of AI",
        weightage: "10%",
        description: "Smart and seamless AI integration"
      }
    ],
    setupRequirements: [
      {
        category: "AI Writing & Copy Generation",
        requirements: [
          "ChatGPT",
          "Jasper AI",
          "Copy.ai",
          "Writesonic",
          "Rytr"
        ]
      },
      {
        category: "AI Image Generation",
        requirements: [
          "DALL·E",
          "MidJourney",
          "Stable Diffusion",
          "Canva AI",
          "Leonardo.Ai"
        ]
      },
      {
        category: "AI Video & Multimedia",
        requirements: [
          "Runway ML",
          "Synthesia",
          "Pictory",
          "InVideo AI",
          "DeepBrain AI"
        ]
      },
      {
        category: "AI Voice Generation",
        requirements: [
          "ElevenLabs",
          "Murf AI",
          "Play.ht",
          "Lovo.ai",
          "Resemble AI"
        ]
      }
    ],
    prizes: {
      First: "₹3,000",
      Second: "₹2,000",
      Third: "₹1,000"
    },
    coordinators: [
      {
        name: "Alex Johnson",
        role: "AI Lead",
        contact: "+91 98765 43212"
      },
      {
        name: "Sarah Williams",
        role: "Event Manager",
        contact: "+91 98765 43213"
      }
    ],
    registrationFee: "₹500 per team",
    teamSize: "1-3 members",
    status: "upcoming"
  },
  {
    id: "code-arena",
    title: "CodeArena",
    shortDescription: "Two-round coding competition focusing on error identification and debugging",
    fullDescription: "A competitive programming contest with two rounds: Round 1 features a 50-question error identification quiz, while Round 2 presents 13 debugging challenges across different difficulty levels, including a bonus question.",
    image: "/events/code-arena.jpg",
    date: "March 21, 2025",
    time: "1:00 PM - 2:15 PM",
    venue: "Data Science Lab",
    rules: [
      "Team size: 1-3 members",
      "No external help or AI tools",
      "Fixed time duration per round",
      "Late submissions not accepted",
      "Points based on accuracy and difficulty",
      "Disqualification for rule violations",
      "Professional dress code mandatory",
      "Must attend opening ceremony at 9:00 AM",
    ],
    guidelines: [
      "Focus on accuracy and completion",
      "Manage time effectively",
      "No internet searches allowed",
      "Bring your own laptop (recommended)",
      "Coding environment provided",
      "Internet access for submissions only",
      "Bring college ID and government photo ID proof",
      "Lunch and refreshments provided",
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
    teamSize: "1-3 members",
    status: "upcoming",
  },
  {
    id: "digital-divas",
    title: "Digital Divas",
    shortDescription: "Women-exclusive tech poster design competition",
    fullDescription: "An exclusive competition for women to create technology-related posters on given topics. Participants can use any graphic design software on personal laptops, while lab computers provide access to Canva. Includes research documentation requirement.",
    image: "/events/digital-divas.jpg",
    date: "March 21, 2025",
    time: "1:00 PM - 2:15 PM",
    venue: "Lecture Hall",
    rules: [
      "Women-only participation",
      "No AI-generated posters or templates",
      "Source documentation required",
      "No extra time provided",
      "No plagiarism allowed",
      "Professional dress code mandatory",
      "Must attend opening ceremony at 9:00 AM",
    ],
    guidelines: [
      "Create visually appealing designs",
      "Include infographics and statistics",
      "Ensure original content",
      "Document all sources",
      "Bring your own laptop (recommended)",
      "Canva available on lab computers",
      "Bring college ID and government photo ID proof",
      "Lunch and refreshments provided",
    ],
    prizes: {
      First: "₹3,000",
      Second: "₹2,000",
      Third: "₹1,000",
    },
    coordinators: [
      {
        name: "Sarah Design",
        role: "Creative Lead",
        contact: "+91 98765 43216",
      },
      {
        name: "Lisa Art",
        role: "Event Coordinator",
        contact: "+91 98765 43217",
      },
    ],
    registrationFee: "₹500 per participant",
    teamSize: "Individual",
    status: "upcoming",
  },
  {
    id: "idea-fusion",
    title: "IdeaFusion",
    shortDescription: "Innovative solution presentation competition",
    fullDescription: "IdeaFusion challenges participants to develop and present innovative solutions to real-world problems. Problem statements are released 10 days before the event, allowing teams to research, strategize, and create compelling presentations.",
    image: "/events/idea-fusion.jpg",
    date: "March 21, 2025",
    time: "1:00 PM - 2:15 PM",
    venue: "Seminar Hall",
    rules: [
      "Team size: 1-3 members",
      "Original ideas only",
      "Pre-event submission required",
      "5-minute presentation limit",
      "2-minute Q&A session",
      "Laptops mandatory",
      "Professional dress code mandatory",
      "Must attend opening ceremony at 9:00 AM",
    ],
    guidelines: [
      "Follow presentation structure",
      "Include required elements",
      "Prepare for Q&A",
      "Optional prototype for bonus points",
      "Bring your own laptop",
      "Internet access provided",
      "Bring college ID and government photo ID proof",
      "Lunch and refreshments provided",
    ],
    prizes: {
      First: "₹3,000",
      Second: "₹2,000",
      Third: "₹1,000",
    },
    coordinators: [
      {
        name: "Innovation Lead",
        role: "Technical Head",
        contact: "+91 98765 43220",
      },
      {
        name: "Idea Manager",
        role: "Event Coordinator",
        contact: "+91 98765 43221",
      },
    ],
    registrationFee: "₹500 per team",
    teamSize: "1-3 members",
    status: "upcoming",
  },
  {
    id: "pixel-showdown",
    title: "Pixel Showdown",
    shortDescription: "Online multiplayer gaming tournament with finals",
    fullDescription:
      "A fully online multiplayer gaming competition testing participants' strategy, reflexes, and teamwork. Players compete in an elimination-style tournament with matches taking place remotely. The event concludes one week before Innothon 2025, with winners announced during the Valedictory Ceremony.",
    image: "/events/pixel-showdown.jpg",
    date: "March 14-21, 2025",
    time: "Online Qualifiers + Finals",
    venue: "Online + Discord",
    rules: [
      "Elimination/bracket tournament format",
      "Teams must use official Discord server",
      "Fair play and sportsmanship mandatory",
      "No cheating or external software allowed",
      "Matches will be monitored by moderators",
      "Team size: 2-4 members (game dependent)",
      "Winners must attend Valedictory for prizes",
      "Professional dress code mandatory for prize ceremony",
    ],
    guidelines: [
      "Stable internet connection required",
      "Discord account mandatory",
      "Game-specific requirements will be shared",
      "Practice sessions available",
      "Technical support provided on Discord",
      "Stream delay rules must be followed",
      "Bring college ID and government photo ID proof for prize collection",
      "Formal/Smart casual attire required for Valedictory",
    ],
    prizes: {
      First: "₹3,000",
      Second: "₹2,000",
      Third: "₹1,000",
    },
    coordinators: [
      {
        name: "Gaming Lead",
        role: "Tournament Head",
        contact: "+91 98765 43218",
      },
      {
        name: "Discord Manager",
        role: "Technical Support",
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
