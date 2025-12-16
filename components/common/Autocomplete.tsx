
import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { Label } from './FormComponents';

interface AutocompleteProps {
    label?: string;
    value: string;
    onChange: (val: string) => void;
    options: string[];
    placeholder: string;
    disabled?: boolean;
    warning?: string;
    className?: string;
}

export default function Autocomplete({ 
    label, 
    value, 
    onChange, 
    options, 
    placeholder, 
    disabled = false,
    warning = '',
    className = ''
}: AutocompleteProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [filter, setFilter] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);

    const filteredOptions = options.filter(opt => 
        opt.toLowerCase().includes((filter || '').toLowerCase())
    );

    useEffect(() => {
        setFilter(value);
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setFilter(val);
        onChange(val);
        setIsOpen(true);
    };

    const handleSelect = (option: string) => {
        onChange(option);
        setFilter(option);
        setIsOpen(false);
    };

    return (
        <div className={`relative ${className}`} ref={wrapperRef}>
            {label && <Label className={disabled ? 'text-gray-400' : 'text-rose-800'}>{label}</Label>}
            <div className="relative">
                <input
                    type="text"
                    className={`w-full rounded-xl border p-3 pl-10 text-sm transition-all focus:outline-none shadow-sm 
                        ${disabled ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white border-orange-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100'}
                    `}
                    placeholder={placeholder}
                    value={filter}
                    onChange={handleInputChange}
                    onFocus={() => !disabled && setIsOpen(true)}
                    disabled={disabled}
                />
                <Search className={`absolute left-3 top-3.5 h-4 w-4 ${disabled ? 'text-gray-300' : 'text-orange-400'}`} />
                {!disabled && (
                    <ChevronDown 
                        className={`absolute right-3 top-3.5 h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''} cursor-pointer`} 
                        onClick={() => setIsOpen(!isOpen)}
                    />
                )}
            </div>
            
            {warning && <p className="text-xs text-rose-400 mt-2 font-medium">{warning}</p>}

            {isOpen && !disabled && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto animate-fadeIn">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((opt) => (
                            <div 
                                key={opt} 
                                onClick={() => handleSelect(opt)}
                                className="px-4 py-2 text-sm hover:bg-orange-50 hover:text-rose-700 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                            >
                                {opt}
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-3 text-sm text-gray-400 italic">No suggestions found.</div>
                    )}
                </div>
            )}
        </div>
    );
}
