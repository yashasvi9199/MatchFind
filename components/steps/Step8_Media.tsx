import { useRef, ChangeEvent } from 'react';
import { ProfileData } from '../../types';
import { Label, SectionTitle } from '../common/FormComponents';
import { Upload, Users, ExternalLink } from 'lucide-react';

interface Props {
  data: ProfileData;
  update: (field: keyof ProfileData, value: string) => void;
  avatarFile: File | null;
  setAvatarFile: (file: File | null) => void;
}

export default function Step8_Media({ data, update, avatarFile, setAvatarFile }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      console.log(`[Media] File selected: ${e.target.files[0].name}`);
      setAvatarFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <SectionTitle>Profile Media & Bio</SectionTitle>
      
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <Label>Short Bio</Label>
          <textarea 
              className="w-full rounded-xl border border-gray-200 p-3 text-sm transition-all focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 bg-white shadow-sm h-32 resize-none" 
              value={data.bio} 
              onChange={e => update('bio', e.target.value)} 
              placeholder="Tell us about yourself, hobbies, and personality..." 
          />
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <Label className="mb-4">Profile Photo</Label>
        
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="group relative h-72 w-full border-2 border-dashed border-rose-200 rounded-2xl bg-rose-50/30 hover:bg-rose-50 transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden"
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
          
          {avatarFile ? (
            <>
              <img 
                src={URL.createObjectURL(avatarFile)} 
                alt="Preview" 
                className="h-full w-full object-contain"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                <p className="text-white font-bold flex items-center bg-white/20 px-4 py-2 rounded-full"><Upload className="w-5 h-5 mr-2" /> Change Photo</p>
              </div>
            </>
          ) : (
            <div className="text-center p-6">
              <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-rose-200 transition-all shadow-sm">
                <Upload className="h-8 w-8 text-rose-600" />
              </div>
              <p className="text-xl font-bold text-gray-800">Click to upload photo</p>
              <p className="text-sm text-gray-500 mt-1">High quality, front facing (Max 5MB)</p>
            </div>
          )}
        </div>

        {avatarFile && (
          <div className="flex gap-4 mt-4 justify-center">
             <button 
               type="button" 
               onClick={(e) => { e.stopPropagation(); setAvatarFile(null); }}
               className="text-sm text-red-600 hover:text-red-700 font-semibold bg-red-50 px-3 py-1 rounded-lg border border-red-100"
             >
               Remove
             </button>
             <button 
               type="button"
               onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
               className="text-sm text-rose-600 hover:text-rose-700 font-semibold bg-rose-50 px-3 py-1 rounded-lg border border-rose-100"
             >
               Change
             </button>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
        <h4 className="font-bold text-lg flex items-center relative z-10">
           <div className="bg-white/20 p-2 rounded-lg mr-3">
             <Users className="w-5 h-5" />
           </div>
           AI Photo Analysis
        </h4>
        <p className="text-indigo-100 mt-2 mb-4 text-sm relative z-10 max-w-md">
          Want to know how appealing your profile picture is? Use our AI tool to get instant feedback before you upload.
        </p>
        <a 
          href="https://yashasvi9199.github.io/style-glow-ai/" 
          target="_blank" 
          rel="noreferrer"
          className="inline-flex items-center text-sm font-bold bg-white text-indigo-600 px-5 py-2.5 rounded-xl hover:bg-indigo-50 transition-colors shadow-md relative z-10"
        >
          Analyze Now <ExternalLink className="h-4 w-4 ml-2" />
        </a>
      </div>
    </div>
  );
}
