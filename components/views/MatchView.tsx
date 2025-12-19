import { useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '../../types';
import { getYouLiked, getWhoLikedYou, getMutualMatches, getRejectedProfiles } from '../../services/matchService';
import PublicProfileModal from './PublicProfileModal';
import { Heart, ArrowRight, Stars, XCircle } from 'lucide-react';

interface Props {
  currentUser: UserProfile;
  isProfileComplete?: boolean;
  onRestrictedAction?: () => void;
  onViewFullProfile?: (profile: UserProfile) => void;
}

type Tab = 'LIKED' | 'LIKED_BY' | 'MATCHES' | 'REJECTED';

export default function MatchView({ currentUser, onViewFullProfile }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('LIKED');
  const [data, setData] = useState<UserProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const loadData = async () => {
        if (activeTab === 'LIKED') setData(await getYouLiked(currentUser.id));
        if (activeTab === 'LIKED_BY') setData(await getWhoLikedYou(currentUser.id));
        if (activeTab === 'MATCHES') setData(await getMutualMatches(currentUser.id));
        if (activeTab === 'REJECTED') setData(await getRejectedProfiles(currentUser.id));
    };
    loadData();
  }, [activeTab, currentUser.id]);

  const renderCard = (profile: UserProfile) => {
    const avatarSrc = profile.avatar_url || '/components/profile/avatar.png';
    
    if (activeTab === 'MATCHES') {
        // TILE STYLE FOR MATCHES
        return (
            <div key={profile.id} onClick={() => setSelectedProfile(profile)} className="cursor-pointer group relative h-80 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <img 
                  src={avatarSrc} 
                  className="w-full h-full object-cover" 
                  alt={profile.name} 
                  crossOrigin="anonymous"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(profile.name || 'User');
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-rose-900/80 via-transparent to-transparent">
                     <div className="absolute bottom-0 left-0 p-6 text-white">
                         <h3 className="text-2xl font-bold flex items-center gap-2">{profile.name}, {profile.age} <Stars className="w-5 h-5 text-yellow-400 fill-current animate-pulse"/></h3>
                         <p className="opacity-90">{profile.occupation_type === 'Job' ? `${profile.designation} at ${profile.company_name}` : profile.occupation_type === 'Business' ? profile.business_name : profile.occupation}</p>
                         <p className="text-xs mt-2 bg-white/20 inline-block px-2 py-1 rounded backdrop-blur-md">Click to view full contact</p>
                     </div>
                </div>
            </div>
        );
    }

    // LIST STYLE FOR OTHERS (including Liked, Liked By, Rejected)
    return (
        <div 
          key={profile.id} 
          onClick={() => setSelectedProfile(profile)}
          className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 mb-3 cursor-pointer hover:shadow-md transition-shadow"
        >
             <img 
               src={avatarSrc} 
               className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" 
               alt={profile.name} 
               crossOrigin="anonymous"
               onError={(e) => {
                 (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(profile.name || 'User');
               }}
             />
             <div>
                <h4 className="font-bold text-gray-800">{profile.title} {profile.name}</h4>
                <p className="text-xs text-gray-500">{profile.educationLevel} • {profile.caste}</p>
             </div>
             <div className={`ml-auto text-xs font-bold px-3 py-1 rounded-full ${
               activeTab === 'LIKED' ? 'text-rose-500 bg-rose-50' :
               activeTab === 'LIKED_BY' ? 'text-green-500 bg-green-50' :
               activeTab === 'REJECTED' ? 'text-gray-500 bg-gray-100' :
               'text-rose-500 bg-rose-50'
             }`}>
                 {activeTab === 'LIKED' ? 'Sent' : activeTab === 'LIKED_BY' ? 'Received' : activeTab === 'REJECTED' ? 'Rejected' : ''}
             </div>
        </div>
    );
  };

  return (
    <div className="animate-fadeIn pb-24">
       <h2 className="text-2xl font-bold text-rose-700 mb-6">Connections</h2>
       
       <div className="flex bg-gray-100 p-1 rounded-xl mb-8 flex-wrap gap-1">
          <TabButton active={activeTab === 'LIKED'} onClick={() => setActiveTab('LIKED')} label="You Liked" icon={<ArrowRight className="w-4 h-4"/>} />
          <TabButton active={activeTab === 'LIKED_BY'} onClick={() => setActiveTab('LIKED_BY')} label="Liked You" icon={<Heart className="w-4 h-4"/>} />
          <TabButton active={activeTab === 'MATCHES'} onClick={() => setActiveTab('MATCHES')} label="Matches" icon={<Stars className="w-4 h-4"/>} />
          <TabButton active={activeTab === 'REJECTED'} onClick={() => setActiveTab('REJECTED')} label="Rejected" icon={<XCircle className="w-4 h-4"/>} />
       </div>

       <div className={activeTab === 'MATCHES' ? 'grid grid-cols-1 sm:grid-cols-2 gap-6' : 'space-y-2'}>
          {data.length > 0 ? data.map(renderCard) : (
            <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400">
                <p>No profiles found in this section yet.</p>
                {activeTab === 'MATCHES' && <p className="text-sm mt-2 text-rose-400">Keep liking profiles to find a match!</p>}
                {activeTab === 'REJECTED' && <p className="text-sm mt-2 text-gray-400">Profiles you reject will appear here.</p>}
            </div>
          )}
       </div>

       {selectedProfile && (
        <PublicProfileModal 
          profile={selectedProfile} 
          onClose={() => setSelectedProfile(null)} 
          isMatch={activeTab === 'MATCHES'}
          onViewFullProfile={() => onViewFullProfile?.(selectedProfile)}
        />
      )}
    </div>
  );
}

interface TabButtonProps {
    active: boolean;
    onClick: () => void;
    label: string;
    icon: ReactNode;
}

const TabButton = ({ active, onClick, label, icon }: TabButtonProps) => (
    <button 
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-bold transition-all min-w-[80px] ${active ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
    >
      {icon} <span>{label}</span>
    </button>
);
