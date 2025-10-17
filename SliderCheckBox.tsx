import React, { useState } from 'react';
import './SliderCheckbox.css'; // Assuming your CSS is in this file

const SliderCheckbox: React.FC = () => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <label className="switch">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={() => setIsChecked(!isChecked)}
      />
      <span className="slider round"></span>
    </label>
  );
};

export default SliderCheckbox;