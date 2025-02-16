export interface Event {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  date: string;
  time: string;
  venue: string;
  rules: string[];
  guidelines: string[];
  prizes: {
    First: string;
    Second: string;
    Third: string;
  };
  coordinators: {
    name: string;
    role: string;
    contact: string;
  }[];
  registrationFee: string;
  teamSize: string;
  status: string;
  judgingCriteria?: {
    criterion: string;
    weightage: string;
    description: string;
  }[];
  setupRequirements?: {
    category: string;
    requirements: string[];
  }[];
  eventStructure?: {
    phase: string;
    description: string;
    duration?: string;
  }[];
} 