export interface Event {
  id: number;
  title: string;
  date: Date;
  location: string;
  description: string;
  status: 'upcoming' | 'attending' | 'maybe' | 'declined';
}
