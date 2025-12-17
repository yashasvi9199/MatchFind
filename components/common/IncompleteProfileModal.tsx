import { AlertTriangle, UserCircle, X } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onCancel: () => void;
    onProfile: () => void;
}

export default function IncompleteProfileModal({ isOpen, onCancel, onProfile }: Props) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 relative border border-rose-100 transform transition-all scale-100">
                <button onClick={onCancel} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                </button>
                
                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle className="w-8 h-8 text-orange-500" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Profile Incomplete</h3>
                    <p className="text-gray-500 mb-6 text-sm">
                        Your Profile is incomplete <br/> Please complete it first
                    </p>
                    
                    <div className="flex gap-3 w-full">
                        <button 
                            onClick={onCancel}
                            className="flex-1 py-2.5 rounded-xl border border-gray-200 font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={onProfile}
                            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 font-bold text-white shadow-lg shadow-rose-200 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                        >
                            <UserCircle className="w-4 h-4" />
                            Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
