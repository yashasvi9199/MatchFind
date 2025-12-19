import { useState } from 'react';
import { Input, Select, Label, SectionTitle } from '../common/FormComponents';
import { TITLES } from '../../constants/data';
import { ArrowRight } from 'lucide-react';
import { toTitleCase } from '../../utils/helpers';

type Gender = 'Male' | 'Female';
type Title = string;

export interface Step0Data {
    name: string;
    gender: Gender | '';
    age: number | '';
    title: Title;
}

interface Props {
    onSubmit: (data: Step0Data) => void;
    isSubmitting: boolean;
}

export default function Step0_Initial({ onSubmit, isSubmitting }: Props) {
    const [data, setData] = useState<Step0Data>({
        title: 'Mr',
        name: '',
        gender: '',
        age: ''
    });
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (!data.name.trim() || !data.gender || !data.age) {
            setError('All fields are required');
            return;
        }
        if (typeof data.age === 'number' && (data.age < 18 || data.age > 60)) {
            setError('Age must be between 18 and 60');
            return;
        }
        onSubmit(data);
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl border border-rose-100 animate-fadeIn mt-10">
            <div className="text-center mb-8">
                <SectionTitle>Welcome to MatchFind</SectionTitle>
                <p className="text-sm text-gray-500 mt-2">Let's start with some basics</p>
            </div>

            <div className="space-y-5">
                {/* Title & Name */}
                <div className="flex gap-4">
                    <div className="w-1/3">
                        <Label>Title</Label>
                        <Select value={data.title} onChange={e => setData({...data, title: e.target.value as Title})}>
                            {TITLES.map(t => <option key={t} value={t}>{t}</option>)}
                        </Select>
                    </div>
                    <div className="w-full">
                        <Label>Full Name</Label>
                        <Input 
                            value={data.name} 
                            onChange={e => setData({...data, name: toTitleCase(e.target.value)})} 
                            placeholder="Enter full name"
                        />
                    </div>
                </div>

                {/* Gender */}
                <div>
                     <Label>Gender</Label>
                     <div className="flex gap-4 mt-1">
                        {['Male', 'Female'].map((g) => (
                            <button
                                key={g}
                                onClick={() => setData({...data, gender: g as Gender})}
                                className={`flex-1 py-3 rounded-xl border font-bold transition-all ${
                                    data.gender === g 
                                    ? 'bg-rose-50 border-rose-500 text-rose-600 shadow-sm' 
                                    : 'border-gray-200 text-gray-500 hover:border-rose-200 hover:bg-gray-50'
                                }`}
                            >
                                {g}
                            </button>
                        ))}
                     </div>
                </div>

                {/* Age */}
                <div>
                    <Label>Age</Label>
                    <Input 
                        type="number" 
                        value={data.age} 
                        onChange={e => setData({...data, age: parseInt(e.target.value) || ''})}
                        placeholder="18-60"
                        min={18}
                        max={60}
                    />
                </div>

                {error && <p className="text-red-500 text-sm text-center font-semibold">{error}</p>}

                <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full mt-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-rose-200 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                    {isSubmitting ? 'Creating Profile...' : 'Get Started'}
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
