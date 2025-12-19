import { useState } from 'react';
import { ProfileData } from '../../types';
import { Input, Label, SectionTitle } from '../common/FormComponents';
import { X, CheckCircle2 } from 'lucide-react';
import { toTitleCasePreserveSpaces } from '../../utils/helpers';

interface Props {
  data: ProfileData;
  setHealthIssues: (issues: string[]) => void;
}

export default function Step6_Health({ data, setHealthIssues }: Props) {
  const [newHealthIssue, setNewHealthIssue] = useState('');

  const handleHealthIssueInput = (val: string) => {
    // Apply title case while preserving trailing spaces
    setNewHealthIssue(toTitleCasePreserveSpaces(val));
  };

  const addHealthIssue = () => {
    const issue = newHealthIssue.trim().replace(/\s+/g, ' '); // Trim additional spaces
    if (issue) {
        // Limit to 3 words
        const words = issue.split(' ');
        if (words.length > 3) {
            alert("Health issue description too long. Max 3 words allowed.");
            return;
        }

        console.log(`[Health] Adding issue: ${issue}`);
        setHealthIssues([...data.healthIssues, issue]);
        setNewHealthIssue('');
    }
  };

  const removeHealthIssue = (index: number) => {
    console.log(`[Health] Removing issue at index: ${index}`);
    setHealthIssues(data.healthIssues.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
       <SectionTitle>Health Information</SectionTitle>
       <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <Label className="mb-3">Health Issues / Conditions (if any)</Label>
          <div className="flex gap-2 mb-4">
            <Input 
              value={newHealthIssue} 
              onChange={e => handleHealthIssueInput(e.target.value)} 
              placeholder="E.g. Glasses, Asthma (Max 3 words)"
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addHealthIssue())}
            />
            <button type="button" onClick={addHealthIssue} className="bg-gray-100 text-gray-700 px-5 rounded-xl hover:bg-gray-200 font-bold border border-gray-200 transition-colors">Add</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.healthIssues.map((issue, idx) => (
              <span key={idx} className="bg-red-50 text-red-700 px-3 py-1.5 rounded-full text-sm flex items-center border border-red-100 shadow-sm font-medium">
                {issue}
                <button onClick={() => removeHealthIssue(idx)} className="ml-2 hover:text-red-900 bg-white rounded-full p-0.5"><X className="h-3 w-3" /></button>
              </span>
            ))}
            {data.healthIssues.length === 0 && <span className="text-sm text-green-600 flex items-center bg-green-50 px-3 py-1.5 rounded-full border border-green-100"><CheckCircle2 className="h-4 w-4 mr-1"/> No major issues declared</span>}
          </div>
       </div>
    </div>
  );
}
