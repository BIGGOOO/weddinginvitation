
export interface GuestInfo {
  name: string;
  attending: boolean;
  plusOne: boolean;
  dietary: string;
  message: string;
}

export interface RSVPState {
  isSubmitting: boolean;
  response: string | null;
  error: string | null;
}

export interface StoryState {
  content: string;
  loading: boolean;
  style: 'classic' | 'tech' | 'poetic' | 'sci-fi';
}

export interface VenueInfo {
  name: string;
  address: string;
  lat: number;
  lng: number;
  uri?: string;
}
