export type Event = {
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
  status: 'upcoming' | 'ongoing' | 'completed';
}; 