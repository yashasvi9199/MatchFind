

import { ProfileData } from '../../types';
import { CASTES, GOTRA_MAP } from '../../constants/data';
import { SectionTitle } from '../common/FormComponents';
import Autocomplete from '../common/Autocomplete';

interface Props {
  data: ProfileData;
  update: (field: keyof ProfileData, value: string) => void;
}

export default function Step2_Social({ data, update }: Props) {
  const availableGotras = data.caste ? (GOTRA_MAP[data.caste] || []) : [];

  return (
    <div className="space-y-6 animate-fadeIn">
      <SectionTitle>Community & Religious</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Caste Autocomplete */}
        <div className="p-5 bg-orange-50 rounded-2xl border border-orange-100 hover:border-orange-200 transition-colors">
            <Autocomplete 
                label="Caste"
                value={data.caste}
                onChange={(val) => {
                    update('caste', val);
                    update('gotra', ''); // Reset gotra when caste changes
                }}
                options={CASTES}
                placeholder="Type to search Caste..."
            />
        </div>

        {/* Gotra Autocomplete */}
        <div className="p-5 bg-orange-50 rounded-2xl border border-orange-100 hover:border-orange-200 transition-colors">
            <Autocomplete 
                label="Gotra"
                value={data.gotra}
                onChange={(val) => update('gotra', val)}
                options={availableGotras}
                placeholder={data.caste ? "Type to search Gotra..." : "Select Caste first"}
                disabled={!data.caste}
                warning={!data.caste ? "Please select a caste first to see Gotra suggestions" : ""}
            />
        </div>

      </div>
    </div>
  );
}
