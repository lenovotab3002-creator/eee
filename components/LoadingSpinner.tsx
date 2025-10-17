
import React, { useState, useEffect } from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = "Getting things ready" }) => {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    let timeoutId: number;

    const updatePercentage = () => {
      setPercentage(prev => {
        if (prev >= 100) {
          return 100;
        }
        
        // Larger, more random increments
        const increment = Math.floor(Math.random() * 10) + 1;
        const newPercentage = Math.min(prev + increment, 100);
        
        if (newPercentage < 100) {
          // Random delay for the next update (70% faster)
          const delay = Math.floor(Math.random() * 80) + 20; // 20ms to 100ms
          timeoutId = window.setTimeout(updatePercentage, delay);
        }
        
        return newPercentage;
      });
    };

    // Start after a small delay to prevent flickering
    const startTimeout = window.setTimeout(updatePercentage, 300);

    return () => {
      clearTimeout(startTimeout);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50 text-slate-700 animate-fade-in text-center p-4">
      <div className="w-12 h-12 relative mb-6 animate-spin">
        {
          [...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 w-2.5 h-2.5 bg-blue-500 rounded-full"
              style={{
                transform: `rotate(${i * 45}deg) translateX(18px)`,
              }}
            />
          ))
        }
      </div>
      <h1 className="text-xl font-light mb-2">{message}...</h1>
      <p className="text-4xl font-semibold">{percentage}% complete</p>
    </div>
  );
};

export default LoadingSpinner;
