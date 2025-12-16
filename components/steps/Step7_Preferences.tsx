import { useState } from 'react';
import { ProfileData } from '../../types';
import { Input, Label, SectionTitle } from '../common/FormComponents';
import { X } from 'lucide-react';
import { sanitizeInput } from '../../utils/helpers';

interface Props {
  data: ProfileData;
  update: (field: keyof ProfileData, value: string) => void;
  setExpectations: (expectations: string[]) => void;
}

export default function Step7_Preferences({ data, update, setExpectations }: Props) {
  const [newExpectation, setNewExpectation] = useState('');
  const suggestText = data.gender === 'Male' ? "Housewife" : "Househusband";

  const addExpectation = (text: string) => {
    const sanitized = sanitizeInput(text);
    if (sanitized.split(/\s+/).length > 10) {
      alert("Please limit expectation to around 6-10 words.");
      return;
    }
    if (sanitized) {
      setExpectations([...data.expectations, sanitized]);
      setNewExpectation('');
    }
  };

  const removeExpectation = (index: number) => {
    setExpectations(data.expectations.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <SectionTitle>Partner Preferences</SectionTitle>
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <div>
            <Label>Preferred Age Range *</Label>
            <div className="flex items-center gap-4">
                <div className="w-24">
                    <Input 
                        type="number" 
                        className="text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                        placeholder="Min" 
                        value={data.partnerAgeMin} 
                        onChange={e => update('partnerAgeMin', e.target.value)} 
                    />
                </div>
                <span className="text-gray-400 font-bold">TO</span>
                <div className="w-24">
                    <Input 
                        type="number" 
                        className="text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                        placeholder="Max" 
                        value={data.partnerAgeMax} 
                        onChange={e => update('partnerAgeMax', e.target.value)} 
                    />
                </div>
            </div>
          </div>
          
          <div>
            <Label>Expectations (Max 6-10 words per point) *</Label>
            <div className="flex gap-2 mb-3">
               <Input 
                  value={newExpectation} 
                  onChange={e => setNewExpectation(e.target.value)} 
                  placeholder="E.g. Should be family oriented..."
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addExpectation(newExpectation))}
                />
                <button type="button" onClick={() => addExpectation(newExpectation)} className="bg-gray-100 text-gray-700 px-5 rounded-xl hover:bg-gray-200 font-bold border border-gray-200 transition-colors">Add</button>
            </div>
            
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider py-1.5">Suggestions:</span>
              {['Can Cook', 'Settled Abroad', 'Vegetarian', 'Professional', suggestText].map(tag => (
                <button 
                  key={tag} 
                  type="button" 
                  onClick={() => addExpectation(tag)}
                  className="text-xs bg-rose-50 text-rose-600 px-2 py-1 rounded-md border border-rose-100 hover:bg-rose-100 transition-colors font-medium"
                >
                  + {tag}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              {data.expectations.map((exp, idx) => (
                 <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 border border-gray-100 rounded-lg group">
                    <span className="text-sm text-gray-700 font-medium"><span className="text-rose-400 mr-2 font-bold">{idx + 1}.</span> {exp}</span>
                    <button onClick={() => removeExpectation(idx)} className="text-gray-300 hover:text-red-500 transition-colors"><X className="h-4 w-4" /></button>
                 </div>
              ))}
            </div>
          </div>
      </div>
    </div>
  );
}
