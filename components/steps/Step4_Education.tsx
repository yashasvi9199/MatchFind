import React from 'react';
import { ProfileData } from '../../types';
import { EDUCATION_LEVELS, EDUCATION_STREAMS, SALARY_SLABS } from '../../constants/data';
import { Input, Select, Label, SectionTitle } from '../common/FormComponents';
import { GraduationCap, Briefcase } from 'lucide-react';

interface Props {
  data: ProfileData;
  update: (field: keyof ProfileData, value: string) => void;
}

export default function Step4_Education({ data, update }: Props) {
  const needsStream = ['Graduate', 'Post Graduate', 'Professional', 'Doctorate'].includes(data.educationLevel);

  const handleTextInput = (field: keyof ProfileData, val: string) => {
    // Alphabets and Dot only, Uppercase
    const clean = val.replace(/[^a-zA-Z.\s]/g, '').toUpperCase();
    update(field, clean);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <SectionTitle>Education & Profession</SectionTitle>
      <div className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        
        {/* Education Level */}
        <div className="space-y-5">
           <div className="group relative">
              <Label>Education Level</Label>
              <div className="relative">
                 <GraduationCap className="absolute left-3 top-3.5 text-gray-400 h-5 w-5 transition-transform group-focus-within:-translate-y-1 group-focus-within:text-rose-500 duration-300" />
                 <Select 
                   className="pl-10" 
                   value={data.educationLevel} 
                   onChange={e => {
                      update('educationLevel', e.target.value);
                      if (!['Graduate', 'Post Graduate', 'Professional', 'Doctorate'].includes(e.target.value)) {
                         update('educationStream', '');
                         update('educationDegree', '');
                      }
                   }}
                 >
                   <option value="">-- Select --</option>
                   {EDUCATION_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                 </Select>
              </div>
           </div>

           {needsStream && (
             <div className="group relative animate-fadeIn">
                <Label>Field / Stream</Label>
                <div className="relative">
                   <Briefcase className="absolute left-3 top-3.5 text-gray-400 h-5 w-5 transition-transform group-focus-within:-translate-y-1 group-focus-within:text-rose-500 duration-300" />
                   <Select 
                      className="pl-10" 
                      value={data.educationStream} 
                      onChange={e => update('educationStream', e.target.value)}
                   >
                      <option value="">-- Select --</option>
                      {EDUCATION_STREAMS.map(s => <option key={s} value={s}>{s}</option>)}
                   </Select>
                </div>
             </div>
           )}

           {needsStream && data.educationStream && (
             <div className="group relative animate-fadeIn">
                <Label>Specific Degree / Qualification</Label>
                <div className="relative">
                   <GraduationCap className="absolute left-3 top-3.5 text-gray-400 h-5 w-5 transition-transform group-focus-within:-translate-y-1 group-focus-within:text-rose-500 duration-300" />
                   <Input 
                      className="pl-10" 
                      value={data.educationDegree} 
                      onChange={e => handleTextInput('educationDegree', e.target.value)}
                      placeholder="e.g. B.TECH, M.B.B.S"
                   />
                </div>
             </div>
           )}
        </div>

        <div className="h-px bg-gray-100 my-4"></div>

        {/* Occupation */}
        <div className="group relative">
          <Label>Occupation / Business</Label>
          <div className="relative">
             <Briefcase className="absolute left-3 top-3.5 text-gray-400 h-5 w-5 transition-transform group-focus-within:-translate-y-1 group-focus-within:text-rose-500 duration-300" />
             <Input 
                className="pl-10" 
                value={data.occupation} 
                onChange={e => handleTextInput('occupation', e.target.value)} 
                placeholder="CURRENT JOB ROLE OR BUSINESS" 
            />
          </div>
        </div>

        {/* Salary */}
        <div className="group relative">
          <Label>Annual Salary Range</Label>
          <Select value={data.salary} onChange={e => update('salary', e.target.value)}>
            <option value="">-- Select --</option>
            {SALARY_SLABS.map(s => <option key={s} value={s}>{s}</option>)}
          </Select>
        </div>
      </div>
    </div>
  );
}
