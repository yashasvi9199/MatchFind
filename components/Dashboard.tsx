import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import type { User } from '@supabase/supabase-js';
import { uploadProfileImage, createProfile } from '../services/supabaseService';
import { ProfileData, FamilyMember, AppView, UserProfile } from '../types';
import { STEPS } from '../constants/data';
import { LogOut, Heart, ArrowRight, Save, SkipForward, ArrowLeft, XCircle, AlertCircle } from 'lucide-react';
import { seedMockInteractions } from '../services/matchService';
import { sanitizeInput } from '../utils/helpers';

// Steps Components
import Step0_Initial from './steps/Step0_Initial';
import Step1_BasicInfo from './steps/Step1_BasicInfo';
import Step2_Social from './steps/Step2_Social';
import Step3_Location from './steps/Step3_Location';
import Step4_Education from './steps/Step4_Education';
import Step5_Family from './steps/Step5_Family';
import Step6_Health from './steps/Step6_Health';
import Step7_Preferences from './steps/Step7_Preferences';
import Step8_Media from './steps/Step8_Media';

// Views
import ProfileView from './profile/ProfileView';
import RishteyView from './views/RishteyView';
import MatchView from './views/MatchView';
import SearchView from './views/SearchView';
import FloatingNav from './navigation/FloatingNav';
import IncompleteProfileModal from './common/IncompleteProfileModal';

const INITIAL_FAMILY_MEMBER: FamilyMember = {
  title: 'Mr', name: '', gotra: '', caste: '', occupation: ''
};

const INITIAL_STATE: ProfileData = {
  title: 'Mr', name: '', gender: 'Male', age: 18, height: '', weight: '',
  skinColor: '', bloodGroup: '', diet: 'Vegetarian', bio: '',
  caste: '', gotra: '',
  birthPlace: '', birthTime: '12:00', 
  nativeCountry: 'India', nativeState: '', nativeCity: '',
  currentCountry: 'India', currentState: '', currentCity: '',
  educationLevel: '', educationStream: '', educationDegree: '', education: '',
  occupation: '', salary: '',
  father: { ...INITIAL_FAMILY_MEMBER, title: 'Mr' },
  mother: { ...INITIAL_FAMILY_MEMBER, title: 'Mrs' },
  paternalSide: { ...INITIAL_FAMILY_MEMBER, title: 'Mr' }, 
  siblings: [],
  healthIssues: [],
  partnerAgeMin: '23', partnerAgeMax: '27',
  expectations: []
};

interface DashboardProps {
  user: User;
}

interface ValidationError {
    field: string;
    message: string;
}

export default function Dashboard({ user }: DashboardProps) {
  // --- State ---
  const [currentView, setCurrentView] = useState<AppView>('PROFILE');
  
  // Data State
  const [hasProfile, setHasProfile] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [formData, setFormData] = useState<ProfileData>(INITIAL_STATE);
  
  // Editing State
  const [isEditingProfile, setIsEditingProfile] = useState(false); 
  const [currentStep, setCurrentStep] = useState(0);
  const [highestStepReached, setHighestStepReached] = useState(0);

  // Restriction Modal
  const [showRestrictionModal, setShowRestrictionModal] = useState(false);
  
  // Media State
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  
  // Validation State
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  
  // Specific Step State Lifted
  const [editingSiblingIndex, setEditingSiblingIndex] = useState<number | null>(null);
  const [editingTargetId, setEditingTargetId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // --- Effects ---
  useEffect(() => {
    const fetchProfile = async () => {
      console.log('[Dashboard] Checking for existing profile...');
      const { data, error } = await supabase
        .from('profiles')
        .select()
        .eq('id', user.id)
        .single();

      if (data && !error) {
        setFormData(data);
        setAvatarUrl(data.avatar_url || null);
        setIsAdmin(data.role === 'admin');
        setHasProfile(true);
        setIsProfileComplete(data.is_complete_profile || false);
        
        setIsEditingProfile(false);
        setCurrentView('RISHTEY'); 
        seedMockInteractions(user.id, data.gender); 
      } else {
        setHasProfile(false);
        setIsProfileComplete(false);
        setIsEditingProfile(true); // Should trigger Step 0 flow if handled in render
      }
      setIsLoadingProfile(false);
    };

    fetchProfile();
  }, [user.id]);

  useEffect(() => {
    if (currentStep > highestStepReached) {
      setHighestStepReached(currentStep);
    }
  }, [currentStep, highestStepReached]);

  // --- Handlers ---

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };
  
  const handleEditProfile = (profile: UserProfile, forceView = false) => {
      if (!forceView && !isProfileComplete && profile.id === user.id) {
          // If editing own incomplete profile, we go to wizard
      }

      // Admin editing another user OR user editing self
      setFormData(profile);
      setAvatarUrl(profile.avatar_url || null);
      setEditingTargetId(profile.id === user.id ? null : profile.id);
      setIsEditingProfile(true);
      setCurrentStep(0); // Start at Step 1 Basic Info
      setHighestStepReached(STEPS.length - 1); 
  };

  const handleRestrictedAction = () => {
      setShowRestrictionModal(true);
  };
  
  const handleStep0Submit = async (basicData: { name: string, gender: any, age: any, title: any }) => {
      setIsSaving(true);
      try {
          const newProfile: ProfileData = {
              ...INITIAL_STATE,
              ...basicData,
          };
          
          // is_complete_profile defaults to false in DB, but we pass it effectively via lack of it or explicit false if we added it to interface
          // We will update the ProfileData type later if needed, but for now Supabase allows extra fields if dynamic, or we ignore it.
          // Actually we need to make sure we save it.
          // Since our types might not have is_complete_profile, we cast or just rely on DB default.
          // BUT createProfile spreads data. 
          
          await createProfile(user.id, newProfile);
          
          setFormData(newProfile);
          setHasProfile(true);
          setIsProfileComplete(false);
          setIsEditingProfile(false); // Exit editing mode
          setCurrentView('RISHTEY');
      } catch (err) {
          console.error(err);
          alert('Failed to create profile');
      } finally {
          setIsSaving(false);
      }
  };

  const updateField = (field: keyof ProfileData, value: string | number) => {
    const sanitizedValue = typeof value === 'string' ? sanitizeInput(value) : value;
    setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
    setErrors(prev => prev.filter(e => e.field !== field));
  };

  const updateFamily = (relation: 'father' | 'mother' | 'paternalSide', field: keyof FamilyMember, value: string) => {
    const sanitized = sanitizeInput(value);
    setFormData(prev => ({
      ...prev,
      [relation]: { ...prev[relation], [field]: sanitized }
    }));
    setErrors(prev => prev.filter(e => e.field !== `${relation}.${field}`));
  };

  const setSiblings = (siblings: FamilyMember[]) => {
    setFormData(prev => ({ ...prev, siblings }));
  };

  // --- Validation Logic (Steps 1-8) ---
  const validateStep = (stepIndex: number): ValidationError[] => {
    const errs: ValidationError[] = [];
    const d = formData;
    const req = (field: keyof ProfileData, msg: string) => {
        if (!d[field] || d[field].toString().trim() === '') errs.push({ field, message: msg });
    };

    switch(stepIndex) {
        case 0: // Basic
            req('name', 'Full name is required');
            req('gender', 'Gender is required');
            req('height', 'Height is required');
            if(d.height && !/^\d\.\d{2}$/.test(d.height)) {
               errs.push({ field: 'height', message: 'Height must be in x.yz format (e.g., 5.11)' });
            }
            req('weight', 'Weight is required');
            req('skinColor', 'Skin color is required');
            req('bloodGroup', 'Blood group is required');
            req('diet', 'Diet preference is required');
            if (d.age < 18 || d.age > 60) errs.push({ field: 'age', message: 'Age must be between 18 and 60' });
            break;
        case 1: req('caste', 'Caste is required'); if (d.caste && !d.gotra) req('gotra', 'Gotra is required'); break;
        case 2: 
            req('birthPlace', 'Birth place is required');
            req('nativeState', 'Native state is required');
            req('nativeCity', 'Native city is required');
            req('currentCountry', 'Current country is required');
            req('currentCity', 'Current city is required');
            break;
        case 3: req('educationLevel', 'Education level is required'); req('occupation', 'Occupation is required'); req('salary', 'Salary range is required'); break;
        case 4: 
            if (!d.father.name) errs.push({ field: 'father.name', message: "Father's name is required" });
            if (!d.father.occupation) errs.push({ field: 'father.occupation', message: "Father's occupation is required" });
            if (!d.mother.name) errs.push({ field: 'mother.name', message: "Mother's name is required" });
            if (editingSiblingIndex !== null) errs.push({ field: 'siblings', message: 'Please save sibling details before proceeding' });
            break;
        case 6: 
            if (!d.partnerAgeMin || !d.partnerAgeMax) errs.push({ field: 'partnerAge', message: 'Partner age range is required' });
            else if (Number(d.partnerAgeMin) >= Number(d.partnerAgeMax)) errs.push({ field: 'partnerAge', message: 'Min age must be less than Max age' });
            if (d.expectations.length === 0) errs.push({ field: 'expectations', message: 'Add at least one expectation' });
            break;
        case 7: 
            if (!d.bio) errs.push({ field: 'bio', message: 'Bio is required' });
            if (!avatarFile && !avatarUrl) errs.push({ field: 'avatar', message: 'Profile photo is required' });
            break;
    }
    return errs;
  };

  const handleNext = () => {
    const stepErrors = validateStep(currentStep);
    if (stepErrors.length > 0) {
        setErrors(stepErrors);
    } else {
        setErrors([]);
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
            window.scrollTo(0, 0);
        } else {
            handleSubmit();
        }
    }
  };

  const handleStepClick = (index: number) => {
    if (index <= highestStepReached && index !== currentStep) {
        if (index < currentStep) {
             setErrors([]);
             setCurrentStep(index);
        } else {
             const stepErrors = validateStep(currentStep);
             if (stepErrors.length === 0) {
                setErrors([]);
                setCurrentStep(index);
             } else {
                setErrors(stepErrors);
             }
        }
    }
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      let finalAvatarUrl = avatarUrl;
      const targetId = editingTargetId || user.id;

      if (avatarFile) {
        const uploadedUrl = await uploadProfileImage(avatarFile, targetId);
        if (uploadedUrl) {
            finalAvatarUrl = uploadedUrl;
            setAvatarUrl(uploadedUrl);
        }
      }
      
      let eduString = formData.educationLevel;
      if (formData.educationStream) eduString += ` - ${formData.educationStream}`;
      if (formData.educationDegree) eduString += ` (${formData.educationDegree})`;

      // When saving Full Wizard, we set is_complete_profile = true
      // Need to cast to any to include is_complete_profile if not in type
      const finalData: any = { 
          ...formData, 
          education: eduString, 
          avatar_url: finalAvatarUrl || '',
          is_complete_profile: true 
      };

      await createProfile(targetId, finalData); 
      
      if (!editingTargetId) {
          setIsProfileComplete(true);
      }
      
      setIsEditingProfile(false);
      setEditingTargetId(null);
      setCurrentView(editingTargetId ? 'RISHTEY' : 'PROFILE');
      window.scrollTo(0, 0);
    } catch (error: unknown) {
      console.error(error);
      const msg = error instanceof Error ? error.message : 'Failed to save profile';
      setErrors([{ field: 'submit', message: msg }]);
    } finally {
      setIsSaving(false);
    }
  };

  // --- Render Helpers ---

  const renderEditSteps = () => {
    const commonProps = { data: formData, update: updateField };
    switch(currentStep) {
      case 0: return <Step1_BasicInfo {...commonProps} />;
      case 1: return <Step2_Social {...commonProps} />;
      case 2: return <Step3_Location {...commonProps} />;
      case 3: return <Step4_Education {...commonProps} />;
      case 4: return <Step5_Family data={formData} updateFamily={updateFamily} siblings={formData.siblings} setSiblings={setSiblings} editingSiblingIndex={editingSiblingIndex} setEditingSiblingIndex={setEditingSiblingIndex} />;
      case 5: return <Step6_Health data={formData} setHealthIssues={(val) => setFormData({...formData, healthIssues: val})} />;
      case 6: return <Step7_Preferences {...commonProps} setExpectations={(val) => setFormData({...formData, expectations: val})} />;
      case 7: return <Step8_Media {...commonProps} avatarFile={avatarFile} setAvatarFile={setAvatarFile} />;
      default: return null;
    }
  };

  const renderMainContent = () => {
    if (isLoadingProfile) return <div className="text-center py-20 text-gray-500">Loading...</div>;

    // STEP 0: No Profile -> Show Step 0 Form
    if (!hasProfile) {
        return <Step0_Initial onSubmit={handleStep0Submit} isSubmitting={isSaving} />;
    }

    // WIZARD: Editing Profile
    if (isEditingProfile) {
        return (
          <div className="relative">
            {/* Step Indicators */}
            <div className="mb-8 animate-fadeIn">
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                {STEPS.map((step, idx) => {
                   const isReachable = idx <= highestStepReached;
                   const isCurrent = idx === currentStep;
                   return (
                    <button 
                        key={idx} 
                        onClick={() => handleStepClick(idx)}
                        disabled={!isReachable}
                        className={`text-[11px] px-3 py-1.5 rounded-full font-bold transition-all border ${
                            isCurrent ? 'bg-rose-600 text-white border-rose-600 shadow-lg scale-105' : 
                            isReachable ? 'bg-white text-rose-600 border-rose-200 hover:bg-rose-50 cursor-pointer' : 
                            'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                        }`}
                    >
                        {step}
                    </button>
                   );
                })}
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-rose-500 to-orange-400 transition-all duration-700 ease-out" style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }} />
              </div>
            </div>

            {/* Wizard Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white overflow-hidden min-h-[600px] flex flex-col relative animate-fadeIn">
              
              {/* Header */}
              <div className="bg-white px-8 py-5 border-b border-gray-100 flex justify-between items-center sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-3">
                    {currentStep > 0 && (
                        <button onClick={() => setCurrentStep(p => p - 1)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                    )}
                    <h2 className="text-xl font-bold text-gray-800">{STEPS[currentStep]}</h2>
                </div>
                {/* Cancel Button if editing other */}
                {editingTargetId && (
                   <button onClick={() => { setIsEditingProfile(false); setEditingTargetId(null); setCurrentView('RISHTEY'); }} className="text-sm text-red-500 hover:bg-red-50 px-3 py-1 rounded-lg">
                     Cancel Edit
                   </button>
                )}
                 {/* Cancel if editing self but has profile (Cancel completes nothing but goes back) */}
                 {!editingTargetId && (
                    <button onClick={() => { setIsEditingProfile(false); setCurrentView('RISHTEY'); }} className="text-sm text-gray-400 hover:text-gray-600 px-3">
                        Cancel
                    </button>
                 )}

                {isAdmin && (
                    <button type="button" onClick={() => setCurrentStep(prev => prev < STEPS.length - 1 ? prev + 1 : prev)} className="text-xs font-bold text-gray-300 hover:text-rose-600 flex items-center transition-all">
                    Dev Skip <SkipForward className="h-3 w-3 ml-1" />
                    </button>
                )}
              </div>

              {/* Content */}
              <div className="p-8 flex-grow">
                {renderEditSteps()}
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-8 py-5 border-t border-gray-100 flex justify-end items-center">
                <button 
                    onClick={handleNext} 
                    disabled={isSaving}
                    className="flex items-center px-8 py-3 rounded-xl shadow-lg shadow-rose-200 text-sm font-bold text-white bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 transition-all transform hover:-translate-y-0.5"
                >
                    {currentStep === STEPS.length - 1 ? (isSaving ? 'Saving...' : <>Complete & Save <Save className="h-4 w-4 ml-2" /></>) : <>Next Step <ArrowRight className="h-4 w-4 ml-2" /></>}
                </button>
              </div>
            </div>

            {/* Error Stack */}
            <div className="fixed top-24 right-4 z-[100] flex flex-col gap-2 pointer-events-none w-64">
                {errors.map((err, idx) => (
                    <div key={`${err.field}-${idx}`} className="pointer-events-auto bg-white border-l-4 border-red-500 rounded shadow-xl p-3 flex items-start gap-2 animate-slideInRight">
                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <div className="min-w-0">
                            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-0.5">Required</h4>
                            <p className="text-[11px] text-gray-600 leading-snug break-words">{err.message}</p>
                        </div>
                        <button onClick={() => setErrors(prev => prev.filter((_, i) => i !== idx))} className="ml-auto text-gray-300 hover:text-gray-500 shrink-0">
                            <XCircle className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
          </div>
        );
    }

    // --- MAIN VIEWS ---
    // If we are here, hasProfile is true, and isEditingProfile is false.
    // Standard views.
    
    // We pass isProfileComplete to views that need to restrict actions
    const userProfile: UserProfile = { ...formData, id: user.id };
    
    // Pass callback to restricted views
    const commonViewProps = {
        isProfileComplete,
        onRestrictedAction: handleRestrictedAction
    };

    switch(currentView) {
        case 'PROFILE': return <ProfileView data={formData} avatarUrl={avatarUrl} avatarFile={avatarFile} onEdit={() => setIsEditingProfile(true)} />;
        case 'RISHTEY': return <RishteyView currentUser={userProfile} onEditProfile={handleEditProfile} {...commonViewProps} />;
        case 'MATCH': return <MatchView currentUser={userProfile} {...commonViewProps} />;
        case 'SEARCH': return <SearchView currentUser={userProfile} />; 
        default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50 font-sans text-gray-800">
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-rose-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          <div className="flex items-center">
             <div className="bg-gradient-to-r from-rose-500 to-orange-500 p-2 rounded-xl mr-3 shadow-lg shadow-rose-200">
               <Heart className="h-5 w-5 text-white fill-current" />
             </div>
             <span className="text-2xl font-bold text-gray-900 tracking-tight">Match<span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-orange-600">Find</span></span>
          </div>
          <button onClick={handleLogout} className="flex items-center text-sm font-bold text-gray-500 hover:text-rose-600 transition-colors bg-white border border-gray-200 hover:border-rose-200 px-4 py-2 rounded-xl">
            <LogOut className="h-4 w-4 mr-2" /> Sign Out
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto py-10 px-4 sm:px-6 relative">
        {renderMainContent()}
      </main>

      {/* Floating Nav: Only shows if user HAS a profile and IS NOT editing. */}
      {/* Also pass isProfileComplete to FloatingNav so it can intercept Search/Match clicks. */}
      {!isEditingProfile && hasProfile && (
        <FloatingNav 
            currentView={currentView} 
            setView={setCurrentView} 
            isProfileComplete={isProfileComplete}
            onRestrictedAction={handleRestrictedAction}
        />
      )}
      
      <IncompleteProfileModal 
          isOpen={showRestrictionModal} 
          onCancel={() => setShowRestrictionModal(false)}
          onProfile={() => {
              setShowRestrictionModal(false);
              setIsEditingProfile(true);
              setCurrentStep(0);
          }}
      />
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }
        .animate-slideInRight { animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
}

