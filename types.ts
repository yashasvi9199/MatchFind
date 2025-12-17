export interface FamilyMember {
  title: string;
  name: string;
  gotra: string;
  caste: string;
  occupation: string;
}

export interface ProfileData {
  // Basic Info
  title: string;
  name: string;
  gender: 'Male' | 'Female';
  age: number;
  height: string;
  weight: string;
  skinColor: string;
  bloodGroup: string;
  diet: 'Vegetarian' | 'Jain' | 'Non-Vegetarian' | 'Vegan';
  bio: string;

  // Social & Religious
  caste: string;
  gotra: string;

  // Location & Birth
  birthPlace: string;
  birthTime: string; // "HH:mm" 24-hour format

  // Native Location
  nativeCountry: string;
  nativeState: string;
  nativeCity: string;

  // Current Location
  currentCountry: string;
  currentState: string;
  currentCity: string;
  
  // Education & Career
  educationLevel: string;   // e.g., "Graduate"
  educationStream: string;  // e.g., "Engineering"
  educationDegree: string;  // e.g., "B.Tech"
  education: string;        // Fallback/Legacy string
  occupation: string;
  salary: string;

  // Family Details
  father: FamilyMember;
  mother: FamilyMember;
  paternalSide: FamilyMember;
  siblings: FamilyMember[];

  // Health
  healthIssues: string[];

  // Preferences
  partnerAgeMin: string;
  partnerAgeMax: string;
  expectations: string[];
}

export interface UserProfile extends ProfileData {
  id: string;
  role?: 'user' | 'admin';
  email?: string; // Added for mock login
  phone?: string; // Added for mock login
  password?: string; // Added for mock login
  avatar_url?: string;
  updated_at?: string;
  is_demo?: boolean; // Added for demo credentials check
  is_complete_profile?: boolean;
}

export type AuthMode = 'LOGIN' | 'SIGNUP';
export type LoginMethod = 'PASSWORD' | 'OTP';

export interface AuthSession {
  access_token: string;
  user: {
    id: string;
    email: string;
  };
}

export type AppView = 'PROFILE' | 'RISHTEY' | 'SEARCH' | 'MATCH';

export interface Interaction {
  fromUserId: string;
  toUserId: string;
  type: 'INTERESTED' | 'REMOVED';
  timestamp: number;
}

export interface FilterState {
  caste: string;
  gotra: string;
  minHeight: string;
  skinColor: string;
  siblings: 'any' | 'none';
  healthIssues: 'any' | 'none';
}
