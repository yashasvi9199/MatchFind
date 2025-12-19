import { useState } from 'react';
import { UserProfile } from '../../types';
import { User as UserIcon, MapPinHouse, Heart, Mail, Phone, Briefcase, GraduationCap, Activity, Users, Star, ArrowLeft, X } from 'lucide-react';

interface Props {
  profile: UserProfile;
  onBack: () => void;
}

// Helper to standardizing empty values
const val = (v: string | number | undefined) => v || <span className="text-gray-300 italic">Not Specified</span>;

// Reusable Detail Row Component
const DetailRow = ({ label, value, icon: Icon }: { label: string, value: React.ReactNode, icon?: React.ElementType }) => (
  <div className="flex items-start justify-between group py-2 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors rounded-lg px-2 -mx-2">
     <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
        {Icon && <Icon className="w-4 h-4 text-rose-300" />}
        <span>{label}</span>
     </div>
     <span className="text-gray-800 font-semibold text-sm text-right max-w-[60%]">{value}</span>
  </div>
);

interface SectionCardProps {
    title: string;
    icon: React.ElementType;
    children: React.ReactNode;
    accent?: "rose" | "orange" | "blue" | "emerald" | "purple";
    className?: string;
}

// Reusable Section Card (Read Only)
const SectionCard = ({ title, icon: Icon, children, accent = "rose", className = "" }: SectionCardProps) => {
    const colors: Record<string, string> = {
        rose: "bg-rose-50 text-rose-600 border-rose-100",
        orange: "bg-orange-50 text-orange-600 border-orange-100",
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
        purple: "bg-purple-50 text-purple-600 border-purple-100"
    };

    return (
      <div className={`bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative group hover:shadow-md transition-all duration-300 ${className}`}>
          <div className="flex items-center gap-3 mb-6">
              <div className={`p-2.5 rounded-2xl ${colors[accent]}`}>
                  <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 tracking-tight">{title}</h3>
          </div>
          <div className="space-y-1">
              {children}
          </div>
      </div>
    );
};

export default function FullProfileView({ profile, onBack }: Props) {
  const displayImage = profile.avatar_url;
  const [showImageModal, setShowImageModal] = useState(false);

  const isMale = profile.gender === 'Male';
  const headerGradient = isMale 
    ? "from-blue-400 via-blue-300 to-cyan-200" 
    : "from-rose-400 via-rose-300 to-orange-200";

  return (
    <div className="animate-fadeIn max-w-6xl mx-auto pb-24 font-sans text-gray-600">
       
       {/* Image Modal */}
       {showImageModal && displayImage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fadeIn" onClick={() => setShowImageModal(false)}>
            <div className="max-w-4xl w-full flex flex-col items-center relative">
                <button 
                    onClick={() => setShowImageModal(false)}
                    className="absolute top-4 right-4 text-white hover:text-rose-400 transition-colors p-2 z-50 bg-black/50 rounded-full"
                >
                    <X className="w-8 h-8" />
                </button>
                <img 
                    src={displayImage} 
                    alt="Full Profile" 
                    className="max-h-[85vh] object-contain rounded-2xl shadow-2xl ring-4 ring-white/10"
                    onClick={e => e.stopPropagation()}
                />
            </div>
        </div>
       )}

       {/* Back Button (Floating) */}
       <div className="fixed top-24 left-4 z-40 lg:absolute lg:top-0 lg:left-0 lg:ml-[-60px]">
           <button 
             onClick={onBack}
             className="bg-white p-3 rounded-full shadow-lg border border-gray-100 text-gray-600 hover:text-rose-600 hover:scale-110 transition-all"
             title="Back"
           >
               <ArrowLeft className="w-5 h-5" />
           </button>
       </div>

       {/* --- HERO SECTION --- */}
       <div className="relative mb-12 mt-6 lg:mt-0">
          {/* Background Gradient */}
          <div className={`h-64 rounded-[3rem] bg-gradient-to-r ${headerGradient} overflow-hidden relative shadow-lg`}>
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <div className="absolute -bottom-24 -right-20 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
          </div>

          <div className="px-8 md:px-12 flex flex-col md:flex-row items-center md:items-end gap-8 -mt-32 relative z-10">
              {/* Profile Image */}
              <div className="group relative shrink-0">
                  <div className="w-48 h-48 rounded-full border-[6px] border-white shadow-2xl overflow-hidden bg-white relative">
                      {displayImage ? (
                          <img 
                            src={displayImage} 
                            onClick={() => setShowImageModal(true)}
                            className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-500" 
                            alt="Profile" 
                          />
                      ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                             <UserIcon className="w-20 h-20" />
                          </div>
                      )}
                  </div>
              </div>

              {/* Title & Headline */}
              <div className="text-center md:text-left pb-4 mt-20 flex-grow">
                  <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight font-serif mb-2">
                    {profile.title} {profile.name}
                  </h1>
                  
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-gray-600 mb-4">
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-white/60 backdrop-blur-sm rounded-full border border-white/40 shadow-sm">
                        <Star className="w-4 h-4 text-orange-400 fill-current" /> 
                        <span className="font-semibold">{profile.age} Years</span>
                      </span>
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-white/60 backdrop-blur-sm rounded-full border border-white/40 shadow-sm">
                        <MapPinHouse className="w-4 h-4 text-rose-400" />
                        <span className="font-medium">{profile.currentCity}, {profile.currentCountry}</span>
                      </span>
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-white/60 backdrop-blur-sm rounded-full border border-white/40 shadow-sm">
                         <Briefcase className="w-4 h-4 text-blue-400" />
                         <span className="font-medium">{profile.designation || 'Professional'}</span>
                      </span>
                  </div>
              </div>
          </div>
       </div>


       {/* --- MAIN GRID LAYOUT --- */}
       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4">
          
          {/* LEFT COLUMN (Details) */}
          <div className="lg:col-span-8 space-y-8">
              
              {/* About Me */}
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-2 h-full ${isMale ? 'bg-blue-400' : 'bg-rose-400'}`}></div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4 font-serif">About Me</h3>
                  <p className="text-lg text-gray-600 leading-relaxed italic font-light relative z-10">
                    "{profile.bio || "No description provided."}"
                  </p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Physical Traits */}
                  <SectionCard title="Physical Appearance" icon={Activity}>
                      <DetailRow label="Height" value={`${profile.height} Ft`} />
                      <DetailRow label="Weight" value={`${profile.weight} Kg`} />
                      <DetailRow label="Skin Tone" value={profile.skinColor} />
                      <DetailRow label="Diet" value={profile.diet} />
                      <DetailRow label="Blood Group" value={profile.bloodGroup} />
                  </SectionCard>

                  {/* Religious Background */}
                  <SectionCard title="Religious Background" icon={Star} accent="orange">
                      <DetailRow label="Caste" value={profile.caste} />
                      <DetailRow label="Gotra" value={profile.gotra} />
                      <DetailRow label="Native State" value={profile.nativeState} />
                      <DetailRow label="Native City" value={profile.nativeCity} />
                      <DetailRow label="Birth Time" value={profile.birthTime} />
                  </SectionCard>

                  {/* Education & Career */}
                  <SectionCard title="Education & Career" icon={GraduationCap} accent="blue">
                      <DetailRow label="Education" value={profile.educationLevel} />
                      <DetailRow label="Stream" value={profile.educationStream} />
                      <DetailRow label="Profession" value={profile.occupation_type} />
                      <DetailRow label="Details" value={profile.designation || profile.business_category} />
                      <DetailRow label="Annual Income" value={profile.salary} />
                  </SectionCard>

                  {/* Family Details */}
                  <SectionCard title="Family Background" icon={Users} accent="emerald">
                      <DetailRow label="Father" value={`${profile.father.title} ${profile.father.name}`} />
                      <DetailRow label="Mother" value={`${profile.mother.title} ${profile.mother.name}`} />
                      <DetailRow label="Siblings" value={`${profile.siblings.length} Members`} />
                      <DetailRow label="Nanihaal Gotra" value={profile.paternalSide.gotra} />
                  </SectionCard>


              </div>
          </div>


          {/* RIGHT COLUMN (Preferences & Contact) */}
          <div className="lg:col-span-4 space-y-8">
              
              {/* Partner Preferences (Highlighted) */}
              <div className={`bg-gradient-to-br ${isMale ? 'from-blue-500 to-cyan-400' : 'from-rose-500 to-orange-400'} rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group`}>
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl group-hover:bg-white/30 transition-colors"></div>
                  
                  <div className="flex items-center gap-3 mb-8 relative z-10">
                      <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                          <Heart className="w-6 h-6 fill-current" />
                      </div>
                      <h3 className="text-xl font-bold font-serif tracking-wide">Partner Choice</h3>
                  </div>

                  <div className="space-y-6 relative z-10">
                      <div>
                          <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${isMale ? 'text-blue-100' : 'text-rose-100'}`}>Age Preference</p>
                          <p className="text-3xl font-serif font-medium">{val(profile.partnerAgeMin)} - {val(profile.partnerAgeMax)} <span className="text-base opacity-70">Years</span></p>
                      </div>
                      <div>
                          <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${isMale ? 'text-blue-100' : 'text-rose-100'}`}>Key Expectations</p>
                          {profile.expectations.length > 0 ? (
                              <ul className="space-y-3">
                                  {profile.expectations.slice(0, 5).map((exp, i) => (
                                      <li key={i} className="flex items-start gap-3 text-sm font-medium text-white/90">
                                          <span className="w-1.5 h-1.5 bg-white rounded-full mt-1.5 shrink-0 shadow-[0_0_5px_white]"></span>
                                          {exp}
                                      </li>
                                  ))}
                              </ul>
                          ) : (
                              <p className="text-white/60 italic text-sm">No specific preferences listed.</p>
                          )}
                      </div>
                  </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="text-lg font-bold text-gray-800 font-serif">Contact Details</h3>
                  </div>
                  
                  <div className="space-y-4">
                      {profile.email && (
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors group/c">
                            <div className="bg-white p-2.5 rounded-xl shadow-sm group-hover/c:scale-110 transition-transform">
                                <Mail className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Email</p>
                                <p className="font-semibold text-gray-800 truncate">{val(profile.email)}</p>
                            </div>
                        </div>
                      )}
                      
                      {profile.phone && (
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors group/c">
                            <div className="bg-white p-2.5 rounded-xl shadow-sm group-hover/c:scale-110 transition-transform">
                                <Phone className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Mobile</p>
                                <p className="font-semibold text-gray-800 truncate">{val(profile.phone)}</p>
                            </div>
                        </div>
                      )}
                      
                      {!profile.email && !profile.phone && (
                        <div className="text-center text-gray-400 italic py-4">
                            Contact details are private.
                        </div>
                      )}
                  </div>
              </div>

              {/* Lifestyle/Health */}
              <SectionCard title="Health & Lifestyle" icon={Activity} accent="purple">
                  <div className="pt-2">
                    {profile.healthIssues.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {profile.healthIssues.map((issue, i) => (
                                <span key={i} className="px-3 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded-full border border-red-100">{issue}</span>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl text-sm font-medium">
                            <Activity className="w-4 h-4" /> Healthy / No Major Issues
                        </div>
                    )}
                  </div>
              </SectionCard>
          </div>
       </div>

       {/* Footer */}
       <div className="text-center pt-16 pb-8 opacity-40 hover:opacity-100 transition-opacity duration-500">
            <div className="flex items-center justify-center gap-2 mb-2">
                <Heart className={`w-4 h-4 fill-current animate-pulse ${isMale ? 'text-blue-400' : 'text-rose-400'}`} />
                <span className="font-serif italic text-gray-500">MatchFind Exclusive</span>
            </div>
       </div>
    </div>
  );
}
