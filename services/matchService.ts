import { Interaction, UserProfile } from '../types';
import { MOCK_PROFILES } from '../constants/mockProfiles';

const STORAGE_KEY_INTERACTIONS = 'matchfind_interactions';

// Helper to get local interactions
const getInteractions = (): Interaction[] => {
  const stored = localStorage.getItem(STORAGE_KEY_INTERACTIONS);
  return stored ? JSON.parse(stored) : [];
};

// Helper to save interactions
const saveInteraction = (interactions: Interaction[]) => {
  localStorage.setItem(STORAGE_KEY_INTERACTIONS, JSON.stringify(interactions));
};

export const recordInteraction = (fromUserId: string, toUserId: string, type: 'INTERESTED' | 'REMOVED') => {
  console.log(`[MatchService] Interaction: ${fromUserId} marked ${toUserId} as ${type}`);
  const interactions = getInteractions();
  
  // Remove existing interaction if any (allow changing mind)
  const filtered = interactions.filter(i => !(i.fromUserId === fromUserId && i.toUserId === toUserId));
  
  filtered.push({
    fromUserId,
    toUserId,
    type,
    timestamp: Date.now()
  });
  
  saveInteraction(filtered);
};

export const getPotentialMatches = (currentUserId: string, gender: 'Male' | 'Female'): UserProfile[] => {
  // 1. Get all profiles of opposite gender
  const oppositeGender = gender === 'Male' ? 'Female' : 'Male';
  let potentials = MOCK_PROFILES.filter(p => p.gender === oppositeGender);

  // 2. Filter out profiles current user has already acted on (Interested or Removed)
  const interactions = getInteractions();
  const actedUponIds = new Set(
    interactions
      .filter(i => i.fromUserId === currentUserId)
      .map(i => i.toUserId)
  );

  return potentials.filter(p => !actedUponIds.has(p.id));
};

export const getYouLiked = (currentUserId: string): UserProfile[] => {
  const interactions = getInteractions();
  const likedIds = interactions
    .filter(i => i.fromUserId === currentUserId && i.type === 'INTERESTED')
    .map(i => i.toUserId);
  
  return MOCK_PROFILES.filter(p => likedIds.includes(p.id));
};

export const getWhoLikedYou = (currentUserId: string): UserProfile[] => {
  const interactions = getInteractions();
  const likerIds = interactions
    .filter(i => i.toUserId === currentUserId && i.type === 'INTERESTED')
    .map(i => i.fromUserId);
  
  return MOCK_PROFILES.filter(p => likerIds.includes(p.id));
};

export const getMutualMatches = (currentUserId: string): UserProfile[] => {
  const interactions = getInteractions();
  
  // IDs the user liked
  const userLikedIds = new Set(
    interactions
      .filter(i => i.fromUserId === currentUserId && i.type === 'INTERESTED')
      .map(i => i.toUserId)
  );

  // IDs that liked the user
  const likedByUserIds = new Set(
    interactions
      .filter(i => i.toUserId === currentUserId && i.type === 'INTERESTED')
      .map(i => i.fromUserId)
  );

  // Intersection
  const mutualIds = [...userLikedIds].filter(id => likedByUserIds.has(id));

  return MOCK_PROFILES.filter(p => mutualIds.includes(p.id));
};

// Seed some initial likes for testing "Who Liked You" and "Match"
export const seedMockInteractions = (currentUserId: string, gender: 'Male' | 'Female') => {
    const existing = getInteractions();
    if (existing.length > 0) return; // Only seed if empty

    console.log('[MatchService] Seeding mock interactions for testing...');
    const oppositeGenderProfiles = MOCK_PROFILES.filter(p => p.gender !== gender);
    
    const newInteractions: Interaction[] = [];

    // 1. Seed "Who Liked You" (People liking current user)
    if(oppositeGenderProfiles.length > 0) {
        newInteractions.push({
            fromUserId: oppositeGenderProfiles[0].id,
            toUserId: currentUserId,
            type: 'INTERESTED',
            timestamp: Date.now()
        });
        newInteractions.push({
            fromUserId: oppositeGenderProfiles[1].id,
            toUserId: currentUserId,
            type: 'INTERESTED',
            timestamp: Date.now()
        });
    }

    // 2. Seed a "Mutual Match" (User likes someone who likes them)
    if (oppositeGenderProfiles.length > 2) {
        // Assume user will like profile[2] later, so we make profile[2] like user now
        newInteractions.push({
            fromUserId: oppositeGenderProfiles[2].id,
            toUserId: currentUserId,
            type: 'INTERESTED',
            timestamp: Date.now()
        });
        // We artificially add the user's like to create an instant match scenario for testing
        newInteractions.push({
            fromUserId: currentUserId,
            toUserId: oppositeGenderProfiles[2].id,
            type: 'INTERESTED',
            timestamp: Date.now()
        });
    }

    saveInteraction(newInteractions);
}
