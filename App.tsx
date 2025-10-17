import React, { useState } from 'react';
import { StudentProfile, MatchedStudent, StudySessionData, View, Match } from './types';
import { MOCK_PROFILES, MOCK_GROUPS } from './constants';
import { findMatches } from './services/geminiService';
import Header from './components/Header';
import ProfileForm from './components/ProfileForm';
import MatchList from './components/MatchList';
import CollaborationSpace from './components/CollaborationSpace';
import LandingPage from './components/LandingPage';
import LoginModal from './components/LoginModal';

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.Home);
  const [userProfile, setUserProfile] = useState<StudentProfile | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [currentSession, setCurrentSession] = useState<StudySessionData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleProfileSubmit = async (profile: StudentProfile) => {
    setIsLoading(true);
    setError(null);
    setUserProfile(profile);
    try {
      // Simulate a delay to show the loading state on the button
      await new Promise(resolve => setTimeout(resolve, 1500));
      const foundMatches = await findMatches(profile, MOCK_PROFILES);
      
      // Combine individual matches with mock group matches for demonstration
      const allMatches: Match[] = [...foundMatches, ...MOCK_GROUPS];
      
      setMatches(allMatches);
      setView(View.Matches);
    } catch (err) {
      console.error("Error finding matches:", err);
      setError("Sorry, we couldn't find matches at this time. Please try again later.");
      setView(View.Profile); // Stay on profile page on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartStudying = (match: Match) => {
    if (!userProfile) return;
    
    const subject = 'topic' in match
      ? match.topic
      // For individual matches, find a common subject
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
    });
    setView(View.Collaboration);
  };

  const handleBackToMatches = () => {
    setCurrentSession(null);
    setView(View.Matches);
  };

  const resetApp = () => {
    setView(View.Home);
    setUserProfile(null);
    setMatches([]);
    setCurrentSession(null);
    setError(null);
  }

  const handleGetStarted = () => {
    setIsLoginModalOpen(true);
  };

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    setView(View.Profile);
  };


  const renderContent = () => {
    if (error) {
       return <div className="text-center p-8">
           <p className="text-red-500 bg-red-100 p-4 rounded-md">{error}</p>
           <button onClick={() => setView(View.Profile)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Go Back</button>
       </div>;
    }

    switch (view) {
      case View.Home:
        return <LandingPage onFindPeers={handleGetStarted} />;
      case View.Profile:
        return <ProfileForm onSubmit={handleProfileSubmit} isLoading={isLoading} />;
      case View.Matches:
        return <MatchList matches={matches} onStartStudying={handleStartStudying} onFindNew={() => setView(View.Profile)}/>;
      case View.Collaboration:
        return currentSession && <CollaborationSpace sessionData={currentSession} onBack={handleBackToMatches} />;
      default:
        return <LandingPage onFindPeers={handleGetStarted} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <Header onLogoClick={resetApp} />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {renderContent()}
      </main>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLoginSuccess}
      />
    </div>
  );
};

export default App;