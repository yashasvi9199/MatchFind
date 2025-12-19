
import { ProfileData } from '../../types';
import { EDUCATION_LEVELS, EDUCATION_STREAMS, SALARY_SLABS } from '../../constants/data';
import { Input, Select, Label, SectionTitle } from '../common/FormComponents';
import { GraduationCap, Briefcase, Building2, BadgeCheck, Store, Tags } from 'lucide-react';

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

  const handleOccupationTypeChange = (type: 'Job' | 'Business') => {
    update('occupation_type', type);
    // Clear opposite fields
    if (type === 'Job') {
      update('business_name', '');
      update('business_category', '');
    } else {
      update('company_name', '');
      update('designation', '');
    }
  };

  const isJob = data.occupation_type === 'Job';
  const isBusiness = data.occupation_type === 'Business';

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

        {/* Occupation Type Selection */}
        <div className="space-y-4">
          <Label>Occupation Type</Label>
          <div className="flex gap-4">
            <label 
              className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                isJob 
                  ? 'border-rose-500 bg-rose-50 text-rose-700' 
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
            >
              <input 
                type="radio" 
                name="occupation_type" 
                value="Job"
                checked={isJob}
                onChange={() => handleOccupationTypeChange('Job')}
                className="sr-only"
              />
              <Briefcase className={`w-5 h-5 ${isJob ? 'text-rose-600' : 'text-gray-400'}`} />
              <span className="font-bold">Job</span>
            </label>
            
            <label 
              className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                isBusiness 
                  ? 'border-rose-500 bg-rose-50 text-rose-700' 
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
            >
              <input 
                type="radio" 
                name="occupation_type" 
                value="Business"
                checked={isBusiness}
                onChange={() => handleOccupationTypeChange('Business')}
                className="sr-only"
              />
              <Store className={`w-5 h-5 ${isBusiness ? 'text-rose-600' : 'text-gray-400'}`} />
              <span className="font-bold">Business</span>
            </label>
          </div>
        </div>

        {/* Conditional Fields for Job */}
        {isJob && (
          <div className="space-y-4 animate-fadeIn bg-blue-50/50 p-5 rounded-xl border border-blue-100">
            <div className="group relative">
              <Label>Company Name</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
                <Input 
                  className="pl-10" 
                  value={data.company_name} 
                  onChange={e => handleTextInput('company_name', e.target.value)}
                  placeholder="e.g. GOOGLE, TCS, INFOSYS"
                />
              </div>
            </div>
            <div className="group relative">
              <Label>Designation / Role</Label>
              <div className="relative">
                <BadgeCheck className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
                <Input 
                  className="pl-10" 
                  value={data.designation} 
                  onChange={e => handleTextInput('designation', e.target.value)}
                  placeholder="e.g. SOFTWARE ENGINEER, MANAGER"
                />
              </div>
            </div>
          </div>
        )}

        {/* Conditional Fields for Business */}
        {isBusiness && (
          <div className="space-y-4 animate-fadeIn bg-orange-50/50 p-5 rounded-xl border border-orange-100">
            <div className="group relative">
              <Label>Business Name</Label>
              <div className="relative">
                <Store className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
                <Input 
                  className="pl-10" 
                  value={data.business_name} 
                  onChange={e => handleTextInput('business_name', e.target.value)}
                  placeholder="e.g. ABC TRADERS, XYZ ENTERPRISES"
                />
              </div>
            </div>
            <div className="group relative">
              <Label>Business Category & Services</Label>
              <div className="relative">
                <Tags className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
                <Input 
                  className="pl-10" 
                  value={data.business_category} 
                  onChange={e => handleTextInput('business_category', e.target.value)}
                  placeholder="e.g. TEXTILE, RETAIL, IT SERVICES"
                />
              </div>
            </div>
          </div>
        )}

        {/* Salary / Turnover */}
        <div className="group relative">
          <Label>{isBusiness ? 'Annual Turnover Range' : 'Annual Salary Range'}</Label>
          <Select value={data.salary} onChange={e => update('salary', e.target.value)}>
            <option value="">-- Select --</option>
            {SALARY_SLABS.map(s => <option key={s} value={s}>{s}</option>)}
          </Select>
        </div>
      </div>
    </div>
  );
}
