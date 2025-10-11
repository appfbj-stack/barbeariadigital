import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps, labels }) => {
  return (
    <div className="w-full px-4 sm:px-0">
      <div className="relative flex items-center justify-between">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-700" style={{ transform: 'translateY(-50%)' }}></div>
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-amber-400 transition-all duration-500 ease-in-out" 
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`, transform: 'translateY(-50%)' }}>
        </div>
        {labels.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;

          return (
            <div key={label} className="z-10 text-center">
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-base sm:text-lg font-bold transition-all duration-300
                  ${isActive ? 'bg-amber-400 text-black scale-110' : ''}
                  ${isCompleted ? 'bg-amber-600 text-white' : ''}
                  ${!isActive && !isCompleted ? 'bg-gray-700 text-gray-400' : ''}
                `}
              >
                {stepNumber}
              </div>
              <p className={`mt-2 text-xs sm:text-base font-semibold transition-colors duration-300 ${isActive ? 'text-amber-400' : 'text-gray-500'}`}>{label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;