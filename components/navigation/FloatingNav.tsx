import { useState } from 'react';
import { AppView } from '../../types';
import { User, Users, Search, HeartHandshake, Menu, X } from 'lucide-react';

interface Props {
  currentView: AppView;
  setView: (view: AppView) => void;
  isProfileComplete: boolean;
  onRestrictedAction: () => void;
}

export default function FloatingNav({ currentView, setView, isProfileComplete, onRestrictedAction }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  // Helper to check if active
  const isActive = (view: AppView) => currentView === view;

  const toggleOpen = () => {
    console.log(`[FloatingNav] Toggling Menu: ${!isOpen}`);
    setIsOpen(!isOpen);
  };

  const handleNav = (view: AppView) => {
    // RESTRICTION CHECK
    if (!isProfileComplete && (view === 'SEARCH' || view === 'MATCH')) {
        onRestrictedAction();
        return;
    }
    
    console.log(`[FloatingNav] Navigating to ${view}`);
    setView(view);
    setIsOpen(false);
  };

  const menuItems = [
    { id: 'MATCH', icon: <HeartHandshake className="w-5 h-5" />, label: 'Matches', color: 'bg-green-500' },
    { id: 'SEARCH', icon: <Search className="w-5 h-5" />, label: 'Search', color: 'bg-blue-500' },
    { id: 'RISHTEY', icon: <Users className="w-5 h-5" />, label: 'Rishtey', color: 'bg-rose-500' },
    { id: 'PROFILE', icon: <User className="w-5 h-5" />, label: 'Profile', color: 'bg-orange-500' },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3">
      {/* Menu Items Stack */}
      <div className={`flex flex-col gap-3 transition-all duration-300 ease-out origin-bottom ${isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-50 pointer-events-none'}`}>
        {menuItems.map((item, index) => {
          const active = isActive(item.id as AppView);
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id as AppView)}
              className={`flex items-center justify-end gap-3 group transition-transform duration-300 ${active ? 'scale-110 mr-2' : ''}`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <span className={`bg-white text-gray-700 text-xs font-bold px-2 py-1 rounded-md shadow-md transition-opacity whitespace-nowrap ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                {item.label}
              </span>
              <div className={`${item.color} text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform ${active ? 'ring-4 ring-white ring-opacity-50' : ''}`}>
                {item.icon}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Toggle Button */}
      <button
        onClick={toggleOpen}
        className={`bg-indigo-600 text-white p-4 rounded-full shadow-xl hover:bg-indigo-700 transition-all duration-300 transform ${isOpen ? 'rotate-90' : 'rotate-0'}`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
    </div>
  );
}
