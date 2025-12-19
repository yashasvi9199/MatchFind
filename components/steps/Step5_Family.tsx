import { useRef, useEffect } from 'react';
import { ProfileData, FamilyMember } from '../../types';
import { TITLES, CASTES, GOTRA_MAP } from '../../constants/data';
import { Input, Select, Label, SectionTitle } from '../common/FormComponents';
import Autocomplete from '../common/Autocomplete';
import { Users, Plus, Trash2, Check, Pencil, X } from 'lucide-react';
import { sanitizeInput } from '../../utils/helpers';

interface Props {
  data: ProfileData;
  updateFamily: (relation: 'father' | 'mother' | 'paternalSide', field: keyof FamilyMember, value: string) => void;
  siblings: FamilyMember[];
  setSiblings: (val: FamilyMember[]) => void;
  editingSiblingIndex: number | null;
  setEditingSiblingIndex: (idx: number | null) => void;
}

export default function Step5_Family({ data, updateFamily, siblings, setSiblings, editingSiblingIndex, setEditingSiblingIndex }: Props) {
  const siblingsEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when adding new sibling
  useEffect(() => {
    if (editingSiblingIndex !== null && editingSiblingIndex === siblings.length - 1) {
        siblingsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [siblings.length, editingSiblingIndex]);

  const addSibling = () => {
    if (editingSiblingIndex !== null) return; 
    const newSib = { title: 'Mr', name: '', gotra: '', caste: '', occupation: '' };
    setSiblings([...siblings, newSib]);
    setEditingSiblingIndex(siblings.length);
  };

  // Title Case Helper for siblings
  const toTitleCaseSibling = (str: string) => {
    return str.replace(/[^a-zA-Z\s]/g, '').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  };

  const updateSibling = (index: number, field: keyof FamilyMember, value: string) => {
    let sanitized = sanitizeInput(value);
    // Apply validation for Name and Occupation - use Title Case
    if (field === 'name' || field === 'occupation') {
        sanitized = toTitleCaseSibling(sanitized);
    }
    const updated = [...siblings];
    updated[index] = { ...updated[index], [field]: sanitized };
    setSiblings(updated);
  };

  const removeSibling = (index: number) => {
    setSiblings(siblings.filter((_, i) => i !== index));
    if (editingSiblingIndex === index) setEditingSiblingIndex(null);
  };

  const saveSibling = (index: number) => {
    const sib = siblings[index];
    if(!sib.name || !sib.occupation) {
        alert("Please fill sibling Name and Occupation (Alphabets only)");
        return;
    }
    setEditingSiblingIndex(null);
  };

  // Title Case Helper: Capitalizes first letter of each word
  const toTitleCase = (str: string) => {
    return str.replace(/[^a-zA-Z\s]/g, '').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  };

  const handleFamilyText = (relation: 'father' | 'mother' | 'paternalSide', field: keyof FamilyMember, val: string) => {
      const clean = toTitleCase(val);
      updateFamily(relation, field, clean);
  };

  const renderRelative = (label: string, relation: 'father' | 'mother' | 'paternalSide') => {
    const relCaste = data[relation].caste;
    const relGotras = relCaste ? (GOTRA_MAP[relCaste] || []) : [];
    const isNanihaal = relation === 'paternalSide';
    const showCasteGotra = isNanihaal; // Only show caste/gotra for Nanihaal (maternal side)
    
    return (
      <div className="p-5 bg-orange-50/50 rounded-2xl border border-orange-100 mb-6 shadow-sm hover:shadow-md transition-shadow">
        <h4 className="font-bold text-rose-700 mb-4 flex items-center">
            <div className="w-2 h-6 bg-rose-500 rounded-full mr-3"></div>
            {label}
        </h4>
        <div className="grid grid-cols-12 gap-3">
          {!isNanihaal && (
            <>
              <div className="col-span-4 sm:col-span-2">
                <Label className="text-xs text-gray-500 uppercase">Title</Label>
                <Select className="py-2 text-sm" value={data[relation].title} onChange={e => updateFamily(relation, 'title', e.target.value)}>
                  <option value="">-- Select --</option>
                  {TITLES.map(t => <option key={t} value={t}>{t}</option>)}
                </Select>
              </div>
              <div className="col-span-8 sm:col-span-10">
                <Label className="text-xs text-gray-500 uppercase">Name *</Label>
                <Input 
                    className="py-2 text-sm" 
                    placeholder="Full Name" 
                    value={data[relation].name} 
                    onChange={e => handleFamilyText(relation, 'name', e.target.value)} 
                />
              </div>
            </>
          )}
          
          {/* Only show Caste/Gotra for Nanihaal (Maternal Side) */}
          {showCasteGotra && (
            <>
              <div className="col-span-6">
                 <Autocomplete 
                    label="Caste"
                    className="text-xs"
                    placeholder="Select Caste"
                    value={data[relation].caste}
                    options={CASTES}
                    onChange={val => {
                        updateFamily(relation, 'caste', val);
                        updateFamily(relation, 'gotra', '');
                    }}
                 />
              </div>
              <div className="col-span-6">
                 <Autocomplete
                    label="Gotra"
                    className="text-xs"
                    placeholder="Select Gotra"
                    value={data[relation].gotra}
                    options={relGotras}
                    onChange={val => updateFamily(relation, 'gotra', val)}
                    disabled={!relCaste}
                 />
              </div>
            </>
          )}
          
          {!isNanihaal && (
            <div className="col-span-12">
                <Label className="text-xs text-gray-500 uppercase">Occupation / Details *</Label>
                <Input 
                    className="py-2 text-sm" 
                    placeholder="Profession" 
                    value={data[relation].occupation} 
                    onChange={e => handleFamilyText(relation, 'occupation', e.target.value)} 
                />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 animate-fadeIn max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
      <SectionTitle>Family Background</SectionTitle>
      {renderRelative("Father's Details", 'father')}
      {renderRelative("Mother's Details", 'mother')}
      {renderRelative("Maternal Side (Nanihaal)", 'paternalSide')}
      
      <div className="mt-8 p-5 bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
          <h4 className="font-bold text-rose-700 flex items-center gap-2"><Users className="w-5 h-5"/> Siblings</h4>
          <button 
            type="button" 
            onClick={addSibling} 
            disabled={editingSiblingIndex !== null}
            className="text-xs bg-rose-100 text-rose-700 px-3 py-1.5 rounded-full hover:bg-rose-200 flex items-center font-bold transition-colors disabled:opacity-50"
          >
            <Plus className="h-3 w-3 mr-1" /> Add Sibling
          </button>
        </div>

        <div className="space-y-4">
          {siblings.map((sib, idx) => {
            const isEditing = editingSiblingIndex === idx;
            if (isEditing) {
              return (
                <div key={idx} ref={siblingsEndRef} className="bg-orange-50 p-4 rounded-xl border border-orange-200 animate-fadeIn relative scroll-mt-24">
                   <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-bold text-orange-600 uppercase tracking-wide">Editing Sibling {idx + 1}</span>
                      <button onClick={() => removeSibling(idx)} className="text-red-500 p-1 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4"/></button>
                   </div>
                   <div className="grid grid-cols-12 gap-3">
                     <div className="col-span-3">
                       <Label className="text-[10px] text-gray-400 uppercase">Title</Label>
                       <Select className="py-1.5 text-xs" value={sib.title} onChange={e => updateSibling(idx, 'title', e.target.value)}>
                         <option value="">-- Select --</option>
                         {TITLES.map(t => <option key={t} value={t}>{t}</option>)}
                       </Select>
                     </div>
                     <div className="col-span-9">
                       <Label className="text-[10px] text-gray-400 uppercase">Name *</Label>
                       <Input className="py-1.5 text-xs" placeholder="Name" value={sib.name} onChange={e => updateSibling(idx, 'name', e.target.value)} />
                     </div>
                     <div className="col-span-12">
                       <Label className="text-[10px] text-gray-400 uppercase">Occupation *</Label>
                       <Input className="py-1.5 text-xs" placeholder="Occupation" value={sib.occupation} onChange={e => updateSibling(idx, 'occupation', e.target.value)} />
                     </div>
                   </div>
                   <div className="mt-3 flex justify-end">
                      <button onClick={() => saveSibling(idx)} className="flex items-center text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-green-700 shadow-sm">
                         <Check className="w-3 h-3 mr-1" /> Save
                      </button>
                   </div>
                </div>
              );
            } else {
              return (
                <div key={idx} className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                   <div>
                      <p className="font-bold text-gray-800 text-sm">{sib.title} {sib.name || 'Unnamed'}</p>
                      <p className="text-xs text-gray-500">{sib.occupation || 'No occupation listed'}</p>
                   </div>
                   <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {editingSiblingIndex === null && (
                          <>
                            <button onClick={() => setEditingSiblingIndex(idx)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
                                <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => removeSibling(idx)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                          </>
                      )}
                   </div>
                </div>
              );
            }
          })}
        </div>
        {siblings.length === 0 && <p className="text-sm text-gray-400 italic text-center py-4">No siblings added yet.</p>}
      </div>
    </div>
  );
}
