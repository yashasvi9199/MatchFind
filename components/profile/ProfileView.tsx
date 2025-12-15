import React from 'react';
import { ProfileData } from '../../types';
import { User as UserIcon, MapPin, Calendar, Heart } from 'lucide-react';

interface Props {
  data: ProfileData;
  avatarUrl: string | null;
  avatarFile: File | null;
  onEdit: () => void;
}

export default function ProfileView({ data, avatarUrl, avatarFile, onEdit }: Props) {
  const displayImage = avatarUrl || (avatarFile ? URL.createObjectURL(avatarFile) : null);

  return (
    <div className="animate-fadeIn max-w-4xl mx-auto space-y-8">
       <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-rose-100">
          <div className="h-48 bg-gradient-to-r from-rose-400 to-orange-400 relative">
             <div className="absolute -bottom-16 left-8 p-1 bg-white rounded-full shadow-lg">
                {displayImage ? (
                   <img src={displayImage} className="w-32 h-32 rounded-full object-cover border-4 border-white" alt="Profile" />
                ) : (
                   <div className="w-32 h-32 rounded-full bg-rose-100 flex items-center justify-center border-4 border-white">
                      <UserIcon className="w-12 h-12 text-rose-300" />
                   </div>
                )}
             </div>
          </div>
          
          <div className="pt-20 px-8 pb-8">
             <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">{data.title} {data.name}</h1>
                  <p className="text-rose-600 font-medium text-lg mt-1">{data.occupation}</p>
                  <div className="flex gap-4 mt-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> {data.currentCity}, {data.currentCountry}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> {data.age} Years, {data.height}</span>
                  </div>
                </div>
                <button onClick={onEdit} className="bg-rose-50 text-rose-600 px-4 py-2 rounded-xl font-bold hover:bg-rose-100 transition-colors">Edit Profile</button>
             </div>

             <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    <section>
                       <h3 className="text-lg font-bold text-gray-800 mb-2 border-b border-rose-100 pb-2">About Me</h3>
                       <p className="text-gray-600 leading-relaxed">{data.bio || "No bio provided."}</p>
                    </section>

                    <section>
                       <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-rose-100 pb-2">Personal Details</h3>
                       <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                          <div><span className="text-gray-400 text-sm block">Caste / Gotra</span> <span className="font-medium text-gray-800">{data.caste} / {data.gotra || 'N/A'}</span></div>
                          <div><span className="text-gray-400 text-sm block">Education</span> <span className="font-medium text-gray-800">{data.educationLevel}</span></div>
                          <div><span className="text-gray-400 text-sm block">Salary</span> <span className="font-medium text-gray-800">{data.salary}</span></div>
                          <div><span className="text-gray-400 text-sm block">Diet</span> <span className="font-medium text-gray-800">{data.diet}</span></div>
                          <div><span className="text-gray-400 text-sm block">Birth Time</span> <span className="font-medium text-gray-800">{data.birthTime || 'N/A'}</span></div>
                          <div><span className="text-gray-400 text-sm block">Birth Place</span> <span className="font-medium text-gray-800">{data.birthPlace || 'N/A'}</span></div>
                       </div>
                    </section>

                     <section>
                       <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-rose-100 pb-2">Family Background</h3>
                       <div className="bg-orange-50/50 rounded-xl p-4 space-y-3">
                          <p><span className="font-semibold text-gray-700">Father:</span> {data.father.name} ({data.father.occupation})</p>
                          <p><span className="font-semibold text-gray-700">Mother:</span> {data.mother.name} ({data.mother.occupation})</p>
                          <p><span className="font-semibold text-gray-700">Siblings:</span> {data.siblings.length > 0 ? `${data.siblings.length} siblings` : "None"}</p>
                       </div>
                    </section>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-rose-100 p-6">
                       <h3 className="font-bold text-rose-600 mb-4 flex items-center gap-2"><Heart className="w-5 h-5 fill-current"/> Partner Preference</h3>
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
    </div>
  );
}
