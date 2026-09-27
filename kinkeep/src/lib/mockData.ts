import { Contact } from '@/types/contact';

export const INITIAL_DEMO_CONTACTS: Contact[] = [
  {
    id: 'demo-1',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    full_name: 'Eleanor Vance',
    relationship: 'Grandmother',
    phone_number: '+1 (555) 234-5678',
    email: 'eleanor.vance@family.org',
    address: '42 Orchard Lane, Greenfield, MA',
    photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    added_by: 'demo-user-1'
  },
  {
    id: 'demo-2',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25).toISOString(),
    full_name: 'Marcus Vance',
    relationship: 'Uncle',
    phone_number: '+1 (555) 345-6789',
    email: 'marcus.vance@workplace.com',
    address: '78 Pinecrest Drive, Seattle, WA',
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    added_by: 'demo-user-1'
  },
  {
    id: 'demo-3',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
    full_name: 'Sarah Chen',
    relationship: 'Cousin',
    phone_number: '+1 (555) 456-7890',
    email: 'sarah.chen@designstudio.io',
    address: '120 Sunset Blvd, Austin, TX',
    photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    added_by: 'demo-user-1'
  },
  {
    id: 'demo-4',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
    full_name: 'Liam Davies',
    relationship: 'Brother',
    phone_number: '+1 (555) 567-8901',
    email: 'liam.davies@techhub.net',
    address: '55 Birchwood Rd, Denver, CO',
    photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    added_by: 'demo-user-1'
  },
  {
    id: 'demo-5',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    full_name: 'Maya Patel',
    relationship: 'Best Friend',
    phone_number: '+1 (555) 678-9012',
    email: 'maya.patel@creativeminds.com',
    address: '310 Willow Way, Portland, OR',
    photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    added_by: 'demo-user-1'
  },
  {
    id: 'demo-6',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    full_name: 'Arthur Vance',
    relationship: 'Father',
    phone_number: '+1 (555) 789-0123',
    email: 'arthur.vance@gardening.co',
    address: '88 Heritage Way, Boston, MA',
    photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    added_by: 'demo-user-1'
  }
];
