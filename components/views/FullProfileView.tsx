import { useState } from 'react';
import { UserProfile } from '../../types';
import { User as UserIcon, MapPinHouse, Calendar, Heart, Mail, Phone, MoveVertical, Briefcase, GraduationCap, Building2, Store, Utensils, Droplet, Users, ArrowLeft, ZoomIn, X } from 'lucide-react';

interface Props {
  profile: UserProfile;
  onBack: () => void;
}

export default function FullProfileView({ profile, onBack }: Props) {
  const displayImage = profile.avatar_url;
  const [showImageModal, setShowImageModal] = useState(false);

  // Build occupation display string
  const getOccupationDisplay = () => {
    if (profile.occupation_type === 'Job') {
      return `${profile.designation || 'Employee'} at ${profile.company_name || 'Company'}`;
    } else if (profile.occupation_type === 'Business') {
      return `${profile.business_name || 'Business'} (${profile.business_category || 'Category'})`;
    }
    return profile.occupation || 'Not specified';
  };

  return (
    <div className="animate-fadeIn max-w-4xl mx-auto space-y-8 pb-10">
       {/* Image Pop-out Modal */}
       {showImageModal && displayImage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fadeIn" onClick={() => setShowImageModal(false)}>
            <div className="relative max-w-4xl max-h-[90vh] w-full flex items-center justify-center">
                <button 
                    onClick={() => setShowImageModal(false)}
                    className="absolute -top-12 right-0 text-white hover:text-rose-400 transition-colors p-2"
                >
                    <X className="w-8 h-8" />
                </button>
                <img 
                    src={displayImage} 
                    alt="Full Profile" 
                    className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border border-gray-800"
                    onClick={e => e.stopPropagation()}
                />
            </div>
        </div>
       )}

       {/* Back Button */}
       <button 
         onClick={onBack}
         className="flex items-center gap-2 text-gray-600 hover:text-rose-600 font-bold bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 transition-colors"
       >
         <ArrowLeft className="w-4 h-4" /> Back
       </button>

       <div className="bg-gradient-to-br from-rose-50 via-white to-orange-50 rounded-3xl shadow-xl overflow-hidden border border-rose-100">
          <div className="h-48 bg-gradient-to-r from-rose-400 to-orange-400 relative">
             <div className="absolute -bottom-16 left-8 p-1 bg-white rounded-full shadow-lg group">
                {displayImage ? (
                   <div className="relative cursor-pointer" onClick={() => setShowImageModal(true)}>
                       <img src={displayImage} className="w-32 h-32 rounded-full object-cover border-4 border-white transition-transform group-hover:scale-105" alt="Profile" />
                       <div className="absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <ZoomIn className="w-8 h-8 text-white sticky" />
                       </div>
                   </div>
                ) : (
                   <div className="w-32 h-32 rounded-full bg-rose-100 flex items-center justify-center border-4 border-white">
                      <UserIcon className="w-12 h-12 text-rose-300" />
                   </div>
                )}
             </div>
          </div>
          
          <div className="pt-20 px-8 pb-8">
             <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="w-full md:w-auto">
                  <h1 className="text-3xl font-bold text-gray-800">{profile.title} {profile.name}</h1>
                  <p className="text-rose-600 font-medium text-lg mt-1">{getOccupationDisplay()}</p>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><MapPinHouse className="w-4 h-4"/> {profile.currentCity}, {profile.currentCountry}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> {profile.age} Years</span>
                      <span className="flex items-center gap-1"><MoveVertical className="w-4 h-4"/> {profile.height} ft</span>
                  </div>
                </div>
             </div>

             {/* Contact Info */}
             <div className="mt-6 flex flex-wrap gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 text-sm">
                   <Mail className="w-4 h-4 text-rose-500" />
                   <span className="text-gray-600">{profile.email || 'No email provided'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                   <Phone className="w-4 h-4 text-rose-500" />
                   <span className="text-gray-600">{profile.phone || 'No phone provided'}</span>
                </div>
             </div>

             <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    <section>
                       <h3 className="text-lg font-bold text-gray-800 mb-2 border-b border-rose-100 pb-2">About Me</h3>
                       <p className="text-gray-600 leading-relaxed">{profile.bio || "No bio provided."}</p>
                    </section>

                    {/* Basic Details */}
                    <section>
                       <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-rose-100 pb-2">Personal Details</h3>
                       <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                          <div><span className="text-gray-400 text-sm block">Caste / Gotra</span> <span className="font-medium text-gray-800">{profile.caste || 'N/A'} / {profile.gotra || 'N/A'}</span></div>
                          <div><span className="text-gray-400 text-sm block">Gender</span> <span className="font-medium text-gray-800">{profile.gender}</span></div>
                          <div><span className="text-gray-400 text-sm block flex items-center gap-1"><MoveVertical className="w-3 h-3"/> Height</span> <span className="font-medium text-gray-800">{profile.height} ft</span></div>
                          <div><span className="text-gray-400 text-sm block">Weight</span> <span className="font-medium text-gray-800">{profile.weight} kg</span></div>
                          <div><span className="text-gray-400 text-sm block flex items-center gap-1"><Droplet className="w-3 h-3"/> Blood Group</span> <span className="font-medium text-gray-800">{profile.bloodGroup || 'N/A'}</span></div>
                          <div><span className="text-gray-400 text-sm block">Skin Color</span> <span className="font-medium text-gray-800">{profile.skinColor || 'N/A'}</span></div>
                          <div><span className="text-gray-400 text-sm block flex items-center gap-1"><Utensils className="w-3 h-3"/> Diet</span> <span className="font-medium text-gray-800">{profile.diet}</span></div>
                       </div>
                    </section>

                    {/* Education & Career */}
                    <section>
                       <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-rose-100 pb-2 flex items-center gap-2"><GraduationCap className="w-5 h-5"/> Education & Career</h3>
                       <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                          <div><span className="text-gray-400 text-sm block">Education Level</span> <span className="font-medium text-gray-800">{profile.educationLevel || 'N/A'}</span></div>
                          <div><span className="text-gray-400 text-sm block">Stream</span> <span className="font-medium text-gray-800">{profile.educationStream || 'N/A'}</span></div>
                          <div><span className="text-gray-400 text-sm block">Degree</span> <span className="font-medium text-gray-800">{profile.educationDegree || 'N/A'}</span></div>
                          <div><span className="text-gray-400 text-sm block">Occupation Type</span> <span className="font-medium text-gray-800">{profile.occupation_type || 'N/A'}</span></div>
                          {profile.occupation_type === 'Job' && (
                            <>
                              <div><span className="text-gray-400 text-sm block flex items-center gap-1"><Building2 className="w-3 h-3"/> Company</span> <span className="font-medium text-gray-800">{profile.company_name || 'N/A'}</span></div>
                              <div><span className="text-gray-400 text-sm block">Designation</span> <span className="font-medium text-gray-800">{profile.designation || 'N/A'}</span></div>
                            </>
                          )}
                          {profile.occupation_type === 'Business' && (
                            <>
                              <div><span className="text-gray-400 text-sm block flex items-center gap-1"><Store className="w-3 h-3"/> Business</span> <span className="font-medium text-gray-800">{profile.business_name || 'N/A'}</span></div>
                              <div><span className="text-gray-400 text-sm block">Category</span> <span className="font-medium text-gray-800">{profile.business_category || 'N/A'}</span></div>
                            </>
                          )}
                          <div><span className="text-gray-400 text-sm block">{profile.occupation_type === 'Business' ? 'Turnover' : 'Salary'}</span> <span className="font-medium text-gray-800">{profile.salary || 'N/A'}</span></div>
                       </div>
                    </section>

                    {/* Location */}
                    <section>
                       <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-rose-100 pb-2 flex items-center gap-2"><MapPinHouse className="w-5 h-5"/> Location Details</h3>
                       <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                          <div><span className="text-gray-400 text-sm block">Birth Place</span> <span className="font-medium text-gray-800">{profile.birthPlace || 'N/A'}</span></div>
                          <div><span className="text-gray-400 text-sm block">Birth Time</span> <span className="font-medium text-gray-800">{profile.birthTime || 'N/A'}</span></div>
                          <div><span className="text-gray-400 text-sm block">Native</span> <span className="font-medium text-gray-800">{profile.nativeCity}, {profile.nativeState}, {profile.nativeCountry}</span></div>
                          <div><span className="text-gray-400 text-sm block">Current</span> <span className="font-medium text-gray-800">{profile.currentCity}, {profile.currentState}, {profile.currentCountry}</span></div>
                       </div>
                    </section>

                     <section>
                       <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-rose-100 pb-2 flex items-center gap-2"><Users className="w-5 h-5"/> Family Background</h3>
                       <div className="bg-orange-50/50 rounded-xl p-4 space-y-3">
                          <p><span className="font-semibold text-gray-700">Father:</span> {profile.father.title} {profile.father.name} ({profile.father.occupation})</p>
                          <p><span className="font-semibold text-gray-700">Mother:</span> {profile.mother.title} {profile.mother.name} ({profile.mother.occupation})</p>
                          <p><span className="font-semibold text-gray-700">Maternal Side:</span> {profile.paternalSide.caste} - {profile.paternalSide.gotra}</p>
                          <p><span className="font-semibold text-gray-700">Siblings:</span> {profile.siblings.length > 0 ? `${profile.siblings.length} siblings` : "None"}</p>
                          {profile.healthIssues.length > 0 && (
                            <p><span className="font-semibold text-gray-700">Health Notes:</span> {profile.healthIssues.join(', ')}</p>
                          )}
                       </div>
                    </section>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-rose-100 p-6">
                       <h3 className="font-bold text-rose-600 mb-4 flex items-center gap-2"><Heart className="w-5 h-5 fill-current"/> Partner Preference</h3>
                       <div className="space-y-3">
                          <div><span className="text-gray-400 text-xs uppercase font-bold">Age Range</span> <div className="font-medium">{profile.partnerAgeMin} - {profile.partnerAgeMax} Years</div></div>
                          <div><span className="text-gray-400 text-xs uppercase font-bold">Expectations</span> 
                             <ul className="mt-2 space-y-1">
                                {profile.expectations.map((ex, i) => <li key={i} className="text-sm text-gray-600 flex items-start gap-2"><div className="w-1.5 h-1.5 bg-rose-400 rounded-full mt-1.5 shrink-0"></div>{ex}</li>)}
                                {profile.expectations.length === 0 && <li className="text-sm text-gray-400 italic">None listed</li>}
                             </ul>
                          </div>
                       </div>
                    </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}
