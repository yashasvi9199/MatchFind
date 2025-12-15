import React, { useState, useEffect } from 'react';
import { ProfileData } from '../../types';
import { TITLES, SKINS, BLOOD_GROUPS, DIETS } from '../../constants/data';
import { Input, Select, Label, SectionTitle } from '../common/FormComponents';

interface Props {
  data: ProfileData;
  update: (field: keyof ProfileData, value: string | number) => void;
}

export default function Step1_BasicInfo({ data, update }: Props) {
  // Local state for split names
  const [nameParts, setNameParts] = useState({ first: '', middle: '', last: '' });

  useEffect(() => {
    // Initialize split names from data.name
    const parts = data.name.split(' ');
    if (parts.length > 0) {
        const first = parts[0] || '';
        const last = parts.length > 1 ? parts[parts.length - 1] : '';
        const middle = parts.length > 2 ? parts.slice(1, -1).join(' ') : '';
        // Only set if different to avoid loop or overwrite on typing
        if(!nameParts.first && !nameParts.last) {
            setNameParts({ first, middle, last });
        }
    }
  }, []); // Run once on mount

  const handleNameInput = (field: 'first' | 'middle' | 'last', val: string) => {
    // 1. Alphabets and space only
    const sanitized = val.replace(/[^a-zA-Z\s]/g, '');
    
    // Update local state
    const newParts = { ...nameParts, [field]: sanitized };
    setNameParts(newParts);
    
    // Update parent with trimmed parts
    const full = [newParts.first.trim(), newParts.middle.trim(), newParts.last.trim()].filter(Boolean).join(' ');
    update('name', full);
  };

  const handleBlurName = (field: 'first' | 'middle' | 'last') => {
      // 2. Trim names for start and end space on blur
      setNameParts(prev => ({ ...prev, [field]: prev[field].trim() }));
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    const oldVal = data.height || '';

    // Remove non-digit/non-dot
    val = val.replace(/[^0-9.]/g, '');

    // 4. Restrict height input behavior: Auto-add decimal if typing first digit
    if (val.length > oldVal.length) {
       if (val.length === 1 && /^\d$/.test(val)) {
           val = val + '.';
       }
    }

    // Regex: Start with digit, optional dot, optional 0-2 digits. Max length 4.
    if (val.length <= 4 && /^(\d(\.\d{0,2})?)?$/.test(val)) {
        update('height', val);
    }
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^\d{0,3}$/.test(val)) {
        update('weight', val);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <SectionTitle>Basic Identity</SectionTitle>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 sm:col-span-2">
          <Label>Title</Label>
          <Select value={data.title} onChange={e => update('title', e.target.value)}>
            <option value="">-- Select --</option>
            {TITLES.map(t => <option key={t} value={t}>{t}</option>)}
          </Select>
        </div>
        
        {/* Name Split Fields */}
        <div className="col-span-12 sm:col-span-10 grid grid-cols-3 gap-4">
            <div>
                <Label>First Name</Label>
                <Input 
                    value={nameParts.first} 
                    onChange={e => handleNameInput('first', e.target.value)} 
                    onBlur={() => handleBlurName('first')}
                    placeholder="First" 
                />
            </div>
            <div>
                <Label>Middle Name</Label>
                <Input 
                    value={nameParts.middle} 
                    onChange={e => handleNameInput('middle', e.target.value)} 
                    onBlur={() => handleBlurName('middle')}
                    placeholder="Middle" 
                />
            </div>
            <div>
                <Label>Last Name</Label>
                <Input 
                    value={nameParts.last} 
                    onChange={e => handleNameInput('last', e.target.value)} 
                    onBlur={() => handleBlurName('last')}
                    placeholder="Last" 
                />
            </div>
        </div>

        <div className="col-span-12 sm:col-span-4">
          <Label>Gender</Label>
          <Select value={data.gender} onChange={e => update('gender', e.target.value)}>
            <option value="">-- Select --</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </Select>
        </div>
        <div className="col-span-6 sm:col-span-3">
          <Label>Age (18-60)</Label>
          <Input 
            type="number" 
            min={18} 
            max={60} 
            value={data.age} 
            onChange={e => update('age', parseInt(e.target.value))} 
            onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
            // 3. remove up down arrows on number input field
            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
        <div className="col-span-6 sm:col-span-3">
          <Label>Height (e.g. 5.11)</Label>
          <Input 
            value={data.height} 
            onChange={handleHeightChange} 
            placeholder="x.yz" 
            maxLength={4}
          />
        </div>
        <div className="col-span-6 sm:col-span-3">
          <Label>Weight (kg)</Label>
          <Input 
            value={data.weight} 
            onChange={handleWeightChange} 
            placeholder="Max 3 digits" 
          />
        </div>
        <div className="col-span-6 sm:col-span-6">
          <Label>Skin Color</Label>
          <Select value={data.skinColor} onChange={e => update('skinColor', e.target.value)}>
            <option value="">-- Select --</option>
            {SKINS.map(s => <option key={s} value={s}>{s}</option>)}
          </Select>
        </div>
        <div className="col-span-6 sm:col-span-6">
          <Label>Diet</Label>
          <Select value={data.diet} onChange={e => update('diet', e.target.value)}>
            <option value="">-- Select --</option>
            {DIETS.map(d => <option key={d} value={d}>{d}</option>)}
          </Select>
        </div>
      </div>
    </div>
  );
}
