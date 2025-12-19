import { UserProfile } from '../types';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'https://match-find-backend.vercel.app';

export const recordInteraction = async (fromUserId: string, toUserId: string, type: 'INTERESTED' | 'REMOVED') => {
  try {
    await fetch(`${API_URL}/api/interactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromUserId, toUserId, type }),
        credentials: 'omit'
    });
  } catch (error) {
    console.error('Failed to record interaction', error);
  }
};

export const getPotentialMatches = async (currentUserId: string, gender: 'Male' | 'Female'): Promise<UserProfile[]> => {
  try {
    const res = await fetch(`${API_URL}/api/matches/potential?userId=${currentUserId}&gender=${gender}`, { credentials: 'omit' });
    if (!res.ok) throw new Error('Failed to fetch');
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getYouLiked = async (currentUserId: string): Promise<UserProfile[]> => {
    try {
        const res = await fetch(`${API_URL}/api/matches/liked?userId=${currentUserId}`, { credentials: 'omit' });
        return await res.json();
    } catch { return []; }
};

export const getWhoLikedYou = async (currentUserId: string): Promise<UserProfile[]> => {
    try {
        const res = await fetch(`${API_URL}/api/matches/liked-by?userId=${currentUserId}`, { credentials: 'omit' });
        return await res.json();
    } catch { return []; }
};

export const getMutualMatches = async (currentUserId: string): Promise<UserProfile[]> => {
    try {
        const res = await fetch(`${API_URL}/api/matches/mutual?userId=${currentUserId}`, { credentials: 'omit' });
        return await res.json();
    } catch { return []; }
};

export const getRejectedProfiles = async (currentUserId: string): Promise<UserProfile[]> => {
    try {
        const res = await fetch(`${API_URL}/api/matches/rejected?userId=${currentUserId}`, { credentials: 'omit' });
        return await res.json();
    } catch { return []; }
};

// Seed is now server-side, but client might trigger it if we wanted to exposed it. 
// For now, removing the client-side seed logic as it's no longer relevant to local storage.
export const seedMockInteractions = async (_currentUserId: string, _gender: 'Male' | 'Female') => {
   // No-op or call server to seed?
   // User asked to move backend code.
  //  console.log('Seed interactions is now updated to Backend API usage. You may call /api/seed on backend to populate data.');
};
