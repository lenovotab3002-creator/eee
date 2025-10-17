import React, { useState } from 'react';
import { StudentProfile, MatchedStudent, StudySessionData, View, Match } from './types';
import { MOCK_PROFILES, MOCK_GROUPS } from './constants';
import { findMatches } from './services/geminiService';
import Header from './components/Header';
import ProfileForm from './components/ProfileForm';
import MatchList from './components/MatchList';
import CollaborationSpace from './components/CollaborationSpace';
import LandingPage from './components/LandingPage';
import LeaderboardModal from './components/LeaderboardModal';
import FriendsModal from './components/FriendsModal';
import LoginModal from './components/LoginModal';

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.Login);
  const [animationClass, setAnimationClass] = useState('animate-fade-in');
  const [userProfile, setUserProfile] = useState<StudentProfile | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [currentSession, setCurrentSession] = useState<StudySessionData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isFriendsModalOpen, setIsFriendsModalOpen] = useState(false);

  const navigateTo = (newView: View, direction: 'forward' | 'backward' = 'forward') => {
    if (view === newView && !error) return;

    const outClass = direction === 'forward' ? 'animate-slide-out-left' : 'animate-slide-out-right';
    const inClass = direction === 'forward' ? 'animate-slide-in-right' : 'animate-slide-in-left';
    
    setAnimationClass(outClass);
    
    setTimeout(() => {
      setView(newView);
      setAnimationClass(inClass);
      window.scrollTo(0, 0); 
    }, 350);
  };

  const handleProfileSubmit = async (profile: StudentProfile) => {
    setIsLoading(true);
    setError(null);
    setUserProfile(profile);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const foundMatches = await findMatches(profile, MOCK_PROFILES);
      
      const allMatches: Match[] = [...foundMatches, ...MOCK_GROUPS];
      
      setMatches(allMatches);
      navigateTo(View.Matches);
    } catch (err) {
      console.error("Error finding matches:", err);
      setError("Sorry, we couldn't find matches at this time. Please try again later.");
      navigateTo(View.Profile);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartStudying = (match: Match) => {
    if (!userProfile) return;
    
    const subject = 'topic' in match
      ? match.topic
      : (() => {
          const partner = match as MatchedStudent;
          const userNeeds = userProfile.subjectsHelpNeeded;
          const partnerOffers = partner.subjectsCanHelp;
          return userNeeds.find(s => partnerOffers.includes(s)) || 
                 userProfile.subjectsCanHelp.find(s => partner.subjectsHelpNeeded.includes(s)) || 
                 userNeeds[0] || 
                 "General Studies";
      })();

    setCurrentSession({
        match,
        subject,
        userProfile,
    });
    navigateTo(View.Collaboration);
  };

  const handleBackToMatches = () => {
    setCurrentSession(null);
    navigateTo(View.Matches, 'backward');
  };

  const handleLogout = () => {
    setUserProfile(null);
    setMatches([]);
    setCurrentSession(null);
    setError(null);
    navigateTo(View.Login);
  };

  const handleLoginSuccess = () => {
    navigateTo(View.Home);
  };
  
  const renderContent = () => {
    if (error) {
       return <div className="text-center p-8">
           <p className="text-red-500 bg-red-100 p-4 rounded-md">{error}</p>
           <button onClick={() => { setError(null); navigateTo(View.Profile, 'backward'); }} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Go Back</button>
       </div>;
    }

    switch (view) {
      case View.Login:
        return <LoginModal onLoginSuccess={handleLoginSuccess} onSignupSuccess={handleLoginSuccess} />;
      case View.Home:
        return <LandingPage onGetStarted={() => navigateTo(View.Profile)} />;
      case View.Profile:
        return <ProfileForm onSubmit={handleProfileSubmit} isLoading={isLoading} />;
      case View.Matches:
        return <MatchList matches={matches} onStartStudying={handleStartStudying} onFindNew={() => navigateTo(View.Profile, 'backward')}/>;
      case View.Collaboration:
        return currentSession && <CollaborationSpace sessionData={currentSession} onBack={handleBackToMatches} />;
      default:
        return <LoginModal onLoginSuccess={handleLoginSuccess} onSignupSuccess={handleLoginSuccess} />;
    }
  };
  
  const handleLogoClick = () => {
    // FIX: The original condition `view !== View.Login` was always true because the Header
    // is only displayed on non-login pages, causing a TypeScript error. 
    // The check is now for `view !== View.Home` to prevent redundant navigation.
    if (view !== View.Home) {
        navigateTo(View.Home, 'backward');
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      {view !== View.Login && (
        <Header 
          onLogoClick={handleLogoClick}
          isNavVisible={view === View.Matches || view === View.Collaboration}
          onLeaderboardClick={() => setIsLeaderboardOpen(true)}
          onFriendsClick={() => setIsFriendsModalOpen(true)}
          isLoggedIn={true}
          onLogout={handleLogout}
        />
      )}
      <main className="container mx-auto px-4 py-8 max-w-5xl flex-grow flex justify-center items-center overflow-hidden">
        <div className={`w-full h-full flex justify-center items-center ${animationClass}`}>
            {renderContent()}
        </div>
      </main>
      <LeaderboardModal 
        isOpen={isLeaderboardOpen} 
        onClose={() => setIsLeaderboardOpen(false)} 
      />
      <FriendsModal 
        isOpen={isFriendsModalOpen}
        onClose={() => setIsFriendsModalOpen(false)}
      />
    </div>
  );
};

export default App;