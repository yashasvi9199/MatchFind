import { useState, useEffect, useMemo } from 'react';
import { UserProfile, FilterState } from '../../types';
import { getPotentialMatches, recordInteraction } from '../../services/matchService';
import { Select, Label } from '../common/FormComponents';
import { CASTES, SKINS, GOTRA_MAP } from '../../constants/data';
import PublicProfileModal from './PublicProfileModal';
import { Heart, X as XIcon, Filter } from 'lucide-react';

interface Props {
  currentUser: UserProfile;
}

const INITIAL_FILTERS: FilterState = {
  caste: '',
  gotra: '',
  minHeight: '',
  skinColor: '',
  siblings: 'any',
  healthIssues: 'any',
};

export default function RishteyView({ currentUser }: Props) {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Load potential matches on mount
    const fetchPotentials = async () => {
        const potentials = await getPotentialMatches(currentUser.id, currentUser.gender);
        setProfiles(potentials);
    };
    fetchPotentials();
  }, [currentUser.id, currentUser.gender]);

  // Apply filters
  const filteredProfiles = useMemo(() => {
    let result = profiles;

    if (filters.caste) result = result.filter(p => p.caste === filters.caste);
    if (filters.gotra) result = result.filter(p => p.gotra === filters.gotra);
    if (filters.skinColor) result = result.filter(p => p.skinColor === filters.skinColor);
    
    if (filters.siblings === 'none') result = result.filter(p => p.siblings.length === 0);
    if (filters.healthIssues === 'none') result = result.filter(p => p.healthIssues.length === 0);

    return result;
  }, [profiles, filters]);

  const handleAction = (targetProfile: UserProfile, type: 'INTERESTED' | 'REMOVED') => {
    console.log(`[Rishtey] Action ${type} on ${targetProfile.name}`);
    
    // Save to local storage
    recordInteraction(currentUser.id, targetProfile.id, type);

    // Remove from local view immediately
    const remaining = profiles.filter(p => p.id !== targetProfile.id);
    setProfiles(remaining);
  };

  return (
    <>
        <div className="animate-fadeIn pb-24">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-rose-700">Explore Rishtey</h2>
            <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${showFilters ? 'bg-rose-100 text-rose-700' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
            <Filter className="w-4 h-4"/> Filters
            </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 animate-slideDown">
            <div>
                <Label>Caste</Label>
                <Select value={filters.caste} onChange={e => setFilters({...filters, caste: e.target.value})}>
                    <option value="">Any</option>
                    {CASTES.map(c => <option key={c} value={c}>{c}</option>)}
                </Select>
            </div>
            <div>
                <Label>Gotra</Label>
                <Select value={filters.gotra} onChange={e => setFilters({...filters, gotra: e.target.value})}>
                    <option value="">Any</option>
                    {filters.caste && GOTRA_MAP[filters.caste]?.map(g => <option key={g} value={g}>{g}</option>)}
                </Select>
            </div>
            <div>
                <Label>Skin Color</Label>
                <Select value={filters.skinColor} onChange={e => setFilters({...filters, skinColor: e.target.value})}>
                    <option value="">Any</option>
                    {SKINS.map(s => <option key={s} value={s}>{s}</option>)}
                </Select>
            </div>
            <div>
                <Label>Siblings</Label>
                <Select value={filters.siblings} onChange={e => setFilters({...filters, siblings: e.target.value as 'any' | 'none'})}>
                    <option value="any">Any</option>
                    <option value="none">No Siblings</option>
                </Select>
            </div>
            <div>
                <Label>Health Issues</Label>
                <Select value={filters.healthIssues} onChange={e => setFilters({...filters, healthIssues: e.target.value as 'any' | 'none'})}>
                    <option value="any">Any</option>
                    <option value="none">None</option>
                </Select>
            </div>
            </div>
        )}

        {/* Grid */}
        {filteredProfiles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProfiles.map(profile => (
                <div key={profile.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group relative cursor-pointer" onClick={() => setSelectedProfile(profile)}>
                <div className="h-64 relative overflow-hidden">
                    <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
                        <span className="text-white font-bold text-sm bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">View Details</span>
                    </div>
                </div>
                <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-800">{profile.title} {profile.name}</h3>
                    <p className="text-sm text-gray-500 mb-3">{profile.age} Yrs • {profile.caste}</p>
                    <p className="text-xs text-gray-400 line-clamp-2">{profile.bio}</p>
                </div>
                
                {/* Quick Actions (Stop Propagation to avoid opening modal when clicking buttons) */}
                <div className="flex border-t border-gray-100">
                    <button 
                        onClick={(e) => { e.stopPropagation(); handleAction(profile, 'REMOVED'); }}
                        className="flex-1 py-3 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors flex justify-center"
                    >
                        <XIcon className="w-5 h-5"/>
                    </button>
                    <div className="w-px bg-gray-100"></div>
                    <button 
                        onClick={(e) => { e.stopPropagation(); handleAction(profile, 'INTERESTED'); }}
                        className="flex-1 py-3 bg-gray-50 hover:bg-green-50 text-gray-400 hover:text-green-500 transition-colors flex justify-center"
                    >
                        <Heart className="w-5 h-5 fill-current"/>
                    </button>
                </div>
                </div>
            ))}
            </div>
        ) : (
            <div className="text-center py-20 text-gray-400">
            <p className="text-lg">No profiles found matching your criteria.</p>
            <button onClick={() => setFilters(INITIAL_FILTERS)} className="text-rose-600 font-bold mt-2 hover:underline">Clear Filters</button>
            </div>
        )}
        </div>

        {/* Modal rendered OUTSIDE the animated div to ensure Fixed Position works */}
        {selectedProfile && (
            <PublicProfileModal 
                profile={selectedProfile} 
                onClose={() => setSelectedProfile(null)} 
                onAction={(type) => handleAction(selectedProfile, type)}
            />
        )}
    </>
  );
}
