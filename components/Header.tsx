import React from 'react';
import { SkullBarberLogoIcon } from './icons';

type View = 'booking' | 'admin';

interface HeaderProps {
    onViewChange: (view: View) => void;
    currentView: View;
    shopName: string;
    logoUrl: string;
}

const Header: React.FC<HeaderProps> = ({ onViewChange, currentView, shopName, logoUrl }) => {
  return (
    <header className="py-6 mb-4 flex flex-col items-center gap-y-4 sm:relative sm:flex-row sm:justify-center">
      {/* Title Block */}
      <div className="flex items-center justify-center space-x-2 sm:space-x-4">
        {logoUrl ? (
          <img src={logoUrl} alt={`${shopName} Logo`} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-amber-400"/>
        ) : (
          <SkullBarberLogoIcon className="w-16 h-16 sm:w-20 sm:h-20 text-amber-400" />
        )}
        <div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-wider text-amber-400 text-center" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
            {shopName}
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 tracking-widest -mt-1 sm:-mt-2 text-center">Agendamento fácil de corte e barba</p>
        </div>
      </div>

      {/* Buttons Block */}
      {/* On mobile, it's a flex item. On sm+, it's absolute positioned to the right. */}
      <div className="sm:absolute sm:top-1/2 sm:-translate-y-1/2 sm:right-0">
        <div className="flex items-center bg-gray-800 border border-gray-700 rounded-full p-1">
            <button 
              onClick={() => onViewChange('booking')}
              className={`px-3 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm font-bold rounded-full transition-colors duration-300 ${currentView === 'booking' ? 'bg-amber-400 text-black' : 'text-gray-300 hover:bg-gray-700'}`}
            >
                Agendar
            </button>
            <button 
              onClick={() => onViewChange('admin')}
              className={`px-3 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm font-bold rounded-full transition-colors duration-300 ${currentView === 'admin' ? 'bg-amber-400 text-black' : 'text-gray-300 hover:bg-gray-700'}`}
            >
                Admin
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
