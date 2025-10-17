import React from 'react';
import '../SliderCheckBox.css';

interface SliderCheckboxProps {
  id: string;
  checked: boolean;
  onChange: () => void;
  label: string;
  hasError?: boolean;
}

const SliderCheckbox: React.FC<SliderCheckboxProps> = ({ id, checked, onChange, label, hasError = false }) => {
  return (
    <label htmlFor={id} className={`flex items-center justify-between p-3 border rounded-lg transition-all duration-200 hover:border-blue-400 hover:bg-slate-50 cursor-pointer ${hasError ? 'border-red-500' : 'border-slate-200'}`}>
      <span className="text-slate-600 select-none">{label}</span>
      <div className="switch">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={onChange}
        />
        <span className="slider"></span>
      </div>
    </label>
  );
};

export default SliderCheckbox;