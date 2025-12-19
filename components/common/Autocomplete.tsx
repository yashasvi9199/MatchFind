
import { useState, useRef, useEffect, ChangeEvent, KeyboardEvent } from 'react';
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
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

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
                setHighlightedIndex(-1);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Scroll highlighted item into view
    useEffect(() => {
        if (highlightedIndex >= 0 && listRef.current) {
            const items = listRef.current.querySelectorAll('[data-option]');
            if (items[highlightedIndex]) {
                items[highlightedIndex].scrollIntoView({ block: 'nearest' });
            }
        }
    }, [highlightedIndex]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setFilter(val);
        onChange(val);
        setIsOpen(true);
        setHighlightedIndex(-1);
    };

    const handleSelect = (option: string) => {
        onChange(option);
        setFilter(option);
        setIsOpen(false);
        setHighlightedIndex(-1);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (disabled) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                if (!isOpen) {
                    setIsOpen(true);
                } else {
                    setHighlightedIndex(prev => 
                        prev < filteredOptions.length - 1 ? prev + 1 : 0
                    );
                }
                break;
            case 'ArrowUp':
                e.preventDefault();
                if (isOpen) {
                    setHighlightedIndex(prev => 
                        prev > 0 ? prev - 1 : filteredOptions.length - 1
                    );
                }
                break;
            case 'Tab':
                if (isOpen && highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
                    e.preventDefault();
                    handleSelect(filteredOptions[highlightedIndex]);
                } else if (isOpen && filteredOptions.length === 1) {
                    e.preventDefault();
                    handleSelect(filteredOptions[0]);
                }
                break;
            case 'Enter':
                e.preventDefault();
                if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
                    handleSelect(filteredOptions[highlightedIndex]);
                } else if (filteredOptions.length === 1) {
                    handleSelect(filteredOptions[0]);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                setHighlightedIndex(-1);
                break;
        }
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
                    onKeyDown={handleKeyDown}
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
                <div ref={listRef} className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto animate-fadeIn">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((opt, index) => (
                            <div 
                                key={opt}
                                data-option
                                onClick={() => handleSelect(opt)}
                                className={`px-4 py-2 text-sm cursor-pointer transition-colors border-b border-gray-50 last:border-0 ${
                                    index === highlightedIndex 
                                        ? 'bg-rose-100 text-rose-700' 
                                        : 'hover:bg-orange-50 hover:text-rose-700'
                                }`}
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
