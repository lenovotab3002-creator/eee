import React, { useState } from 'react';
import LeaderboardModal from './LeaderboardModal';

interface HeaderProps {
    onLogoClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick }) => {
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  return (
    <>
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 max-w-5xl flex justify-between items-center">
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={onLogoClick}
          >
            <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-5.747-8.247l11.494 0M4.253 12l15.494 0" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4a8 8 0 100 16 8 8 0 000-16z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">StudySphere</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
                className="flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 hover:text-slate-800 transition-colors font-semibold"
                aria-label="Open friends list"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0115 11.47V11a1 1 0 112 0v.47a7 7 0 01-1.252 4.225 10.024 10.024 0 00-2.816.305zM5 11.47a5 5 0 013.43-1.74 6.97 6.97 0 00-1.5 4.33c0 .34.024.673.07 1A10.024 10.024 0 004.252 15.695 7 7 0 013 11.47V11a1 1 0 112 0v.47z" />
                </svg>
                <span>Friends</span>
            </button>
            <button
              onClick={() => setIsLeaderboardOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 hover:text-slate-800 transition-colors font-semibold"
              aria-label="Open leaderboard"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M11.918 8.166a.5.5 0 00-.836.582l1.32 1.98-1.423.844a.5.5 0 00-.214.658l1.785 2.976a.5.5 0 00.87-.52l-1.32-1.98 1.423-.844a.5.5 0 00.214-.658L12.788 8.3A.5.5 0 0011.918 8.166z"/>
                <path d="M12.5 3.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                <path d="M7 11.232a1.5 1.5 0 10-2.023 2.023A1.5 1.5 0 007 11.232zM4.5 6.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                <path fillRule="evenodd" d="M15.5 3a.5.5 0 01.5.5v13a.5.5 0 01-.5.5h-11a.5.5 0 01-.5-.5v-13a.5.5 0 01.5-.5h11zm-10.5 1a.5.5 0 00-.5.5v11a.5.5 0 00.5.5h9a.5.5 0 00.5-.5v-11a.5.5 0 00-.5-.5h-9z" clipRule="evenodd"/>
              </svg>
              <span>Leaderboard</span>
            </button>
          </div>
        </div>
      </header>
      <LeaderboardModal isOpen={isLeaderboardOpen} onClose={() => setIsLeaderboardOpen(false)} />
    </>
  );
};

export default Header;