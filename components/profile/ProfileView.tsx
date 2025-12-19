import { useState } from 'react';
import { ProfileData } from '../../types';
import { User as UserIcon, MapPinHouse, Calendar, Heart, LogOut, Mail, Phone, MoveVertical, Briefcase, GraduationCap, Building2, Store, Utensils, Droplet, Users, ZoomIn, X, SquarePen } from 'lucide-react';

interface Props {
  data: ProfileData;
  avatarUrl: string | null;
  avatarFile: File | null;
  onEdit: () => void;
  onLogout: () => void;
  isProfileComplete?: boolean;
  onRestrictedAction?: () => void;
}

export default function ProfileView({ data, avatarUrl, avatarFile, onEdit, onLogout, isProfileComplete = true, onRestrictedAction }: Props) {
  const displayImage = avatarUrl || (avatarFile ? URL.createObjectURL(avatarFile) : null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [editingField, setEditingField] = useState<{label: string, field: keyof ProfileData} | null>(null);

  const handlePartialEdit = (label: string, field: keyof ProfileData) => {
    if (!isProfileComplete && onRestrictedAction) {
        onRestrictedAction();
        return;
    }
    setEditingField({ label, field });
  };

  // Build occupation display string
  const getOccupationDisplay = () => {
    if (data.occupation_type === 'Job') {
      return `${data.designation || 'Employee'} at ${data.company_name || 'Company'}`;
    } else if (data.occupation_type === 'Business') {
      return `${data.business_name || 'Business'} (${data.business_category || 'Category'})`;
    }
    return data.occupation || 'Not specified';
  };

  return (
    <div className="animate-fadeIn max-w-4xl mx-auto space-y-8">
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
                  <h1 className="text-3xl font-bold text-gray-800">{data.title} {data.name}</h1>
                  <p className="text-rose-600 font-medium text-lg mt-1">{getOccupationDisplay()}</p>
                   <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                       <span className="flex items-center gap-1"><MapPinHouse className="w-4 h-4"/> {data.currentCity}, {data.currentCountry}</span>
                       <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> {data.age} Years</span>
                       <span className="flex items-center gap-1 cursor-pointer hover:text-rose-600 transition-colors" onClick={() => handlePartialEdit('Height', 'height')}>
                          <MoveVertical className="w-4 h-4"/> {data.height} ft
                          {isProfileComplete && <SquarePen className="w-3 h-3 ml-1 opacity-50" />}
                       </span>
                   </div>
                </div>
                <div className="flex flex-col gap-2 w-full md:w-auto relative z-20">
                    <button onClick={onEdit} className="w-full md:w-auto bg-rose-50 text-rose-600 px-4 py-2 rounded-xl font-bold hover:bg-rose-100 transition-colors text-center">Edit Profile</button>
                    <button onClick={onLogout} className="md:hidden flex items-center justify-center bg-gray-50 text-gray-600 px-4 py-2 rounded-xl font-bold hover:bg-gray-100 transition-colors w-full md:w-auto">
                        <LogOut className="w-4 h-4 mr-2" /> Sign Out
                    </button>
                </div>
             </div>

             {/* Contact Info */}
             <div className="mt-6 flex flex-wrap gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 text-sm cursor-pointer hover:text-rose-600 transition-colors" onClick={() => handlePartialEdit('Email', 'email')}>
                   <Mail className="w-4 h-4 text-rose-500" />
                   <span className="text-gray-600">{data.email || 'No email provided'}</span>
                   {isProfileComplete && <SquarePen className="w-3 h-3 opacity-50" />}
                </div>
                <div className="flex items-center gap-2 text-sm cursor-pointer hover:text-rose-600 transition-colors" onClick={() => handlePartialEdit('Phone', 'phone')}>
                   <Phone className="w-4 h-4 text-rose-500" />
                   <span className="text-gray-600">{data.phone || 'No phone provided'}</span>
                   {isProfileComplete && <SquarePen className="w-3 h-3 opacity-50" />}
                </div>
             </div>

             <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    <section>
                       <h3 className="text-lg font-bold text-gray-800 mb-2 border-b border-rose-100 pb-2 flex items-center justify-between">
                          About Me
                          {isProfileComplete && <SquarePen className="w-4 h-4 text-rose-400 cursor-pointer hover:text-rose-600 transition-colors" onClick={() => handlePartialEdit('Bio', 'bio')} />}
                       </h3>
                       <p className="text-gray-600 leading-relaxed">{data.bio || "No bio provided."}</p>
                    </section>

                    {/* Basic Details */}
                    <section>
                       <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-rose-100 pb-2">Personal Details</h3>
                       <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                          <div>
                             <span className="text-gray-400 text-sm block">Caste / Gotra</span> 
                             <span className="font-medium text-gray-800">{data.caste || 'N/A'} / {data.gotra || 'N/A'}</span>
                          </div>
                          <div><span className="text-gray-400 text-sm block">Gender</span> <span className="font-medium text-gray-800">{data.gender}</span></div>
                          <div className="cursor-pointer group" onClick={() => handlePartialEdit('Height', 'height')}>
                             <span className="text-gray-400 text-sm flex items-center gap-1 group-hover:text-rose-500 transition-colors">
                                <MoveVertical className="w-3 h-3"/> Height {isProfileComplete && <SquarePen className="w-3 h-3 opacity-50" />}
                             </span> 
                             <span className="font-medium text-gray-800">{data.height} ft</span>
                          </div>
                          <div className="cursor-pointer group" onClick={() => handlePartialEdit('Weight', 'weight')}>
                             <span className="text-gray-400 text-sm block group-hover:text-rose-500 transition-colors">
                                Weight {isProfileComplete && <SquarePen className="w-3 h-3 opacity-50" />}
                             </span> 
                             <span className="font-medium text-gray-800">{data.weight} kg</span>
                          </div>
                          <div className="cursor-pointer group" onClick={() => handlePartialEdit('Blood Group', 'bloodGroup')}>
                             <span className="text-gray-400 text-sm flex items-center gap-1 group-hover:text-rose-500 transition-colors">
                                <Droplet className="w-3 h-3"/> Blood Group {isProfileComplete && <SquarePen className="w-3 h-3 opacity-50" />}
                             </span> 
                             <span className="font-medium text-gray-800">{data.bloodGroup || 'N/A'}</span>
                          </div>
                          <div className="cursor-pointer group" onClick={() => handlePartialEdit('Skin Color', 'skinColor')}>
                             <span className="text-gray-400 text-sm block group-hover:text-rose-500 transition-colors">
                                Skin Color {isProfileComplete && <SquarePen className="w-3 h-3 opacity-50" />}
                             </span> 
                             <span className="font-medium text-gray-800">{data.skinColor || 'N/A'}</span>
                          </div>
                          <div className="cursor-pointer group" onClick={() => handlePartialEdit('Diet', 'diet')}>
                             <span className="text-gray-400 text-sm flex items-center gap-1 group-hover:text-rose-500 transition-colors">
                                <Utensils className="w-3 h-3"/> Diet {isProfileComplete && <SquarePen className="w-3 h-3 opacity-50" />}
                             </span> 
                             <span className="font-medium text-gray-800">{data.diet}</span>
                          </div>
                       </div>
                    </section>

                    {/* Education & Career */}
                    <section>
                       <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-rose-100 pb-2 flex items-center justify-between">
                          <span className="flex items-center gap-2"><GraduationCap className="w-5 h-5"/> Education & Career</span>
                          {isProfileComplete && <SquarePen className="w-4 h-4 text-rose-400 cursor-pointer hover:text-rose-600 transition-colors" onClick={() => handlePartialEdit('Education & Career', 'occupation_type')} />}
                       </h3>
                       <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                          <div><span className="text-gray-400 text-sm block">Education Level</span> <span className="font-medium text-gray-800">{data.educationLevel || 'N/A'}</span></div>
                          <div><span className="text-gray-400 text-sm block">Stream</span> <span className="font-medium text-gray-800">{data.educationStream || 'N/A'}</span></div>
                          <div><span className="text-gray-400 text-sm block">Degree</span> <span className="font-medium text-gray-800">{data.educationDegree || 'N/A'}</span></div>
                          <div><span className="text-gray-400 text-sm block">Occupation Type</span> <span className="font-medium text-gray-800">{data.occupation_type || 'N/A'}</span></div>
                          {data.occupation_type === 'Job' && (
                            <>
                              <div><span className="text-gray-400 text-sm block flex items-center gap-1"><Building2 className="w-3 h-3"/> Company</span> <span className="font-medium text-gray-800">{data.company_name || 'N/A'}</span></div>
                              <div><span className="text-gray-400 text-sm block">Designation</span> <span className="font-medium text-gray-800">{data.designation || 'N/A'}</span></div>
                            </>
                          )}
                          {data.occupation_type === 'Business' && (
                            <>
                              <div><span className="text-gray-400 text-sm block flex items-center gap-1"><Store className="w-3 h-3"/> Business</span> <span className="font-medium text-gray-800">{data.business_name || 'N/A'}</span></div>
                              <div><span className="text-gray-400 text-sm block">Category</span> <span className="font-medium text-gray-800">{data.business_category || 'N/A'}</span></div>
                            </>
                          )}
                          <div><span className="text-gray-400 text-sm block">{data.occupation_type === 'Business' ? 'Turnover' : 'Salary'}</span> <span className="font-medium text-gray-800">{data.salary || 'N/A'}</span></div>
                       </div>
                    </section>

                    {/* Location */}
                    <section>
                       <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-rose-100 pb-2 flex items-center justify-between">
                          <span className="flex items-center gap-2"><MapPinHouse className="w-5 h-5"/> Location Details</span>
                          {isProfileComplete && <SquarePen className="w-4 h-4 text-rose-400 cursor-pointer hover:text-rose-600 transition-colors" onClick={() => handlePartialEdit('Location', 'currentCity')} />}
                       </h3>
                       <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                          <div><span className="text-gray-400 text-sm block">Birth Place</span> <span className="font-medium text-gray-800">{data.birthPlace || 'N/A'}</span></div>
                          <div><span className="text-gray-400 text-sm block">Birth Time</span> <span className="font-medium text-gray-800">{data.birthTime || 'N/A'}</span></div>
                          <div><span className="text-gray-400 text-sm block">Native</span> <span className="font-medium text-gray-800">{data.nativeCity}, {data.nativeState}, {data.nativeCountry}</span></div>
                          <div><span className="text-gray-400 text-sm block">Current</span> <span className="font-medium text-gray-800">{data.currentCity}, {data.currentState}, {data.currentCountry}</span></div>
                       </div>
                    </section>

                     <section>
                       <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-rose-100 pb-2 flex items-center justify-between">
                          <span className="flex items-center gap-2"><Users className="w-5 h-5"/> Family Background</span>
                          {isProfileComplete && <SquarePen className="w-4 h-4 text-rose-400 cursor-pointer hover:text-rose-600 transition-colors" onClick={() => handlePartialEdit('Family', 'father')} />}
                       </h3>
                       <div className="bg-orange-50/50 rounded-xl p-4 space-y-3">
                          <p><span className="font-semibold text-gray-700">Father:</span> {data.father.title} {data.father.name} ({data.father.occupation})</p>
                          <p><span className="font-semibold text-gray-700">Mother:</span> {data.mother.title} {data.mother.name} ({data.mother.occupation})</p>
                          <p><span className="font-semibold text-gray-700">Maternal Side:</span> {data.paternalSide.caste} - {data.paternalSide.gotra}</p>
                          <p><span className="font-semibold text-gray-700">Siblings:</span> {data.siblings.length > 0 ? `${data.siblings.length} siblings` : "None"}</p>
                          {data.healthIssues.length > 0 && (
                            <p><span className="font-semibold text-gray-700">Health Notes:</span> {data.healthIssues.join(', ')}</p>
                          )}
                       </div>
                    </section>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-rose-100 p-6">
                       <h3 className="font-bold text-rose-600 mb-4 flex items-center justify-between">
                          <span className="flex items-center gap-2"><Heart className="w-5 h-5 fill-current"/> Partner Preference</span>
                          {isProfileComplete && <SquarePen className="w-4 h-4 text-rose-400 cursor-pointer hover:text-rose-600 transition-colors" onClick={() => handlePartialEdit('Preferences', 'partnerAgeMin')} />}
                       </h3>
                       <div className="space-y-3">
                          <div><span className="text-gray-400 text-xs uppercase font-bold">Age Range</span> <div className="font-medium">{data.partnerAgeMin} - {data.partnerAgeMax} Years</div></div>
                          <div><span className="text-gray-400 text-xs uppercase font-bold">Expectations</span> 
                             <ul className="mt-2 space-y-1">
                                {data.expectations.map((ex, i) => <li key={i} className="text-sm text-gray-600 flex items-start gap-2"><div className="w-1.5 h-1.5 bg-rose-400 rounded-full mt-1.5 shrink-0"></div>{ex}</li>)}
                                {data.expectations.length === 0 && <li className="text-sm text-gray-400 italic">None listed</li>}
                             </ul>
                          </div>
                       </div>
                    </div>
                </div>
             </div>
          </div>
       </div>

       {/* Partial Edit Modal */}
       {editingField && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scaleIn">
                <div className="bg-gradient-to-r from-rose-500 to-orange-500 px-6 py-4 flex justify-between items-center text-white">
                    <h3 className="text-lg font-bold">Edit {editingField.label}</h3>
                    <button onClick={() => setEditingField(null)} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6">
                    <p className="text-gray-500 text-sm mb-4">You can edit your {editingField.label.toLowerCase()} here. For complex changes, please use the full "Edit Profile" button.</p>
                    <div className="bg-rose-50 p-4 rounded-xl border border-rose-100 flex items-center justify-center text-center">
                        <div>
                            <p className="text-rose-600 font-bold mb-2">Redirect to Full Editor?</p>
                            <p className="text-xs text-rose-400 mb-4">Partial editing is a shortcut to the relevant step in your profile wizard.</p>
                            <button 
                                onClick={() => {
                                    setEditingField(null);
                                    onEdit();
                                }}
                                className="w-full bg-rose-500 text-white font-bold py-2 rounded-lg shadow-lg shadow-rose-200 hover:bg-rose-600 transition-colors"
                            >
                                Go to {editingField.label} Editor
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
       )}
    </div>
  );
}
