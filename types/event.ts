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
    first: string;
    second: string;
    third: string;
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