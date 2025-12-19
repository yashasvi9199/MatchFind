import { useState, useEffect } from 'react';
import { ProfileData } from '../../types';
import { INDIAN_STATES } from '../../constants/data';
import { Input, Label, SectionTitle } from '../common/FormComponents';
import Autocomplete from '../common/Autocomplete';
import TimePicker from '../common/TimePicker';
import { Clock, MapPin, Briefcase } from 'lucide-react';

interface Props {
  data: ProfileData;
  update: (field: keyof ProfileData, value: string) => void;
}

export default function Step3_Location({ data, update }: Props) {
  const [sameAsNative, setSameAsNative] = useState(false);

  // Sync effect for Same As Native
  useEffect(() => {
    if (sameAsNative) {
      console.log('[Location] Syncing Current with Native');
      update('currentCountry', data.nativeCountry);
      update('currentState', data.nativeState);
      update('currentCity', data.nativeCity);
    }
  }, [sameAsNative, data.nativeCountry, data.nativeState, data.nativeCity, update]); 

  const isIndiaNative = data.nativeCountry?.toUpperCase() === 'INDIA';
  const isIndiaCurrent = data.currentCountry?.toUpperCase() === 'INDIA';

  // Helper for Alphabets Only
  const handleAlphaInput = (field: keyof ProfileData, val: string) => {
    const clean = val.replace(/[^a-zA-Z\s]/g, '');
    update(field, clean);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Birth Info */}
      <div>
        <SectionTitle icon={<Clock className="w-5 h-5"/>}>Birth Details</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div>
            <Label>Birth Place (City/Town)</Label>
            <Input value={data.birthPlace} onChange={e => handleAlphaInput('birthPlace', e.target.value)} placeholder="Only alphabets" />
          </div>
          <div>
            <Label>Birth Time</Label>
            <TimePicker value={data.birthTime} onChange={val => update('birthTime', val)} />
          </div>
        </div>
      </div>

      {/* Native Location */}
      <div>
        <SectionTitle icon={<MapPin className="w-5 h-5"/>}>Native Place</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
           <div>
              <Label>Country</Label>
              <Input 
                value={data.nativeCountry} 
                onChange={e => handleAlphaInput('nativeCountry', e.target.value)} 
                placeholder="e.g. INDIA" 
              />
           </div>
           <div>
              <Label>State</Label>
              {isIndiaNative ? (
                 <Autocomplete
                    value={data.nativeState}
                    onChange={val => update('nativeState', val)}
                    options={INDIAN_STATES}
                    placeholder="Type or select state..."
                 />
              ) : (
                 <Input value={data.nativeState} onChange={e => handleAlphaInput('nativeState', e.target.value)} placeholder="State/Province" />
              )}
           </div>
           <div>
              <Label>City</Label>
              <Input value={data.nativeCity} onChange={e => handleAlphaInput('nativeCity', e.target.value)} placeholder="City name" />
           </div>
        </div>
      </div>

      {/* Current Location */}
      <div>
        <div className="flex justify-between items-center mb-2">
           <h3 className="text-xl font-bold text-rose-700 flex items-center gap-2"><Briefcase className="w-5 h-5"/> Current Residence</h3>
           <label className="flex items-center text-sm text-gray-600 bg-orange-50 px-3 py-1.5 rounded-full cursor-pointer hover:bg-orange-100 transition-colors border border-orange-100">
              <input type="checkbox" className="mr-2 rounded text-rose-600 focus:ring-rose-500" checked={sameAsNative} onChange={e => setSameAsNative(e.target.checked)} />
              Same as Native
           </label>
        </div>
        
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-2xl border border-gray-100 shadow-sm transition-all duration-300 ${sameAsNative ? 'bg-gray-100 opacity-80 pointer-events-none select-none' : 'bg-white'}`}>
           <div>
              <Label>Country</Label>
              <Input 
                value={data.currentCountry} 
                onChange={e => handleAlphaInput('currentCountry', e.target.value)} 
                placeholder="e.g. INDIA" 
                disabled={sameAsNative}
              />
           </div>
           <div>
              <Label>State</Label>
              {isIndiaCurrent && !sameAsNative ? (
                 <Autocomplete
                    value={data.currentState}
                    onChange={val => update('currentState', val)}
                    options={INDIAN_STATES}
                    placeholder="Type or select state..."
                    disabled={sameAsNative}
                 />
              ) : (
                 <Input 
                   value={data.currentState} 
                   onChange={e => handleAlphaInput('currentState', e.target.value)} 
                   placeholder="State/Province"
                   disabled={sameAsNative}
                 />
              )}
           </div>
           <div>
              <Label>City</Label>
              <Input 
                value={data.currentCity} 
                onChange={e => handleAlphaInput('currentCity', e.target.value)} 
                placeholder="City name"
                disabled={sameAsNative}
              />
           </div>
        </div>
      </div>
    </div>
  );
}
