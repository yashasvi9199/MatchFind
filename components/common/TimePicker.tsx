import { useState, useRef, useEffect } from 'react';
import { Clock, Check } from 'lucide-react';

interface TimePickerProps {
  value: string;
  onChange: (val: string) => void;
}

export default function TimePicker({ value, onChange }: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempHour, setTempHour] = useState(12);
  const [tempMinute, setTempMinute] = useState(0);
  const [tempPeriod, setTempPeriod] = useState('AM');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const parseTime = (timeStr: string) => {
    // Check if format is "HH:mm AM/PM" or "HH:mm" (24h)
    if (timeStr && (timeStr.includes('AM') || timeStr.includes('PM'))) {
        const [time, p] = timeStr.split(' ');
        const [h, m] = time.split(':').map(Number);
        return { hour12: h, minute: m, period: p };
    }

    // Fallback for 24h format (legacy data)
    const [h, m] = timeStr.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return { hour12, minute: m, period };
  };

  const { hour12, minute, period } = parseTime(value || '12:00 PM');

  // Sync temp state when opening
  useEffect(() => {
    if (isOpen) {
      setTempHour(hour12);
      setTempMinute(minute);
      setTempPeriod(period);
    }
  }, [isOpen, hour12, minute, period]);

  const handleSave = () => {
    // Return "hh:mm AA" format directly
    const timeStr = `${tempHour.toString().padStart(2, '0')}:${tempMinute.toString().padStart(2, '0')} ${tempPeriod}`;
    
    console.log(`[TimePicker] Time saved: ${timeStr}`);
    onChange(timeStr);
    setIsOpen(false);
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
        <div className="absolute z-20 mt-2 w-full bg-white border border-rose-100 rounded-xl shadow-xl p-4 animate-fadeIn">
          <div className="grid grid-cols-3 gap-2 mb-3">
            {/* Hours */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-gray-400 mb-1">HR</span>
              <div className="h-32 overflow-y-auto w-full snap-y scrollbar-hide text-center">
                {hours.map(h => (
                  <div key={h} onClick={() => setTempHour(h)}
                    className={`py-2 text-sm cursor-pointer rounded snap-center hover:bg-rose-50 ${h === tempHour ? 'bg-rose-100 font-bold text-rose-700' : 'text-gray-600'}`}>
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
                  <div key={m} onClick={() => setTempMinute(m)}
                    className={`py-2 text-sm cursor-pointer rounded snap-center hover:bg-rose-50 ${m === tempMinute ? 'bg-rose-100 font-bold text-rose-700' : 'text-gray-600'}`}>
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
                    <div key={p} onClick={() => setTempPeriod(p)}
                      className={`py-3 mb-2 text-center text-sm cursor-pointer rounded hover:bg-rose-50 ${p === tempPeriod ? 'bg-rose-100 font-bold text-rose-700' : 'text-gray-600'}`}>
                      {p}
                    </div>
                 ))}
               </div>
            </div>
          </div>
          
          {/* Save Button */}
          <button 
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-orange-500 text-white py-2.5 rounded-lg font-bold text-sm hover:from-rose-600 hover:to-orange-600 transition-all shadow-md"
          >
            <Check className="w-4 h-4" /> Save Time
          </button>
        </div>
      )}
      <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
}
