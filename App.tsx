
import React, { useState } from 'react';
import { StudentProfile, MatchedStudent, StudySessionData, View } from './types';
import { MOCK_PROFILES } from './constants';
import { findMatches } from './services/geminiService';
import Header from './components/Header';
import ProfileForm from './components/ProfileForm';
import MatchList from './components/MatchList';
import CollaborationSpace from './components/CollaborationSpace';
import LandingPage from './components/LandingPage';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.Home);
  const [userProfile, setUserProfile] = useState<StudentProfile | null>(null);
  const [matches, setMatches] = useState<MatchedStudent[]>([]);
  const [currentSession, setCurrentSession] = useState<StudySessionData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleProfileSubmit = async (profile: StudentProfile) => {
    setIsLoading(true);
    setError(null);
    setUserProfile(profile);
    try {
      const foundMatches = await findMatches(profile, MOCK_PROFILES);
      setMatches(foundMatches);
      setView(View.Matches);
    } catch (err) {
      console.error("Error finding matches:", err);
      setError("Sorry, we couldn't find matches at this time. Please try again later.");
      setView(View.Profile); // Stay on profile page on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartStudying = (matchedStudent: MatchedStudent) => {
    if (!userProfile) return;
    
    // Determine the common subject. Give priority to what the user needs help with.
    const userNeeds = userProfile.subjectsHelpNeeded;
    const partnerOffers = matchedStudent.subjectsCanHelp;
    const commonSubject = userNeeds.find(subject => partnerOffers.includes(subject)) || userProfile.subjectsCanHelp.find(s => matchedStudent.subjectsHelpNeeded.includes(s)) || userNeeds[0];

    setCurrentSession({
        partner: matchedStudent,
        subject: commonSubject || "General Studies",
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

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner message="Finding your study crew" />;
    }

    if (error) {
       return <div className="text-center p-8">
           <p className="text-red-500 bg-red-100 p-4 rounded-md">{error}</p>
           <button onClick={() => setView(View.Profile)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Go Back</button>
       </div>;
    }

    switch (view) {
      case View.Home:
        return <LandingPage onFindPeers={() => setView(View.Profile)} />;
      case View.Profile:
        return <ProfileForm onSubmit={handleProfileSubmit} />;
      case View.Matches:
        return <MatchList matches={matches} onStartStudying={handleStartStudying} onFindNew={() => setView(View.Profile)}/>;
      case View.Collaboration:
        return currentSession && <CollaborationSpace sessionData={currentSession} onBack={handleBackToMatches} />;
      default:
        return <LandingPage onFindPeers={() => setView(View.Profile)} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <Header onLogoClick={resetApp} />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;