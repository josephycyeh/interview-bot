import React from 'react';

interface NavbarProps {
  isCallActive: boolean;
  isConnecting: boolean;
  onToggleCall: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isCallActive, isConnecting, onToggleCall }) => {
  return (
    <nav className="bg-[#1a1a1a] border-b border-[#2d2d2d] h-14 flex items-center px-6 backdrop-blur-sm bg-opacity-80 sticky top-0 z-50">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-white font-semibold text-xl tracking-tight">
          Interview<span className="text-blue-500">Bot</span>
        </h1>
        <button 
          onClick={onToggleCall}
          disabled={isConnecting}
          className={`px-4 py-1.5 rounded-md text-white text-sm font-medium transition-all duration-200 transform hover:scale-105 flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${isCallActive 
            ? 'bg-red-600 hover:bg-red-500 shadow-red-500/20' 
            : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20'
          }`}
        >
          {isConnecting ? (
            <>
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {isCallActive ? 'Ending...' : 'Connecting...'}
            </>
          ) : isCallActive ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              End Interview
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Start Interview
            </>
          )}
        </button>
      </div>
    </nav>
  );
}; 