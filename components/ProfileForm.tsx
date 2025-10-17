import React, { useState, useRef } from 'react';
import { StudentProfile } from '../types';
import { SUBJECTS, AVAILABILITY_OPTIONS, STUDY_METHODS } from '../constants';
import SliderCheckbox from './SliderCheckbox';
import '../styles/customScrollbar.css';

interface ProfileFormProps {
  onSubmit: (profile: StudentProfile) => void;
  isLoading: boolean;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onSubmit, isLoading }) => {
  const [name, setName] = useState('');
  const [subjectsCanHelp, setSubjectsCanHelp] = useState<string[]>([]);
  const [subjectsHelpNeeded, setSubjectsHelpNeeded] = useState<string[]>([]);
  const [availability, setAvailability] = useState<string[]>([]);
  const [studyMethod, setStudyMethod] = useState('');
  const [buttonError, setButtonError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState({
    name: false,
    subjectsCanHelp: false,
    subjectsHelpNeeded: false,
    availability: false,
    studyMethod: false,
  });
  const nameInputWrapperRef = useRef<HTMLDivElement>(null);

  const handleNameInputMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const wrapper = nameInputWrapperRef.current;
    if (!wrapper) return;

    const rect = wrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    wrapper.style.setProperty('--x', `${x}px`);
    wrapper.style.setProperty('--y', `${y}px`);
    
    wrapper.classList.add('is-radiating');
  };
  
  const handleAnimationEnd = () => {
    const wrapper = nameInputWrapperRef.current;
    if (wrapper) {
      wrapper.classList.remove('is-radiating');
    }
  };

  const handleCheckboxChange = <T,>(
    value: T, 
    list: T[], 
    setter: React.Dispatch<React.SetStateAction<T[]>>
  ) => {
    if (list.includes(value)) {
      setter(list.filter(item => item !== value));
    } else {
      setter([...list, value]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    const newErrors = {
        name: !name,
        subjectsCanHelp: subjectsCanHelp.length === 0,
        subjectsHelpNeeded: subjectsHelpNeeded.length === 0,
        availability: availability.length === 0,
        studyMethod: !studyMethod,
    };

    if (Object.values(newErrors).some(err => err)) {
        setValidationErrors(newErrors);
        setButtonError('Fill all sections');
        setTimeout(() => {
          setButtonError(null);
          setValidationErrors({ name: false, subjectsCanHelp: false, subjectsHelpNeeded: false, availability: false, studyMethod: false });
        }, 3000);
        return;
    }
    
    setButtonError(null);
    setValidationErrors({ name: false, subjectsCanHelp: false, subjectsHelpNeeded: false, availability: false, studyMethod: false });
    
    const profile: StudentProfile = {
      id: Date.now(),
      name,
      subjectsCanHelp,
      subjectsHelpNeeded,
      availability,
      studyMethod,
      avatarUrl: `https://picsum.photos/seed/${name.toLowerCase().replace(/\s+/g, '-')}/200`
    };
    onSubmit(profile);
  };
  
  const handleAnimatedButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    button.classList.remove('animate-fade-outline');
    // This is to force a reflow, allowing the animation to be re-triggered.
    void button.offsetWidth;
    button.classList.add('animate-fade-outline');
    
    button.addEventListener('animationend', () => {
        button.classList.remove('animate-fade-outline');
    }, { once: true });
  };


  const pillButtonClasses = (isSelected: boolean, hasError: boolean) => `
    py-2 px-4 w-full rounded-full text-sm font-semibold transition-all duration-300 ease-in-out border-2
    focus:outline-none
    ${isSelected
        ? 'bg-gradient-to-r from-blue-800 to-blue-600 text-white border-transparent shadow-lg transform scale-105'
        : `bg-slate-50 text-slate-700 ${hasError ? 'border-red-500' : 'border-slate-300'} hover:bg-slate-100 hover:border-slate-400`
    }
  `;

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
      <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">Create Your Study Profile</h2>
      <p className="text-center text-slate-500 mb-8">Let's find the perfect study partners for you.</p>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div
          ref={nameInputWrapperRef}
          onMouseDown={handleNameInputMouseDown}
          onAnimationEnd={handleAnimationEnd}
          className={`input-wrapper relative w-full bg-slate-50 border rounded-full transition-colors duration-300 overflow-hidden
            focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-600
            ${validationErrors.name ? 'border-red-500 ring-2 ring-red-200' : 'border-slate-300'}`}
        >
          <label htmlFor="name" className="block text-lg font-semibold text-slate-700 mb-2 sr-only">Your Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="relative z-10 w-full py-3 px-6 text-lg bg-transparent focus:outline-none placeholder-slate-400 text-black focus:text-black"
            placeholder="Enter your name"
          />
        </div>
        
        <div className="bg-slate-50 p-6 sm:p-12 rounded-[3rem] border border-slate-200">
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
                <fieldset>
                    <legend className="text-lg font-semibold mb-2 px-2 bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">Subjects you can help with</legend>
                    <div className="space-y-3 max-h-48 overflow-y-auto pr-2 no-scrollbar">
                        {SUBJECTS.map(subject => (
                            <SliderCheckbox 
                                key={`help-${subject}`}
                                id={`help-${subject}`}
                                label={subject}
                                checked={subjectsCanHelp.includes(subject)}
                                onChange={() => handleCheckboxChange(subject, subjectsCanHelp, setSubjectsCanHelp)}
                                hasError={validationErrors.subjectsCanHelp}
                            />
                        ))}
                    </div>
                </fieldset>
                <fieldset>
                    <legend className="text-lg font-semibold mb-2 px-2 bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">Subjects you need help in</legend>
                    <div className="space-y-3 max-h-48 overflow-y-auto pr-2 no-scrollbar">
                        {SUBJECTS.map(subject => (
                            <SliderCheckbox 
                                key={`need-${subject}`}
                                id={`need-${subject}`}
                                label={subject}
                                checked={subjectsHelpNeeded.includes(subject)}
                                onChange={() => handleCheckboxChange(subject, subjectsHelpNeeded, setSubjectsHelpNeeded)}
                                hasError={validationErrors.subjectsHelpNeeded}
                            />
                        ))}
                    </div>
                </fieldset>
            </div>
            
            <fieldset>
                <legend className="text-lg font-semibold mb-3 bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">Your Availability</legend>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {AVAILABILITY_OPTIONS.map(option => (
                        <button
                            type="button"
                            key={option}
                            onClick={(e) => {
                                handleAnimatedButtonClick(e);
                                handleCheckboxChange(option, availability, setAvailability);
                            }}
                            className={pillButtonClasses(availability.includes(option), validationErrors.availability)}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </fieldset>

            <fieldset>
                <legend className="text-lg font-semibold mb-3 bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">Preferred Study Method</legend>
                <div className="flex flex-wrap gap-3">
                    {STUDY_METHODS.map(method => (
                        <button
                            type="button"
                            key={method}
                            onClick={(e) => {
                                handleAnimatedButtonClick(e);
                                setStudyMethod(method);
                            }}
                            className={pillButtonClasses(studyMethod === method, validationErrors.studyMethod)}
                        >
                            {method}
                        </button>
                    ))}
                </div>
            </fieldset>
          </div>
        </div>


        <button 
          type="submit" 
          onClick={handleAnimatedButtonClick}
          disabled={isLoading}
          className="w-full font-bold py-4 px-4 rounded-lg focus:outline-none transition-all duration-300 ease-in-out flex justify-center items-center bg-blue-700 text-white border-2 border-transparent hover:bg-blue-800 transition-transform transform hover:scale-105 disabled:bg-blue-500 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Finding Crew...
            </>
          ) : (
            buttonError || 'Find My Study Crew'
          )}
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;