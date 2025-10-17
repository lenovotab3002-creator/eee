import React from 'react';

interface HeaderProps {
    isProfileCreated: boolean;
    onProfileClick: () => void;
    isNavVisible: boolean;
    onLeaderboardClick: () => void;
    onFriendsClick: () => void;
    isLoggedIn: boolean;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isProfileCreated, onProfileClick, isNavVisible, onLeaderboardClick, onFriendsClick, isLoggedIn, onLogout }) => {
  return (
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 max-w-5xl flex justify-between items-center">
          <div 
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-5.747-8.247l11.494 0M4.253 12l15.494 0" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4a8 8 0 100 16 8 8 0 000-16z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">StudySphere</h1>
            {isProfileCreated && (
                <>
                    <div className="h-6 w-px bg-slate-300" />
                    <button
                        onClick={onProfileClick}
                        className="font-semibold text-slate-600 hover:text-blue-700 transition-colors flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-slate-100"
                        aria-label="Open profile editor"
                    >
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                       </svg>
                      <span>Profile</span>
                    </button>
                </>
            )}
          </div>
          
          {isLoggedIn && (
            <nav className="flex items-center space-x-2">
              {isNavVisible && (
                <>
                  <button
                    onClick={onFriendsClick}
                    className="font-semibold text-slate-600 hover:text-blue-700 transition-colors flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-slate-100"
                    aria-label="Open friends list"
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                     </svg>
                    <span>Friends</span>
                  </button>
                  <button
                    onClick={onLeaderboardClick}
                    className="font-semibold text-slate-600 hover:text-blue-700 transition-colors flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-slate-100"
                    aria-label="Open leaderboard"
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M17.926 5.432l-2.138-.428A2.004 2.004 0 0014 3h-2a1 1 0 100 2h1.268a2 2 0 011.986 1.732l.334 1.668a3 3 0 11-5.176 0l.334-1.668A2 2 0 0110.732 5H12a1 1 0 100-2H8a2 2 0 00-1.788 1.004l-2.138.428A3.004 3.004 0 002 8.24v5.52a3 3 0 003 3h10a3 3 0 003-3V8.24a3.004 3.004 0 00-2.074-2.808zM16 13.76a1 1 0 01-1 1H5a1 1 0 01-1-1V8.24a1 1 0 01.691-.94l2.138-.427A4.003 4.003 0 0110 3.999a4.003 4.003 0 013.17 2.873l2.139.427a1 1 0 01.691.94v5.52z"/>
                     </svg>
                    <span>Leaderboard</span>
                  </button>
                </>
              )}
              <button
                onClick={onLogout}
                className="font-semibold text-slate-600 hover:text-red-600 transition-colors flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-slate-100"
                aria-label="Sign Out"
              >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                   <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                 </svg>
                <span>Sign Out</span>
              </button>
            </nav>
          )}
        </div>
      </header>
  );
};

export default Header;