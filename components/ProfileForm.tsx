import React, { useState } from 'react';
import { StudentProfile } from '../types';
import { SUBJECTS, AVAILABILITY_OPTIONS, STUDY_METHODS } from '../constants';
import SliderCheckbox from './SliderCheckbox';
import '../styles/customScrollbar.css';

interface ProfileFormProps {
  onSubmit: (profile: StudentProfile) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [subjectsCanHelp, setSubjectsCanHelp] = useState<string[]>([]);
  const [subjectsHelpNeeded, setSubjectsHelpNeeded] = useState<string[]>([]);
  const [availability, setAvailability] = useState<string[]>([]);
  const [studyMethod, setStudyMethod] = useState('');
  const [buttonError, setButtonError] = useState<string | null>(null);

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
    if (!name || subjectsCanHelp.length === 0 || subjectsHelpNeeded.length === 0 || availability.length === 0 || !studyMethod) {
      setButtonError('Please fill out all sections of the form.');
      setTimeout(() => setButtonError(null), 3000); // Clear error after 3 seconds
      return;
    }
    setButtonError(null);
    
    const profile: StudentProfile = {
      id: Date.now(),
      name,
      subjectsCanHelp,
      subjectsHelpNeeded,
      availability,
      studyMethod,
      avatarUrl: `https://picsum.photos/seed/${name.toLowerCase()}/200`
    };
    onSubmit(profile);
  };

  const pillButtonClasses = (isSelected: boolean) => `
    py-2 px-4 w-full rounded-full text-sm font-semibold transition-all duration-300 ease-in-out border-2
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
    ${isSelected
        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-transparent shadow-lg transform scale-105'
        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100 hover:border-slate-400'
    }
  `;

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
      <h2 className="text-3xl font-bold text-center mb-2 text-slate-800">Create Your Study Profile</h2>
      <p className="text-center text-slate-500 mb-8">Let's find the perfect study partners for you.</p>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label htmlFor="name" className="block text-lg font-semibold text-slate-700 mb-2">Your Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full py-3 px-6 text-lg bg-slate-50 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
            placeholder="e.g., Jane Doe"
          />
        </div>
        
        <div className="bg-slate-50 p-12 rounded-[3rem] border border-slate-200">
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
                <fieldset>
                    <legend className="text-lg font-semibold text-slate-700 mb-2">Subjects you can help with:</legend>
                    <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                        {SUBJECTS.map(subject => (
                            <SliderCheckbox 
                                key={`help-${subject}`}
                                id={`help-${subject}`}
                                label={subject}
                                checked={subjectsCanHelp.includes(subject)}
                                onChange={() => handleCheckboxChange(subject, subjectsCanHelp, setSubjectsCanHelp)}
                            />
                        ))}
                    </div>
                </fieldset>
                <fieldset>
                    <legend className="text-lg font-semibold text-slate-700 mb-2">Subjects you need help in:</legend>
                    <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                        {SUBJECTS.map(subject => (
                            <SliderCheckbox 
                                key={`need-${subject}`}
                                id={`need-${subject}`}
                                label={subject}
                                checked={subjectsHelpNeeded.includes(subject)}
                                onChange={() => handleCheckboxChange(subject, subjectsHelpNeeded, setSubjectsHelpNeeded)}
                            />
                        ))}
                    </div>
                </fieldset>
            </div>
            
            <fieldset>
                <legend className="text-lg font-semibold text-slate-700 mb-3">Your Availability:</legend>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {AVAILABILITY_OPTIONS.map(option => (
                        <button
                            type="button"
                            key={option}
                            onClick={() => handleCheckboxChange(option, availability, setAvailability)}
                            className={pillButtonClasses(availability.includes(option))}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </fieldset>

            <fieldset>
                <legend className="text-lg font-semibold text-slate-700 mb-3">Preferred Study Method:</legend>
                <div className="flex flex-wrap gap-3">
                    {STUDY_METHODS.map(method => (
                        <button
                            type="button"
                            key={method}
                            onClick={() => setStudyMethod(method)}
                            className={pillButtonClasses(studyMethod === method)}
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
          className={`w-full font-bold py-4 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 ease-in-out
            ${buttonError
              ? 'bg-white text-red-600 border-2 border-red-500 focus:ring-red-500'
              : 'bg-blue-600 text-white border-2 border-transparent hover:bg-blue-700 transition-transform transform hover:scale-105 focus:ring-blue-500'
            }`
          }
        >
          {buttonError || 'Find My Study Crew'}
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;