import { Event } from "@/types/event";

export const events: Event[] = [
  {
    id: "hackquest",
    title: "HackQuest",
    shortDescription: "A Capture the Flag (CTF) competition using TryHackMe",
    fullDescription:
      'HackQuest is a Capture the Flag (CTF) competition that tests cybersecurity skills using TryHackMe platform. Participants solve security challenges to find hidden "flags" and earn points.',
    image: "/events/hackquest.jpg",
    date: "March 21, 2025",
    time: "2:00 PM - 4:00 PM",
    venue: "Coder's Hub, Main Block, 2nd Floor",
    eventStructure: [
      {
        phase: "Round 1 (Beginner-Intermediate)",
        description:
          "Covers basic cybersecurity topics such as cryptography, web security, networking, and reconnaissance. Top teams advance to Round 2.",
        duration: "1 hour",
      },
      {
        phase: "Round 2 (Advanced)",
        description:
          "Includes advanced challenges such as exploit development, privilege escalation, reverse engineering, and forensic analysis. The highest-scoring team wins.",
        duration: "1 hour",
      },
    ],
    rules: [
      "Team size: 1-3 members",
      "All challenges will be hosted on the TryHackMe platform",
      "No unauthorised collaboration, brute-force attacks, or DDoS attempts on TryHackMe",
      "Flags must be submitted in the correct format (e.g., THM{flag_here})",
      "Flags must be submitted before the round ends. Late submissions will not be accepted",
    ],
    guidelines: [
      "Bring your own laptop recommended, lab PCs available if needed",
      "Basic knowledge of networking, cybersecurity, and ethical hacking required",
      "VPN or AttackBox usage allowed for specific TryHackMe rooms",
      "Cybersecurity tools like Wireshark, Burp Suite, and Nmap allowed",
      "Practice on TryHackMe before the event recommended",
      "Prioritize solving challenges with higher point values",
      "Bring college ID",
      "Refreshments provided",
    ],
    judgingCriteria: [
      {
        criterion: "Accuracy",
        weightage: "40%",
        description: "Points will be awarded for correct flag submissions",
      },
      {
        criterion: "Completion",
        weightage: "40%",
        description: "Teams should aim to solve as many challenges as possible",
      },
      {
        criterion: "Rule Adherence",
        weightage: "20%",
        description: "Teams that violate any rules will be disqualified",
      },
    ],
    prizes: {
      Main: {
        First: "₹3,000",
        Second: "₹2,000",
        Third: "₹1,000",
      },
    },
    coordinators: [
      {
        name: "Chandaluri Monish N S S Gupta",
        role: "Cybersecurity Lead",
        contact: "+91 824 807 7123",
      },
      {
        name: "V Vishal",
        role: "Event Coordinator",
        contact: "+91 93841 59875",
      },
      {
        name: "Anna Elizabeth Pravin",
        role: "Asst. Event Coordinator",
        contact: "+91 63824 96273",
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
      "AI Ad Slogan Challenge - Create compelling ad campaigns using AI",
    fullDescription:
      "AI Genesis is an AI Ad Slogan Challenge. It is a two-phase competition where participants use AI tools to create catchy ad slogans and develop full advertising campaigns. The event encourages creativity, strategic thinking, and the innovative use of AI in marketing.",
    image: "/events/ai-genesis.jpg",
    date: "March 21, 2025",
    time: "11:00 AM - 1:00 PM",
    venue: "Data Science Lab, 2nd Floor, Computer Science Extension Block",
    eventStructure: [
      {
        phase: "Round 1: Slogan & Visual Sprint",
        description:
          "Generate a creative slogan for a randomly assigned product or service using AI tools. Create an AI-generated visual (logo, banner, or ad) to match the slogan. Entries are judged on creativity, relevance, impact, and visual appeal.",
        duration: "60 minutes",
      },
      {
        phase: "Round 2: Full Ad Campaign",
        description:
          "Expand the slogan into a complete ad campaign with AI-generated visuals, ad copy, and social media content. Optional: Use AI for voiceovers, video ads, or interactive elements for bonus points. Judging considers creativity, execution quality, and marketing impact.",
        duration: "60 minutes",
      },
    ],
    rules: [
      "Team size: 1-3 members",
      "Must use AI tools for slogans, visuals, and campaign creation",
      "Random product/service will be assigned for content creation",
      "Time limits must be followed; late submissions not accepted",
      "All work must be original; no pre-made assets",
      "Participants can compete solo or in teams",
      "Judges' decisions are final",
    ],
    setupRequirements: [
      {
        category: "AI Writing & Copy Generation",
        requirements: ["ChatGPT", "Jasper AI", "Copy.ai", "Writesonic", "Rytr"],
      },
      {
        category: "AI Image Generation",
        requirements: [
          "DALL·E",
          "MidJourney",
          "Stable Diffusion",
          "Canva AI",
          "Leonardo.Ai",
        ],
      },
      {
        category: "AI Video & Multimedia",
        requirements: [
          "Runway ML",
          "Synthesia",
          "Pictory",
          "InVideo AI",
          "DeepBrain AI",
        ],
      },
      {
        category: "AI Voice Generation",
        requirements: [
          "ElevenLabs",
          "Murf AI",
          "Play.ht",
          "Lovo.ai",
          "Resemble AI",
        ],
      },
      {
        category: "AI Social Media & Branding",
        requirements: [
          "Brandmark.io",
          "Looka",
          "LogoAI",
          "Hootsuite AI",
          "Lately AI",
        ],
      },
      {
        category: "AI Ad Performance Optimization",
        requirements: [
          "Adzooma",
          "Persado",
          "Phrasee",
          "Albert AI",
          "Pattern89",
        ],
      },
    ],
    guidelines: [
      "Think outside the box for unique slogans and campaigns",
      "Slogan and visuals should align well with the product",
      "Maximize AI tools for text, design, and multimedia",
      "Make sure visuals and copy are polished and professional",
      "Campaign should be persuasive and impactful",
      "Bring college ID",
      "Refreshments provided",
    ],
    judgingCriteria: [
      {
        criterion: "Creativity",
        weightage: "30%",
        description: "Unique and original slogans and campaigns score higher",
      },
      {
        criterion: "Relevance",
        weightage: "20%",
        description:
          "The slogan and campaign should fit the assigned product/service well",
      },
      {
        criterion: "Technical Execution",
        weightage: "20%",
        description:
          "High-quality visuals, ad copy, and multimedia elements are key",
      },
      {
        criterion: "Persuasive Appeal",
        weightage: "20%",
        description:
          "The campaign should effectively engage and convince the audience",
      },
      {
        criterion: "Innovative Use of AI",
        weightage: "10%",
        description: "Smart and seamless AI integration earns bonus points",
      },
    ],
    prizes: {
      Main: {
        First: "₹3,000",
        Second: "₹2,000",
        Third: "₹1,000",
      },
    },
    coordinators: [
      {
        name: "Shubham Choudhary",
        role: "AI Lead",
        contact: "+91 6289 578 020",
      },
      {
        name: "V Vishal",
        role: "Event Coordinator",
        contact: "+91 93841 59875",
      },
      {
        name: "Anna Elizabeth Pravin",
        role: "Asst. Event Coordinator",
        contact: "+91 63824 96273",
      },
    ],
    registrationFee: "₹500 per team",
    teamSize: "1-3 members",
    status: "upcoming",
  },
  {
    id: "code-arena",
    title: "CodeArena",
    shortDescription:
      "Two-round coding competition focusing on error identification and debugging",
    fullDescription:
      "CodeArena is a competitive programming contest where teams solve coding challenges under time constraints. Participants will face multiple rounds designed to test their debugging, problem-solving, and analytical skills. The contest encourages logical thinking, efficiency, and accuracy in coding under pressure.",
    image: "/events/code-arena.jpg",
    date: "March 21, 2025",
    time: "2:00 PM - 4:00 PM",
    venue: "Data Science Lab, 2nd Floor, Computer Science Extension Block",
    eventStructure: [
      {
        phase: "Round 1: Error Identification Quiz",
        description:
          "Participants will analyse code snippets to identify syntax, logical, and conceptual errors. Total: 50 questions (1 point each). Categories: Syntax Errors (20), Logical Errors (15), Conceptual Mistakes (10), Edge Case Errors (5).",
        duration: "1 hour",
      },
      {
        phase: "Round 2: Debugging Challenge",
        description:
          "Teams will debug code snippets of varying difficulty levels. Total: 13 questions + 1 bonus (60 + 20 points). Easy: 5 questions (2 points each), Medium: 5 questions (4 points each), Hard: 3 questions (10 points each), Bonus: 1 question (20 points).",
        duration: "1 hour",
      },
    ],
    rules: [
      "Team size: 1-3 members",
      "Multiple-choice and hands-on debugging challenges",
      "No external help, internet searches, or AI-assisted debugging tools",
      "Fixed time duration for each round",
      "Points based on accuracy and difficulty level",
      "Disqualification for copying or sharing solutions",
    ],
    guidelines: [
      "Lab PCs provided, personal laptops not required",
      "Strict time limit for each round",
      "Languages: Python, C, and Java",
      "No misconduct or AI tools allowed",
      "Bring college ID",
      "Refreshments provided",
    ],
    judgingCriteria: [
      {
        criterion: "Accuracy",
        weightage: "40%",
        description:
          "Correctly identified errors and fixed code receive full points",
      },
      {
        criterion: "Completion",
        weightage: "30%",
        description: "Teams should aim to solve as many challenges as possible",
      },
      {
        criterion: "Time Management",
        weightage: "20%",
        description:
          "Faster submissions may be considered in case of tie-breakers",
      },
      {
        criterion: "Rule Adherence",
        weightage: "10%",
        description: "Any violations will result in disqualification",
      },
    ],
    prizes: {
      Main: {
        First: "₹3,000",
        Second: "₹2,000",
        Third: "₹1,000",
      },
    },
    coordinators: [
      {
        name: "Gokulakrishnan",
        role: "Coding & Development Lead",
        contact: "+91 7418 232 796",
      },
      {
        name: "V Vishal",
        role: "Event Coordinator",
        contact: "+91 93841 59875",
      },
      {
        name: "Anna Elizabeth Pravin",
        role: "Asst. Event Coordinator",
        contact: "+91 63824 96273",
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
    fullDescription:
      "Digital Divas is an exclusive competition for women, where participants create technology-related posters on women empowerment. Participants can use any graphic design software on their personal laptops, while those using lab computers will have access only to Canva. The competition encourages creativity, research, and design skills, with a focus on tech-related themes. Participants must also submit a Word document containing sources for the content and images used to evaluate their research efforts. The best-designed poster, as judged by an expert panel, will be awarded.",
    image: "/events/digital-divas.jpg",
    date: "March 21, 2025",
    time: "11:00 AM - 1:00 PM",
    venue: "Coder's Hub, Main Block, 2nd Floor",
    eventStructure: [
      {
        phase: "Topic Announcement",
        description:
          "The topic will be revealed at the beginning of the competition.",
      },
      {
        phase: "Design Phase",
        description:
          "Participants have 1 hour to design their posters. Those using lab computers can only use Canva, while personal laptops may use other design tools like Photoshop, Illustrator, or Figma.",
        duration: "1 hour",
      },
      {
        phase: "Evaluation",
        description:
          "Posters will be judged on creativity, clarity, and relevance to the topic. Additional marks will be awarded for infographics, statistics, and figures.",
      },
    ],
    rules: [
      "Team size: 1-2 members",
      "No AI-generated posters or pre-made templates allowed",
      "AI-generated images and vectors, as well as no-copyright images, may be used",
      "Must submit a Word document listing sources for content and images",
      "No extra time will be provided",
      "Plagiarism or direct copying from internet will lead to disqualification",
    ],
    guidelines: [
      "Posters should be visually appealing, clear, and relevant to topic",
      "Creative use of infographics, statistics, and figures will receive bonus points",
      "Ensure designs are original and free from copyright infringement",
      "Judges will assess posters based on design quality, message clarity, and research depth",
      "Bring college ID",
      "Refreshments provided",
    ],
    judgingCriteria: [
      {
        criterion: "Creativity",
        weightage: "30%",
        description: "Innovative and visually appealing design",
      },
      {
        criterion: "Clarity",
        weightage: "25%",
        description: "How well the message is conveyed through the poster",
      },
      {
        criterion: "Relevance",
        weightage: "20%",
        description: "How effectively the poster aligns with the given topic",
      },
      {
        criterion: "Technical Depth",
        weightage: "15%",
        description: "Use of statistics, figures, and infographics",
      },
      {
        criterion: "Research Effort",
        weightage: "10%",
        description: "Properly documented sources in the Word document",
      },
    ],
    prizes: {
      Main: {
        First: "₹3,000",
        Second: "₹2,000",
        Third: "₹1,000",
      },
    },
    coordinators: [
      {
        name: "Samyuktha S",
        role: "Design & UI/UX Lead",
        contact: "+91 72000 97390",
      },
      {
        name: "V Vishal",
        role: "Event Coordinator",
        contact: "+91 93841 59875",
      },
      {
        name: "Anna Elizabeth Pravin",
        role: "Asst. Event Coordinator",
        contact: "+91 63824 96273",
      },
    ],
    registrationFee: "₹200 per participant",
    teamSize: "1-2 members",
    status: "upcoming",
  },
  {
    id: "idea-fusion",
    title: "IdeaFusion",
    shortDescription: "Innovative solution presentation competition",
    fullDescription:
      "IdeaFusion challenges participants to develop and present innovative solutions to real-world problems. Problem statements will be released 10 days before the event, allowing teams to research, strategize, and create compelling presentations. This competition encourages critical thinking, creativity, and effective communication.",
    image: "/events/idea-fusion.jpg",
    date: "March 21, 2025",
    time: "11:00 AM - 4:00 PM",
    venue: "Andromeda Hall, Ground Floor, Jubilee Block",
    eventStructure: [
      {
        phase: "Problem Statement Release",
        description:
          "Participants will receive the problem statements 10 days before the event and must select one to work on.",
      },
      {
        phase: "Presentation Preparation",
        description:
          "Each team must create a PowerPoint presentation (PPT) – MANDATORY and can use additional visual aids.",
      },
      {
        phase: "Presentation Day",
        description:
          "Each team presents their idea within a 5-minute time limit. A buzzer will sound at the 4-minute mark to indicate one minute remaining, and a final buzzer will ring at 5 minutes. A 2-minute Q&A session will follow each presentation.",
      },
      {
        phase: "Winner Selection",
        description:
          "Based on the judging criteria, the best presentations will be awarded.",
      },
    ],
    rules: [
      "Team size: 1-3 members",
      "Ideas must be original; plagiarism will result in disqualification",
      "Presentations must be submitted one day before the event",
      "Participants must bring their own laptops for presentations",
      "Participants must adhere to the time limit of 5 minutes",
    ],
    guidelines: [
      "Title Slide: Team name, member names, and selected problem statement",
      "Problem Analysis: Understanding and significance of the problem",
      "Existing Solutions: Overview of existing solutions or approaches",
      "Proposed Solution: Innovative and feasible approach",
      "Implementation Plan: Steps to bring the idea to reality",
      "Expected Impact: How the solution benefits society or industry",
      "Include Product/Service Overview, Feasibility & Market Analysis",
      "Prototype (Optional) for bonus points",
      "Prepare for Q&A session",
      "Bring college ID",
      "Refreshments provided",
    ],
    judgingCriteria: [
      {
        criterion: "Innovation & Creativity",
        weightage: "30%",
        description: "Originality and uniqueness of the idea",
      },
      {
        criterion: "Feasibility",
        weightage: "25%",
        description: "Practicality and realistic implementation",
      },
      {
        criterion: "Presentation & Communication",
        weightage: "20%",
        description: "Clarity, structure, and impact of the presentation",
      },
      {
        criterion: "Problem Understanding",
        weightage: "15%",
        description: "Depth of analysis and relevance of the solution",
      },
      {
        criterion: "Impact & Scalability",
        weightage: "10%",
        description: "Potential benefits and long-term scalability",
      },
    ],
    prizes: {
      Main: {
        First: "₹3,000",
        Second: "₹2,000",
        Third: "₹1,000",
      },
    },
    coordinators: [
      {
        name: "Pavan Sai H V",
        role: "Data Science & Analytics Lead",
        contact: "+91 96770 73103",
      },
      {
        name: "V Vishal",
        role: "Event Coordinator",
        contact: "+91 93841 59875",
      },
      {
        name: "Anna Elizabeth Pravin",
        role: "Asst. Event Coordinator",
        contact: "+91 63824 96273",
      },
    ],
    registrationFee: "₹500 per team",
    teamSize: "1-3 members",
    status: "upcoming",
  },
  {
    id: "pixel-showdown",
    title: "Pixel Showdown",
    shortDescription:
      "Multi-game tournament featuring Free Fire, BGMI, and PES",
    fullDescription: `Join us for an action-packed gaming tournament featuring three competitive esports titles:

• Free Fire (Squad Tournament)
  - Online Qualifiers (Battle Royale - Bermuda)
  - Top 15-20 teams advance to Offline Finals
  - Offline Finals: Clash Squad with Knockout Format
  - Open to all college students
  - Prize pool: First ₹3,000, Second ₹1,500

• BGMI (Squad Tournament)
  - 12 intense matches over 3 days
  - Point-based scoring system
  - Prize pool: First ₹3,000, Second ₹1,000

• PES eFootball (Solo)
  - League stage followed by knockouts
  - Competitive matches with standard rules
  - Prize pool: First ₹1,000, Second ₹500`,

    rules: [
      // General Gaming Rules
      "Valid game accounts required for all titles",
      "No cheating, hacks, or external tools allowed",
      "Stable internet connection mandatory",
      "Prompt attendance for all matches",
      "Team composition cannot be changed mid-tournament",
      "Decisions of admins are final",
      "Violations result in immediate disqualification",

      // Free Fire Specific Rules
      "No VPN usage allowed",
      "PC players not allowed",
      "Single player cannot participate in multiple teams",
      "Teams must use only registered players",
      "Custom lobbies hosted by tournament officials only",
      "Must join custom room within 5 minutes of receiving ID/password",
      "Late teams face disqualification",
      "No refunds provided",
    ],

    guidelines: [
      // Technical Guidelines
      "Test your game and setup before tournament day",
      "Keep your game client updated",
      "Ensure stable internet connection (minimum 10 Mbps)",
      "Use ethernet connection when possible",

      // Tournament Guidelines
      "Join the official Discord server for updates",
      "Check tournament brackets 24 hours before start",
      "Report issues to admins immediately",
      "Save and submit match screenshots as proof",
      "Follow standard competitive settings",
      "Maintain professional conduct throughout",

      // Participation Guidelines
      "Keep college ID ready for verification",
      "Winners must be present for prize distribution",
      "Follow all game-specific tournament rules",
    ],
    prizes: {
      "Free Fire Squad": { First: "₹3,000", Second: "₹1,500" },
      "BGMI Squad": { First: "₹3,000", Second: "₹1,000" },
      "PES Solo": { First: "₹1,000", Second: "₹500" },
    },
    coordinators: [
      {
        name: "NV Yogeshwaran",
        role: "Gaming Head",
        contact: "+91 72001 37507",
      },
      {
        name: "V Vishal",
        role: "Event Coordinator",
        contact: "+91 93841 59875",
      },
      {
        name: "Anna Elizabeth Pravin",
        role: "Asst. Event Coordinator",
        contact: "+91 63824 96273",
      },
    ],
    registrationFee: "Varies by game and team size",
    teamSize: "1-4 members (game dependent)",
    status: "upcoming",
    image: "/events/pixel-showdown.jpg",
    date: "March 21, 2025",
    time: "11:00 AM - 4:00 PM",
    venue: "Room-PX003, Ground Floor, Computer Science Extension Block",
    gameDetails: [
      {
        game: "Free Fire",
        registrationFee: "₹200 per team",
        teamSize: "4 members",
        format: "Online Qualifiers (BR) + Offline Finals (CS)",
        scoring: {
          placement:
            "1st: 12pts, 2nd: 9pts, 3rd: 8pts, 4th: 7pts, 5th: 6pts, 6th: 5pts, 7th: 4pts, 8th: 3pts, 9th: 2pts, 10th: 1pt",
          kills: "1 point per kill",
        },
        rules: {
          qualifiers: [
            "Battle Royale mode on Bermuda map",
            "Online matches can be played from anywhere",
            "Top 15-20 teams qualify for finals (based on registration)",
            "No VPN usage allowed",
            "PC players not allowed",
            "Gun property remains odd in BR mode",
            "Full map matches will be BR-Ranked",
          ],
          finals: [
            "Offline matches at Hindustan University (21.3.25)",
            "Clash Squad mode with Knockout format",
            "Character skills and gun property disabled in CS mode",
            "One AWM per team in Clash Squad",
            "No throwables or double vectors in CS",
            "Roof climbing and gloo wall breaking allowed",
            "Gun property remains odd in CS mode",
            "Unlimited ammo in CS mode",
            "Teams must join custom room within 5 minutes",
          ],
        },
      },
      {
        game: "BGMI",
        registrationFee: "₹200 per team",
        teamSize: "4 members",
        format: "3 Days, 4 matches per day",
        scoring: {
          placement: "1st: 15pts, 2nd: 12pts, 3rd: 10pts...",
          kills: "1 point per kill",
        },
      },
      {
        game: "PES",
        registrationFee: "₹100 per individual",
        teamSize: "1 member",
        format: "League (26 players) + Knockout (Top 16)",
        scoring: {
          placement: "N/A",
          league: "Win: 3pts, Draw: 1pt, Loss: 0pt",
          tiebreakers: "Goal Difference, Goals Scored, H2H",
        },
      },
    ],
  },
];

export const getEventById = (id: string): Event | undefined => {
  return events.find((event) => event.id === id);
};
