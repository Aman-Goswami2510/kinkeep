export interface Contact {
  id: string;
  created_at: string;
  full_name: string;
  relationship: string;
  phone_number?: string | null;
  email?: string | null;
  address?: string | null;
  photo_url?: string | null;
  added_by?: string | null;
}

export type ContactFormData = Omit<Contact, 'id' | 'created_at' | 'added_by'>;

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
}

export const RELATIONSHIP_PRESETS = [
  'Mother',
  'Father',
  'Sister',
  'Brother',
  'Grandmother',
  'Grandfather',
  'Aunt',
  'Uncle',
  'Cousin',
  'Niece',
  'Nephew',
  'Spouse',
  'Partner',
  'Child',
  'In-Law',
  'Best Friend',
  'Close Friend',
  'Colleague',
  'Neighbor',
  'Other'
] as const;

export type RelationshipType = typeof RELATIONSHIP_PRESETS[number];
