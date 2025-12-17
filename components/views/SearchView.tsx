import { useState, FormEvent } from 'react';
import { UserProfile } from '../../types';

import { Input, Label } from '../common/FormComponents';
import PublicProfileModal from './PublicProfileModal';
import { Search, Loader2 } from 'lucide-react';

interface Props {
  currentUser: UserProfile;
}

export default function SearchView({ currentUser }: Props) {
  const [query, setQuery] = useState({
    name: '',
    caste: '',
    gotra: '',
    city: ''
  });
  const [results, setResults] = useState<UserProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    
    try {
        // Use actual user ID and gender - backend handles admin logic
        const allProfiles = await import('../../services/matchService').then(m => m.getPotentialMatches(currentUser.id, currentUser.gender));
        
        const filtered = allProfiles.filter(p => {
            const matchesName = query.name ? p.name.toLowerCase().includes(query.name.toLowerCase()) : true;
            const matchesCaste = query.caste ? p.caste.toLowerCase().includes(query.caste.toLowerCase()) : true;
            const matchesGotra = query.gotra ? p.gotra.toLowerCase().includes(query.gotra.toLowerCase()) : true;
            const matchesCity = query.city ? p.currentCity.toLowerCase().includes(query.city.toLowerCase()) : true;
            
            return matchesName && matchesCaste && matchesGotra && matchesCity;
        });
        
        setResults(filtered);
    } catch (err) {
        console.error("Search failed", err);
    } finally {
        setIsSearching(false);
    }
  };

  return (
    <div className="animate-fadeIn pb-24">
       <h2 className="text-2xl font-bold text-rose-700 mb-6">Find Someone Specific</h2>
       
       <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <Label>Name</Label>
                <Input value={query.name} onChange={e => setQuery({...query, name: e.target.value})} placeholder="First or Last Name" />
             </div>
             <div>
                <Label>City</Label>
                <Input value={query.city} onChange={e => setQuery({...query, city: e.target.value})} placeholder="City Name" />
             </div>
             <div>
                <Label>Caste</Label>
                <Input value={query.caste} onChange={e => setQuery({...query, caste: e.target.value})} placeholder="Caste" />
             </div>
             <div>
                <Label>Gotra</Label>
                <Input value={query.gotra} onChange={e => setQuery({...query, gotra: e.target.value})} placeholder="Gotra" />
             </div>
             <div className="md:col-span-2 mt-2">
                <button type="submit" disabled={isSearching} className="w-full bg-rose-600 text-white py-3 rounded-xl font-bold hover:bg-rose-700 transition-colors flex items-center justify-center">
                    {isSearching ? <Loader2 className="w-5 h-5 animate-spin"/> : <><Search className="w-5 h-5 mr-2"/> Search Database</>}
                </button>
             </div>
          </form>
       </div>

       {/* Results */}
       <div className="space-y-4">
          <h3 className="font-bold text-gray-400 uppercase text-xs tracking-wider mb-4">Results ({results.length})</h3>
          
          {results.map(profile => (
              <div 
                key={profile.id} 
                onClick={() => setSelectedProfile(profile)}
                className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md cursor-pointer transition-shadow"
              >
                 <img src={profile.avatar_url} className="w-16 h-16 rounded-full object-cover" alt={profile.name} />
                 <div>
                    <h4 className="font-bold text-gray-800">{profile.title} {profile.name}</h4>
                    <p className="text-sm text-gray-500">{profile.age} Yrs • {profile.occupation}</p>
                 </div>
                 <div className="ml-auto">
                    <button className="text-xs bg-gray-100 hover:bg-rose-100 text-gray-600 hover:text-rose-600 px-3 py-1.5 rounded-full font-bold transition-colors">View</button>
                 </div>
              </div>
          ))}

          {results.length === 0 && !isSearching && (
              <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  Try adjusting your search filters.
              </div>
          )}
       </div>

       {selectedProfile && (
        <PublicProfileModal 
          profile={selectedProfile} 
          onClose={() => setSelectedProfile(null)} 
        />
      )}
    </div>
  );
}
