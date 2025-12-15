import React from 'react';
import { UserProfile } from '../../types';
import { X, Heart, ThumbsDown, User as UserIcon, Briefcase, MapPin, CheckCircle2 } from 'lucide-react';

interface Props {
  profile: UserProfile;
  onClose: () => void;
  onAction?: (type: 'INTERESTED' | 'REMOVED') => void;
  isMatch?: boolean;
}

export default function PublicProfileModal({ profile, onClose, onAction, isMatch = false }: Props) {
  
  const renderValue = (val: string | undefined, isSensitive = false) => {
    if (!val) return 'N/A';
    if (!isSensitive || isMatch) return val;
    return '•'.repeat(8) + ' (Hidden)';
  };

  return (
    // Outer Container: Fixed, Full Screen, High Z-Index. 
    // Removed animations on parent to avoid transform issues.
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      
      {/* Card Container */}
      <div className="bg-white rounded-3xl w-full max-w-2xl h-[85vh] md:h-[75vh] shadow-2xl overflow-hidden flex flex-col relative animate-slideUp">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-md transition-all"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Scrollable Content Area */}
        <div className="overflow-y-auto flex-grow custom-scrollbar">
          {/* Header Image */}
          <div className="h-72 bg-gray-200 relative">
            <img 
              src={profile.avatar_url || `https://ui-avatars.com/api/?name=${profile.name}`} 
              alt={profile.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 pt-24">
              <h2 className="text-3xl font-bold text-white">{profile.title} {profile.name}</h2>
              <p className="text-white/90 text-lg flex items-center gap-2 mt-1">
                 <Briefcase className="w-4 h-4"/> {profile.occupation}
              </p>
            </div>
          </div>

          <div className="p-6 space-y-8 pb-32">
            {/* Quick Stats */}
            <div className="flex flex-wrap gap-3">
               <Badge color="rose">{profile.age} Years</Badge>
               <Badge color="blue">{profile.height}</Badge>
               <Badge color="orange">{profile.caste}</Badge>
               <Badge color="purple"><MapPin className="w-3 h-3 mr-1"/> {profile.currentCity}</Badge>
            </div>

            {/* About */}
            <section>
               <h3 className="text-lg font-bold text-gray-800 mb-2">About</h3>
               <p className="text-gray-600 leading-relaxed text-sm">{profile.bio}</p>
            </section>

            {/* Detailed Info Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
               <div className="space-y-4">
                  <h4 className="font-bold text-gray-400 uppercase text-xs tracking-wider">Basic Details</h4>
                  <InfoRow label="Gotra" value={profile.gotra} />
                  <InfoRow label="Skin Color" value={profile.skinColor} />
                  <InfoRow label="Diet" value={profile.diet} />
                  <InfoRow label="Education" value={profile.education} />
                  <InfoRow label="Salary" value={profile.salary} />
               </div>
               <div className="space-y-4">
                  <h4 className="font-bold text-gray-400 uppercase text-xs tracking-wider">Private Details {isMatch ? '(Unlocked)' : '(Hidden)'}</h4>
                  <InfoRow label="Birth Time" value={renderValue(profile.birthTime, true)} isLocked={!isMatch} />
                  <InfoRow label="Birth City" value={renderValue(profile.birthPlace, true)} isLocked={!isMatch} />
                  <InfoRow label="Phone" value={renderValue(profile.phone, true)} isLocked={!isMatch} />
                  <InfoRow label="Email" value={renderValue(profile.email, true)} isLocked={!isMatch} />
               </div>
            </section>

            {/* Family */}
            <section className="bg-orange-50/50 p-5 rounded-2xl border border-orange-100">
               <h4 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide">Family Background</h4>
               <div className="space-y-3">
                 <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Father</span>
                    <span className="font-medium text-gray-800 text-right">{profile.father.title} {profile.father.name} <br/><span className="text-xs text-gray-400 font-normal">({profile.father.occupation})</span></span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Mother</span>
                    <span className="font-medium text-gray-800 text-right">{profile.mother.title} {profile.mother.name} <br/><span className="text-xs text-gray-400 font-normal">({profile.mother.occupation})</span></span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Siblings</span>
                    <span className="font-medium text-gray-800 text-right">{profile.siblings.length > 0 ? profile.siblings.length : 'None'}</span>
                 </div>
               </div>
            </section>

            {/* Preferences */}
            <section>
                 <h4 className="font-bold text-gray-400 uppercase text-xs tracking-wider mb-3">Partner Preferences</h4>
                 <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-600 space-y-2">
                    <p>Looking for age: <span className="font-bold">{profile.partnerAgeMin} - {profile.partnerAgeMax}</span></p>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {profile.expectations.map((exp, i) => (
                            <span key={i} className="bg-white px-2 py-1 rounded border border-gray-200 text-xs">{exp}</span>
                        ))}
                    </div>
                 </div>
            </section>
          </div>
        </div>

        {/* Sticky Action Buttons */}
        {!isMatch && onAction && (
          <div className="absolute bottom-6 w-full flex justify-center gap-8 z-30 pointer-events-none">
             <button 
               onClick={() => { onAction('REMOVED'); onClose(); }}
               className="pointer-events-auto bg-white text-red-500 hover:bg-red-50 p-4 rounded-full shadow-xl border border-red-100 hover:scale-110 transition-all group"
             >
               <ThumbsDown className="w-8 h-8 group-hover:rotate-12 transition-transform" />
             </button>
             <button 
               onClick={() => { onAction('INTERESTED'); onClose(); }}
               className="pointer-events-auto bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-green-200/50 p-4 rounded-full shadow-xl hover:scale-110 transition-all group"
             >
               <Heart className="w-8 h-8 fill-current group-hover:scale-110 transition-transform" />
             </button>
          </div>
        )}

        {isMatch && (
            <div className="absolute bottom-6 left-0 w-full flex justify-center z-30 pointer-events-none">
                 <div className="bg-green-600 text-white px-6 py-2 rounded-full shadow-lg flex items-center font-bold animate-bounce">
                    <CheckCircle2 className="w-5 h-5 mr-2" /> It's a Match!
                 </div>
            </div>
        )}
      </div>
      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(100px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slideUp { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
}

const Badge = ({ children, color }: { children: React.ReactNode, color: string }) => {
    const colorClasses: Record<string, string> = {
        rose: 'bg-rose-50 text-rose-700 border-rose-100',
        blue: 'bg-blue-50 text-blue-700 border-blue-100',
        orange: 'bg-orange-50 text-orange-700 border-orange-100',
        purple: 'bg-purple-50 text-purple-700 border-purple-100'
    };
    return (
        <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${colorClasses[color] || colorClasses.rose}`}>
            {children}
        </span>
    );
}

const InfoRow = ({ label, value, isLocked = false }: { label: string, value: string, isLocked?: boolean }) => (
  <div className="flex justify-between items-center border-b border-dashed border-gray-100 pb-2">
    <span className="text-sm text-gray-500 font-medium">{label}</span>
    <span className={`text-sm font-semibold text-right ${isLocked ? 'text-gray-300' : 'text-gray-800'}`}>{value}</span>
  </div>
);
