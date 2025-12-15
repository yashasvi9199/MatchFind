import React, { useState, useRef, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimePickerProps {
  value: string;
  onChange: (val: string) => void;
}

export default function TimePicker({ value, onChange }: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const parseTime = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return { hour12, minute: m, period };
  };

  const { hour12, minute, period } = parseTime(value || '12:00');

  const updateTime = (newH: number, newM: number, newP: string) => {
    let h24 = newH;
    if (newP === 'PM' && newH !== 12) h24 += 12;
    if (newP === 'AM' && newH === 12) h24 = 0;
    const timeStr = `${h24.toString().padStart(2, '0')}:${newM.toString().padStart(2, '0')}`;
    
    console.log(`[TimePicker] Time updated to: ${timeStr} (${newH}:${newM} ${newP})`);
    onChange(timeStr);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const periods = ['AM', 'PM'];

  return (
    <div className="relative" ref={wrapperRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full rounded-xl border border-gray-200 p-3 text-sm transition-all bg-white shadow-sm cursor-pointer flex items-center justify-between hover:border-rose-300"
      >
        <span>{hour12.toString().padStart(2, '0')}:{minute.toString().padStart(2, '0')} {period}</span>
        <Clock className="w-4 h-4 text-gray-400" />
      </div>

      {isOpen && (
        <div className="absolute z-20 mt-2 w-full bg-white border border-rose-100 rounded-xl shadow-xl p-4 grid grid-cols-3 gap-2 animate-fadeIn">
          {/* Hours */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-gray-400 mb-1">HR</span>
            <div className="h-32 overflow-y-auto w-full snap-y scrollbar-hide text-center">
              {hours.map(h => (
                <div key={h} onClick={() => updateTime(h, minute, period)}
                  className={`py-2 text-sm cursor-pointer rounded snap-center hover:bg-rose-50 ${h === hour12 ? 'bg-rose-100 font-bold text-rose-700' : 'text-gray-600'}`}>
                  {h.toString().padStart(2, '0')}
                </div>
              ))}
            </div>
          </div>
          {/* Minutes */}
          <div className="flex flex-col items-center border-l border-r border-gray-100">
             <span className="text-[10px] font-bold text-gray-400 mb-1">MIN</span>
             <div className="h-32 overflow-y-auto w-full snap-y scrollbar-hide text-center">
              {minutes.map(m => (
                <div key={m} onClick={() => updateTime(hour12, m, period)}
                  className={`py-2 text-sm cursor-pointer rounded snap-center hover:bg-rose-50 ${m === minute ? 'bg-rose-100 font-bold text-rose-700' : 'text-gray-600'}`}>
                  {m.toString().padStart(2, '0')}
                </div>
              ))}
            </div>
          </div>
          {/* Period */}
          <div className="flex flex-col items-center">
             <span className="text-[10px] font-bold text-gray-400 mb-1">AP</span>
             <div className="h-32 flex flex-col justify-center w-full">
               {periods.map(p => (
                  <div key={p} onClick={() => updateTime(hour12, minute, p)}
                    className={`py-3 mb-2 text-center text-sm cursor-pointer rounded hover:bg-rose-50 ${p === period ? 'bg-rose-100 font-bold text-rose-700' : 'text-gray-600'}`}>
                    {p}
                  </div>
               ))}
             </div>
          </div>
        </div>
      )}
      <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
}
