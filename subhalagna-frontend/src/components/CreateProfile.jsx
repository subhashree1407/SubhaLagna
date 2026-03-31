import React, { useState, useContext, useRef, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { STATES, LOCATION_DATA } from '../data/locationData.js';

// --- Icons ---
const UserIcon = () => (<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>);
const BriefcaseIcon = () => (<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>);
const HeartIcon = () => (<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>);
const CameraIcon = () => (<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>);
const HomeIcon = () => (<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>);
const SparklesIcon = () => (<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>);
const ChevronRight = () => (<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>);
const ChevronLeft = () => (<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>);
const XIcon = () => (<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>);

const PREDEFINED_INTERESTS = ["Travel", "Music", "Cooking", "Photography", "Fitness", "Reading", "Movies", "Sports", "Art"];
const PREDEFINED_TRAITS = ["Introvert", "Extrovert", "Ambivert", "Ambitious", "Creative", "Organized", "Spontaneous", "Rational", "Empathetic"];

const SearchableDropdown = ({ label, name, value, options, onChange, placeholder, disabled, minChars = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value || '');
  const wrapperRef = useRef(null);

  useEffect(() => {
    setSearchTerm(value || '');
  }, [value]);

  const filteredOptions = (options || []).filter(opt => 
    opt?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (opt) => {
    onChange({ target: { name, value: opt } });
    setSearchTerm(opt);
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    onChange({ target: { name, value: val } });
    setIsOpen(true);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showOptions = isOpen && (searchTerm.length >= minChars);

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="block text-xs font-bold text-gray-500 mb-1 ml-1 uppercase">{label}</label>
      <input 
        type="text" 
        name={name}
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-rose-500 outline-none transition-all font-medium text-gray-800 disabled:opacity-50"
        autoComplete="off"
      />
      {showOptions && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-xl max-h-48 overflow-y-auto animate-fade-in">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt, i) => (
              <div 
                key={i} 
                onClick={() => handleSelect(opt)}
                className="px-4 py-3 hover:bg-rose-50 cursor-pointer text-sm font-medium text-gray-700 transition-colors border-b last:border-0 border-gray-50"
              >
                {opt}
              </div>
            ))
          ) : searchTerm.length > 0 && (
             <div className="px-4 py-3 text-xs text-gray-400 italic bg-gray-50/30">
               "{searchTerm}" not in list. Using as manual entry.
             </div>
          )}
        </div>
      )}
    </div>
  );
};

const CreateProfile = () => {
  const { user, token, updateProfileContext } = useContext(AuthContext);
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorStr, setErrorStr] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: user?.name || '',
    gender: 'Male',
    age: '',
    religion: 'Hindu',
    caste: '',
    location: '', // Legacy fallback
    currentState: '',
    currentCity: '',
    nativeState: '',
    nativeCity: '',
    education: '',
    profession: '',
    height: "5' 5\"",
    fatherName: '',
    motherName: '',
    siblings: '0',
    familyType: 'Nuclear',
    bio: '',
    partnerInterests: ''
  });

  const [traits, setTraits] = useState([]);
  const [interests, setInterests] = useState([]);
  const [customInterest, setCustomInterest] = useState('');
  const [customTrait, setCustomTrait] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [additionalPreviews, setAdditionalPreviews] = useState([]);
  
  const fileInputRef = useRef(null);

  // Auto-fill name if user object changes
  useEffect(() => {
    if (user?.name && !formData.name) {
      setFormData(prev => ({ ...prev, name: user.name }));
    }
  }, [user]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const nextStep = () => {
    if (currentStep === 1) {
      if (!formData.name || !formData.age) {
        setErrorStr("Please fill in basic details.");
        return;
      }
      if (parseInt(formData.age) < 18) {
        setErrorStr("Must be 18 or older to continue.");
        return;
      }
    }
    if (currentStep === 2) {
      if (!formData.currentState || !formData.currentCity || !formData.nativeState || !formData.nativeCity) {
        setErrorStr("Please specify both Current and Native locations.");
        return;
      }
    }
    setErrorStr(null);
    setCurrentStep(prev => Math.min(prev + 1, 6));
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setErrorStr(null);
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };

  const toggleTrait = (trait) => {
    setTraits(prev => prev.includes(trait) ? prev.filter(t => t !== trait) : [...prev, trait]);
  };

  const toggleInterest = (interest) => {
    setInterests(prev => prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]);
  };

  const addCustomInterest = (e) => {
    e.preventDefault();
    if (customInterest.trim() && !interests.includes(customInterest.trim())) {
      setInterests([...interests, customInterest.trim()]);
    }
    setCustomInterest('');
  };

  const addCustomTrait = (e) => {
    e.preventDefault();
    if (customTrait.trim() && !traits.includes(customTrait.trim())) {
      setTraits([...traits, customTrait.trim()]);
    }
    setCustomTrait('');
  };

  const handlePhotoChange = (e, target) => {
    const files = Array.from(e.target.files);
    if (target === 'profile') {
      const file = files[0];
      if (file) {
        setProfilePhoto(file);
        setProfilePhotoPreview(URL.createObjectURL(file));
      }
    } else {
      if (additionalFiles.length + files.length > 5) {
        alert("Maximum 5 additional photos allowed.");
        return;
      }
      setAdditionalFiles(prev => [...prev, ...files]);
      const previews = files.map(f => URL.createObjectURL(f));
      setAdditionalPreviews(prev => [...prev, ...previews]);
    }
  };

  const removePhoto = (index) => {
    setAdditionalFiles(prev => prev.filter((_, i) => i !== index));
    setAdditionalPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep !== 6) return;
    setIsSubmitting(true);
    setErrorStr(null);

    const submitData = new FormData();
    // Consolidate location for backend requirement
    const consolidatedLocation = `${formData.currentCity}, ${formData.currentState}`;
    
    Object.keys(formData).forEach(key => {
      if (key === 'location') submitData.append(key, consolidatedLocation);
      else if (key !== 'partnerInterests') submitData.append(key, formData[key]);
    });
    submitData.append('traits', traits.join(', '));
    submitData.append('interests', interests.join(', '));
    submitData.append('partnerInterests', formData.partnerInterests);
    if (profilePhoto) submitData.append('profilePhoto', profilePhoto);
    additionalFiles.forEach(f => submitData.append('additionalPhotos', f));

    try {
      const response = await fetch('http://localhost:5000/api/profiles/setup', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: submitData
      });
      const data = await response.json();
      if (response.ok) {
        updateProfileContext(data);
        navigate('/matches');
      } else {
        setErrorStr(data.message || "Something went wrong.");
      }
    } catch (err) {
      setErrorStr("Failed to connect to server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { id: 1, title: 'Basic Info', icon: <UserIcon /> },
    { id: 2, title: 'Personal', icon: <SparklesIcon /> },
    { id: 3, title: 'Education', icon: <BriefcaseIcon /> },
    { id: 4, title: 'Family', icon: <HomeIcon /> },
    { id: 5, title: 'Interests', icon: <HeartIcon /> },
    { id: 6, title: 'Photos', icon: <CameraIcon /> },
  ];

  return (
    <div className="flex-1 w-full max-w-2xl mx-auto py-10 px-6 animate-fade-in pb-32">
      
      {/* Title & Progress Header */}
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-serif font-bold text-gray-800 mb-2">Step {currentStep} of 6</h2>
        <p className="text-gray-500 font-medium">{steps.find(s => s.id === currentStep).title}</p>
        
        {/* Progress Bar */}
        <div className="mt-6 flex items-center justify-between relative px-2">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 z-0 rounded-full"></div>
          <div 
            className="absolute top-1/2 left-0 h-1 bg-rose-500 -translate-y-1/2 z-0 rounded-full transition-all duration-500" 
            style={{ width: `${((currentStep - 1) / 5) * 100}%` }}
          ></div>
          
          {steps.map(step => (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 
                  ${currentStep >= step.id ? 'bg-rose-500 border-rose-500 text-white shadow-md' : 'bg-white border-gray-200 text-gray-400'}`}
              >
                {step.icon}
              </div>
            </div>
          ))}
        </div>
      </div>

      {errorStr && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-sm font-semibold flex items-center gap-3 animate-shake">
          <span className="text-lg">⚠️</span> {errorStr}
        </div>
      )}

      {/* Wizard Steps */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="glass-card p-8 rounded-3xl border border-white shadow-xl animate-slide-up">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-rose-500 outline-none transition-all font-medium text-gray-800" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Gender</label>
                <div className="grid grid-cols-2 gap-4">
                  {['Male', 'Female'].map(g => (
                    <button 
                      key={g} type="button" 
                      onClick={() => setFormData({...formData, gender: g})}
                      className={`py-4 rounded-2xl border-2 font-bold transition-all ${formData.gender === g ? 'bg-rose-50 border-rose-500 text-rose-600 shadow-sm' : 'bg-white border-gray-100 text-gray-400 hover:bg-gray-50'}`}
                    >
                      {g === 'Male' ? '♂️ Male' : '♀️ Female'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Age</label>
                <input type="number" name="age" value={formData.age} onChange={handleChange} required placeholder="21" className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-rose-500 outline-none transition-all font-medium text-gray-800" />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Personal Details */}
        {currentStep === 2 && (
          <div className="glass-card p-8 rounded-3xl border border-white shadow-xl animate-slide-up">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Religion</label>
                <input type="text" name="religion" value={formData.religion} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-rose-500 outline-none transition-all font-medium text-gray-800" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Caste</label>
                <input type="text" name="caste" value={formData.caste} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-rose-500 outline-none transition-all font-medium text-gray-800" />
              </div>
              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-sm font-bold text-rose-500 uppercase tracking-wider mb-4">Current Residence</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SearchableDropdown 
                    label="State"
                    name="currentState"
                    value={formData.currentState}
                    options={STATES}
                    onChange={handleChange}
                    placeholder="Type state..."
                  />
                  <SearchableDropdown 
                    label="City"
                    name="currentCity"
                    value={formData.currentCity}
                    options={LOCATION_DATA[formData.currentState] || []}
                    onChange={handleChange}
                    placeholder="Type city..."
                    disabled={!formData.currentState}
                    minChars={2}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-sm font-bold text-rose-500 uppercase tracking-wider mb-4">Native / Hometown</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SearchableDropdown 
                    label="Native State"
                    name="nativeState"
                    value={formData.nativeState}
                    options={STATES}
                    onChange={handleChange}
                    placeholder="Type state..."
                  />
                  <SearchableDropdown 
                    label="Native City"
                    name="nativeCity"
                    value={formData.nativeCity}
                    options={LOCATION_DATA[formData.nativeState] || []}
                    onChange={handleChange}
                    placeholder="Type city..."
                    disabled={!formData.nativeState}
                    minChars={2}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Height</label>
                <input type="text" name="height" value={formData.height} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-rose-500 outline-none transition-all font-medium text-gray-800" />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Education & Career */}
        {currentStep === 3 && (
          <div className="glass-card p-8 rounded-3xl border border-white shadow-xl animate-slide-up">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Highest Education</label>
                <input type="text" name="education" value={formData.education} onChange={handleChange} placeholder="e.g. MBA, B.Tech" className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-rose-500 outline-none transition-all font-medium text-gray-800" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Profession / Occupation</label>
                <input type="text" name="profession" value={formData.profession} onChange={handleChange} placeholder="e.g. Software Engineer" className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-rose-500 outline-none transition-all font-medium text-gray-800" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">About Myself (Bio)</label>
                <textarea name="bio" value={formData.bio} onChange={handleChange} rows="4" className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-rose-500 outline-none transition-all font-medium text-gray-800 resize-none" placeholder="Tell us about yourself..."></textarea>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Family */}
        {currentStep === 4 && (
          <div className="glass-card p-8 rounded-3xl border border-white shadow-xl animate-slide-up">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Father's Name</label>
                <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-rose-500 outline-none transition-all font-medium text-gray-800" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Mother's Name</label>
                <input type="text" name="motherName" value={formData.motherName} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-rose-500 outline-none transition-all font-medium text-gray-800" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Siblings</label>
                  <input type="number" name="siblings" value={formData.siblings} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-rose-500 outline-none transition-all font-medium text-gray-800" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Family Type</label>
                  <select name="familyType" value={formData.familyType} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-rose-500 outline-none transition-all font-medium text-gray-800 cursor-pointer">
                    <option value="Nuclear">Nuclear</option>
                    <option value="Joint">Joint</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Preferences */}
        {currentStep === 5 && (
          <div className="glass-card p-8 rounded-3xl border border-white shadow-xl animate-slide-up">
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-4">Select Your Personality Traits</label>
                <div className="flex flex-wrap gap-3 mb-4">
                  {PREDEFINED_TRAITS.map(t => (
                    <button 
                      key={t} type="button" 
                      onClick={() => toggleTrait(t)}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all border-2 
                        ${traits.includes(t) ? 'bg-rose-500 border-rose-500 text-white shadow-sm' : 'bg-white border-gray-100 text-gray-400 hover:border-rose-200'}`}
                    >
                      {t}
                    </button>
                  ))}
                  {traits.filter(t => !PREDEFINED_TRAITS.includes(t)).map(t => (
                    <button 
                      key={t} type="button" 
                      onClick={() => toggleTrait(t)}
                      className="px-4 py-2 rounded-full text-xs font-bold bg-rose-500 border-rose-500 text-white shadow-sm flex items-center gap-2"
                    >
                      {t} <XIcon />
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                   <input 
                    type="text" value={customTrait} 
                    onChange={e => setCustomTrait(e.target.value)} 
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCustomTrait(e);
                      }
                    }}
                    placeholder="Add custom trait..." 
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-100 bg-gray-50/50 text-sm outline-none focus:ring-2 focus:ring-rose-400"
                   />
                   <button onClick={addCustomTrait} type="button" className="px-5 py-3 bg-gray-800 text-white font-bold rounded-xl text-sm transition-all hover:bg-black">Add</button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-4">Interests & Hobbies</label>
                <div className="flex flex-wrap gap-3 mb-4">
                  {PREDEFINED_INTERESTS.map(i => (
                    <button 
                      key={i} type="button" 
                      onClick={() => toggleInterest(i)}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all border-2 
                        ${interests.includes(i) ? 'bg-pink-500 border-pink-500 text-white shadow-sm' : 'bg-white border-gray-100 text-gray-500 hover:border-pink-200'}`}
                    >
                      {i}
                    </button>
                  ))}
                  {interests.filter(i => !PREDEFINED_INTERESTS.includes(i)).map(i => (
                    <button 
                      key={i} type="button" 
                      onClick={() => toggleInterest(i)}
                      className="px-4 py-2 rounded-full text-xs font-bold bg-pink-500 border-pink-500 text-white shadow-sm flex items-center gap-2"
                    >
                      {i} <XIcon />
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                   <input 
                    type="text" value={customInterest} 
                    onChange={e => setCustomInterest(e.target.value)} 
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCustomInterest(e);
                      }
                    }}
                    placeholder="Add custom interest..." 
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-100 bg-gray-50/50 text-sm outline-none focus:ring-2 focus:ring-pink-400"
                   />
                   <button onClick={addCustomInterest} type="button" className="px-5 py-3 bg-gray-800 text-white font-bold rounded-xl text-sm transition-all hover:bg-black">Add</button>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <div className="bg-rose-50/50 p-6 rounded-2xl border border-rose-100/50">
                  <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <HeartIcon /> Ideal Partner's Interests & Qualities
                  </label>
                  <p className="text-xs text-gray-500 mb-3">Describe the personality and hobbies you're looking for in your opposite gender.</p>
                  <textarea 
                    name="partnerInterests" 
                    value={formData.partnerInterests} 
                    onChange={handleChange} 
                    rows="3" 
                    className="w-full px-4 py-3 rounded-xl border border-white bg-white focus:ring-2 focus:ring-rose-400 outline-none transition-all font-medium text-gray-800 resize-none shadow-sm"
                    placeholder="e.g. Someone who loves trekking and has a calm personality..."
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Photos */}
        {currentStep === 6 && (
          <div className="glass-card p-8 rounded-3xl border border-white shadow-xl animate-slide-up">
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-rose-100 flex items-center justify-center rounded-lg text-rose-500 text-xs">1</span>
                  Primary Profile Photo
                </label>
                <div 
                  className="relative group w-40 h-40 mx-auto rounded-3xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 overflow-hidden shadow-inner"
                  onClick={() => document.getElementById('profile-file').click()}
                >
                  {profilePhotoPreview ? (
                    <img src={profilePhotoPreview} className="w-full h-full object-cover" alt="Profile" />
                  ) : (
                    <CameraIcon />
                  )}
                  <input id="profile-file" type="file" className="hidden" accept="image/*" onChange={(e) => handlePhotoChange(e, 'profile')} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-pink-100 flex items-center justify-center rounded-lg text-pink-500 text-xs">2</span>
                  Additional Photos (Max 5)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {additionalPreviews.map((src, idx) => (
                    <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden shadow-sm group">
                      <img src={src} className="w-full h-full object-cover" alt="Gallery" />
                      <button 
                        type="button" onClick={() => removePhoto(idx)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <XIcon />
                      </button>
                    </div>
                  ))}
                  {additionalFiles.length < 5 && (
                    <button 
                      type="button" 
                      onClick={() => document.getElementById('extra-files').click()}
                      className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-pink-300 hover:bg-pink-50 transition-all font-bold text-xs gap-2"
                    >
                      <CameraIcon />
                      Add Photo
                    </button>
                  )}
                  <input id="extra-files" type="file" className="hidden" multiple accept="image/*" onChange={(e) => handlePhotoChange(e, 'extra')} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Bar */}
        <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-gray-100 p-6 z-50">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            {currentStep > 1 && (
              <button 
                type="button" onClick={prevStep}
                className="flex items-center gap-2 px-6 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
              >
                <ChevronLeft /> Back
              </button>
            )}
            <div className="flex-1"></div>
            {currentStep < 6 ? (
              <button 
                type="button" onClick={nextStep}
                className="flex items-center gap-2 px-10 py-4 bg-gray-900 text-white rounded-2xl font-bold shadow-xl shadow-gray-200 hover:bg-black hover:-translate-y-1 transition-all"
              >
                Continue <ChevronRight />
              </button>
            ) : (
              <button 
                type="submit" disabled={isSubmitting}
                className={`flex items-center gap-2 px-12 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-2xl font-bold shadow-2xl shadow-rose-200 hover:-translate-y-1 transition-all ${isSubmitting ? 'opacity-50' : ''}`}
              >
                {isSubmitting ? 'Finalizing Profile...' : 'Complete Profile 🚀'}
              </button>
            )}
          </div>
        </div>

      </form>
    </div>
  );
};

export default CreateProfile;
